import React, { useEffect, useMemo, useState } from 'react';
import { Eraser, LoaderCircle, PencilLine, StickyNote, Trash2 } from 'lucide-react';
import {
    appendStudyGroupWhiteboardEvent,
    fetchStudyGroupWhiteboardEvents,
    subscribeToStudyGroupWhiteboard
} from '../../lib/studyGroups';
import './SharedWhiteboard.css';

const BOARD_WIDTH = 1000;
const BOARD_HEIGHT = 640;
const DEFAULT_COLORS = ['#f7f9fc', '#79ffe1', '#7c9bff', '#ffd166', '#ff9d6c', '#ff7eb6'];
const DEFAULT_STROKE_WIDTH = 4;
const ERASER_HIT_PADDING = 16;

const uniqueEventsById = (items = []) => items.filter(
    (item, index, collection) => item?.id && collection.findIndex((candidate) => candidate.id === item.id) === index
);

const sortEvents = (items = []) => [...items].sort(
    (left, right) => new Date(left.created_at) - new Date(right.created_at)
);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getPointFromPointerEvent = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * BOARD_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * BOARD_HEIGHT;

    return {
        x: clamp(Number(x.toFixed(2)), 0, BOARD_WIDTH),
        y: clamp(Number(y.toFixed(2)), 0, BOARD_HEIGHT)
    };
};

const buildTextLines = (text = '') => text
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line, index, collection) => line.length > 0 || index !== collection.length - 1)
    .slice(0, 6);

const distanceToSegment = (point, start, end) => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;

    if (deltaX === 0 && deltaY === 0) {
        return Math.hypot(point.x - start.x, point.y - start.y);
    }

    const t = Math.max(0, Math.min(1, (
        ((point.x - start.x) * deltaX) + ((point.y - start.y) * deltaY)
    ) / ((deltaX * deltaX) + (deltaY * deltaY))));

    const projectionX = start.x + (t * deltaX);
    const projectionY = start.y + (t * deltaY);

    return Math.hypot(point.x - projectionX, point.y - projectionY);
};

const isPointInsideTextElement = (point, element) => {
    const lines = buildTextLines(element.text);
    const maxLineLength = Math.max(...lines.map((line) => line.length), 1);
    const estimatedWidth = Math.min(BOARD_WIDTH, Math.max(72, maxLineLength * 16));
    const estimatedHeight = Math.max(40, lines.length * 34);

    return (
        point.x >= element.x - 12 &&
        point.x <= element.x + estimatedWidth &&
        point.y >= element.y - 30 &&
        point.y <= element.y + estimatedHeight
    );
};

const isPointNearPathElement = (point, element) => {
    if (!Array.isArray(element.points) || !element.points.length) {
        return false;
    }

    const hitRadius = Math.max(ERASER_HIT_PADDING, (element.strokeWidth || DEFAULT_STROKE_WIDTH) + 8);

    if (element.points.length === 1) {
        const onlyPoint = element.points[0];
        return Math.hypot(point.x - onlyPoint.x, point.y - onlyPoint.y) <= hitRadius;
    }

    for (let index = 1; index < element.points.length; index += 1) {
        if (distanceToSegment(point, element.points[index - 1], element.points[index]) <= hitRadius) {
            return true;
        }
    }

    return false;
};

const findTopmostElementAtPoint = (elements, point) => {
    for (let index = elements.length - 1; index >= 0; index -= 1) {
        const element = elements[index];

        if (element.type === 'text' && isPointInsideTextElement(point, element)) {
            return element;
        }

        if (element.type === 'path' && isPointNearPathElement(point, element)) {
            return element;
        }
    }

    return null;
};

const normalizeBoardElements = (events = []) => {
    const elements = [];
    const erasedElementIds = new Set();

    sortEvents(events).forEach((event) => {
        if (!event?.id) {
            return;
        }

        if (event.event_type === 'clear') {
            elements.length = 0;
            erasedElementIds.clear();
            return;
        }

        const payload = event.payload_json || {};

        if (event.event_type === 'erase') {
            const targetEventId = String(payload.targetEventId || '').trim();
            if (targetEventId) {
                erasedElementIds.add(targetEventId);
            }
            return;
        }

        if (event.event_type === 'path' && Array.isArray(payload.points) && payload.points.length) {
            if (erasedElementIds.has(event.id)) {
                return;
            }

            elements.push({
                id: event.id,
                type: 'path',
                color: payload.color || DEFAULT_COLORS[0],
                strokeWidth: clamp(Number(payload.strokeWidth || DEFAULT_STROKE_WIDTH), 2, 16),
                points: payload.points
                    .map((point) => ({
                        x: clamp(Number(point?.x || 0), 0, BOARD_WIDTH),
                        y: clamp(Number(point?.y || 0), 0, BOARD_HEIGHT)
                    }))
                    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y)),
                created_at: event.created_at
            });
            return;
        }

        if (event.event_type === 'text') {
            if (erasedElementIds.has(event.id)) {
                return;
            }

            const noteText = String(payload.text || '').trim().slice(0, 240);
            if (!noteText) {
                return;
            }

            elements.push({
                id: event.id,
                type: 'text',
                text: noteText,
                x: clamp(Number(payload.x || 0), 0, BOARD_WIDTH - 24),
                y: clamp(Number(payload.y || 0), 32, BOARD_HEIGHT - 16),
                color: payload.color || DEFAULT_COLORS[0],
                created_at: event.created_at
            });
        }
    });

    return elements;
};

const buildPolylinePoints = (points = []) => points.map((point) => `${point.x},${point.y}`).join(' ');

const SharedWhiteboard = ({
    groupId,
    currentUserId,
    isMember,
    isOwner,
    accentColor = '#79ffe1',
    translations
}) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState('');
    const [tool, setTool] = useState('draw');
    const [brushColor, setBrushColor] = useState(DEFAULT_COLORS[1]);
    const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
    const [noteText, setNoteText] = useState('');
    const [draftPath, setDraftPath] = useState(null);

    const boardElements = useMemo(() => normalizeBoardElements(events), [events]);

    useEffect(() => {
        if (!groupId || !isMember) {
            setEvents([]);
            setLoading(false);
            return undefined;
        }

        let cancelled = false;

        const loadWhiteboard = async () => {
            setLoading(true);
            setError('');
            const rows = await fetchStudyGroupWhiteboardEvents(groupId);

            if (!cancelled) {
                setEvents(sortEvents(uniqueEventsById(rows)));
                setLoading(false);
            }
        };

        void loadWhiteboard();

        const unsubscribe = subscribeToStudyGroupWhiteboard(groupId, (incomingEvent) => {
            if (cancelled || !incomingEvent?.id) {
                return;
            }

            setEvents((previous) => sortEvents(uniqueEventsById([...previous, incomingEvent])));
        });

        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, [groupId, isMember]);

    const appendEvent = async (eventType, payload) => {
        if (!groupId || !currentUserId) {
            setError(translations.board_sign_in_required);
            return null;
        }

        setSyncing(true);
        setError('');

        const result = await appendStudyGroupWhiteboardEvent({
            groupId,
            eventType,
            payload,
            userId: currentUserId
        });

        setSyncing(false);

        if (!result.ok || !result.event) {
            setError(result.error || translations.board_sync_error);
            return null;
        }

        setEvents((previous) => sortEvents(uniqueEventsById([...previous, result.event])));
        return result.event;
    };

    const handlePointerDown = (event) => {
        if (!isMember) {
            return;
        }

        if (tool === 'erase') {
            event.preventDefault();
            void eraseElementAtEventPoint(event);
            return;
        }

        if (tool !== 'draw') {
            return;
        }

        event.preventDefault();
        const point = getPointFromPointerEvent(event);
        setDraftPath({
            color: brushColor,
            strokeWidth,
            points: [point]
        });
    };

    const handlePointerMove = (event) => {
        if (tool !== 'draw' || !draftPath) {
            return;
        }

        event.preventDefault();
        const point = getPointFromPointerEvent(event);

        setDraftPath((previous) => {
            if (!previous) {
                return previous;
            }

            const lastPoint = previous.points[previous.points.length - 1];
            if (lastPoint && Math.abs(lastPoint.x - point.x) < 1 && Math.abs(lastPoint.y - point.y) < 1) {
                return previous;
            }

            return {
                ...previous,
                points: [...previous.points, point]
            };
        });
    };

    const finishDraftPath = async () => {
        if (tool !== 'draw' || !draftPath) {
            return;
        }

        const finishedPath = draftPath;
        setDraftPath(null);

        if (!finishedPath.points.length) {
            return;
        }

        await appendEvent('path', finishedPath);
    };

    const handleBoardClick = async (event) => {
        if (tool === 'erase' || tool === 'draw') {
            return;
        }

        if (tool !== 'text' || !isMember) {
            return;
        }

        const text = noteText.trim();
        if (!text) {
            setError(translations.board_text_hint);
            return;
        }

        const point = getPointFromPointerEvent(event);
        const created = await appendEvent('text', {
            text,
            x: point.x,
            y: point.y,
            color: brushColor
        });

        if (created) {
            setNoteText('');
        }
    };

    const eraseElementAtEventPoint = async (event) => {
        if (!isMember) {
            return;
        }

        const point = getPointFromPointerEvent(event);
        const targetElement = findTopmostElementAtPoint(boardElements, point);

        if (!targetElement?.id) {
            return;
        }

        await appendEvent('erase', {
            targetEventId: targetElement.id
        });
    };

    const handleClearBoard = async () => {
        if (!isOwner) {
            return;
        }

        await appendEvent('clear', {});
    };

    const boardStateLabel = syncing
        ? translations.board_syncing
        : translations.board_live;

    return (
        <section className="study-room-panel shared-whiteboard" style={{ '--whiteboard-accent': accentColor }}>
            <div className="study-room-panel__header shared-whiteboard__header">
                <div>
                    <h2>{translations.board_title}</h2>
                    <p>{translations.board_subtitle}</p>
                </div>

                <div className="shared-whiteboard__status">
                    {syncing ? <LoaderCircle size={15} className="shared-whiteboard__spinner" /> : null}
                    <span>{boardStateLabel}</span>
                </div>
            </div>

            <div className="shared-whiteboard__toolbar">
                <div className="shared-whiteboard__modes">
                    <button
                        type="button"
                        className={`shared-whiteboard__mode ${tool === 'draw' ? 'is-active' : ''}`}
                        onClick={() => setTool('draw')}
                    >
                        <PencilLine size={15} />
                        {translations.board_draw}
                    </button>
                    <button
                        type="button"
                        className={`shared-whiteboard__mode ${tool === 'text' ? 'is-active' : ''}`}
                        onClick={() => setTool('text')}
                    >
                        <StickyNote size={15} />
                        {translations.board_text}
                    </button>
                    <button
                        type="button"
                        className={`shared-whiteboard__mode ${tool === 'erase' ? 'is-active' : ''}`}
                        onClick={() => setTool('erase')}
                    >
                        <Eraser size={15} />
                        {translations.board_erase}
                    </button>
                </div>

                <div className="shared-whiteboard__controls">
                    <div className="shared-whiteboard__palette" aria-label={translations.board_color}>
                        {DEFAULT_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className={`shared-whiteboard__swatch ${brushColor === color ? 'is-active' : ''}`}
                                style={{ '--swatch-color': color }}
                                onClick={() => setBrushColor(color)}
                                aria-label={`${translations.board_color}: ${color}`}
                            />
                        ))}
                    </div>

                    <label className="shared-whiteboard__range">
                        <span>{translations.board_brush}</span>
                        <input
                            type="range"
                            min="2"
                            max="16"
                            step="1"
                            value={strokeWidth}
                            onChange={(event) => setStrokeWidth(Number(event.target.value))}
                        />
                    </label>

                    {isOwner ? (
                        <button type="button" className="shared-whiteboard__clear" onClick={handleClearBoard}>
                            <Trash2 size={15} />
                            {translations.board_clear}
                        </button>
                    ) : null}
                </div>
            </div>

            {tool === 'text' ? (
                <label className="shared-whiteboard__note-input">
                    <span>{translations.board_text_label}</span>
                    <textarea
                        rows={2}
                        value={noteText}
                        onChange={(event) => setNoteText(event.target.value.slice(0, 240))}
                        placeholder={translations.board_text_placeholder}
                    />
                </label>
            ) : null}

            <div className={`shared-whiteboard__board-wrap ${tool === 'draw' ? 'is-draw-mode' : tool === 'erase' ? 'is-erase-mode' : 'is-text-mode'}`}>
                <div className="shared-whiteboard__board">
                    <svg
                        viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
                        className="shared-whiteboard__svg"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={finishDraftPath}
                        onPointerLeave={finishDraftPath}
                        onPointerCancel={finishDraftPath}
                        onClick={handleBoardClick}
                    >
                        <defs>
                            <pattern id="whiteboard-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width={BOARD_WIDTH} height={BOARD_HEIGHT} fill="url(#whiteboard-grid)" />

                        {boardElements
                            .filter((element) => element.type === 'path')
                            .map((element) => (
                                element.points.length === 1 ? (
                                    <circle
                                        key={element.id}
                                        cx={element.points[0].x}
                                        cy={element.points[0].y}
                                        r={element.strokeWidth / 2}
                                        fill={element.color}
                                    />
                                ) : (
                                    <polyline
                                        key={element.id}
                                        points={buildPolylinePoints(element.points)}
                                        fill="none"
                                        stroke={element.color}
                                        strokeWidth={element.strokeWidth}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                )
                            ))}

                        {draftPath ? (
                            draftPath.points.length === 1 ? (
                                <circle
                                    cx={draftPath.points[0].x}
                                    cy={draftPath.points[0].y}
                                    r={draftPath.strokeWidth / 2}
                                    fill={draftPath.color}
                                />
                            ) : (
                                <polyline
                                    points={buildPolylinePoints(draftPath.points)}
                                    fill="none"
                                    stroke={draftPath.color}
                                    strokeWidth={draftPath.strokeWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )
                        ) : null}

                        {boardElements
                            .filter((element) => element.type === 'text')
                            .map((element) => (
                                <text
                                    key={element.id}
                                    x={element.x}
                                    y={element.y}
                                    fill={element.color}
                                    fontSize="28"
                                    fontWeight="700"
                                    fontFamily="SF Pro Display, sans-serif"
                                >
                                    {buildTextLines(element.text).map((line, index) => (
                                        <tspan
                                            key={`${element.id}-line-${index}`}
                                            x={element.x}
                                            dy={index === 0 ? 0 : 34}
                                        >
                                            {line}
                                        </tspan>
                                    ))}
                                </text>
                            ))}
                    </svg>

                    {!loading && boardElements.length === 0 && !draftPath ? (
                        <div className="shared-whiteboard__empty">
                            <strong>{translations.board_empty_title}</strong>
                            <span>{translations.board_empty_subtitle}</span>
                        </div>
                    ) : null}

                    {loading ? (
                        <div className="shared-whiteboard__loading">
                            <LoaderCircle size={18} className="shared-whiteboard__spinner" />
                            <span>{translations.board_loading}</span>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="shared-whiteboard__footer">
                <span>
                    {tool === 'draw'
                        ? translations.board_draw_hint
                        : tool === 'erase'
                            ? translations.board_erase_hint
                            : translations.board_place_text_hint}
                </span>
                <span>{translations.board_member_access}</span>
            </div>

            {error ? (
                <div className="study-room-feedback study-room-feedback--error compact">{error}</div>
            ) : null}
        </section>
    );
};

export default SharedWhiteboard;

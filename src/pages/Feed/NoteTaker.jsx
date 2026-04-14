import React, { useState, useEffect, useRef } from 'react';
import { Cloud, CloudUpload, CloudOff } from 'lucide-react';
import { fetchVideoNote, upsertVideoNote, saveUserSummary } from '../../lib/db';
import { useAuth } from '../../context/AuthContext';
import './NoteTaker.css';

const FALLBACK_USER_ID = '00000000-0000-0000-0000-000000000001';
const GLOBAL_FEED_NOTES_ID = 'global-feed-notes';

const NoteTaker = () => {
    const { user } = useAuth();
    const userId = user?.id || FALLBACK_USER_ID;
    const [notes, setNotes] = useState('');
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error', 'loading'
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const typingTimeoutRef = useRef(null);

    // Initial fetch of notes
    useEffect(() => {
        const loadNotes = async () => {
            setSaveStatus('loading');
            const data = await fetchVideoNote(userId, GLOBAL_FEED_NOTES_ID);
            setNotes(data || '');
            setSaveStatus('saved');
        };

        loadNotes();

        // Cleanup timeout on unmount
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [userId]);

    // Handle text change with debounce auto-save
    const handleChange = (e) => {
        const newNotes = e.target.value;
        setNotes(newNotes);
        setSaveStatus('saving');

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new debounced timeout (wait 1 second after last keystroke)
        typingTimeoutRef.current = setTimeout(async () => {
            const success = await upsertVideoNote(userId, GLOBAL_FEED_NOTES_ID, newNotes);
            if (success) {
                setSaveStatus('saved');
            } else {
                setSaveStatus('error');
            }
        }, 1000);
    };

    const handleManualSaveClick = () => {
        setIsSaveModalOpen(true);
        setNoteTitle('');
    };

    const confirmSave = async () => {
        if (noteTitle.trim()) {
            setSaveStatus('saving');
            const success = await saveUserSummary(userId, noteTitle, notes, 'Book');
            if (success) {
                setSaveStatus('saved');
                alert(`Note "${noteTitle}" saved to your profile!`);
                setIsSaveModalOpen(false);
            } else {
                setSaveStatus('error');
                alert(`Failed to save note "${noteTitle}". Please try again.`);
            }
        }
    };

    // Render save status icon (without text, just the icon)
    const renderStatusIcon = () => {
        switch (saveStatus) {
            case 'saving':
                return <CloudUpload size={18} className="status-saving" title="Saving..." />;
            case 'error':
                return <CloudOff size={18} className="status-error" title="Error saving" />;
            case 'saved':
            case 'loading':
            default:
                return <Cloud size={18} className="status-saved" title="Saved" />;
        }
    };

    return (
        <div className="note-taker-container">
            <div className="note-taker-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className="note-taker-title">Notes</h3>
                    <div className="note-taker-status-icon-only">
                        {renderStatusIcon()}
                    </div>
                </div>
                <div>
                    <button className="save-note-btn" onClick={handleManualSaveClick}>
                        Save note
                    </button>
                </div>
            </div>

            <div className="note-taker-body">
                <textarea
                    className="note-taker-input"
                    placeholder="Write your notes here..."
                    value={notes}
                    onChange={handleChange}
                    disabled={saveStatus === 'loading'}
                />
            </div>

            {isSaveModalOpen && (
                <div className="save-modal-overlay" onClick={() => setIsSaveModalOpen(false)}>
                    <div className="save-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h4 className="save-modal-title">Save Note</h4>
                        <input
                            autoFocus
                            type="text"
                            className="save-modal-input"
                            placeholder="Enter a title for your note..."
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && confirmSave()}
                        />
                        <div className="save-modal-actions">
                            <button className="save-modal-cancel" onClick={() => setIsSaveModalOpen(false)}>
                                Cancel
                            </button>
                            <button
                                className="save-modal-confirm"
                                onClick={confirmSave}
                                disabled={!noteTitle.trim()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteTaker;

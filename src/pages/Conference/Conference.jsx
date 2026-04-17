import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  AudioLines,
  Camera,
  Copy,
  LoaderCircle,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  RefreshCw,
  Sparkles,
  Video,
  VideoOff,
  Users,
} from 'lucide-react';
import { connect, LocalVideoTrack } from 'twilio-video';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './Conference.css';

const TOKEN_SERVER_URL =
  import.meta.env.VITE_TWILIO_TOKEN_SERVER_URL || 'http://localhost:3007/token';

const connectionOptions = {
  dominantSpeaker: true,
  maxAudioBitrate: 16000,
  preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
  bandwidthProfile: {
    video: {
      dominantSpeakerPriority: 'high',
      mode: 'collaboration',
      clientTrackSwitchOffControl: 'auto',
      contentPreferencesMode: 'auto',
    },
  },
  video: { width: 1280, height: 720, frameRate: 24 },
};

const getVideoTrack = (participant) => {
  const publications = Array.from(participant.videoTracks?.values?.() || []);
  const tracks = publications.map((publication) => publication.track).filter(Boolean);
  return tracks.find((track) => track.name === 'screen-share') || tracks[0] || null;
};

const getAudioTrack = (participant) => {
  const publications = Array.from(participant.audioTracks?.values?.() || []);
  return publications.map((publication) => publication.track).find(Boolean) || null;
};

const buildParticipantModel = (participant, isLocal = false) => {
  const videoTrack = getVideoTrack(participant);

  return {
    sid: participant.sid,
    identity: participant.identity || (isLocal ? 'You' : 'Guest'),
    isLocal,
    videoTrack,
    audioTrack: getAudioTrack(participant),
    isScreenSharing: videoTrack?.name === 'screen-share',
  };
};

const ParticipantTile = ({ participant, highlight = false }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const { videoTrack } = participant;
    const node = videoRef.current;
    if (!videoTrack || !node) return undefined;

    videoTrack.attach(node);
    return () => {
      videoTrack.detach(node);
    };
  }, [participant.videoTrack]);

  useEffect(() => {
    const { audioTrack, isLocal } = participant;
    const node = audioRef.current;
    if (!audioTrack || !node || isLocal) return undefined;

    audioTrack.attach(node);
    return () => {
      audioTrack.detach(node);
    };
  }, [participant.audioTrack, participant.isLocal]);

  return (
    <article className={`conference-tile ${highlight ? 'is-highlighted' : ''}`}>
      <div className="conference-tile__media">
        {participant.videoTrack ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={participant.isLocal}
            className="conference-tile__video"
          />
        ) : (
          <div className="conference-tile__placeholder">
            <VideoOff size={28} />
            <span>Video offline</span>
          </div>
        )}
        <audio ref={audioRef} autoPlay />
      </div>
      <div className="conference-tile__meta">
        <div>
          <strong>{participant.identity}</strong>
          <span>
            {participant.isScreenSharing
              ? 'Sharing screen'
              : participant.isLocal
                ? 'Local participant'
                : 'Live in room'}
          </span>
        </div>
        <div className="conference-tile__badges">
          <span className={participant.audioTrack?.isEnabled === false ? 'is-off' : ''}>
            {participant.audioTrack?.isEnabled === false ? <MicOff size={14} /> : <Mic size={14} />}
          </span>
          <span className={participant.videoTrack?.isEnabled === false ? 'is-off' : ''}>
            {participant.videoTrack?.isEnabled === false ? (
              <VideoOff size={14} />
            ) : (
              <Video size={14} />
            )}
          </span>
        </div>
      </div>
    </article>
  );
};

const Conference = () => {
  const { language } = useLanguage();
  const t = translations[language].conference;

  const [roomName, setRoomName] = useState('smart-scroll-room');
  const [displayName, setDisplayName] = useState('Guest learner');
  const [cameraId, setCameraId] = useState('');
  const [microphoneId, setMicrophoneId] = useState('');
  const [devices, setDevices] = useState({ cameras: [], microphones: [] });
  const [previewStream, setPreviewStream] = useState(null);
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);
  const [isCopying, setIsCopying] = useState(false);

  const previewVideoRef = useRef(null);
  const roomRef = useRef(null);
  const screenTrackRef = useRef(null);

  const isConnected = Boolean(room);
  const participantCount = participants.length;

  const statusMeta = useMemo(() => {
    if (status === 'connecting') return { label: t.status_connecting, tone: 'is-connecting' };
    if (status === 'connected') return { label: t.status_connected, tone: 'is-connected' };
    if (status === 'error') return { label: t.status_error, tone: 'is-error' };
    return { label: t.status_idle, tone: 'is-idle' };
  }, [status, t]);

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    if (isConnected) return undefined;
    startPreview();

    return () => {
      stopPreview();
    };
  }, [cameraId, microphoneId, isConnected]);

  useEffect(() => {
    const node = previewVideoRef.current;
    if (!node) return;

    if (previewStream) {
      node.srcObject = previewStream;
    } else {
      node.srcObject = null;
    }
  }, [previewStream]);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    screenTrackRef.current = screenTrack;
  }, [screenTrack]);

  useEffect(() => {
    return () => {
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
      }
      stopPreview();
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, []);

  const loadDevices = async () => {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const cameras = mediaDevices.filter((device) => device.kind === 'videoinput');
      const microphones = mediaDevices.filter((device) => device.kind === 'audioinput');

      setDevices({ cameras, microphones });
      if (!cameraId && cameras[0]) setCameraId(cameras[0].deviceId);
      if (!microphoneId && microphones[0]) setMicrophoneId(microphones[0].deviceId);
    } catch (loadError) {
      setError(loadError.message || t.device_error);
    }
  };

  const startPreview = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cameraId ? { deviceId: { exact: cameraId } } : true,
        audio: microphoneId ? { deviceId: { exact: microphoneId } } : true,
      });

      setPreviewStream((current) => {
        current?.getTracks().forEach((track) => track.stop());
        return stream;
      });
    } catch (previewError) {
      setError(previewError.message || t.preview_error);
    }
  };

  const stopPreview = () => {
    setPreviewStream((current) => {
      current?.getTracks().forEach((track) => track.stop());
      return null;
    });
  };

  const syncParticipants = (activeRoom) => {
    const nextParticipants = [
      buildParticipantModel(activeRoom.localParticipant, true),
      ...Array.from(activeRoom.participants.values()).map((participant) =>
        buildParticipantModel(participant)
      ),
    ];
    setParticipants(nextParticipants);
  };

  const registerParticipantEvents = (participant, activeRoom) => {
    participant.on('trackSubscribed', () => syncParticipants(activeRoom));
    participant.on('trackUnsubscribed', () => syncParticipants(activeRoom));
    participant.on('trackEnabled', () => syncParticipants(activeRoom));
    participant.on('trackDisabled', () => syncParticipants(activeRoom));
    participant.on('trackPublished', () => syncParticipants(activeRoom));
    participant.on('trackUnpublished', () => syncParticipants(activeRoom));
  };

  const fetchToken = async () => {
    const identity = displayName.trim();
    const roomParam = roomName.trim();
    const url = new URL(TOKEN_SERVER_URL);
    url.searchParams.set('identity', identity);
    url.searchParams.set('room', roomParam);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`${t.token_error} (${response.status})`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const payload = await response.json();
      return payload.token || payload.accessToken || '';
    }

    return response.text();
  };

  const joinRoom = async () => {
    if (!roomName.trim() || !displayName.trim()) {
      setError(t.form_error);
      return;
    }

    try {
      setError('');
      setStatus('connecting');

      const token = await fetchToken();
      if (!token) {
        throw new Error(t.token_missing);
      }

      const activeRoom = await connect(token, {
        ...connectionOptions,
        name: roomName.trim(),
        audio: microphoneId ? { deviceId: { exact: microphoneId } } : true,
        video: cameraId ? { deviceId: { exact: cameraId }, width: 1280, height: 720 } : true,
      });

      activeRoom.on('participantConnected', (participant) => {
        registerParticipantEvents(participant, activeRoom);
        syncParticipants(activeRoom);
      });

      activeRoom.on('participantDisconnected', () => {
        syncParticipants(activeRoom);
      });

      activeRoom.on('dominantSpeakerChanged', () => {
        syncParticipants(activeRoom);
      });

      activeRoom.on('disconnected', () => {
        setStatus('idle');
        setRoom(null);
        setParticipants([]);
        setIsMuted(false);
        setIsVideoEnabled(true);
        setIsScreenSharing(false);
        setScreenTrack(null);
        startPreview();
      });

      registerParticipantEvents(activeRoom.localParticipant, activeRoom);
      activeRoom.participants.forEach((participant) => {
        registerParticipantEvents(participant, activeRoom);
      });

      stopPreview();
      setRoom(activeRoom);
      syncParticipants(activeRoom);
      setStatus('connected');
    } catch (joinError) {
      setStatus('error');
      setError(joinError.message || t.join_error);
    }
  };

  const disconnectRoom = () => {
    setScreenTrack((currentTrack) => {
      if (currentTrack) {
        currentTrack.stop();
      }
      return null;
    });

    if (room) {
      room.disconnect();
    }

    setRoom(null);
    setParticipants([]);
    setIsMuted(false);
    setIsVideoEnabled(true);
    setIsScreenSharing(false);
    setStatus('idle');
  };

  const toggleMute = () => {
    if (!room?.localParticipant) return;

    room.localParticipant.audioTracks.forEach((publication) => {
      if (publication.track) {
        if (isMuted) publication.track.enable();
        else publication.track.disable();
      }
    });

    setIsMuted((current) => !current);
    syncParticipants(room);
  };

  const toggleVideo = () => {
    if (!room?.localParticipant) return;

    room.localParticipant.videoTracks.forEach((publication) => {
      if (publication.track && publication.track.name !== 'screen-share') {
        if (isVideoEnabled) publication.track.disable();
        else publication.track.enable();
      }
    });

    setIsVideoEnabled((current) => !current);
    syncParticipants(room);
  };

  const toggleScreenShare = async () => {
    if (!room?.localParticipant) return;

    if (screenTrack) {
      room.localParticipant.unpublishTrack(screenTrack);
      screenTrack.stop();
      setScreenTrack(null);
      setIsScreenSharing(false);
      syncParticipants(room);
      return;
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const [track] = displayStream.getVideoTracks();
      const publishedTrack = new LocalVideoTrack(track, { name: 'screen-share' });
      await room.localParticipant.publishTrack(publishedTrack);

      track.onended = () => {
        room.localParticipant.unpublishTrack(publishedTrack);
        publishedTrack.stop();
        setScreenTrack(null);
        setIsScreenSharing(false);
        syncParticipants(room);
      };

      setScreenTrack(publishedTrack);
      setIsScreenSharing(true);
      syncParticipants(room);
    } catch (shareError) {
      setError(shareError.message || t.share_error);
    }
  };

  const copyInvite = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(roomName.trim());
    } finally {
      window.setTimeout(() => setIsCopying(false), 1200);
    }
  };

  return (
    <div className="page-container conference-page">
      <section className="conference-hero">
        <div className="conference-hero__copy">
          <span className="conference-eyebrow">
            <Sparkles size={14} />
            {t.eyebrow}
          </span>
          <h1 className="conference-title">{t.title}</h1>
          <p className="conference-subtitle">{t.subtitle}</p>
          <div className="conference-status-row">
            <div className={`conference-status ${statusMeta.tone}`}>
              <AudioLines size={16} />
              {statusMeta.label}
            </div>
            <div className="conference-status conference-status--ghost">
              <Users size={16} />
              {participantCount} {t.participants}
            </div>
          </div>
        </div>

        <aside className="conference-hero__panel glass">
          <div className="conference-panel__header">
            <div>
              <h2>{t.setup_title}</h2>
              <p>{t.setup_subtitle}</p>
            </div>
            <button className="conference-icon-btn" onClick={loadDevices} title={t.refresh_devices}>
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="conference-form-grid">
            <label className="conference-field">
              <span>{t.room_label}</span>
              <input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            </label>
            <label className="conference-field">
              <span>{t.name_label}</span>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </label>
            <label className="conference-field">
              <span>{t.camera_label}</span>
              <select value={cameraId} onChange={(e) => setCameraId(e.target.value)}>
                {devices.cameras.map((camera, index) => (
                  <option key={camera.deviceId || index} value={camera.deviceId}>
                    {camera.label || `${t.camera_fallback} ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
            <label className="conference-field">
              <span>{t.microphone_label}</span>
              <select value={microphoneId} onChange={(e) => setMicrophoneId(e.target.value)}>
                {devices.microphones.map((mic, index) => (
                  <option key={mic.deviceId || index} value={mic.deviceId}>
                    {mic.label || `${t.microphone_fallback} ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="conference-actions">
            <button
              className="conference-primary-btn"
              onClick={joinRoom}
              disabled={isConnected || status === 'connecting'}
            >
              {status === 'connecting' ? <LoaderCircle size={18} className="spin" /> : <Camera size={18} />}
              {status === 'connecting' ? t.connecting_btn : t.join_btn}
            </button>
            <button className="conference-secondary-btn" onClick={copyInvite}>
              <Copy size={18} />
              {isCopying ? t.copied : t.copy_room}
            </button>
          </div>

          <div className="conference-note">
            <AlertCircle size={16} />
            <span>{t.server_hint.replace('{url}', TOKEN_SERVER_URL)}</span>
          </div>

          {error ? (
            <div className="conference-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ) : null}
        </aside>
      </section>

      <section className="conference-stage">
        <div className="conference-stage__main glass">
          <div className="conference-stage__header">
            <div>
              <h2>{isConnected ? t.live_room_title : t.preview_title}</h2>
              <p>{isConnected ? t.live_room_subtitle : t.preview_subtitle}</p>
            </div>
            {isConnected ? (
              <button className="conference-danger-btn" onClick={disconnectRoom}>
                <PhoneOff size={18} />
                {t.leave_btn}
              </button>
            ) : null}
          </div>

          {isConnected ? (
            <div className="conference-grid">
              {participants.map((participant, index) => (
                <ParticipantTile
                  key={participant.sid}
                  participant={participant}
                  highlight={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="conference-preview-card">
              <video ref={previewVideoRef} autoPlay playsInline muted className="conference-preview-video" />
              <div className="conference-preview-copy">
                <strong>{displayName || t.preview_user_fallback}</strong>
                <span>{t.preview_ready}</span>
              </div>
            </div>
          )}
        </div>

        <aside className="conference-stage__sidebar">
          <div className="conference-control-panel glass">
            <h3>{t.controls_title}</h3>
            <div className="conference-control-grid">
              <button className={`conference-control-btn ${isMuted ? 'is-off' : ''}`} onClick={toggleMute} disabled={!isConnected}>
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                {isMuted ? t.unmute : t.mute}
              </button>
              <button
                className={`conference-control-btn ${!isVideoEnabled ? 'is-off' : ''}`}
                onClick={toggleVideo}
                disabled={!isConnected}
              >
                {!isVideoEnabled ? <VideoOff size={18} /> : <Video size={18} />}
                {!isVideoEnabled ? t.enable_video : t.disable_video}
              </button>
              <button
                className={`conference-control-btn ${isScreenSharing ? 'is-live' : ''}`}
                onClick={toggleScreenShare}
                disabled={!isConnected}
              >
                <MonitorUp size={18} />
                {isScreenSharing ? t.stop_share : t.start_share}
              </button>
            </div>
          </div>

          <div className="conference-info-card glass">
            <h3>{t.room_card_title}</h3>
            <dl>
              <div>
                <dt>{t.room_label}</dt>
                <dd>{roomName}</dd>
              </div>
              <div>
                <dt>{t.name_label}</dt>
                <dd>{displayName}</dd>
              </div>
              <div>
                <dt>{t.participants_label}</dt>
                <dd>{participantCount}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Conference;

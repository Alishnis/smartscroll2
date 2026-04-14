import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { fetchGroupMessages, sendGroupMessage, fetchGroups } from '../../lib/db';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import './GroupDetails.css';

const GroupDetails = () => {
    const { language } = useLanguage();
    const t = translations[language].group_details;
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const currentUserId = '00000000-0000-0000-0000-000000000001'; // Mock user ID

    useEffect(() => {
        const loadGroupAndMessages = async () => {
            setLoading(true);
            // Fetch the group details (in a real app you might have a specific fetchGroupById function)
            const allGroups = await fetchGroups();
            const currentGroup = allGroups.find(g => g.id === groupId);
            setGroup(currentGroup);

            // Fetch initial messages
            const fetchedMessages = await fetchGroupMessages(groupId);
            setMessages(fetchedMessages);
            setLoading(false);
            scrollToBottom();
        };

        if (groupId) {
            loadGroupAndMessages();
        }
    }, [groupId]);

    // Set up Realtime Subscription for new messages
    useEffect(() => {
        if (!groupId) return;

        const subscription = supabase
            .channel(`public:group_messages:group_id=eq.${groupId}`)
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'group_messages',
                    filter: `group_id=eq.${groupId}`
                },
                async (payload) => {
                    // We need to fetch the profile info for the new message since the payload only has the raw row
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('username, avatar_url')
                        .eq('id', payload.new.user_id)
                        .single();

                    const newMessageWithProfile = {
                        ...payload.new,
                        profiles: profileData
                    };

                    setMessages(prev => [...prev, newMessageWithProfile]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [groupId]);

    // Scroll to bottom whenever messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const sent = await sendGroupMessage(currentUserId, groupId, newMessage.trim());
        if (sent) {
            setNewMessage('');
            // Optional: You could optimistically add the message to the local state here,
            // but the realtime subscription will handle it soon enough.
        }
    };

    if (loading) {
        return (
            <div className="page-container group-details-page">
                <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="skeleton avatar" style={{ width: '40px', height: '40px' }}></div>
                    <div>
                        <div className="skeleton title" style={{ width: '150px' }}></div>
                        <div className="skeleton bar" style={{ width: '100px', marginTop: '8px' }}></div>
                    </div>
                </header>
                <div className="chat-container glass">
                    <div className="chat-messages" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="skeleton bar" style={{ width: '60%' }}></div>
                        <div className="skeleton bar" style={{ width: '40%', alignSelf: 'flex-end' }}></div>
                        <div className="skeleton bar" style={{ width: '70%' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="page-container">
                <h2>{t.not_found}</h2>
                <button className="browse-more-btn glass" onClick={() => navigate('/groups')}>{t.back}</button>
            </div>
        );
    }

    const IconComponent = LucideIcons[group.icon_name] || LucideIcons.Users;

    return (
        <div className="page-container group-details-page">
            <header className="page-header group-chat-header">
                <button className="back-btn" onClick={() => navigate('/groups')}>
                    <LucideIcons.ArrowLeft size={20} />
                </button>
                <div className="group-header-info">
                    <div className="group-icon-placeholder small">
                        <IconComponent size={20} style={{ color: group.icon_color || 'var(--color-accent-bright)' }} />
                    </div>
                    <div>
                        <h1 className="tech-font text-gradient" style={{ fontSize: '24px' }}>{group.name}</h1>
                        <p className="subtitle" style={{ fontSize: '14px', marginTop: '2px' }}>
                            {group.member_count} {t.members}
                        </p>
                    </div>
                </div>
            </header>

            <div className="chat-container glass">
                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="empty-chat-state">
                            <LucideIcons.MessageSquare size={48} className="text-muted" style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p className="text-secondary">{t.no_messages}</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.user_id === currentUserId;
                            return (
                                <div key={msg.id} className={`chat-message-wrapper ${isMe ? 'sent' : 'received'}`}>
                                    {!isMe && (
                                        <div className="message-avatar">
                                            {msg.profiles?.avatar_url ? (
                                                <img src={msg.profiles.avatar_url} alt="avatar" />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {msg.profiles?.username ? msg.profiles.username.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="message-content">
                                        {!isMe && <span className="message-sender">{msg.profiles?.username || t.unknown_user}</span>}
                                        <div className={`chat-bubble ${isMe ? 'my-bubble' : 'other-bubble'}`}>
                                            {msg.content}
                                        </div>
                                        <span className="message-time">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder={t.input_placeholder}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="send-btn"
                        disabled={!newMessage.trim()}
                    >
                        <LucideIcons.Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupDetails;

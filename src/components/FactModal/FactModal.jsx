import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import './FactModal.css';

const FactModal = ({ fact, onClose }) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!fact) return null;

    return (
        <div className="fact-modal-overlay" onClick={onClose}>
            <div className="fact-modal-content" onClick={(e) => e.stopPropagation()}>
                <a
                    href={fact.url}
                    target="_blank"
                    rel="noreferrer"
                    className="view-wiki-btn"
                >
                    <ExternalLink size={14} style={{ marginRight: '6px' }} />
                    Wikipedia
                </a>
                <button className="close-modal-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="fact-modal-header">
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Wikipedia Abstract</span>
                </div>

                <div className="fact-modal-body custom-scrollbar">
                    <h2 className="fact-modal-title">{fact.title}</h2>

                    <div className="fact-modal-body-content">
                        {fact.thumbnail && (
                            <img src={fact.thumbnail} alt={fact.title} className="fact-modal-thumbnail" />
                        )}
                        <div className="fact-modal-full-text">
                            {fact.extract}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FactModal;

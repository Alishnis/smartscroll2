CREATE TABLE explain_back_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    content_id VARCHAR(191) NOT NULL,
    content_type VARCHAR(32) NOT NULL DEFAULT 'generic',
    source_label VARCHAR(120) NULL,
    source_title VARCHAR(255) NULL,
    topic VARCHAR(255) NOT NULL,
    source_text MEDIUMTEXT NULL,
    explanation MEDIUMTEXT NULL,
    follow_up_summary TEXT NULL,
    overall_score DECIMAL(4,2) NULL,
    confidence_level VARCHAR(32) NULL,
    criteria_json JSON NULL,
    strengths_json JSON NULL,
    gaps_json JSON NULL,
    next_step TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_explain_user_created (user_id, created_at),
    INDEX idx_explain_content (content_id, content_type)
);

CREATE TABLE explain_back_questions (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    question_text TEXT NOT NULL,
    answer_text MEDIUMTEXT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_explain_questions_session
        FOREIGN KEY (session_id) REFERENCES explain_back_sessions(id)
        ON DELETE CASCADE,
    INDEX idx_explain_questions_session (session_id, sort_order)
);

CREATE TABLE memory_refresh_groups (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(160) NOT NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_memory_groups_user_created (user_id, created_at)
);

CREATE TABLE memory_refresh_group_items (
    id VARCHAR(64) PRIMARY KEY,
    group_id VARCHAR(64) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_memory_group_items_group
        FOREIGN KEY (group_id) REFERENCES memory_refresh_groups(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_memory_group_items_session
        FOREIGN KEY (session_id) REFERENCES explain_back_sessions(id)
        ON DELETE CASCADE,
    UNIQUE KEY uq_memory_group_session (group_id, session_id),
    INDEX idx_memory_group_items_group (group_id)
);

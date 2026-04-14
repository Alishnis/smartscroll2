import { supabase } from './supabaseClient';

const buildId = (prefix) => `${prefix}_${crypto.randomUUID()}`;

const ensureGamificationProfile = async (userId) => {
    const { data: existing, error: fetchError } = await supabase
        .from('gamification_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (fetchError) {
        throw fetchError;
    }

    if (existing) {
        return existing;
    }

    const payload = {
        user_id: userId,
        smart_coins: 0,
        equipped_accessory_id: null,
        total_minutes_spent: 0,
        updated_at: new Date().toISOString()
    };

    const { data: inserted, error: insertError } = await supabase
        .from('gamification_profiles')
        .insert([payload])
        .select('*')
        .single();

    if (insertError) {
        throw insertError;
    }

    return inserted;
};

/**
 * Fetch all groups from the public.groups table.
 */
export const fetchGroups = async () => {
    try {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .order('member_count', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
    }
};

/**
 * Fetch groups that a specific user has joined.
 */
export const fetchUserJoinedGroups = async (userId) => {
    try {
        // We join the user_groups table with the groups table
        const { data, error } = await supabase
            .from('user_groups')
            .select(`
                group_id,
                groups (*)
            `)
            .eq('user_id', userId);

        if (error) throw error;
        // Extract just the group objects
        return data ? data.map(row => row.groups) : [];
    } catch (error) {
        console.error('Error fetching user joined groups:', error);
        return [];
    }
};

/**
 * Fetch a user profile securely by profile ID.
 * Defaults to the mock ID if none is provided for testing purposes.
 */
export const fetchUserProfile = async (userId = '00000000-0000-0000-0000-000000000001') => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            // If strictly not found, it might throw PGRST116. Let's return null instead of breaking
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};

export const fetchGamificationProfile = async (userId = '00000000-0000-0000-0000-000000000001') => {
    try {
        return await ensureGamificationProfile(userId);
    } catch (error) {
        console.error('Error fetching gamification profile:', error);
        return null;
    }
};

export const fetchUserAccessoryPurchases = async (userId = '00000000-0000-0000-0000-000000000001') => {
    try {
        const { data, error } = await supabase
            .from('user_accessory_purchases')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching accessory purchases:', error);
        return [];
    }
};

export const awardSmartCoins = async ({
    userId = '00000000-0000-0000-0000-000000000001',
    amount,
    reason,
    idempotencyKey,
    metadata = {},
    minutesSpentDelta = 0
}) => {
    try {
        if (!amount || amount === 0 || !idempotencyKey) {
            return { ok: false, balance: 0 };
        }

        const profile = await ensureGamificationProfile(userId);

        const { data: existingEvent, error: existingError } = await supabase
            .from('smart_coin_ledger')
            .select('*')
            .eq('user_id', userId)
            .eq('idempotency_key', idempotencyKey)
            .maybeSingle();

        if (existingError) throw existingError;
        if (existingEvent) {
            return { ok: true, balance: profile.smart_coins ?? 0, duplicate: true };
        }

        const newBalance = Number(profile.smart_coins || 0) + Number(amount);
        const newMinutes = Number(profile.total_minutes_spent || 0) + Number(minutesSpentDelta || 0);

        const { error: ledgerError } = await supabase
            .from('smart_coin_ledger')
            .insert([{
                id: buildId('coin'),
                user_id: userId,
                amount,
                reason,
                metadata_json: metadata,
                idempotency_key: idempotencyKey,
                created_at: new Date().toISOString()
            }]);

        if (ledgerError) throw ledgerError;

        const { error: updateError } = await supabase
            .from('gamification_profiles')
            .update({
                smart_coins: newBalance,
                total_minutes_spent: newMinutes,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (updateError) throw updateError;

        return { ok: true, balance: newBalance };
    } catch (error) {
        console.error('Error awarding smart coins:', error);
        return { ok: false, balance: 0 };
    }
};

export const purchaseProfileAccessory = async ({
    userId = '00000000-0000-0000-0000-000000000001',
    accessoryId,
    price,
    title,
    category = 'accessory'
}) => {
    try {
        const profile = await ensureGamificationProfile(userId);

        const { data: existingPurchase, error: existingError } = await supabase
            .from('user_accessory_purchases')
            .select('*')
            .eq('user_id', userId)
            .eq('accessory_id', accessoryId)
            .maybeSingle();

        if (existingError) throw existingError;

        if (existingPurchase) {
            return { ok: true, alreadyOwned: true, balance: profile.smart_coins ?? 0 };
        }

        if (Number(profile.smart_coins || 0) < Number(price || 0)) {
            return { ok: false, reason: 'insufficient', balance: profile.smart_coins ?? 0 };
        }

        const newBalance = Number(profile.smart_coins || 0) - Number(price || 0);

        const { error: purchaseError } = await supabase
            .from('user_accessory_purchases')
            .insert([{
                id: buildId('accessory_purchase'),
                user_id: userId,
                accessory_id: accessoryId,
                category,
                title,
                created_at: new Date().toISOString()
            }]);

        if (purchaseError) throw purchaseError;

        const { error: ledgerError } = await supabase
            .from('smart_coin_ledger')
            .insert([{
                id: buildId('coin'),
                user_id: userId,
                amount: -Math.abs(Number(price || 0)),
                reason: 'accessory_purchase',
                metadata_json: { accessoryId, title },
                idempotency_key: `purchase-${userId}-${accessoryId}`,
                created_at: new Date().toISOString()
            }]);

        if (ledgerError) throw ledgerError;

        const { error: updateError } = await supabase
            .from('gamification_profiles')
            .update({
                smart_coins: newBalance,
                equipped_accessory_id: profile.equipped_accessory_id || accessoryId,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (updateError) throw updateError;

        return { ok: true, balance: newBalance };
    } catch (error) {
        console.error('Error purchasing accessory:', error);
        return { ok: false, balance: 0 };
    }
};

export const equipProfileAccessory = async ({
    userId = '00000000-0000-0000-0000-000000000001',
    accessoryId
}) => {
    try {
        const { error } = await supabase
            .from('gamification_profiles')
            .update({
                equipped_accessory_id: accessoryId,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error equipping accessory:', error);
        return false;
    }
};

/**
 * Fetch a user's saved summaries.
 * Defaults to the mock ID if none is provided for testing purposes.
 */
export const fetchUserSummaries = async (userId = '00000000-0000-0000-0000-000000000001', limit = 5) => {
    try {
        const { data, error } = await supabase
            .from('summaries')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching user summaries:', error);
        return [];
    }
};

/**
 * Utility function to join a user into a group
 */
export const joinGroup = async (userId, groupId) => {
    try {
        const { error } = await supabase
            .from('user_groups')
            .insert([{ user_id: userId, group_id: groupId }]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error joining group:', error);
        return false;
    }
};

/**
 * Utility function to leave a group
 */
export const leaveGroup = async (userId, groupId) => {
    try {
        const { error } = await supabase
            .from('user_groups')
            .delete()
            .match({ user_id: userId, group_id: groupId });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error leaving group:', error);
        return false;
    }
};

/**
 * Fetch messages for a specific group
 */
export const fetchGroupMessages = async (groupId) => {
    try {
        const { data, error } = await supabase
            .from('group_messages')
            .select(`
                *,
                profiles (
                    username,
                    avatar_url
                )
            `)
            .eq('group_id', groupId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching group messages:', error);
        return [];
    }
};

/**
 * Send a message to a specific group
 */
export const sendGroupMessage = async (userId, groupId, content) => {
    try {
        const { error } = await supabase
            .from('group_messages')
            .insert([{
                group_id: groupId,
                user_id: userId,
                content: content
            }]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error sending message:', error);
        return false;
    }
};

/**
 * Fetch a video note for a specific user and video
 */
export const fetchVideoNote = async (userId, videoId) => {
    try {
        const { data, error } = await supabase
            .from('video_notes')
            .select('*')
            .eq('user_id', userId)
            .eq('video_id', videoId)
            .maybeSingle();

        if (error) throw error;
        return data ? data.content : '';
    } catch (error) {
        console.error('Error fetching video note:', error);
        return '';
    }
};

/**
 * Upsert (Insert or Update) a video note
 */
export const upsertVideoNote = async (userId, videoId, content) => {
    try {
        const { error } = await supabase
            .from('video_notes')
            .upsert(
                { user_id: userId, video_id: videoId, content: content, updated_at: new Date() },
                { onConflict: 'user_id,video_id' }
            );

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving video note:', error);
        return false;
    }
};

/**
 * Save a new user summary/note
 */
export const saveUserSummary = async (userId, title, content, iconName = 'Book') => {
    try {
        const { error } = await supabase
            .from('summaries')
            .insert([{
                user_id: userId,
                title: title,
                content: content,
                icon_name: iconName
            }]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving summary:', error);
        return false;
    }
};

export const createExplainBackSessionWithQuestions = async ({
    userId,
    contentId,
    contentType,
    sourceLabel,
    sourceTitle,
    topic,
    sourceText,
    explanation,
    followUpSummary,
    questions = []
}) => {
    try {
        const sessionId = buildId('explain');
        const sessionPayload = {
            id: sessionId,
            user_id: userId,
            content_id: contentId || sessionId,
            content_type: contentType || 'generic',
            source_label: sourceLabel || '',
            source_title: sourceTitle || topic || '',
            topic: topic || '',
            source_text: sourceText || '',
            explanation: explanation || '',
            follow_up_summary: followUpSummary || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { error: sessionError } = await supabase
            .from('explain_back_sessions')
            .insert([sessionPayload]);

        if (sessionError) throw sessionError;

        if (questions.length) {
            const questionRows = questions.map((question, index) => ({
                id: buildId('question'),
                session_id: sessionId,
                question_text: typeof question === 'string' ? question : (question.questionText || question.question || ''),
                answer_text: typeof question === 'string' ? '' : (question.answerText || question.referenceAnswer || ''),
                sort_order: index,
                created_at: new Date().toISOString()
            }));

            const { error: questionError } = await supabase
                .from('explain_back_questions')
                .insert(questionRows);

            if (questionError) throw questionError;
        }

        return sessionId;
    } catch (error) {
        console.error('Error creating explain-back session:', error);
        return null;
    }
};

export const updateExplainBackSessionEvaluation = async ({
    sessionId,
    explanation,
    overallScore,
    confidenceLevel,
    criteria,
    strengths,
    gaps,
    nextStep
}) => {
    try {
        const { error: sessionError } = await supabase
            .from('explain_back_sessions')
            .update({
                explanation: explanation || '',
                overall_score: overallScore ?? null,
                confidence_level: confidenceLevel || null,
                criteria_json: criteria || {},
                strengths_json: strengths || [],
                gaps_json: gaps || [],
                next_step: nextStep || '',
                updated_at: new Date().toISOString()
            })
            .eq('id', sessionId);

        if (sessionError) throw sessionError;

        return true;
    } catch (error) {
        console.error('Error updating explain-back evaluation:', error);
        return false;
    }
};

export const fetchExplainBackSessions = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('explain_back_sessions')
            .select(`
                *,
                explain_back_questions (
                    id,
                    question_text,
                    answer_text,
                    sort_order
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching explain-back sessions:', error);
        return [];
    }
};

export const createMemoryRefreshGroup = async ({
    userId,
    name,
    description = '',
    sessionIds = []
}) => {
    try {
        const groupId = buildId('memory_group');
        const { error: groupError } = await supabase
            .from('memory_refresh_groups')
            .insert([{
                id: groupId,
                user_id: userId,
                name,
                description,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }]);

        if (groupError) throw groupError;

        if (sessionIds.length) {
            const { error: itemError } = await supabase
                .from('memory_refresh_group_items')
                .insert(
                    sessionIds.map((sessionId) => ({
                        id: buildId('memory_item'),
                        group_id: groupId,
                        session_id: sessionId,
                        created_at: new Date().toISOString()
                    }))
                );

            if (itemError) throw itemError;
        }

        return groupId;
    } catch (error) {
        console.error('Error creating memory refresh group:', error);
        return null;
    }
};

export const fetchMemoryRefreshGroups = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('memory_refresh_groups')
            .select(`
                *,
                memory_refresh_group_items (
                    id,
                    session_id,
                    explain_back_sessions (
                        id,
                        topic,
                        source_title,
                        content_type,
                        overall_score,
                        explain_back_questions (
                            id,
                            question_text,
                            answer_text,
                            sort_order
                        )
                    )
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching memory refresh groups:', error);
        return [];
    }
};

export const addSessionsToMemoryRefreshGroup = async ({
    groupId,
    sessionIds = []
}) => {
    try {
        if (!groupId || sessionIds.length === 0) {
            return true;
        }

        const { error } = await supabase
            .from('memory_refresh_group_items')
            .insert(
                sessionIds.map((sessionId) => ({
                    id: buildId('memory_item'),
                    group_id: groupId,
                    session_id: sessionId,
                    created_at: new Date().toISOString()
                }))
            );

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error adding sessions to memory refresh group:', error);
        return false;
    }
};

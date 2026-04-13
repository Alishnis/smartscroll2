import { supabase } from './supabaseClient';

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

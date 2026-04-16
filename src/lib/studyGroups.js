import { supabase } from './supabaseClient';

const GROUP_FIELDS = 'id, name, description, visibility, invite_code, owner_user_id, theme_color, member_count, created_at, updated_at';
const MESSAGE_FIELDS = 'id, group_id, user_id, content, created_at';
const ASSIGNMENT_FIELDS = 'id, group_id, teacher_user_id, title, description, video_id, video_title, required_score, created_at';
const WHITEBOARD_EVENT_FIELDS = 'id, group_id, user_id, event_type, payload_json, created_at';
const DEFAULT_DISCOVER_GROUP_ID = '11111111-1111-4111-8111-111111111111';
const SYSTEM_GROUP_OWNER_ID = '00000000-0000-0000-0000-000000000000';
const REMOTE_TIMEOUT_MS = 12000;
const AUTH_LOOKUP_TIMEOUT_MS = 5000;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const STUDY_GROUP_THEME_OPTIONS = [
    '#79ffe1',
    '#7c9bff',
    '#ff9d6c',
    '#ffd166',
    '#9bff8a',
    '#ff7eb6'
];

const normalizeRpcRow = (data) => {
    if (Array.isArray(data)) {
        return data[0] || null;
    }

    return data || null;
};

const attachMembershipMeta = (group, membershipRole = null) => {
    if (!group) {
        return null;
    }

    return {
        ...group,
        membership_role: membershipRole,
        is_owner: Boolean(group.owner_user_id && membershipRole === 'teacher')
    };
};

const fallbackProfileForUserId = (userId) => ({
    id: userId,
    username: userId === SYSTEM_GROUP_OWNER_ID ? 'SmartScroll' : `User ${String(userId).slice(0, 6)}`,
    avatar_url: '',
    role: userId === SYSTEM_GROUP_OWNER_ID ? 'System' : 'Student'
});

const uniqueById = (items = []) => items.filter(
    (item, index, collection) => item?.id && collection.findIndex((candidate) => candidate.id === item.id) === index
);

const sortByCreatedAtAsc = (items = []) => [...items].sort(
    (left, right) => new Date(left.created_at) - new Date(right.created_at)
);

const uniqueByEventId = (items = []) => items.filter(
    (item, index, collection) => item?.id && collection.findIndex((candidate) => candidate.id === item.id) === index
);

const buildInviteCode = () => normalizeStudyGroupInviteCode(
    crypto.randomUUID().replace(/-/g, '').slice(0, 8)
);

const getPostgrestHeaders = (accessToken, prefer = 'return=representation') => ({
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Prefer: prefer
});

const postgrestInsert = async (table, row, select, accessToken) => {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}`,
        {
            method: 'POST',
            headers: getPostgrestHeaders(accessToken),
            body: JSON.stringify(row)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Insert failed for ${table}.`);
    }

    const payload = await response.json();
    return Array.isArray(payload) ? payload[0] || null : payload;
};

const postgrestUpsert = async (table, row, select, accessToken, onConflict) => {
    const query = new URLSearchParams({
        select,
        on_conflict: onConflict
    });

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?${query.toString()}`,
        {
            method: 'POST',
            headers: getPostgrestHeaders(accessToken, 'resolution=merge-duplicates,return=representation'),
            body: JSON.stringify(row)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Upsert failed for ${table}.`);
    }

    const payload = await response.json();
    return Array.isArray(payload) ? payload[0] || null : payload;
};

const postgrestDelete = async (table, filters, accessToken) => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        query.set(key, `eq.${value}`);
    });

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?${query.toString()}`,
        {
            method: 'DELETE',
            headers: getPostgrestHeaders(accessToken, 'return=minimal')
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Delete failed for ${table}.`);
    }

    return true;
};

const isMissingRpcError = (error) => {
    const message = String(error?.message || '').toLowerCase();
    return (
        message.includes('could not find the function public.') ||
        message.includes('function public.') ||
        message.includes('does not exist')
    );
};

const callStudyGroupsRpc = async (fnName, args) => {
    const { data, error } = await supabase.rpc(fnName, args);

    if (error) {
        throw error;
    }

    return normalizeRpcRow(data);
};

const runRemote = async (label, operation) => {
    try {
        const data = await Promise.race([
            Promise.resolve().then(operation),
            new Promise((_, reject) => {
                window.setTimeout(() => {
                    reject(new Error(`Supabase timeout after ${REMOTE_TIMEOUT_MS}ms`));
                }, REMOTE_TIMEOUT_MS);
            })
        ]);

        return {
            ok: true,
            data,
            error: null
        };
    } catch (error) {
        console.error(`[StudyGroups] ${label} failed.`, error);
        return {
            ok: false,
            data: null,
            error
        };
    }
};

const getCurrentUserId = async (userId = null) => {
    if (userId) {
        return userId;
    }

    try {
        const result = await Promise.race([
            supabase.auth.getUser(),
            new Promise((_, reject) => {
                window.setTimeout(() => reject(new Error('getUser timed out')), AUTH_LOOKUP_TIMEOUT_MS);
            })
        ]);

        return result?.data?.user?.id || null;
    } catch {
        return null;
    }
};

const getCurrentSession = async () => {
    try {
        const result = await Promise.race([
            supabase.auth.getSession(),
            new Promise((_, reject) => {
                window.setTimeout(() => reject(new Error('getSession timed out')), AUTH_LOOKUP_TIMEOUT_MS);
            })
        ]);

        return result?.data?.session || null;
    } catch {
        return null;
    }
};

const ensureAuthenticatedSession = async (userId = null) => {
    const session = await getCurrentSession();
    const sessionUserId = session?.user?.id || null;
    const resolvedUserId = sessionUserId || await getCurrentUserId(userId);

    if (!resolvedUserId || !session?.access_token) {
        return {
            ok: false,
            userId: null,
            session: null,
            error: 'Supabase session is missing. Sign in again before changing groups.'
        };
    }

    return {
        ok: true,
        userId: resolvedUserId,
        session,
        error: ''
    };
};

const fetchProfilesByIds = async (userIds = []) => {
    const ids = [...new Set(userIds.filter(Boolean))];
    if (!ids.length) {
        return {};
    }

    const remote = await runRemote('fetchProfilesByIds', async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, role')
            .in('id', ids);

        if (error) {
            throw error;
        }

        return Object.fromEntries((data || []).map((profile) => [profile.id, profile]));
    });

    if (!remote.ok) {
        return Object.fromEntries(ids.map((id) => [id, fallbackProfileForUserId(id)]));
    }

    const remoteProfiles = remote.data || {};
    return Object.fromEntries(ids.map((id) => [id, remoteProfiles[id] || fallbackProfileForUserId(id)]));
};

export const normalizeStudyGroupInviteCode = (value = '') => value
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

export const isSeededStudyGroup = (groupOrId) => (
    typeof groupOrId === 'string'
        ? groupOrId === DEFAULT_DISCOVER_GROUP_ID
        : groupOrId?.id === DEFAULT_DISCOVER_GROUP_ID || Boolean(groupOrId?.is_seeded)
);

export const listPublicStudyGroups = async () => {
    const remote = await runRemote('listPublicStudyGroups', async () => {
        const { data, error } = await supabase
            .from('study_groups')
            .select(GROUP_FIELDS)
            .order('updated_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data || [];
    });

    return remote.ok ? uniqueById(remote.data || []) : [];
};

export const listMyStudyGroups = async (userId) => {
    if (!userId) {
        return [];
    }

    const remote = await runRemote('listMyStudyGroups', async () => {
        const { data, error } = await supabase
            .from('study_group_members')
            .select(`
                role,
                joined_at,
                study_groups (${GROUP_FIELDS})
            `)
            .eq('user_id', userId)
            .order('joined_at', { ascending: false });

        if (error) {
            throw error;
        }

        return (data || [])
            .map((row) => attachMembershipMeta(row.study_groups, row.role))
            .filter(Boolean);
    });

    return remote.ok ? uniqueById(remote.data || []) : [];
};

export const listOwnedStudyGroups = async (userId) => {
    if (!userId) {
        return [];
    }

    const remote = await runRemote('listOwnedStudyGroups', async () => {
        const { data, error } = await supabase
            .from('study_groups')
            .select(GROUP_FIELDS)
            .eq('owner_user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) {
            throw error;
        }

        return (data || []).map((group) => attachMembershipMeta(group, 'teacher'));
    });

    return remote.ok ? uniqueById(remote.data || []) : [];
};

export const fetchStudyGroupById = async (groupId) => {
    if (!groupId) {
        return null;
    }

    const remote = await runRemote('fetchStudyGroupById', async () => {
        const { data, error } = await supabase
            .from('study_groups')
            .select(GROUP_FIELDS)
            .eq('id', groupId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data || null;
    });

    return remote.ok ? (remote.data || null) : null;
};

export const fetchStudyGroupMembership = async (groupId, userId) => {
    if (!groupId || !userId) {
        return null;
    }

    const remote = await runRemote('fetchStudyGroupMembership', async () => {
        const { data, error } = await supabase
            .from('study_group_members')
            .select('group_id, user_id, role, joined_at')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data || null;
    });

    return remote.ok ? (remote.data || null) : null;
};

export const createStudyGroup = async ({
    name,
    description = '',
    themeColor = STUDY_GROUP_THEME_OPTIONS[0],
    visibility = 'public',
    userId = null
}) => {
    const auth = await ensureAuthenticatedSession(userId);

    if (!auth.ok) {
        return {
            ok: false,
            group: null,
            error: auth.error
        };
    }

    const remote = await runRemote('createStudyGroup', async () => {
        try {
            const createdGroup = await callStudyGroupsRpc('create_study_group', {
                p_name: name.trim(),
                p_description: description.trim(),
                p_visibility: visibility,
                p_theme_color: themeColor
            });

            return attachMembershipMeta(createdGroup, 'teacher');
        } catch (error) {
            if (!isMissingRpcError(error)) {
                throw error;
            }
        }

        let lastError = null;

        for (let attempt = 0; attempt < 5; attempt += 1) {
            const inviteCode = buildInviteCode();
            try {
                const insertedGroup = await postgrestInsert(
                    'study_groups',
                    {
                        name: name.trim(),
                        description: description.trim(),
                        visibility,
                        invite_code: inviteCode,
                        owner_user_id: auth.userId,
                        theme_color: themeColor,
                        member_count: 1
                    },
                    GROUP_FIELDS,
                    auth.session.access_token
                );

                await postgrestUpsert(
                    'study_group_members',
                    {
                        group_id: insertedGroup.id,
                        user_id: auth.userId,
                        role: 'teacher'
                    },
                    'group_id,user_id,role,joined_at',
                    auth.session.access_token,
                    'group_id,user_id'
                );

                return attachMembershipMeta(insertedGroup, 'teacher');
            } catch (error) {
                if (String(error?.message || '').includes('duplicate key')) {
                    lastError = error;
                    continue;
                }

                throw error;
            }
        }

        throw lastError || new Error('Could not generate a unique invite code.');
    });

    return {
        ok: Boolean(remote.ok && remote.data),
        group: remote.ok ? (remote.data || null) : null,
        error: remote.ok ? '' : (remote.error?.message || 'Could not create the group.')
    };
};

export const joinStudyGroup = async (groupId, userId = null) => {
    const auth = await ensureAuthenticatedSession(userId);

    if (!auth.ok) {
        return {
            ok: false,
            group: null,
            error: auth.error
        };
    }

    const remote = await runRemote('joinStudyGroup', async () => {
        try {
            const group = await callStudyGroupsRpc('join_study_group', {
                p_group_id: groupId
            });
            const membershipRole = group?.owner_user_id === auth.userId ? 'teacher' : 'student';
            return attachMembershipMeta(group, membershipRole);
        } catch (error) {
            if (!isMissingRpcError(error)) {
                throw error;
            }
        }

        const { data: group, error: groupError } = await supabase
            .from('study_groups')
            .select(GROUP_FIELDS)
            .eq('id', groupId)
            .maybeSingle();

        if (groupError) {
            throw groupError;
        }

        if (!group) {
            throw new Error('Group not found.');
        }

        if (group.visibility !== 'public' && group.owner_user_id !== auth.userId) {
            throw new Error('This group is private.');
        }

        const membershipRole = group.owner_user_id === auth.userId ? 'teacher' : 'student';
        await postgrestUpsert(
            'study_group_members',
            {
                group_id: group.id,
                user_id: auth.userId,
                role: membershipRole
            },
            'group_id,user_id,role,joined_at',
            auth.session.access_token,
            'group_id,user_id'
        );

        return attachMembershipMeta(group, membershipRole);
    });

    return {
        ok: Boolean(remote.ok && remote.data),
        group: remote.ok ? (remote.data || null) : null,
        error: remote.ok ? '' : (remote.error?.message || 'Could not join the group.')
    };
};

export const joinStudyGroupByCode = async (inviteCode, userId = null) => {
    const normalizedCode = normalizeStudyGroupInviteCode(inviteCode);
    const auth = await ensureAuthenticatedSession(userId);

    if (!auth.ok) {
        return {
            ok: false,
            group: null,
            error: auth.error
        };
    }

    const remote = await runRemote('joinStudyGroupByCode', async () => {
        try {
            const group = await callStudyGroupsRpc('join_study_group_by_code', {
                p_invite_code: normalizedCode
            });
            const membershipRole = group?.owner_user_id === auth.userId ? 'teacher' : 'student';
            return attachMembershipMeta(group, membershipRole);
        } catch (error) {
            if (!isMissingRpcError(error)) {
                throw error;
            }
        }

        const { data: group, error: groupError } = await supabase
            .from('study_groups')
            .select(GROUP_FIELDS)
            .eq('invite_code', normalizedCode)
            .maybeSingle();

        if (groupError) {
            throw groupError;
        }

        if (!group) {
            throw new Error('Group not found.');
        }

        const membershipRole = group.owner_user_id === auth.userId ? 'teacher' : 'student';
        await postgrestUpsert(
            'study_group_members',
            {
                group_id: group.id,
                user_id: auth.userId,
                role: membershipRole
            },
            'group_id,user_id,role,joined_at',
            auth.session.access_token,
            'group_id,user_id'
        );

        return attachMembershipMeta(group, membershipRole);
    });

    return {
        ok: Boolean(remote.ok && remote.data),
        group: remote.ok ? (remote.data || null) : null,
        error: remote.ok ? '' : (remote.error?.message || 'Could not join the group with that code.')
    };
};

export const leaveStudyGroup = async (groupId, userId = null) => {
    const auth = await ensureAuthenticatedSession(userId);

    if (!auth.ok) {
        return {
            ok: false,
            error: auth.error
        };
    }

    const remote = await runRemote('leaveStudyGroup', async () => {
        try {
            await callStudyGroupsRpc('leave_study_group', {
                p_group_id: groupId
            });
            return true;
        } catch (error) {
            if (!isMissingRpcError(error)) {
                throw error;
            }
        }

        const { data: group, error: groupError } = await supabase
            .from('study_groups')
            .select('id, owner_user_id')
            .eq('id', groupId)
            .maybeSingle();

        if (groupError) {
            throw groupError;
        }

        if (!group) {
            throw new Error('Group not found.');
        }

        if (group.owner_user_id === auth.userId) {
            throw new Error('Group owners cannot leave their own group.');
        }

        return postgrestDelete('study_group_members', {
            group_id: groupId,
            user_id: auth.userId
        }, auth.session.access_token);
    });

    return {
        ok: Boolean(remote.ok && remote.data),
        error: remote.ok ? '' : (remote.error?.message || 'Could not leave the group.')
    };
};

export const fetchStudyGroupMembers = async (groupId) => {
    if (!groupId) {
        return [];
    }

    const remote = await runRemote('fetchStudyGroupMembers', async () => {
        const { data, error } = await supabase
            .from('study_group_members')
            .select('group_id, user_id, role, joined_at')
            .eq('group_id', groupId)
            .order('joined_at', { ascending: true });

        if (error) {
            throw error;
        }

        const rows = data || [];
        const profileMap = await fetchProfilesByIds(rows.map((row) => row.user_id));

        return rows.map((row) => ({
            ...row,
            profiles: profileMap[row.user_id] || fallbackProfileForUserId(row.user_id)
        }));
    });

    return remote.ok ? (remote.data || []) : [];
};

export const fetchStudyGroupMessages = async (groupId) => {
    if (!groupId) {
        return [];
    }

    const remote = await runRemote('fetchStudyGroupMessages', async () => {
        const { data, error } = await supabase
            .from('study_group_messages')
            .select(MESSAGE_FIELDS)
            .eq('group_id', groupId)
            .order('created_at', { ascending: true });

        if (error) {
            throw error;
        }

        const rows = data || [];
        const profileMap = await fetchProfilesByIds(rows.map((row) => row.user_id));

        return rows.map((row) => ({
            ...row,
            profiles: profileMap[row.user_id] || fallbackProfileForUserId(row.user_id)
        }));
    });

    return remote.ok ? (remote.data || []) : [];
};

export const subscribeToStudyGroupMessages = (groupId, onMessage) => {
    if (!groupId || typeof onMessage !== 'function') {
        return () => {};
    }

    const channel = supabase
        .channel(`study-group-messages-${groupId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'study_group_messages',
                filter: `group_id=eq.${groupId}`
            },
            async (payload) => {
                const profileMap = await fetchProfilesByIds([payload.new.user_id]);
                onMessage({
                    ...payload.new,
                    profiles: profileMap[payload.new.user_id] || fallbackProfileForUserId(payload.new.user_id)
                });
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

export const postStudyGroupMessage = async ({ groupId, content, userId = null }) => {
    const auth = await ensureAuthenticatedSession(userId);

    if (!auth.ok) {
        return {
            ok: false,
            message: null,
            error: auth.error
        };
    }

    const remote = await runRemote('postStudyGroupMessage', async () => {
        let data = null;

        try {
            data = await callStudyGroupsRpc('send_study_group_message', {
                p_group_id: groupId,
                p_content: content.trim()
            });
        } catch (error) {
            if (!isMissingRpcError(error)) {
                throw error;
            }

            data = await postgrestInsert(
                'study_group_messages',
                {
                    group_id: groupId,
                    user_id: auth.userId,
                    content: content.trim()
                },
                MESSAGE_FIELDS,
                auth.session.access_token
            );
        }

        const profileMap = await fetchProfilesByIds([data?.user_id]);

        return {
            ...data,
            profiles: profileMap[data?.user_id] || fallbackProfileForUserId(data?.user_id)
        };
    });

    return {
        ok: Boolean(remote.ok && remote.data),
        message: remote.ok ? (remote.data || null) : null,
        error: remote.ok ? '' : (remote.error?.message || 'Could not send the message.')
    };
};

export const createStudyGroupAssignment = async ({
    groupId,
    title,
    description = '',
    videoId,
    videoTitle = '',
    requiredScore = 7,
    userId = null
}) => {
    const auth = await ensureAuthenticatedSession(userId);

    if (!auth.ok) {
        return {
            ok: false,
            assignment: null,
            error: auth.error
        };
    }

    const remote = await runRemote('createStudyGroupAssignment', async () => {
        let data = null;

        try {
            data = await callStudyGroupsRpc('create_study_group_assignment', {
                p_group_id: groupId,
                p_title: title.trim(),
                p_description: description.trim(),
                p_video_id: videoId.trim(),
                p_video_title: videoTitle.trim(),
                p_required_score: Number(requiredScore || 7)
            });
        } catch (error) {
            if (!isMissingRpcError(error)) {
                throw error;
            }

            data = await postgrestInsert(
                'study_group_assignments',
                {
                    group_id: groupId,
                    teacher_user_id: auth.userId,
                    title: title.trim(),
                    description: description.trim(),
                    video_id: videoId.trim(),
                    video_title: videoTitle.trim(),
                    required_score: Number(requiredScore || 7)
                },
                ASSIGNMENT_FIELDS,
                auth.session.access_token
            );
        }

        return data;
    });

    return {
        ok: Boolean(remote.ok && remote.data),
        assignment: remote.ok ? (remote.data || null) : null,
        error: remote.ok ? '' : (remote.error?.message || 'Could not create the assignment.')
    };
};

export const fetchStudyGroupAssignments = async (groupId) => {
    if (!groupId) {
        return [];
    }

    const remote = await runRemote('fetchStudyGroupAssignments', async () => {
        const { data, error } = await supabase
            .from('study_group_assignments')
            .select(ASSIGNMENT_FIELDS)
            .eq('group_id', groupId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data || [];
    });

    return remote.ok ? (remote.data || []) : [];
};

export const fetchStudyGroupWhiteboardEvents = async (groupId) => {
    if (!groupId) {
        return [];
    }

    const remote = await runRemote('fetchStudyGroupWhiteboardEvents', async () => {
        const { data, error } = await supabase
            .from('study_group_whiteboard_events')
            .select(WHITEBOARD_EVENT_FIELDS)
            .eq('group_id', groupId)
            .order('created_at', { ascending: true });

        if (error) {
            throw error;
        }

        return data || [];
    });

    return remote.ok ? sortByCreatedAtAsc(uniqueByEventId(remote.data || [])) : [];
};

export const subscribeToStudyGroupWhiteboard = (groupId, onEvent) => {
    if (!groupId || typeof onEvent !== 'function') {
        return () => {};
    }

    const channel = supabase
        .channel(`study-group-whiteboard-${groupId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'study_group_whiteboard_events',
                filter: `group_id=eq.${groupId}`
            },
            (payload) => {
                onEvent(payload.new);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

export const appendStudyGroupWhiteboardEvent = async ({
    groupId,
    eventType,
    payload = {},
    userId = null
}) => {
    const auth = await ensureAuthenticatedSession(userId);

    if (!auth.ok) {
        return {
            ok: false,
            event: null,
            error: auth.error
        };
    }

    const remote = await runRemote('appendStudyGroupWhiteboardEvent', async () => {
        const data = await postgrestInsert(
            'study_group_whiteboard_events',
            {
                group_id: groupId,
                user_id: auth.userId,
                event_type: eventType,
                payload_json: payload
            },
            WHITEBOARD_EVENT_FIELDS,
            auth.session.access_token
        );

        return data;
    });

    return {
        ok: Boolean(remote.ok && remote.data),
        event: remote.ok ? (remote.data || null) : null,
        error: remote.ok ? '' : (remote.error?.message || 'Could not sync the class board.')
    };
};

export const fetchExplainBackSessionsForGroupVideos = async ({
    userIds = [],
    videoIds = []
}) => {
    try {
        const scopedUserIds = [...new Set(userIds.filter(Boolean))];
        const scopedVideoIds = [...new Set(videoIds.filter(Boolean))];

        if (!scopedUserIds.length || !scopedVideoIds.length) {
            return [];
        }

        const remote = await runRemote('fetchExplainBackSessionsForGroupVideos', async () => {
            const { data, error } = await supabase
                .from('explain_back_sessions')
                .select('id, user_id, content_id, overall_score, created_at')
                .in('user_id', scopedUserIds)
                .eq('content_type', 'youtube')
                .in('content_id', scopedVideoIds);

            if (error) {
                throw error;
            }

            return data || [];
        });

        return remote.ok ? (remote.data || []) : [];
    } catch (error) {
        console.error('Error fetching explain back progress for study groups:', error);
        return [];
    }
};

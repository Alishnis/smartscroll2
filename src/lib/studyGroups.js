import { supabase } from './supabaseClient';

const GROUP_FIELDS = 'id, name, description, visibility, invite_code, owner_user_id, theme_color, member_count, created_at, updated_at';
const MESSAGE_FIELDS = 'id, group_id, user_id, content, created_at';
const ASSIGNMENT_FIELDS = 'id, group_id, teacher_user_id, title, description, video_id, video_title, required_score, created_at';
const WHITEBOARD_EVENT_FIELDS = 'id, group_id, user_id, event_type, payload_json, created_at';
const DEFAULT_DISCOVER_GROUP_ID = '11111111-1111-4111-8111-111111111111';
const SYSTEM_GROUP_OWNER_ID = '00000000-0000-0000-0000-000000000000';
const REMOTE_TIMEOUT_MS = 3200;
const STORAGE_PREFIX = 'smartscroll.study-groups.v2';

const STORAGE_KEYS = {
    groups: `${STORAGE_PREFIX}.groups`,
    memberships: `${STORAGE_PREFIX}.memberships`,
    messages: `${STORAGE_PREFIX}.messages`,
    assignments: `${STORAGE_PREFIX}.assignments`,
    whiteboardEvents: `${STORAGE_PREFIX}.whiteboard-events`
};

export const DEFAULT_DISCOVER_GROUP = {
    id: DEFAULT_DISCOVER_GROUP_ID,
    name: 'SmartScroll Starter Class',
    description: 'A built-in demo room so Discover never looks empty. Use it as a visual example while the real database-backed classes are being set up.',
    visibility: 'public',
    invite_code: 'SMART101',
    owner_user_id: SYSTEM_GROUP_OWNER_ID,
    theme_color: '#7c9bff',
    member_count: 128,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    is_seeded: true
};

export const STUDY_GROUP_THEME_OPTIONS = [
    '#79ffe1',
    '#7c9bff',
    '#ff9d6c',
    '#ffd166',
    '#9bff8a',
    '#ff7eb6'
];

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const normalizeRpcRow = (data) => {
    if (Array.isArray(data)) {
        return data[0] || null;
    }

    return data || null;
};

const uniqueById = (items = []) => items.filter(
    (item, index, collection) => item?.id && collection.findIndex((candidate) => candidate.id === item.id) === index
);

const attachMembershipMeta = (group, membershipRole = null) => {
    if (!group) return null;

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

const readStorage = (key, fallbackValue) => {
    if (!canUseStorage()) {
        return fallbackValue;
    }

    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallbackValue;
    } catch (error) {
        console.error(`[StudyGroups] Failed to read ${key} from localStorage`, error);
        return fallbackValue;
    }
};

const writeStorage = (key, value) => {
    if (!canUseStorage()) {
        return;
    }

    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`[StudyGroups] Failed to write ${key} to localStorage`, error);
    }
};

const getLocalGroups = () => readStorage(STORAGE_KEYS.groups, []);
const setLocalGroups = (groups) => writeStorage(STORAGE_KEYS.groups, uniqueById(groups));
const getLocalMemberships = () => readStorage(STORAGE_KEYS.memberships, []);
const setLocalMemberships = (memberships) => writeStorage(STORAGE_KEYS.memberships, memberships);
const getLocalMessages = () => readStorage(STORAGE_KEYS.messages, []);
const setLocalMessages = (messages) => writeStorage(STORAGE_KEYS.messages, messages);
const getLocalAssignments = () => readStorage(STORAGE_KEYS.assignments, []);
const setLocalAssignments = (assignments) => writeStorage(STORAGE_KEYS.assignments, assignments);
const getLocalWhiteboardEvents = () => readStorage(STORAGE_KEYS.whiteboardEvents, []);
const setLocalWhiteboardEvents = (events) => writeStorage(STORAGE_KEYS.whiteboardEvents, events);

const getLocalGroupById = (groupId) => getLocalGroups().find((group) => group.id === groupId) || null;

const updateLocalGroupMemberCount = (groupId) => {
    const groups = getLocalGroups();
    const memberships = getLocalMemberships();
    const targetGroup = groups.find((group) => group.id === groupId);

    if (!targetGroup) {
        return;
    }

    const memberCount = memberships.filter((membership) => membership.group_id === groupId).length;
    const nextGroups = groups.map((group) => (
        group.id === groupId
            ? {
                ...group,
                member_count: memberCount,
                updated_at: new Date().toISOString()
            }
            : group
    ));

    setLocalGroups(nextGroups);
};

const buildLocalInviteCode = () => normalizeStudyGroupInviteCode(
    crypto.randomUUID().replace(/-/g, '').slice(0, 8)
);

const buildLocalGroup = ({
    name,
    description = '',
    themeColor = STUDY_GROUP_THEME_OPTIONS[0],
    visibility = 'public',
    ownerUserId
}) => ({
    id: `local-group-${crypto.randomUUID()}`,
    name,
    description,
    visibility,
    invite_code: buildLocalInviteCode(),
    owner_user_id: ownerUserId,
    theme_color: themeColor,
    member_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_local: true
});

const mergeGroupCollections = (...collections) => uniqueById(
    collections
        .flat()
        .filter(Boolean)
);

const isLocalGroupId = (groupId) => typeof groupId === 'string' && groupId.startsWith('local-group-');
const uniqueByEventId = (items = []) => items.filter(
    (item, index, collection) => item?.id && collection.findIndex((candidate) => candidate.id === item.id) === index
);
const sortByCreatedAtAsc = (items = []) => [...items].sort(
    (left, right) => new Date(left.created_at) - new Date(right.created_at)
);

const runRemote = async (label, operation, fallbackValue = null) => {
    try {
        const result = await Promise.race([
            Promise.resolve().then(operation),
            new Promise((_, reject) => {
                window.setTimeout(() => {
                    reject(new Error(`Remote timeout after ${REMOTE_TIMEOUT_MS}ms`));
                }, REMOTE_TIMEOUT_MS);
            })
        ]);

        return {
            ok: true,
            data: result,
            fallback: fallbackValue
        };
    } catch (error) {
        console.error(`[StudyGroups] ${label} remote failed; using local fallback.`, error);
        return {
            ok: false,
            data: fallbackValue,
            error
        };
    }
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
    }, {});

    if (remote.ok) {
        return remote.data || {};
    }

    return Object.fromEntries(ids.map((id) => [id, fallbackProfileForUserId(id)]));
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
    const localGroups = getLocalGroups().filter((group) => group.visibility === 'public');
    const remote = await runRemote('listPublicStudyGroups', async () => {
        const { data, error } = await supabase
            .from('study_groups')
            .select(GROUP_FIELDS)
            .order('updated_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data || [];
    }, []);

    return mergeGroupCollections(DEFAULT_DISCOVER_GROUP, localGroups, remote.data || []);
};

export const listMyStudyGroups = async (userId) => {
    if (!userId) {
        return [];
    }

    const localMemberships = getLocalMemberships().filter((membership) => membership.user_id === userId);
    const localGroups = localMemberships
        .map((membership) => attachMembershipMeta(getLocalGroupById(membership.group_id), membership.role))
        .filter(Boolean);

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
    }, []);

    return mergeGroupCollections(localGroups, remote.data || []);
};

export const listOwnedStudyGroups = async (userId) => {
    if (!userId) {
        return [];
    }

    const localOwnedGroups = getLocalGroups()
        .filter((group) => group.owner_user_id === userId)
        .map((group) => attachMembershipMeta(group, 'teacher'));

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
    }, []);

    return mergeGroupCollections(localOwnedGroups, remote.data || []);
};

export const fetchStudyGroupById = async (groupId) => {
    if (!groupId) {
        return null;
    }

    if (isSeededStudyGroup(groupId)) {
        return DEFAULT_DISCOVER_GROUP;
    }

    const localGroup = getLocalGroupById(groupId);
    if (localGroup) {
        return localGroup;
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
    }, null);

    return remote.data || null;
};

export const fetchStudyGroupMembership = async (groupId, userId) => {
    if (!groupId || !userId) {
        return null;
    }

    const localMembership = getLocalMemberships().find(
        (membership) => membership.group_id === groupId && membership.user_id === userId
    );

    if (localMembership) {
        return localMembership;
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
    }, null);

    return remote.data || null;
};

export const createStudyGroup = async ({
    name,
    description = '',
    themeColor = STUDY_GROUP_THEME_OPTIONS[0],
    visibility = 'public',
    userId = null
}) => {
    const ownerUserId = userId || (await supabase.auth.getUser().then(({ data }) => data.user?.id).catch(() => null));

    const remote = await runRemote('createStudyGroup', async () => {
        const { data, error } = await supabase.rpc('create_study_group', {
            p_name: name,
            p_description: description,
            p_visibility: visibility,
            p_theme_color: themeColor
        });

        if (error) {
            throw error;
        }

        return attachMembershipMeta(normalizeRpcRow(data), 'teacher');
    }, null);

    if (remote.ok && remote.data) {
        return {
            ok: true,
            group: remote.data,
            error: ''
        };
    }

    if (!ownerUserId) {
        return {
            ok: false,
            group: null,
            error: remote.error?.message || 'Could not create the group.'
        };
    }

    const localGroup = buildLocalGroup({
        name,
        description,
        themeColor,
        visibility,
        ownerUserId
    });

    setLocalGroups([localGroup, ...getLocalGroups()]);
    setLocalMemberships([
        {
            group_id: localGroup.id,
            user_id: ownerUserId,
            role: 'teacher',
            joined_at: new Date().toISOString()
        },
        ...getLocalMemberships()
    ]);

    return {
        ok: true,
        group: attachMembershipMeta(localGroup, 'teacher'),
        error: '',
        source: 'local'
    };
};

export const joinStudyGroup = async (groupId, userId = null) => {
    const currentUserId = userId || (await supabase.auth.getUser().then(({ data }) => data.user?.id).catch(() => null));

    if (!currentUserId) {
        return {
            ok: false,
            group: null,
            error: 'Sign in before joining a group.'
        };
    }

    if (isLocalGroupId(groupId)) {
        const localGroup = getLocalGroupById(groupId);
        if (!localGroup) {
            return { ok: false, group: null, error: 'Group not found.' };
        }

        const memberships = getLocalMemberships();
        const exists = memberships.some((membership) => membership.group_id === groupId && membership.user_id === currentUserId);

        if (!exists) {
            memberships.unshift({
                group_id: groupId,
                user_id: currentUserId,
                role: localGroup.owner_user_id === currentUserId ? 'teacher' : 'student',
                joined_at: new Date().toISOString()
            });
            setLocalMemberships(memberships);
            updateLocalGroupMemberCount(groupId);
        }

        return {
            ok: true,
            group: attachMembershipMeta(getLocalGroupById(groupId), localGroup.owner_user_id === currentUserId ? 'teacher' : 'student'),
            error: '',
            source: 'local'
        };
    }

    const remote = await runRemote('joinStudyGroup', async () => {
        const { data, error } = await supabase.rpc('join_study_group', {
            p_group_id: groupId
        });

        if (error) {
            throw error;
        }

        return attachMembershipMeta(normalizeRpcRow(data), 'student');
    }, null);

    if (remote.ok && remote.data) {
        return { ok: true, group: remote.data, error: '' };
    }

    const fallbackGroup = await fetchStudyGroupById(groupId);
    if (!fallbackGroup) {
        return { ok: false, group: null, error: remote.error?.message || 'Could not join the group.' };
    }

    const memberships = getLocalMemberships();
    const exists = memberships.some((membership) => membership.group_id === groupId && membership.user_id === currentUserId);
    if (!exists) {
        memberships.unshift({
            group_id: groupId,
            user_id: currentUserId,
            role: fallbackGroup.owner_user_id === currentUserId ? 'teacher' : 'student',
            joined_at: new Date().toISOString()
        });
        setLocalMemberships(memberships);
    }
    updateLocalGroupMemberCount(groupId);

    return {
        ok: true,
        group: attachMembershipMeta(await fetchStudyGroupById(groupId), fallbackGroup.owner_user_id === currentUserId ? 'teacher' : 'student'),
        error: '',
        source: 'local'
    };
};

export const joinStudyGroupByCode = async (inviteCode, userId = null) => {
    const normalizedCode = normalizeStudyGroupInviteCode(inviteCode);
    const currentUserId = userId || (await supabase.auth.getUser().then(({ data }) => data.user?.id).catch(() => null));

    if (!currentUserId) {
        return {
            ok: false,
            group: null,
            error: 'Sign in before joining a group.'
        };
    }

    const localGroup = getLocalGroups().find((group) => group.invite_code === normalizedCode) || (
        normalizedCode === DEFAULT_DISCOVER_GROUP.invite_code ? DEFAULT_DISCOVER_GROUP : null
    );

    if (localGroup && isLocalGroupId(localGroup.id)) {
        return joinStudyGroup(localGroup.id, currentUserId);
    }

    const remote = await runRemote('joinStudyGroupByCode', async () => {
        const { data, error } = await supabase.rpc('join_study_group_by_code', {
            p_invite_code: normalizedCode
        });

        if (error) {
            throw error;
        }

        return attachMembershipMeta(normalizeRpcRow(data), 'student');
    }, null);

    if (remote.ok && remote.data) {
        return { ok: true, group: remote.data, error: '' };
    }

    if (localGroup) {
        return joinStudyGroup(localGroup.id, currentUserId);
    }

    return {
        ok: false,
        group: null,
        error: remote.error?.message || 'Could not join the group with that code.'
    };
};

export const leaveStudyGroup = async (groupId, userId = null) => {
    const currentUserId = userId || (await supabase.auth.getUser().then(({ data }) => data.user?.id).catch(() => null));

    if (!currentUserId) {
        return {
            ok: false,
            error: 'Sign in before leaving a group.'
        };
    }

    if (isLocalGroupId(groupId) || getLocalMemberships().some((membership) => membership.group_id === groupId && membership.user_id === currentUserId)) {
        const targetGroup = getLocalGroupById(groupId);
        if (targetGroup?.owner_user_id === currentUserId) {
            return {
                ok: false,
                error: 'Group owners cannot leave their own group.'
            };
        }

        setLocalMemberships(
            getLocalMemberships().filter((membership) => !(membership.group_id === groupId && membership.user_id === currentUserId))
        );
        updateLocalGroupMemberCount(groupId);

        return { ok: true, error: '', source: 'local' };
    }

    const remote = await runRemote('leaveStudyGroup', async () => {
        const { data, error } = await supabase.rpc('leave_study_group', {
            p_group_id: groupId
        });

        if (error) {
            throw error;
        }

        return Boolean(data ?? true);
    }, false);

    return {
        ok: Boolean(remote.data),
        error: remote.ok ? '' : (remote.error?.message || 'Could not leave the group.')
    };
};

export const fetchStudyGroupMembers = async (groupId) => {
    if (!groupId) {
        return [];
    }

    const localMembershipRows = getLocalMemberships().filter((membership) => membership.group_id === groupId);
    if (localMembershipRows.length) {
        const localProfileMap = await fetchProfilesByIds(localMembershipRows.map((row) => row.user_id));
        return localMembershipRows.map((row) => ({
            ...row,
            profiles: localProfileMap[row.user_id] || fallbackProfileForUserId(row.user_id)
        }));
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
    }, []);

    return remote.data || [];
};

export const fetchStudyGroupMessages = async (groupId) => {
    if (!groupId) {
        return [];
    }

    const localMessages = getLocalMessages().filter((message) => message.group_id === groupId);
    if (localMessages.length) {
        const profileMap = await fetchProfilesByIds(localMessages.map((message) => message.user_id));
        return localMessages.map((message) => ({
            ...message,
            profiles: profileMap[message.user_id] || fallbackProfileForUserId(message.user_id)
        }));
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
    }, []);

    return remote.data || [];
};

export const subscribeToStudyGroupMessages = (groupId, onMessage) => {
    if (!groupId || typeof onMessage !== 'function' || isLocalGroupId(groupId)) {
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
    const currentUserId = userId || (await supabase.auth.getUser().then(({ data }) => data.user?.id).catch(() => null));

    if (!currentUserId) {
        return {
            ok: false,
            message: null,
            error: 'Sign in before sending a message.'
        };
    }

    if (isLocalGroupId(groupId) || getLocalMemberships().some((membership) => membership.group_id === groupId && membership.user_id === currentUserId)) {
        const localMessage = {
            id: `local-message-${crypto.randomUUID()}`,
            group_id: groupId,
            user_id: currentUserId,
            content,
            created_at: new Date().toISOString()
        };
        setLocalMessages([...getLocalMessages(), localMessage]);
        const profileMap = await fetchProfilesByIds([currentUserId]);

        return {
            ok: true,
            message: {
                ...localMessage,
                profiles: profileMap[currentUserId] || fallbackProfileForUserId(currentUserId)
            },
            error: '',
            source: 'local'
        };
    }

    const remote = await runRemote('postStudyGroupMessage', async () => {
        const { data, error } = await supabase.rpc('send_study_group_message', {
            p_group_id: groupId,
            p_content: content
        });

        if (error) {
            throw error;
        }

        const row = normalizeRpcRow(data);
        const profileMap = await fetchProfilesByIds([row?.user_id]);

        return {
            ...row,
            profiles: profileMap[row?.user_id] || fallbackProfileForUserId(row?.user_id)
        };
    }, null);

    if (remote.ok && remote.data) {
        return {
            ok: true,
            message: remote.data,
            error: ''
        };
    }

    const localMessage = {
        id: `local-message-${crypto.randomUUID()}`,
        group_id: groupId,
        user_id: currentUserId,
        content,
        created_at: new Date().toISOString()
    };
    setLocalMessages([...getLocalMessages(), localMessage]);
    const profileMap = await fetchProfilesByIds([currentUserId]);

    return {
        ok: true,
        message: {
            ...localMessage,
            profiles: profileMap[currentUserId] || fallbackProfileForUserId(currentUserId)
        },
        error: '',
        source: 'local'
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
    const currentUserId = userId || (await supabase.auth.getUser().then(({ data }) => data.user?.id).catch(() => null));

    if (!currentUserId) {
        return {
            ok: false,
            assignment: null,
            error: 'Sign in before creating an assignment.'
        };
    }

    if (isLocalGroupId(groupId) || getLocalGroupById(groupId)?.owner_user_id === currentUserId) {
        const localAssignment = {
            id: `local-assignment-${crypto.randomUUID()}`,
            group_id: groupId,
            teacher_user_id: currentUserId,
            title,
            description,
            video_id: videoId,
            video_title: videoTitle,
            required_score: Number(requiredScore || 7),
            created_at: new Date().toISOString()
        };
        setLocalAssignments([localAssignment, ...getLocalAssignments()]);

        return {
            ok: true,
            assignment: localAssignment,
            error: '',
            source: 'local'
        };
    }

    const remote = await runRemote('createStudyGroupAssignment', async () => {
        const { data, error } = await supabase.rpc('create_study_group_assignment', {
            p_group_id: groupId,
            p_title: title,
            p_description: description,
            p_video_id: videoId,
            p_video_title: videoTitle,
            p_required_score: Number(requiredScore || 7)
        });

        if (error) {
            throw error;
        }

        return normalizeRpcRow(data);
    }, null);

    if (remote.ok && remote.data) {
        return {
            ok: true,
            assignment: remote.data,
            error: ''
        };
    }

    const localAssignment = {
        id: `local-assignment-${crypto.randomUUID()}`,
        group_id: groupId,
        teacher_user_id: currentUserId,
        title,
        description,
        video_id: videoId,
        video_title: videoTitle,
        required_score: Number(requiredScore || 7),
        created_at: new Date().toISOString()
    };
    setLocalAssignments([localAssignment, ...getLocalAssignments()]);

    return {
        ok: true,
        assignment: localAssignment,
        error: '',
        source: 'local'
    };
};

export const fetchStudyGroupAssignments = async (groupId) => {
    if (!groupId) {
        return [];
    }

    const localAssignments = getLocalAssignments()
        .filter((assignment) => assignment.group_id === groupId)
        .sort((left, right) => new Date(right.created_at) - new Date(left.created_at));

    if (localAssignments.length) {
        return localAssignments;
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
    }, []);

    return remote.data || [];
};

export const fetchStudyGroupWhiteboardEvents = async (groupId) => {
    if (!groupId) {
        return [];
    }

    const localEvents = getLocalWhiteboardEvents().filter((event) => event.group_id === groupId);

    if (isLocalGroupId(groupId)) {
        return sortByCreatedAtAsc(localEvents);
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
    }, []);

    return sortByCreatedAtAsc(uniqueByEventId([
        ...(remote.data || []),
        ...localEvents
    ]));
};

export const subscribeToStudyGroupWhiteboard = (groupId, onEvent) => {
    if (!groupId || typeof onEvent !== 'function' || isLocalGroupId(groupId)) {
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
    const currentUserId = userId || (await supabase.auth.getUser().then(({ data }) => data.user?.id).catch(() => null));

    if (!currentUserId) {
        return {
            ok: false,
            event: null,
            error: 'Sign in before using the class board.'
        };
    }

    const buildLocalEvent = () => ({
        id: `local-whiteboard-event-${crypto.randomUUID()}`,
        group_id: groupId,
        user_id: currentUserId,
        event_type: eventType,
        payload_json: payload,
        created_at: new Date().toISOString()
    });

    if (isLocalGroupId(groupId)) {
        const localEvent = buildLocalEvent();
        setLocalWhiteboardEvents([...getLocalWhiteboardEvents(), localEvent]);

        return {
            ok: true,
            event: localEvent,
            error: '',
            source: 'local'
        };
    }

    const remote = await runRemote('appendStudyGroupWhiteboardEvent', async () => {
        const { data, error } = await supabase
            .from('study_group_whiteboard_events')
            .insert([{
                group_id: groupId,
                user_id: currentUserId,
                event_type: eventType,
                payload_json: payload
            }])
            .select(WHITEBOARD_EVENT_FIELDS)
            .single();

        if (error) {
            throw error;
        }

        return data;
    }, null);

    if (remote.ok && remote.data) {
        return {
            ok: true,
            event: remote.data,
            error: ''
        };
    }

    const localEvent = buildLocalEvent();
    setLocalWhiteboardEvents([...getLocalWhiteboardEvents(), localEvent]);

    return {
        ok: true,
        event: localEvent,
        error: '',
        source: 'local'
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
        }, []);

        return remote.data || [];
    } catch (error) {
        console.error('Error fetching explain back progress for study groups:', error);
        return [];
    }
};

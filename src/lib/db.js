import { supabase } from './supabaseClient';

const buildId = (prefix) => `${prefix}_${crypto.randomUUID()}`;
const CLASSROOM_WRITE_TIMEOUT_MS = 8000;
const isClassroomId = (groupId) => typeof groupId === 'string' && groupId.startsWith('classroom_');
const isTeacherClassId = (groupId) => typeof groupId === 'string' && groupId.startsWith('teacher_class_');
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const TEACHER_CLASS_INVITE_CODE_LENGTH = 8;

const normalizeTeacherClassInviteCode = (value = '') => value
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

const buildInviteCode = () => normalizeTeacherClassInviteCode(
    crypto.randomUUID().replace(/-/g, '').slice(0, TEACHER_CLASS_INVITE_CODE_LENGTH)
);

export const getTeacherClassInviteCode = (groupOrId = '') => {
    if (groupOrId && typeof groupOrId === 'object') {
        if (groupOrId.invite_code) {
            return normalizeTeacherClassInviteCode(groupOrId.invite_code);
        }
        groupOrId = groupOrId.id || '';
    }

    const compactId = normalizeTeacherClassInviteCode(
        typeof groupOrId === 'string'
            ? groupOrId.replace(/^teacher_class_/i, '').replace(/^classroom_/i, '')
            : ''
    );

    return compactId.slice(0, TEACHER_CLASS_INVITE_CODE_LENGTH);
};

const getPostgrestAnonHeaders = () => {
    return {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
    };
};

const postgrestInsert = async (table, row, select = '*') => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), CLASSROOM_WRITE_TIMEOUT_MS);

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}`, {
            method: 'POST',
            headers: getPostgrestAnonHeaders(),
            body: JSON.stringify(row),
            signal: controller.signal
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Failed to insert into ${table}.`);
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        return { ok: true, data };
    } catch (error) {
        if (error.name === 'AbortError') {
            return { ok: false, timedOut: true, error: `Timed out while inserting into ${table}.` };
        }

        return { ok: false, timedOut: false, error: error?.message || `Insert failed for ${table}.` };
    } finally {
        window.clearTimeout(timeoutId);
    }
};

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
        const [{ data, error }, { data: classrooms, error: classroomsError }] = await Promise.all([
            supabase
                .from('groups')
                .select('*')
                .order('member_count', { ascending: false }),
            supabase
                .from('classrooms')
                .select('*')
                .order('member_count', { ascending: false })
        ]);

        if (error) throw error;
        if (classroomsError && classroomsError.code !== '42P01') throw classroomsError;

        return [...(data || []), ...(classrooms || [])]
            .sort((a, b) => Number(b.member_count || 0) - Number(a.member_count || 0));
    } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
    }
};

export const fetchTeacherOwnedClasses = async (userId) => {
    try {
        if (!userId) return [];

        const { data, error } = await supabase
            .from('classrooms')
            .select('*')
            .eq('teacher_user_id', userId)
            .order('created_at', { ascending: false });

        if (error && error.code !== '42P01') throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching teacher owned classes:', error);
        return [];
    }
};

export const fetchTeacherClassByInviteCode = async (inviteCode) => {
    try {
        const normalizedCode = normalizeTeacherClassInviteCode(inviteCode);
        if (!normalizedCode) return null;

        const { data, error } = await supabase
            .from('classrooms')
            .select('*')
            .eq('invite_code', normalizedCode)
            .maybeSingle();

        if (error) throw error;
        return data || null;
    } catch (error) {
        console.error('Error fetching teacher class by invite code:', error);
        return null;
    }
};

export const fetchGroupById = async (groupId) => {
    if (isClassroomId(groupId)) {
        try {
            const { data, error } = await supabase
                .from('classrooms')
                .select('*')
                .eq('id', groupId)
                .maybeSingle();

            if (error) throw error;
            return data || null;
        } catch (error) {
            console.error('Error fetching classroom by id:', error);
            return null;
        }
    }

    if (isTeacherClassId(groupId)) {
        try {
            const { data, error } = await supabase
                .from('teacher_classes')
                .select('*')
                .eq('id', groupId)
                .maybeSingle();

            if (error) throw error;
            return data || null;
        } catch (error) {
            console.error('Error fetching teacher class by id:', error);
            return null;
        }
    }

    try {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .eq('id', groupId)
            .maybeSingle();

        if (error) throw error;
        return data || null;
    } catch (error) {
        console.error('Error fetching group by id:', error);
        return null;
    }
};

/**
 * Fetch groups that a specific user has joined.
 */
export const fetchUserJoinedGroups = async (userId) => {
    try {
        const [
            { data, error },
            { data: classroomMembershipRows, error: classroomMembershipError },
            { data: ownedClassrooms, error: ownedClassroomsError }
        ] = await Promise.all([
            supabase
                .from('user_groups')
                .select('group_id')
                .eq('user_id', userId),
            supabase
                .from('classroom_members')
                .select('classroom_id')
                .eq('user_id', userId),
            supabase
                .from('classrooms')
                .select('*')
                .eq('teacher_user_id', userId)
        ]);

        if (error) throw error;
        if (classroomMembershipError && classroomMembershipError.code !== '42P01') throw classroomMembershipError;
        if (ownedClassroomsError && ownedClassroomsError.code !== '42P01') throw ownedClassroomsError;

        const rows = data || [];
        const groupIds = rows.map((row) => row.group_id).filter(Boolean);
        const classroomIds = (classroomMembershipRows || []).map((row) => row.classroom_id).filter(Boolean);

        const [
            { data: groupsData, error: groupsError },
            { data: classrooms, error: classroomsError }
        ] = await Promise.all([
            groupIds.length
                ? supabase.from('groups').select('*').in('id', groupIds)
                : Promise.resolve({ data: [], error: null }),
            classroomIds.length
                ? supabase.from('classrooms').select('*').in('id', classroomIds)
                : Promise.resolve({ data: [], error: null })
        ]);

        if (groupsError) throw groupsError;
        if (classroomsError && classroomsError.code !== '42P01') throw classroomsError;

        const mergedClassrooms = [
            ...(classrooms || []),
            ...(ownedClassrooms || [])
        ].filter((classroom, index, collection) => (
            collection.findIndex((candidate) => candidate.id === classroom.id) === index
        ));

        return [...(groupsData || []), ...mergedClassrooms];
    } catch (error) {
        console.error('Error fetching user joined groups:', error);
        return [];
    }
};

export const updateUserRole = async (userId, role) => {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({
                role,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating user role:', error);
        return false;
    }
};

export const createTeacherGroup = async ({
    userId,
    name,
    description
}) => {
    try {
        if (!userId) {
            return {
                ok: false,
                groupId: null,
                error: 'You need to be signed in as a teacher before creating a class.'
            };
        }

        for (let attempt = 0; attempt < 4; attempt += 1) {
            const groupId = `classroom_${crypto.randomUUID()}`;
            const inviteCode = buildInviteCode();
            const payload = {
                id: groupId,
                invite_code: inviteCode,
                name,
                description,
                member_count: 1,
                teacher_user_id: userId,
                icon_name: 'GraduationCap',
                icon_color: '#79ffe1',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const classInsertResult = await postgrestInsert('classrooms', payload, 'id,invite_code,name,description,member_count,teacher_user_id,icon_name,icon_color,created_at,updated_at');

            if (!classInsertResult.ok) {
                if (classInsertResult.error?.includes('duplicate key value') && classInsertResult.error?.includes('invite_code')) {
                    continue;
                }

                return {
                    ok: false,
                    groupId: null,
                    group: null,
                    error: classInsertResult.error || 'The class could not be created right now.'
                };
            }

            const createdGroup = Array.isArray(classInsertResult.data)
                ? classInsertResult.data[0]
                : classInsertResult.data;

            void postgrestInsert('classroom_members', {
                classroom_id: groupId,
                user_id: userId,
                role: 'teacher',
                joined_at: new Date().toISOString()
            }, 'classroom_id');

            return {
                ok: true,
                groupId,
                group: createdGroup || payload
            };
        }

        return {
            ok: false,
            groupId: null,
            group: null,
            error: 'Could not generate a unique invite code. Please try again.'
        };
    } catch (error) {
        console.error('Error creating teacher group:', error);
        return {
            ok: false,
            groupId: null,
            group: null,
            error: error?.message || 'Unknown error'
        };
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
                const { error: insertError } = await supabase
                    .from('profiles')
                    .upsert([{
                        id: userId,
                        username: 'Learner',
                        role: 'Student',
                        updated_at: new Date().toISOString()
                    }], { onConflict: 'id' });

                if (insertError) {
                    console.error('Error creating missing user profile:', insertError);
                    return null;
                }

                const { data: retriedData, error: retriedError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle();

                if (retriedError) {
                    console.error('Error refetching newly created user profile:', retriedError);
                    return null;
                }

                return retriedData || null;
            }
            if (error.code === '42501') {
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

        if (Number(minutesSpentDelta || 0) > 0) {
            const derivedHours = Math.floor(newMinutes / 60);
            const { error: profileUpdateError } = await supabase
                .from('profiles')
                .upsert([{
                    id: userId,
                    time_saved_hours: derivedHours,
                    updated_at: new Date().toISOString()
                }], { onConflict: 'id' });

            if (profileUpdateError) {
                console.error('Error updating derived time_saved_hours:', profileUpdateError);
            }
        }

        return { ok: true, balance: newBalance };
    } catch (error) {
        console.error('Error awarding smart coins:', error);
        return { ok: false, balance: 0 };
    }
};

export const recordMinutesSpent = async ({
    userId = '00000000-0000-0000-0000-000000000001',
    minutesSpentDelta = 1
}) => {
    try {
        const delta = Number(minutesSpentDelta || 0);
        if (!delta || delta <= 0) {
            return { ok: false, minutes: 0 };
        }

        const profile = await ensureGamificationProfile(userId);
        const newMinutes = Number(profile.total_minutes_spent || 0) + delta;

        const { error: updateError } = await supabase
            .from('gamification_profiles')
            .update({
                total_minutes_spent: newMinutes,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (updateError) throw updateError;

        const derivedHours = Math.floor(newMinutes / 60);
        const { error: profileUpdateError } = await supabase
            .from('profiles')
            .upsert([{
                id: userId,
                time_saved_hours: derivedHours,
                updated_at: new Date().toISOString()
            }], { onConflict: 'id' });

        if (profileUpdateError) {
            console.error('Error updating derived time_saved_hours:', profileUpdateError);
        }

        return { ok: true, minutes: newMinutes };
    } catch (error) {
        console.error('Error recording minutes spent:', error);
        return { ok: false, minutes: 0 };
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
    if (isClassroomId(groupId)) {
        try {
            const { error } = await supabase
                .from('classroom_members')
                .insert([{
                    classroom_id: groupId,
                    user_id: userId,
                    role: 'student',
                    joined_at: new Date().toISOString()
                }]);

            if (error && error.code !== '23505') throw error;

            const { data: classroomData } = await supabase
                .from('classrooms')
                .select('member_count')
                .eq('id', groupId)
                .maybeSingle();

            await supabase
                .from('classrooms')
                .update({
                    member_count: Number(classroomData?.member_count || 0) + (error?.code === '23505' ? 0 : 1),
                    updated_at: new Date().toISOString()
                })
                .eq('id', groupId);

            return true;
        } catch (error) {
            console.error('Error joining classroom:', error);
            return false;
        }
    }

    if (isTeacherClassId(groupId)) {
        try {
            const { error } = await supabase
                .from('teacher_class_members')
                .insert([{
                    class_id: groupId,
                    user_id: userId,
                    created_at: new Date().toISOString()
                }]);

            if (error && error.code !== '23505') throw error;

            const { data: classData } = await supabase
                .from('teacher_classes')
                .select('member_count')
                .eq('id', groupId)
                .maybeSingle();

            await supabase
                .from('teacher_classes')
                .update({
                    member_count: Number(classData?.member_count || 0) + (error?.code === '23505' ? 0 : 1),
                    updated_at: new Date().toISOString()
                })
                .eq('id', groupId);
            return true;
        } catch (error) {
            console.error('Error joining teacher class:', error);
            return false;
        }
    }

    try {
        const { error } = await supabase
            .from('user_groups')
            .insert([{ user_id: userId, group_id: groupId }]);

        if (error) throw error;

        const { data: groupData } = await supabase
            .from('groups')
            .select('member_count')
            .eq('id', groupId)
            .maybeSingle();

        await supabase
            .from('groups')
            .update({
                member_count: Number(groupData?.member_count || 0) + 1,
                updated_at: new Date().toISOString()
            })
            .eq('id', groupId);

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
    if (isClassroomId(groupId)) {
        try {
            const { error } = await supabase
                .from('classroom_members')
                .delete()
                .match({ classroom_id: groupId, user_id: userId });

            if (error) throw error;

            const { data: classroomData } = await supabase
                .from('classrooms')
                .select('member_count, teacher_user_id')
                .eq('id', groupId)
                .maybeSingle();

            if (classroomData?.teacher_user_id === userId) {
                return true;
            }

            await supabase
                .from('classrooms')
                .update({
                    member_count: Math.max(Number(classroomData?.member_count || 1) - 1, 0),
                    updated_at: new Date().toISOString()
                })
                .eq('id', groupId);
            return true;
        } catch (error) {
            console.error('Error leaving classroom:', error);
            return false;
        }
    }

    if (isTeacherClassId(groupId)) {
        try {
            const { error } = await supabase
                .from('teacher_class_members')
                .delete()
                .match({ class_id: groupId, user_id: userId });

            if (error) throw error;

            const { data: classData } = await supabase
                .from('teacher_classes')
                .select('member_count')
                .eq('id', groupId)
                .maybeSingle();

            await supabase
                .from('teacher_classes')
                .update({
                    member_count: Math.max(Number(classData?.member_count || 1) - 1, 0),
                    updated_at: new Date().toISOString()
                })
                .eq('id', groupId);
            return true;
        } catch (error) {
            console.error('Error leaving teacher class:', error);
            return false;
        }
    }

    try {
        const { error } = await supabase
            .from('user_groups')
            .delete()
            .match({ user_id: userId, group_id: groupId });

        if (error) throw error;

        const { data: groupData } = await supabase
            .from('groups')
            .select('member_count')
            .eq('id', groupId)
            .maybeSingle();

        await supabase
            .from('groups')
            .update({
                member_count: Math.max(Number(groupData?.member_count || 1) - 1, 0),
                updated_at: new Date().toISOString()
            })
            .eq('id', groupId);

        return true;
    } catch (error) {
        console.error('Error leaving group:', error);
        return false;
    }
};

export const fetchGroupMembers = async (groupId) => {
    if (isClassroomId(groupId)) {
        try {
            const { data: classroom, error: classroomError } = await supabase
                .from('classrooms')
                .select('teacher_user_id, created_at')
                .eq('id', groupId)
                .maybeSingle();

            if (classroomError) throw classroomError;

            const { data, error } = await supabase
                .from('classroom_members')
                .select('user_id, classroom_id, joined_at, role')
                .eq('classroom_id', groupId);

            if (error) throw error;

            const teacherUserId = classroom?.teacher_user_id || null;
            const hasTeacherMembership = (data || []).some((row) => row.user_id === teacherUserId);
            const rows = teacherUserId && !hasTeacherMembership
                ? [{
                    user_id: teacherUserId,
                    classroom_id: groupId,
                    joined_at: classroom?.created_at || new Date().toISOString(),
                    role: 'teacher'
                }, ...(data || [])]
                : (data || []);
            const userIds = rows.map((row) => row.user_id).filter(Boolean);

            if (!userIds.length) return [];

            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, username, role, avatar_url')
                .in('id', userIds);
            if (profilesError) throw profilesError;

            const profileMap = Object.fromEntries((profilesData || []).map((profile) => [profile.id, profile]));

            return rows.map((row) => ({
                ...row,
                class_id: row.classroom_id,
                created_at: row.joined_at,
                profiles: profileMap[row.user_id] || null
            }));
        } catch (error) {
            console.error('Error fetching classroom members:', error);
            return [];
        }
    }

    if (isTeacherClassId(groupId)) {
        try {
            const { data: teacherClass, error: teacherClassError } = await supabase
                .from('teacher_classes')
                .select('teacher_user_id')
                .eq('id', groupId)
                .maybeSingle();

            if (teacherClassError) throw teacherClassError;

            const { data, error } = await supabase
                .from('teacher_class_members')
                .select('user_id, class_id, created_at')
                .eq('class_id', groupId);

            if (error) throw error;

            const teacherUserId = teacherClass?.teacher_user_id || null;
            const hasTeacherMembership = (data || []).some((row) => row.user_id === teacherUserId);
            const rows = teacherUserId && !hasTeacherMembership
                ? [{ user_id: teacherUserId, class_id: groupId, created_at: teacherClass?.created_at || new Date().toISOString() }, ...(data || [])]
                : (data || []);
            const userIds = rows.map((row) => row.user_id).filter(Boolean);

            if (!userIds.length) return [];
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, username, role, avatar_url')
                .in('id', userIds);
            if (profilesError) throw profilesError;
            const profileMap = Object.fromEntries((profilesData || []).map((profile) => [profile.id, profile]));

            return rows.map((row) => ({
                ...row,
                profiles: profileMap[row.user_id] || null
            }));
        } catch (error) {
            console.error('Error fetching teacher class members:', error);
            return [];
        }
    }

    try {
        const { data, error } = await supabase
            .from('user_groups')
            .select('user_id')
            .eq('group_id', groupId);

        if (error) throw error;

        const rows = data || [];
        const userIds = rows.map((row) => row.user_id).filter(Boolean);

        if (!userIds.length) {
            return [];
        }

        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, role, avatar_url')
            .in('id', userIds);

        if (profilesError) throw profilesError;

        const profileMap = Object.fromEntries((profilesData || []).map((profile) => [profile.id, profile]));

        return rows.map((row) => ({
            ...row,
            profiles: profileMap[row.user_id] || null
        }));
    } catch (error) {
        console.error('Error fetching group members:', error);
        return [];
    }
};

export const createClassAssignment = async ({
    groupId,
    teacherUserId,
    title,
    description = '',
    videoId,
    videoTitle = '',
    requiredScore = 7
}) => {
    if (isClassroomId(groupId)) {
        try {
            const { error } = await supabase
                .from('classroom_assignments')
                .insert([{
                    id: buildId('assignment'),
                    classroom_id: groupId,
                    teacher_user_id: teacherUserId,
                    title,
                    description,
                    video_id: videoId,
                    video_title: videoTitle,
                    required_score: requiredScore,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error creating classroom assignment:', error);
            return false;
        }
    }

    if (isTeacherClassId(groupId)) {
        try {
            const { error } = await supabase
                .from('teacher_class_assignments')
                .insert([{
                id: buildId('assignment'),
                class_id: groupId,
                teacher_user_id: teacherUserId,
                title,
                description,
                video_id: videoId,
                video_title: videoTitle,
                required_score: requiredScore,
                created_at: new Date().toISOString()
                }]);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error creating teacher class assignment:', error);
            return false;
        }
    }

    try {
        const { error } = await supabase
            .from('class_assignments')
            .insert([{
                id: buildId('assignment'),
                group_id: groupId,
                teacher_user_id: teacherUserId,
                title,
                description,
                video_id: videoId,
                video_title: videoTitle,
                required_score: requiredScore,
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error creating class assignment:', error);
        return false;
    }
};

export const fetchClassAssignments = async (groupId) => {
    if (isClassroomId(groupId)) {
        try {
            const { data, error } = await supabase
                .from('classroom_assignments')
                .select('*')
                .eq('classroom_id', groupId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []).map((assignment) => ({
                ...assignment,
                group_id: assignment.classroom_id
            }));
        } catch (error) {
            console.error('Error fetching classroom assignments:', error);
            return [];
        }
    }

    if (isTeacherClassId(groupId)) {
        try {
            const { data, error } = await supabase
                .from('teacher_class_assignments')
                .select('*')
                .eq('class_id', groupId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []).map((assignment) => ({
                ...assignment,
                group_id: assignment.class_id
            }));
        } catch (error) {
            console.error('Error fetching teacher class assignments:', error);
            return [];
        }
    }

    try {
        const { data, error } = await supabase
            .from('class_assignments')
            .select('*')
            .eq('group_id', groupId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching class assignments:', error);
        return [];
    }
};

export const fetchExplainBackSessionsForUsersAndVideos = async ({
    userIds = [],
    videoIds = []
}) => {
    try {
        if (!userIds.length || !videoIds.length) return [];

        const { data, error } = await supabase
            .from('explain_back_sessions')
            .select('id, user_id, content_id, overall_score, created_at')
            .in('user_id', userIds)
            .eq('content_type', 'youtube')
            .in('content_id', videoIds);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching explain back sessions for classroom:', error);
        return [];
    }
};

/**
 * Fetch messages for a specific group
 */
export const fetchGroupMessages = async (groupId) => {
    if (isClassroomId(groupId)) {
        try {
            const { data, error } = await supabase
                .from('classroom_messages')
                .select('*')
                .eq('classroom_id', groupId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const rows = (data || []).map((message) => ({
                ...message,
                group_id: message.classroom_id
            }));

            const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))];
            if (!userIds.length) return rows;

            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, role')
                .in('id', userIds);
            if (profilesError) throw profilesError;

            const profileMap = Object.fromEntries((profilesData || []).map((profile) => [profile.id, profile]));

            return rows.map((row) => ({
                ...row,
                profiles: profileMap[row.user_id] || null
            }));
        } catch (error) {
            console.error('Error fetching classroom messages:', error);
            return [];
        }
    }

    if (isTeacherClassId(groupId)) {
        try {
            const { data, error } = await supabase
                .from('teacher_class_messages')
                .select('*')
                .eq('class_id', groupId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const rows = (data || []).map((message) => ({
                ...message,
                group_id: message.class_id
            }));

            const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))];
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, role')
                .in('id', userIds);
            if (profilesError) throw profilesError;
            const profileMap = Object.fromEntries((profilesData || []).map((profile) => [profile.id, profile]));

            return rows.map((row) => ({
                ...row,
                profiles: profileMap[row.user_id] || null
            }));
        } catch (error) {
            console.error('Error fetching teacher class messages:', error);
            return [];
        }
    }

    try {
        const { data, error } = await supabase
            .from('group_messages')
            .select('*')
            .eq('group_id', groupId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        const rows = data || [];
        const userIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))];

        if (!userIds.length) {
            return rows;
        }

        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, role')
            .in('id', userIds);

        if (profilesError) throw profilesError;

        const profileMap = Object.fromEntries((profilesData || []).map((profile) => [profile.id, profile]));

        return rows.map((row) => ({
            ...row,
            profiles: profileMap[row.user_id] || null
        }));
    } catch (error) {
        console.error('Error fetching group messages:', error);
        return [];
    }
};

/**
 * Send a message to a specific group
 */
export const sendGroupMessage = async (userId, groupId, content) => {
    if (isClassroomId(groupId)) {
        try {
            const payload = {
                id: crypto.randomUUID(),
                classroom_id: groupId,
                user_id: userId,
                content,
                created_at: new Date().toISOString()
            };

            const insertResult = await postgrestInsert('classroom_messages', payload, 'id,classroom_id,user_id,content,created_at');
            if (!insertResult.ok) {
                throw new Error(insertResult.error || 'Could not send classroom message.');
            }

            const data = Array.isArray(insertResult.data)
                ? insertResult.data[0]
                : insertResult.data;

            const { data: profileData } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, role')
                .eq('id', userId)
                .maybeSingle();

            return {
                ok: true,
                message: {
                    ...(data || payload),
                    group_id: groupId,
                    profiles: profileData || null
                }
            };
        } catch (error) {
            console.error('Error sending classroom message:', error);
            return {
                ok: false,
                message: null,
                error: error?.message || 'Could not send classroom message.'
            };
        }
    }

    if (isTeacherClassId(groupId)) {
        try {
            const payload = {
                id: crypto.randomUUID(),
                class_id: groupId,
                user_id: userId,
                content,
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('teacher_class_messages')
                .insert([payload])
                .select('*')
                .single();

            if (error) throw error;

            const { data: profileData } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, role')
                .eq('id', userId)
                .maybeSingle();

            return {
                ok: true,
                message: {
                    ...(data || payload),
                    group_id: groupId,
                    profiles: profileData || null
                }
            };
        } catch (error) {
            console.error('Error sending teacher class message:', error);
            return {
                ok: false,
                message: null,
                error: error?.message || 'Could not send teacher class message.'
            };
        }
    }

    try {
        const payload = {
            id: crypto.randomUUID(),
            group_id: groupId,
            user_id: userId,
            content: content,
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('group_messages')
            .insert([payload])
            .select('*')
            .single();

        if (error) throw error;

        const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, role')
            .eq('id', userId)
            .maybeSingle();

        return {
            ok: true,
            message: {
                ...(data || payload),
                profiles: profileData || null
            }
        };
    } catch (error) {
        console.error('Error sending message:', error);
        return {
            ok: false,
            message: null,
            error: error?.message || 'Could not send message.'
        };
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

export const fetchUserVideoNotes = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('video_notes')
            .select('*')
            .eq('user_id', userId)
            .not('content', 'is', null)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return (data || []).filter((item) => item.video_id !== 'global-feed-notes' && item.content?.trim());
    } catch (error) {
        console.error('Error fetching user video notes:', error);
        return [];
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
export const saveUserSummary = async (userId, title, content, iconName = 'Book', options = {}) => {
    try {
        const sourceVideoId = String(options.sourceVideoId || '').trim();
        const storedContent = sourceVideoId
            ? `${content}\n\n[[smartscroll_video:${sourceVideoId}]]`
            : content;

        const { data: insertedSummary, error } = await supabase
            .from('summaries')
            .insert([{
                user_id: userId,
                title: title,
                content: storedContent,
                icon_name: iconName
            }])
            .select('id')
            .single();

        if (error) throw error;

        await awardSmartCoins({
            userId,
            amount: 5,
            reason: 'summary_saved',
            idempotencyKey: `summary-saved-${userId}-${insertedSummary?.id || title}`,
            metadata: {
                title,
                sourceVideoId
            }
        });

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('summaries_read')
            .eq('id', userId)
            .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
        }

        const nextSummariesRead = Number(profileData?.summaries_read || 0) + 1;
        const { error: updateError } = await supabase
            .from('profiles')
            .upsert([{
                id: userId,
                summaries_read: nextSummariesRead,
                updated_at: new Date().toISOString()
            }], { onConflict: 'id' });

        if (updateError) throw updateError;

        if (nextSummariesRead > 0 && nextSummariesRead % 10 === 0) {
            await awardSmartCoins({
                userId,
                amount: 25,
                reason: 'summary_milestone',
                idempotencyKey: `summary-milestone-${userId}-${nextSummariesRead}`,
                metadata: {
                    summariesRead: nextSummariesRead
                }
            });
        }

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

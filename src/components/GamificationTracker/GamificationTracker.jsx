import { useEffect } from 'react';
import { awardSmartCoins } from '../../lib/db';
import { useAuth } from '../../context/AuthContext';

const FALLBACK_USER_ID = '00000000-0000-0000-0000-000000000001';
const ACTIVE_MINUTES_TARGET = 10;
const COINS_PER_ACTIVE_BLOCK = 8;

const GamificationTracker = () => {
    const { user } = useAuth();
    const userId = user?.id || FALLBACK_USER_ID;

    useEffect(() => {
        const storageKey = `smartscroll-active-minutes-${userId}`;
        const lastBucketKey = `smartscroll-active-bucket-${userId}`;

        const tick = async () => {
            if (document.visibilityState !== 'visible') {
                return;
            }

            const currentMinutes = Number(localStorage.getItem(storageKey) || '0') + 1;
            localStorage.setItem(storageKey, String(currentMinutes));

            if (currentMinutes < ACTIVE_MINUTES_TARGET) {
                return;
            }

            const bucket = new Date().toISOString().slice(0, 16);
            const lastAwardedBucket = localStorage.getItem(lastBucketKey);

            if (lastAwardedBucket === bucket) {
                return;
            }

            const result = await awardSmartCoins({
                userId,
                amount: COINS_PER_ACTIVE_BLOCK,
                reason: 'active_time',
                idempotencyKey: `active-time-${bucket}`,
                metadata: {
                    minutes: ACTIVE_MINUTES_TARGET
                },
                minutesSpentDelta: ACTIVE_MINUTES_TARGET
            });

            if (result.ok) {
                localStorage.setItem(storageKey, '0');
                localStorage.setItem(lastBucketKey, bucket);
            }
        };

        const interval = window.setInterval(() => {
            tick();
        }, 60 * 1000);

        return () => window.clearInterval(interval);
    }, [userId]);

    return null;
};

export default GamificationTracker;

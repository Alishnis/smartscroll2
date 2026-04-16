import { useEffect } from 'react';
import { awardSmartCoins, recordMinutesSpent } from '../../lib/db';
import { useAuth } from '../../context/AuthContext';

const FALLBACK_USER_ID = '00000000-0000-0000-0000-000000000001';
const SECONDS_PER_MINUTE = 60;
const ACTIVE_SECONDS_TARGET = 10 * SECONDS_PER_MINUTE;
const COINS_PER_ACTIVE_BLOCK = 8;

const GamificationTracker = () => {
    const { user } = useAuth();
    const userId = user?.id || FALLBACK_USER_ID;

    useEffect(() => {
        const pendingSecondsKey = `smartscroll-pending-seconds-${userId}`;
        const rewardSecondsKey = `smartscroll-reward-seconds-${userId}`;
        const rewardBlockKey = `smartscroll-reward-block-${userId}`;
        let syncInFlight = false;
        let awardInFlight = false;

        const tick = async () => {
            if (document.visibilityState !== 'visible') {
                return;
            }

            const pendingSeconds = Number(localStorage.getItem(pendingSecondsKey) || '0') + 1;
            const rewardSeconds = Number(localStorage.getItem(rewardSecondsKey) || '0') + 1;

            localStorage.setItem(pendingSecondsKey, String(pendingSeconds));
            localStorage.setItem(rewardSecondsKey, String(rewardSeconds));
            window.dispatchEvent(new CustomEvent('smartscroll-time-spent-updated', {
                detail: {
                    userId,
                    pendingSeconds
                }
            }));

            if (!syncInFlight && pendingSeconds >= SECONDS_PER_MINUTE) {
                syncInFlight = true;
                const minutesSpentDelta = Math.floor(pendingSeconds / SECONDS_PER_MINUTE);
                const result = await recordMinutesSpent({
                    userId,
                    minutesSpentDelta
                });

                if (result.ok) {
                    const latestPendingSeconds = Number(localStorage.getItem(pendingSecondsKey) || '0');
                    const remainingPendingSeconds = Math.max(
                        0,
                        latestPendingSeconds - (minutesSpentDelta * SECONDS_PER_MINUTE)
                    );
                    localStorage.setItem(pendingSecondsKey, String(remainingPendingSeconds));
                    window.dispatchEvent(new CustomEvent('smartscroll-time-spent-updated', {
                        detail: {
                            userId,
                            pendingSeconds: remainingPendingSeconds
                        }
                    }));
                }

                syncInFlight = false;
            }

            if (!awardInFlight && rewardSeconds >= ACTIVE_SECONDS_TARGET) {
                awardInFlight = true;
                const completedBlocks = Number(localStorage.getItem(rewardBlockKey) || '0') + 1;
                const result = await awardSmartCoins({
                    userId,
                    amount: COINS_PER_ACTIVE_BLOCK,
                    reason: 'active_time',
                    idempotencyKey: `active-time-${userId}-block-${completedBlocks}`,
                    metadata: {
                        seconds: ACTIVE_SECONDS_TARGET,
                        block: completedBlocks
                    },
                    minutesSpentDelta: 0
                });

                if (result.ok) {
                    const latestRewardSeconds = Number(localStorage.getItem(rewardSecondsKey) || '0');
                    const remainingRewardSeconds = Math.max(0, latestRewardSeconds - ACTIVE_SECONDS_TARGET);
                    localStorage.setItem(rewardSecondsKey, String(remainingRewardSeconds));
                    localStorage.setItem(rewardBlockKey, String(completedBlocks));
                }

                awardInFlight = false;
            }
        };

        const interval = window.setInterval(() => {
            void tick();
        }, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, [userId]);

    return null;
};

export default GamificationTracker;

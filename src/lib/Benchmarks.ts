/**
 * Benchmarks.ts
 * 
 * Validated industry averages to provide "Reality Checks" in the Plan Generator.
 * 
 * SOURCES:
 * - Cold Email: Belkins 2024 B2B Stats (5.8% avg) & Smartlead (1-5%)
 * - Inbound: Belkins 2023 (35% Lead-to-Appt) & Industry Avg (5-10%)
 * - Sales Close: Trellus.ai & Hubspot (20-30% for B2B Services)
 * - RFP: Loopio 2024 Trends (44% avg win rate)
 */

export const BENCHMARKS = {
    OUTBOUND: {
        // We use a conservative 3% to be safe (vs 5.8% report) so users feel beating it is achievable
        AVG_REPLY_RATE: 0.03,
        GOOD_VOLUME_PER_DAY: 25,
    },
    INBOUND: {
        // We use conservative 15% (vs 35% report)
        LEAD_TO_CALL_RATE: 0.15,
        CLOSE_RATE: 0.25, // 25% (Trellus/Hubspot)
    },
    RFP: {
        WIN_RATE: 0.35, // Conservative 35% (vs 44% reported)
    },
    REFERRAL: {
        CLOSE_RATE: 0.50, // 50% (High trust, naturally higher)
    }
};

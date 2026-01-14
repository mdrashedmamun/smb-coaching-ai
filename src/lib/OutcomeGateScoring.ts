export interface GateCriteria {
    pricePoint: number;
    salesMotion: 'consultative' | 'transactional' | 'productized' | 'unknown';
    buyerType: 'business_owner' | 'consumer' | 'department_head';
}

export interface GateResult {
    isQualified: boolean;
    mode: 'consulting' | 'lab'; // Renamed from 'simulation'
    reasons: string[];
    softRampMessage?: string;
}

/**
 * Outcome Gate Scoring Logic (The Velvet Rope)
 * 
 * Rules (Context-Aware):
 * 1. Price >= $3,000 -> PASS
 * 2. Motion = Consultative AND Buyer = B2B (not consumer) -> PASS
 * 
 * @param criteria
 * @returns GateResult
 */
export const evaluateEngagementFit = (criteria: GateCriteria): GateResult => {
    const reasons: string[] = [];
    const isPriceQualified = criteria.pricePoint >= 3000;
    const isMotionQualified = criteria.salesMotion === 'consultative';
    const isBuyerB2B = criteria.buyerType !== 'consumer';

    // Context-Aware Logic: Pass if Price is high OR (Motion is Consultative AND Buyer is B2B)
    const isQualified = isPriceQualified || (isMotionQualified && isBuyerB2B);

    if (!isQualified) {
        if (!isPriceQualified) {
            reasons.push(
                `Your price point ($${criteria.pricePoint}) is below the $3,000 threshold for our primary consulting algorithms.`
            );
        }
        if (!isMotionQualified) {
            reasons.push(
                'Our system is optimized for high-touch, consultative sales motions rather than transactional flows.'
            );
        }
        if (!isBuyerB2B) {
            reasons.push(
                'Our advisory is designed for B2B buyers with organizational budgets.'
            );
        }
    }

    return {
        isQualified,
        mode: isQualified ? 'consulting' : 'lab',
        reasons,
        softRampMessage: isQualified
            ? undefined
            : 'Welcome to the Consulting Lab. This is where high-ticket consulting businesses are engineered.'
    };
};

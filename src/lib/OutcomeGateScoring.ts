export interface GateCriteria {
    pricePoint: number;
    salesMotion: 'consultative' | 'transactional' | 'productized' | 'unknown';
    buyerType: 'business_owner' | 'consumer' | 'department_head';
}

export interface GateResult {
    isQualified: boolean;
    mode: 'consulting' | 'simulation';
    reasons: string[];
    softRampMessage?: string;
}

/**
 * Outcome Gate Scoring Logic (The Velvet Rope)
 * 
 * Rules:
 * 1. Price < $3,000 -> Simulation Mode
 * 2. Sales Motion != Consultative -> Simulation Mode
 * 
 * @param criteria
 * @returns GateResult
 */
export const evaluateEngagementFit = (criteria: GateCriteria): GateResult => {
    const reasons: string[] = [];
    const isPriceQualified = criteria.pricePoint >= 3000;
    const isMotionQualified = criteria.salesMotion === 'consultative';

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

    const isQualified = isPriceQualified && isMotionQualified;

    return {
        isQualified,
        mode: isQualified ? 'consulting' : 'simulation',
        reasons,
        softRampMessage: isQualified
            ? undefined
            : 'If your model is not consultative yet, we’ll help you design one. Running in Scenario Mode...'
    };
};

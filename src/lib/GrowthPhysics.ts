export type SellingStatus = 'selling' | 'pre_revenue';
export type BillingModel = 'one_off' | 'monthly_retainer' | 'annual_retainer' | 'usage' | 'other';
export type BillingPeriod = 'monthly' | 'annual';
export type GrowthPhysicsMode = 'real' | 'scenario';

export interface Phase1State {
    status: 'incomplete' | 'complete';
    mode: GrowthPhysicsMode;
    assumptionsUsed: string[];
}

export interface GrowthPhysicsBrief {
    revenueGapMonthly: number;
    requiredDealsMonthly?: number;
    callsRequiredMonthly?: number;
    assumptionsUsed: string[];
    mode: GrowthPhysicsMode;
    primaryOfferMonthlyPrice?: number;
    primaryOfferId?: string | null;
}

export interface GrowthPhysicsInput {
    sellingStatus: SellingStatus | null;
    targetRevenueMonthly?: number | null;
    currentRevenueMonthlyAvg?: number | null;
    primaryOffer?: {
        id: string;
        price: number;
        billingModel: BillingModel;
        billingPeriod?: BillingPeriod | null;
    } | null;
    closeRate?: number | null;
    assumptionsUsed?: string[];
}

function resolveMonthlyPrice(offer: GrowthPhysicsInput['primaryOffer']): number | null {
    if (!offer) return null;

    const price = offer.price;
    if (!price || price <= 0) return null;

    if (offer.billingModel === 'monthly_retainer') {
        return price;
    }

    if (offer.billingModel === 'annual_retainer') {
        if (offer.billingPeriod !== 'annual') return null;
        return price / 12;
    }

    return price;
}

export function buildGrowthPhysicsBrief(input: GrowthPhysicsInput): {
    brief: GrowthPhysicsBrief | null;
    phase1: Phase1State;
} {
    const assumptionsUsed = (input.assumptionsUsed || []).filter(Boolean);
    const mode: GrowthPhysicsMode = assumptionsUsed.length > 0 ? 'scenario' : 'real';

    const sellingStatusSet = input.sellingStatus === 'selling' || input.sellingStatus === 'pre_revenue';
    const target = typeof input.targetRevenueMonthly === 'number' ? input.targetRevenueMonthly : null;
    const targetIsValid = Boolean(target && target > 0);
    const current = input.sellingStatus === 'pre_revenue'
        ? 0
        : (typeof input.currentRevenueMonthlyAvg === 'number' ? input.currentRevenueMonthlyAvg : null);

    const missingCurrentForSelling = input.sellingStatus === 'selling' && (current === null || current === undefined);
    const status: Phase1State['status'] =
        sellingStatusSet && targetIsValid && !missingCurrentForSelling ? 'complete' : 'incomplete';

    if (status !== 'complete') {
        return {
            brief: null,
            phase1: {
                status,
                mode,
                assumptionsUsed
            }
        };
    }

    const revenueGapMonthly = Math.max((target || 0) - (current || 0), 0);
    const monthlyPrice = resolveMonthlyPrice(input.primaryOffer || null);

    let requiredDealsMonthly: number | undefined;
    if (input.primaryOffer && monthlyPrice && monthlyPrice > 0) {
        requiredDealsMonthly = Math.ceil(revenueGapMonthly / monthlyPrice);
    }

    let callsRequiredMonthly: number | undefined;
    if (requiredDealsMonthly && input.closeRate && input.closeRate > 0) {
        callsRequiredMonthly = Math.ceil((requiredDealsMonthly * 100) / input.closeRate);
    }

    return {
        brief: {
            revenueGapMonthly,
            requiredDealsMonthly,
            callsRequiredMonthly,
            assumptionsUsed,
            mode,
            primaryOfferMonthlyPrice: monthlyPrice ?? undefined,
            primaryOfferId: input.primaryOffer?.id || null
        },
        phase1: {
            status,
            mode,
            assumptionsUsed
        }
    };
}

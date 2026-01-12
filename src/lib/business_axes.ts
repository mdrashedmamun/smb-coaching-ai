/**
 * Business Axes Scoring System
 * 
 * This is the investor-grade backbone of the diagnostic engine.
 * See docs/philosophy.md for the guiding principles.
 * 
 * We do not prescribe models. We reveal leverage when evidence supports it.
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * The 5 axes that determine business economics.
 * Each axis is scored 0-100, where higher = more favorable for scale/durability.
 */
export interface BusinessAxes {
    /** 0 = pure labor (revenue capped by headcount), 100 = pure product (build once, sell many) */
    laborVsProductLeverage: number;

    /** 0 = mostly fixed costs, 100 = mostly variable costs (scales with revenue) */
    fixedVsVariableCost: number;

    /** 0 = all one-time revenue, 100 = all recurring/subscription */
    oneTimeVsRecurringRevenue: number;

    /** 0 = fully dependent on external distribution, 100 = owns customer relationship */
    distributionDependency: number;

    /** 0-100 composite score based on moat type */
    moatStrength: number;
}

export type MoatType =
    | 'brand'           // Customer loyalty, reputation
    | 'switching_cost'  // Pain to leave
    | 'network_effect'  // Value increases with users
    | 'cost_advantage'  // Can undercut profitably
    | 'regulation'      // Legal barriers to entry
    | 'data'            // Proprietary data advantage
    | 'none';           // No defensible moat

export type PrimaryConstraint =
    | 'labor_ceiling'         // Can't grow without more people
    | 'distribution_weakness' // Don't own the customer
    | 'margin_compression'    // Revenue grows, profit doesn't
    | 'churn_spiral'          // Losing customers faster than acquiring
    | 'pricing_power'         // Can't charge what you're worth
    | 'capital_intensity';    // Need money to grow

/**
 * The 90-Day Lever output structure.
 * Every diagnostic MUST produce this.
 */
export interface NinetyDayLever {
    /** The single highest-impact action */
    action: string;

    /** Why this is the lever (1-2 sentences) */
    rationale: string;

    /** What to explicitly NOT fix yet */
    avoidFixing: string;
}

/**
 * Complete diagnostic output for a business.
 */
export interface DiagnosticOutput {
    /** The UI bucket (identity anchor) */
    bucket: BusinessBucket;

    /** The 5-axis scores */
    axes: BusinessAxes;

    /** The binding constraint */
    primaryConstraint: PrimaryConstraint;

    /** Why this constraint exists */
    constraintExplanation: string;

    /** The moat type(s) present */
    moatTypes: MoatType[];

    /** The actionable output */
    lever: NinetyDayLever;

    /** The ID of the module (1-7) that solves the primary constraint */
    recommendedModuleId: number;

    // --- Founder Context (from North Star intake) ---

    /** The founder's stated operational change (from intake) */
    statedChange: string | null;

    /** The founder's admitted structural fix (from intake) */
    admittedFix: string | null;

    /** The founder's own evidence on the constraint (from intake) */
    constraintEvidence: string | null;
}

// ============================================================================
// BUSINESS BUCKETS (UI Layer)
// ============================================================================

/**
 * The 4 founder-friendly buckets.
 * These are IDENTITY ANCHORS, not economic models.
 */
export type BusinessBucket =
    | 'high_ticket_service'  // Consulting, Coaching, Agencies
    | 'local_trades'         // Plumbers, Cleaners, Landscapers
    | 'saas_software'        // Apps, APIs, Digital Products
    | 'physical_location';   // Cafés, Gyms, Retail

export const BUCKET_CONFIG: Record<BusinessBucket, {
    label: string;
    description: string;
    color: string;
    icon: string;
    isActive: boolean;
}> = {
    high_ticket_service: {
        label: 'High-Ticket Service',
        description: 'Consulting, Coaching, Agencies',
        color: 'amber',
        icon: 'Briefcase',
        isActive: true,
    },
    local_trades: {
        label: 'Local / Trades',
        description: 'Plumbers, Cleaners, Landscapers',
        color: 'emerald',
        icon: 'Wrench',
        isActive: false,
    },
    saas_software: {
        label: 'SaaS / Software',
        description: 'Apps, APIs, Digital Products',
        color: 'blue',
        icon: 'Code',
        isActive: false,
    },
    physical_location: {
        label: 'Physical Location',
        description: 'Cafés, Gyms, Retail',
        color: 'gray',
        icon: 'MapPin',
        isActive: false,
    },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Determines the primary constraint from axes scores.
 */
export function derivePrimaryConstraint(axes: BusinessAxes): PrimaryConstraint {
    const { laborVsProductLeverage, distributionDependency, fixedVsVariableCost, oneTimeVsRecurringRevenue } = axes;

    // Labor ceiling is most common for High-Ticket Service
    if (laborVsProductLeverage < 30) {
        return 'labor_ceiling';
    }

    // Distribution weakness
    if (distributionDependency < 30) {
        return 'distribution_weakness';
    }

    // Margin compression (high fixed costs + low product leverage)
    if (fixedVsVariableCost < 30 && laborVsProductLeverage < 50) {
        return 'margin_compression';
    }

    // Churn spiral (high recurring but low moat)
    if (oneTimeVsRecurringRevenue > 70 && axes.moatStrength < 30) {
        return 'churn_spiral';
    }

    // Default to pricing power if nothing else is obvious
    return 'pricing_power';
}

/**
 * Generates a 90-Day Lever based on the primary constraint.
 */
export function generate90DayLever(constraint: PrimaryConstraint): NinetyDayLever {
    const levers: Record<PrimaryConstraint, NinetyDayLever> = {
        labor_ceiling: {
            action: 'Document your top 3 repeatable processes and create SOPs for delegation.',
            rationale: 'Your revenue is capped by your time. Delegation unlocks capacity without hiring full-time.',
            avoidFixing: 'Do not invest in marketing until you can fulfill more demand.',
        },
        distribution_weakness: {
            action: 'Build an owned email list of your top 100 prospects or past clients.',
            rationale: 'You are renting attention from platforms. Owning the relationship protects revenue.',
            avoidFixing: 'Do not optimize ads until you have a direct channel to customers.',
        },
        margin_compression: {
            action: 'Raise prices by 20% for new clients and measure conversion impact.',
            rationale: 'Your cost structure punishes volume. Margin improvement is faster than cost-cutting.',
            avoidFixing: 'Do not cut costs or seek more volume until pricing power is tested.',
        },
        churn_spiral: {
            action: 'Call your last 5 churned customers and document the real reasons they left.',
            rationale: 'You are filling a leaky bucket. Retention is cheaper than acquisition.',
            avoidFixing: 'Do not increase marketing spend until churn is understood.',
        },
        pricing_power: {
            action: 'Create a "premium tier" offer at 2x your current price with added value.',
            rationale: 'You are undercharging. Testing a higher tier reveals willingness to pay.',
            avoidFixing: 'Do not compete on price or offer discounts.',
        },
        capital_intensity: {
            action: 'Map your capital cycle and identify the slowest-moving cash tied up in operations.',
            rationale: 'Your growth is gated by capital, not demand. Freeing cash accelerates reinvestment.',
            avoidFixing: 'Do not seek external funding until internal capital efficiency is maximized.',
        },
    };

    return levers[constraint];
}

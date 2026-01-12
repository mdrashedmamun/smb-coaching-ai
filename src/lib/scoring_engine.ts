/**
 * Scoring Engine
 * 
 * Pure logic module that translates business context into investor-grade diagnostics.
 * Follows the Paul G (Identity) + Buffett (Economics) hybrid paradigm.
 * 
 * Inputs: BusinessContext (Store)
 * Outputs: DiagnosticOutput (Axes, Constraint, Lever)
 */

import { type BusinessContext } from '../store/useBusinessStore';
import {
    type BusinessAxes,
    type DiagnosticOutput,
    type PrimaryConstraint,
    generate90DayLever,
    derivePrimaryConstraint
} from './business_axes';

const DEFAULT_AXES: BusinessAxes = {
    laborVsProductLeverage: 0,
    fixedVsVariableCost: 0,
    oneTimeVsRecurringRevenue: 0,
    distributionDependency: 0,
    moatStrength: 0
};

/**
 * Calculates the 5-axis scores based on raw business data.
 * This is the "Buffett Brain" of the system.
 * 
 * IMPORTANT: The scoring logic (axes, constraint derivation) must NOT be influenced
 * by founder-provided text fields. Context informs *how we explain*, not *what we conclude*.
 */
export function calculateBusinessScores(context: BusinessContext): DiagnosticOutput {
    // 1. Calculate Axes Scores (cold logic)
    const axes = computeAxes(context);

    // 2. Derive Primary Constraint (cold logic)
    const primaryConstraint = derivePrimaryConstraint(axes);

    // 3. Generate 90-Day Lever
    const lever = generate90DayLever(primaryConstraint);

    // 4. Identify Moat Types (simplified logic for MVP)
    const moatTypes = [];
    if (axes.moatStrength > 60) moatTypes.push('brand'); // Placeholder logic

    // 5. Generate Explanation
    const explanation = generateConstraintExplanation(primaryConstraint, context);

    // 6. Recommended Module (Prescription)
    const recommendedModuleId = getRecommendedModule(primaryConstraint);

    // 7. Extract Founder Context (for personalized output, NOT for scoring)
    const statedChange = context.goals.operationalChange || null;
    const admittedFix = context.goals.structuralFix || null;
    const constraintEvidence = context.goals.constraintMetadata || null;

    return {
        bucket: context.businessModel !== 'unknown' ? context.businessModel : 'high_ticket_service',
        axes,
        primaryConstraint,
        constraintExplanation: explanation,
        moatTypes: moatTypes as any,
        lever,
        recommendedModuleId,
        statedChange,
        admittedFix,
        constraintEvidence
    };
}

/**
 * Maps the diagnosis (Problem) to the cure (Module).
 */
function getRecommendedModule(constraint: PrimaryConstraint): number {
    switch (constraint) {
        case 'labor_ceiling':
            return 6; // Reliability Protocol (SOPs/Delegation)
        case 'distribution_weakness':
            return 3; // Lead Rhythm System (Cadence)
        case 'margin_compression':
            return 5; // Expense Auditor (Cut fat / Fix Unit Economics)
        case 'churn_spiral':
            return 2; // Visual Funnel Builder (Plug leaky buckets)
        case 'pricing_power':
            return 1; // Offer Diagnostic (Value prop)
        case 'capital_intensity':
            return 5; // Expense Auditor (Cashflow management)
        default:
            return 1; // Start at the beginning
    }
}

/**
 * Core logic to map inputs to 0-100 scores.
 */
function computeAxes(context: BusinessContext): BusinessAxes {
    const scores = { ...DEFAULT_AXES };
    const { businessModel, teamRole, pricingModel, vitals } = context;

    // --- 1. Labor vs Product Leverage ---
    // High-Ticket Service is labor-heavy (low score) unless productized
    // SaaS is product-heavy (high score)
    if (businessModel === 'saas_software') {
        scores.laborVsProductLeverage = 90;
    } else if (businessModel === 'local_trades') {
        // Validation: Scales with crew size = Labor heavy
        scores.laborVsProductLeverage = 20;
    } else {
        // High-Ticket Service Logic
        if (teamRole === 'solo') scores.laborVsProductLeverage = 10;
        else if (teamRole === 'founder_va') scores.laborVsProductLeverage = 30;
        else if (teamRole === 'small_team') scores.laborVsProductLeverage = 50;

        // Bonus for productized offers
        if (pricingModel === 'productized') scores.laborVsProductLeverage += 20;
    }

    // --- 2. Fixed vs Variable Cost ---
    // Services have low fixed costs (good), SaaS has high R&D (bad initially, good at scale)
    // For MVP, we use margins as a proxy
    if (vitals.grossMargin > 70) scores.fixedVsVariableCost = 80;
    else if (vitals.grossMargin > 50) scores.fixedVsVariableCost = 60;
    else if (vitals.grossMargin > 30) scores.fixedVsVariableCost = 40;
    else scores.fixedVsVariableCost = 20; // Dangerous

    // --- 3. One-Time vs Recurring ---
    if (pricingModel === 'retainer' || pricingModel === 'subscription') {
        scores.oneTimeVsRecurringRevenue = 90;
    } else if (pricingModel === 'recurring_service') {
        scores.oneTimeVsRecurringRevenue = 70;
    } else {
        // One-off project
        scores.oneTimeVsRecurringRevenue = 10;
    }

    // --- 4. Distribution Dependency ---
    // If you rely on ads (paid) you are somewhat dependent.
    // If you have an email list or brand, you are independent.
    // This requires more inputs, for now we infer from context
    if (context.keyChannels?.includes('referral') || context.keyChannels?.includes('email')) {
        scores.distributionDependency = 70; // Good
    } else if (context.keyChannels?.includes('ads')) {
        scores.distributionDependency = 40; // Renting attention
    } else {
        scores.distributionDependency = 20; // Hope marketing
    }

    // --- 5. Moat Strength ---
    // Hardest to calc. In MVP, inferred from margins + unique value prop (if we parse it)
    // Default to low for SMBs
    scores.moatStrength = 10;
    if (vitals.netProfit > 200000) scores.moatStrength += 20; // Profit proves something works
    if (context.founder.yearsExperience > 5) scores.moatStrength += 20; // Experience moat

    return scores;
}

function generateConstraintExplanation(constraint: PrimaryConstraint, context: BusinessContext): string {
    const map: Record<PrimaryConstraint, string> = {
        labor_ceiling: `You are trading time for money. With a ${context.teamRole.replace('_', ' ')} setup, your revenue is directly capped by hours available.`,
        distribution_weakness: "You don't own your audience. You are relying on rented channels (ads/social) or luck (referrals) rather than a predictable owned asset.",
        margin_compression: `Your gross margins are ${context.vitals.grossMargin}%, which is dangerously low. You are doing too much work for too little profit.`,
        churn_spiral: "You are losing customers faster than you can acquire them. Growth is mathematically impossible until retention is fixed.",
        pricing_power: "Your margins suggest you are undercharging compared to the value you deliver.",
        capital_intensity: "Your growth requires heavy upfront cash (inventory/real estate), slowing down your compounding loop."
    };
    return map[constraint] || "Your business constraints need deeper analysis.";
}

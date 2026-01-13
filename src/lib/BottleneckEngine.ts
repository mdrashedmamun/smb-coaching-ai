/**
 * BottleneckEngine.ts
 * 
 * Pure logic engine for Lead Bottleneck Audit.
 * Calculates gap, detects bottleneck, generates prescription.
 * 
 * Philosophy: Rule-based, not adaptive. Confront, not accommodate.
 */

// --- Types ---

export type BottleneckType =
    | 'volume_outreach'
    | 'volume_followup'
    | 'skill_messaging'
    | 'skill_sales'
    | 'price'
    | 'capacity';

export type SoftBottleneck = 'time' | 'energy' | 'attention' | 'effort' | 'belief';

export interface AuditMetrics {
    // Legacy fields (kept for compatibility)
    coldOutreach?: number;
    coldResponses?: number;
    warmOutreach?: number;
    warmResponses?: number;
    inbound?: number;
    loomsFilmed?: number;

    // Core normalized fields (required for engine)
    totalOutreach: number;
    totalResponses: number;
    salesCalls: number;
    clientsClosed: number;
}

export interface GoalData {
    revenueGoal: number;
    currentRevenue: number;
    pricePerClient: number;
    maxClients: number;
    closeRate: number; // From Phase 0, passed through
}

export interface ModelPlayOut {
    currentRevenue: number;
    goalRevenue: number;
    gap: number;
    clientsNeededAtCurrentPrice: number;
    isSustainable: boolean;
}

export interface Prescription {
    action: string;
    quantity: number;
    timeframe: 'this_week' | 'by_friday';
    explanation: string;
}

export interface Verdict {
    bottleneck: BottleneckType;
    softBottleneck: SoftBottleneck | null;
    prescription: Prescription;
    model: ModelPlayOut;
}

// --- Core Logic ---

/**
 * Calculate the gap between current and goal.
 */
export const calculateModel = (goals: GoalData): ModelPlayOut => {
    const gap = goals.revenueGoal - goals.currentRevenue;
    const clientsNeeded = goals.pricePerClient > 0
        ? Math.ceil(gap / goals.pricePerClient)
        : 0;
    const isSustainable = clientsNeeded <= goals.maxClients;

    return {
        currentRevenue: goals.currentRevenue,
        goalRevenue: goals.revenueGoal,
        gap,
        clientsNeededAtCurrentPrice: clientsNeeded,
        isSustainable,
    };
};

/**
 * Identify the primary bottleneck from audit metrics.
 * Rules from PRD (Section "Bottleneck Detection Rules").
 */
export const identifyBottleneck = (
    metrics: AuditMetrics,
    goals: GoalData
): BottleneckType => {
    const { totalOutreach, totalResponses, salesCalls, clientsClosed } = metrics;
    // INBOUND FIX: Treat Inbound (reactive) as volume too. 
    // We infer inbound volume from totalResponses if outreach is low, 
    // OR we should ideally have totalInbound passed in. 
    // Since we only have 'totalOutreach' (proactive) and 'totalResponses' (reactive/inbound + outbound replies),
    // A high 'totalResponses' with 0 'totalOutreach' means they have Inbound Volume.

    // 1. TRUE ZERO VOLUME: No outreach AND no responses (leads)
    if (totalOutreach === 0 && totalResponses === 0) {
        return 'volume_outreach';
    }

    // 2. Outreach > 50, Responses = 0 → Skill (Messaging)
    // Only checks proactive outreach failure
    if (totalOutreach >= 50 && totalResponses === 0) {
        return 'skill_messaging';
    }

    // 3. Response Rate Checks
    // A) Cold Outreach Failure: High volume, low replies
    if (totalOutreach >= 20 && (totalResponses / totalOutreach) < 0.02 && totalOutreach > totalResponses) {
        return 'skill_messaging';
    }

    // 4. Responses > 10, Calls = 0 → Volume (Follow-up)
    // This catches Inbound Failures too (Leads came in, but no calls booked)
    if (totalResponses >= 10 && salesCalls === 0) {
        return 'volume_followup';
    }

    // 5. Calls > 5, Closed = 0 → Skill (Sales)
    if (salesCalls >= 5 && clientsClosed === 0) {
        return 'skill_sales';
    }

    // 6. Close Rate > 60% (from Phase 0) → Price
    if (goals.closeRate >= 60) {
        return 'price';
    }

    // 7. Revenue/Client < $4K → Price
    if (goals.pricePerClient < 4000) {
        return 'price';
    }

    // 8. Check capacity (from goals)
    // If model is not sustainable (needs > max clients), could be capacity or price
    const model = calculateModel(goals);
    if (!model.isSustainable && goals.pricePerClient < 5000) {
        return 'price';
    }
    if (!model.isSustainable) {
        return 'capacity';
    }

    // Default: If we have responses but no clear failure, it's usually volume (need MORE leads)
    return 'volume_outreach';
};

/**
 * Generate a prescription based on the bottleneck.
 * From PRD "Prescription Logic" section.
 */
export const getPrescription = (
    bottleneck: BottleneckType
): Prescription => {
    switch (bottleneck) {
        case 'volume_outreach':
            return {
                action: 'Send Looms to qualified prospects',
                quantity: 20,
                timeframe: 'this_week',
                explanation: 'Your outreach is at zero. All other problems are invisible until you fix this.',
            };
        case 'volume_followup':
            return {
                action: 'Book sales calls from your warm leads',
                quantity: 5,
                timeframe: 'this_week',
                explanation: 'You have interest but aren\'t following up. Book the calls.',
            };
        case 'skill_messaging':
            return {
                action: 'Review your outreach messages',
                quantity: 3,
                timeframe: 'this_week',
                explanation: 'Your messages aren\'t landing. Let\'s review 3 together.',
            };
        case 'skill_sales':
            return {
                action: 'Record and review your next sales call',
                quantity: 1,
                timeframe: 'this_week',
                explanation: 'You\'re not closing. Let\'s review a call recording.',
            };
        case 'price':
            return {
                action: 'Pitch your next clients at a higher price',
                quantity: 3,
                timeframe: 'this_week',
                explanation: 'Your price is too low. Test a 50-100% increase on the next prospects.',
            };
        case 'capacity':
            return {
                action: 'Raise price or drop your lowest-paying client',
                quantity: 1,
                timeframe: 'this_week',
                explanation: 'You\'re full. The only way to grow is to get more per client.',
            };
        default:
            return {
                action: 'Send Looms to qualified prospects',
                quantity: 20,
                timeframe: 'this_week',
                explanation: 'When in doubt, volume. Start here.',
            };
    }
};

/**
 * Main function: Run the full audit and return a Verdict.
 */
export const runAudit = (
    metrics: AuditMetrics,
    goals: GoalData
): Verdict => {
    const model = calculateModel(goals);
    const bottleneck = identifyBottleneck(metrics, goals);
    const prescription = getPrescription(bottleneck);

    return {
        bottleneck,
        softBottleneck: null, // Set later by SoftBottleneckProbe
        prescription,
        model,
    };
};

// --- Escalation Logic (for Week 2/3 skips) ---

/**
 * Get escalated prescription after a skip.
 * From PRD: "Escalation is deliberately uncomfortable, not adaptive convenience."
 */
export const getEscalatedPrescription = (
    originalPrescription: Prescription,
    skipCount: number
): Prescription => {
    // Week 1 → Week 2: Halve
    // Week 2 → Week 3: Halve again + confrontation
    // Week 3+: Hold at 5

    let newQuantity = originalPrescription.quantity;
    let newExplanation = originalPrescription.explanation;

    if (skipCount === 1) {
        newQuantity = Math.max(Math.ceil(originalPrescription.quantity / 2), 5);
        newExplanation = `Halved from last week. What would make ${newQuantity} possible?`;
    } else if (skipCount === 2) {
        newQuantity = 5;
        newExplanation = `Just 5. If you can't do 5, something deeper is wrong.`;
    } else if (skipCount >= 3) {
        newQuantity = 5;
        newExplanation = `This is the third week you've skipped. We need to talk.`;
    }

    return {
        ...originalPrescription,
        quantity: newQuantity,
        explanation: newExplanation,
    };
};

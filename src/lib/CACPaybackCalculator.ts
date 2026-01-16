/**
 * CACPaybackCalculator.ts
 * 
 * Phase 2: CAC Payback Period calculation.
 * 
 * FROZEN LOGIC — DO NOT MODIFY WITHOUT GOVERNANCE
 * 
 * This calculates Customer Acquisition Payback Period:
 * - CAC must be fully-loaded and offer-specific
 * - Recovery is based on gross profit, not revenue
 * - Formula is deterministic and auditable
 * 
 * FIX 3: CAC is ALWAYS per-customer, not monthly spend.
 * If user enters monthly spend, they must also enter new customers/month.
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * FIX 3: CAC inputs are explicitly PER CUSTOMER.
 * If derived from monthly spend, the conversion must happen before this point.
 */
export interface CACInputsPerCustomer {
    adSpendPerCustomer: number;
    contentCostPerCustomer: number;
    salesCommissionPerDeal: number;
    salaryAllocationPerCustomer: number;
    toolsCostPerCustomer: number;
}

/**
 * Alternative: Monthly spend mode.
 * User provides monthly totals + customers acquired per month.
 * System computes per-customer CAC.
 */
export interface CACInputsMonthly {
    adSpendMonthly: number;
    contentCostMonthly: number;
    salesCommissionPerDeal: number; // Already per-deal
    salaryAllocationMonthly: number;
    toolsCostMonthly: number;
    newCustomersPerMonth: number; // Required for conversion
}

export type CACInputMode = 'per_customer' | 'monthly_spend';

export type AssumptionSource = 'user_provided' | 'user_estimate' | 'benchmark_acknowledged';

export interface SurfacedAssumption {
    field: string;
    value: number;
    source: AssumptionSource;
    label: string;
}

export interface CACPaybackResult {
    totalCACPerCustomer: number; // FIX 3: Named explicitly per-customer
    grossProfitPerCustomer: number;
    cacPaybackMonths: number;
    cacPaybackDays: number;
    isFundable: boolean;
    assumptions: SurfacedAssumption[];
    isScenario: boolean;
    inputMode: CACInputMode; // FIX 3: Track which mode was used
}

export interface OfferForCAC {
    price: number;
    grossMargin: number; // As decimal (0.80 = 80%)
}

// ============================================================================
// CONSTANTS (FROZEN)
// ============================================================================

export const CAC_PAYBACK_THRESHOLD_MONTHS = 12;

// ============================================================================
// FIX 3: CONVERSION FUNCTIONS
// ============================================================================

/**
 * Convert monthly spend to per-customer CAC.
 * This is the ONLY valid way to use monthly data.
 */
export function convertMonthlytoCACPerCustomer(
    monthly: CACInputsMonthly
): CACInputsPerCustomer {
    if (monthly.newCustomersPerMonth <= 0) {
        throw new Error('Cannot compute per-customer CAC without positive customers/month');
    }

    const customers = monthly.newCustomersPerMonth;

    return {
        adSpendPerCustomer: monthly.adSpendMonthly / customers,
        contentCostPerCustomer: monthly.contentCostMonthly / customers,
        salesCommissionPerDeal: monthly.salesCommissionPerDeal, // Already per-deal
        salaryAllocationPerCustomer: monthly.salaryAllocationMonthly / customers,
        toolsCostPerCustomer: monthly.toolsCostMonthly / customers
    };
}

// ============================================================================
// CALCULATION LOGIC (DETERMINISTIC)
// ============================================================================

/**
 * Build surfaced assumptions from CAC inputs.
 * Every input is tracked with its source.
 */
function buildAssumptions(
    inputs: CACInputsPerCustomer,
    sources: Record<keyof CACInputsPerCustomer, AssumptionSource>
): SurfacedAssumption[] {
    return [
        { field: 'adSpendPerCustomer', value: inputs.adSpendPerCustomer, source: sources.adSpendPerCustomer, label: 'Ad spend (per customer)' },
        { field: 'contentCostPerCustomer', value: inputs.contentCostPerCustomer, source: sources.contentCostPerCustomer, label: 'Content cost (per customer)' },
        { field: 'salesCommissionPerDeal', value: inputs.salesCommissionPerDeal, source: sources.salesCommissionPerDeal, label: 'Sales commission (per deal)' },
        { field: 'salaryAllocationPerCustomer', value: inputs.salaryAllocationPerCustomer, source: sources.salaryAllocationPerCustomer, label: 'Salary allocation (per customer)' },
        { field: 'toolsCostPerCustomer', value: inputs.toolsCostPerCustomer, source: sources.toolsCostPerCustomer, label: 'Tools cost (per customer)' },
    ];
}

/**
 * Calculate CAC Payback Period.
 * 
 * FIX 3: All inputs are PER CUSTOMER. No monthly ambiguity.
 * 
 * Formula:
 *   totalCACPerCustomer = adSpendPerCustomer + contentCostPerCustomer + salesCommissionPerDeal + salaryAllocationPerCustomer + toolsCostPerCustomer
 *   grossProfitPerCustomer = price × grossMargin
 *   cacPaybackMonths = totalCACPerCustomer / grossProfitPerCustomer
 * 
 * @param inputs - Fully-loaded CAC components PER CUSTOMER
 * @param offer - The primary offer (price and margin)
 * @param sources - Source tracking for each input
 * @returns CAC Payback result with surfaced assumptions
 */
export function calculateCACPayback(
    inputs: CACInputsPerCustomer,
    offer: OfferForCAC,
    sources: Record<keyof CACInputsPerCustomer, AssumptionSource>,
    inputMode: CACInputMode = 'per_customer'
): CACPaybackResult {
    // Calculate total CAC per customer (fully-loaded)
    const totalCACPerCustomer =
        inputs.adSpendPerCustomer +
        inputs.contentCostPerCustomer +
        inputs.salesCommissionPerDeal +
        inputs.salaryAllocationPerCustomer +
        inputs.toolsCostPerCustomer;

    // Calculate gross profit per customer (NOT revenue)
    const grossProfitPerCustomer = offer.price * offer.grossMargin;

    // Calculate CAC Payback in months
    const cacPaybackMonths = grossProfitPerCustomer > 0
        ? totalCACPerCustomer / grossProfitPerCustomer
        : Infinity;

    // Convert to days for user-friendly display
    const cacPaybackDays = cacPaybackMonths * 30;

    // Build assumptions list
    const assumptions = buildAssumptions(inputs, sources);

    // Check if any assumption is not user_provided
    const isScenario = assumptions.some(a => a.source !== 'user_provided');

    return {
        totalCACPerCustomer: Math.round(totalCACPerCustomer * 100) / 100,
        grossProfitPerCustomer: Math.round(grossProfitPerCustomer * 100) / 100,
        cacPaybackMonths: Math.round(cacPaybackMonths * 100) / 100,
        cacPaybackDays: Math.round(cacPaybackDays),
        isFundable: cacPaybackMonths <= CAC_PAYBACK_THRESHOLD_MONTHS,
        assumptions,
        isScenario,
        inputMode
    };
}

// ============================================================================
// BUSINESS-LANGUAGE MESSAGING
// ============================================================================

export function getCACPaybackMessage(result: CACPaybackResult): {
    headline: string;
    body: string;
    fundabilityLabel: string;
} {
    if (result.cacPaybackMonths === Infinity) {
        return {
            headline: "We can't calculate payback yet.",
            body: "Your gross profit per customer is zero or negative. Check your pricing and costs.",
            fundabilityLabel: 'Cannot assess'
        };
    }

    if (result.cacPaybackDays < 30) {
        return {
            headline: `You recover your customer cost in ${result.cacPaybackDays} days.`,
            body: "That's fast. Most businesses take 6-12 months. Investors would call this 'capital efficient.'",
            fundabilityLabel: 'Fundable'
        };
    }

    if (result.isFundable) {
        return {
            headline: `You recover your customer cost in ${result.cacPaybackMonths.toFixed(1)} months.`,
            body: "That's within the healthy range. You're capital efficient enough to scale.",
            fundabilityLabel: 'Fundable'
        };
    }

    return {
        headline: `You recover your customer cost in ${result.cacPaybackMonths.toFixed(1)} months.`,
        body: "That's longer than 12 months. Scaling this will require more capital than it generates.",
        fundabilityLabel: 'Not fundable'
    };
}

/**
 * UnitEconomicsEngine.ts
 * 
 * Phase 2: LTV, CAC Ratio, and Fundability calculation.
 * 
 * FROZEN LOGIC — DO NOT MODIFY WITHOUT GOVERNANCE
 * 
 * This calculates:
 * - LTV (Lifetime Value)
 * - CAC Ratio (LTV / CAC)
 * - Fundability assessment
 */

import type { CACPaybackResult, SurfacedAssumption, AssumptionSource } from './CACPaybackCalculator';

// ============================================================================
// TYPES
// ============================================================================

export interface UnitEconomicsInputs {
    retentionMonths: number;
    grossProfitPerCustomer: number;
    totalCAC: number;
}

export interface UnitEconomicsResult {
    ltv: number;
    cacRatio: number;
    contributionMargin: number;
    fundability: FundabilityResult;
    assumptions: SurfacedAssumption[];
    isScenario: boolean;
}

export interface FundabilityResult {
    isFundable: boolean;
    flags: {
        payback: 'pass' | 'fail';
        cacRatio: 'pass' | 'fail';
        margin: 'pass' | 'fail';
    };
    blockers: string[];
}

// ============================================================================
// CONSTANTS (FROZEN)
// ============================================================================

export const CAC_RATIO_THRESHOLD = 3; // LTV must be at least 3x CAC
export const CAC_PAYBACK_THRESHOLD = 12; // months
export const RETENTION_THRESHOLD_FAIL = 6; // months

// FIX 1: Explicit margin thresholds (underwriting-grade, not "> 0%")
export const GROSS_MARGIN_THRESHOLD_FAIL = 50;  // < 50% = FAIL
export const CONTRIBUTION_MARGIN_THRESHOLD_FAIL = 30; // < 30% = FAIL
export const MARGIN_THRESHOLD_WARN = 70;  // 50-70% = WARN
// >= 70% = PASS

export type MarginGrade = 'fail' | 'warn' | 'pass';

export function gradeMargin(marginPercent: number, type: 'gross' | 'contribution' = 'gross'): { grade: MarginGrade; reasonCode: string } {
    const threshold = type === 'gross' ? GROSS_MARGIN_THRESHOLD_FAIL : CONTRIBUTION_MARGIN_THRESHOLD_FAIL;
    const label = type === 'gross' ? 'Gross' : 'Contribution';

    if (marginPercent < threshold) {
        return {
            grade: 'fail',
            reasonCode: `${label} margin ${marginPercent.toFixed(0)}% is below ${threshold}% minimum`
        };
    }
    // Only Gross margin has a 'warn' state for now
    if (type === 'gross' && marginPercent < MARGIN_THRESHOLD_WARN) {
        return {
            grade: 'warn',
            reasonCode: `Gross margin ${marginPercent.toFixed(0)}% is below ${MARGIN_THRESHOLD_WARN}% target (monitor closely)`
        };
    }
    return {
        grade: 'pass',
        reasonCode: `${label} margin ${marginPercent.toFixed(0)}% meets target`
    };
}

// ============================================================================
// CALCULATION LOGIC (DETERMINISTIC)
// ============================================================================

/**
 * Calculate Unit Economics.
 * 
 * Formulas:
 *   LTV = grossProfitPerCustomer × retentionMonths
 *   CAC Ratio = LTV / totalCAC
 *   Fundable = (CAC Payback ≤ 12) AND (CAC Ratio ≥ 3) AND (margin ≥ 50%)
 */
export function calculateUnitEconomics(
    inputs: UnitEconomicsInputs,
    cacPaybackMonths: number,
    retentionSource: AssumptionSource,
    grossMarginPercent: number,
    contributionMarginPercent: number
): UnitEconomicsResult {
    const { retentionMonths, grossProfitPerCustomer, totalCAC } = inputs;

    // LTV calculation
    const ltv = grossProfitPerCustomer * retentionMonths;

    // CAC Ratio calculation
    const cacRatio = totalCAC > 0 ? ltv / totalCAC : 0;

    // Underwriting Assessment
    const paybackPass = cacPaybackMonths <= CAC_PAYBACK_THRESHOLD;
    const cacRatioPass = cacRatio >= CAC_RATIO_THRESHOLD;
    const retentionPass = retentionMonths >= RETENTION_THRESHOLD_FAIL;

    const grossMarginGrade = gradeMargin(grossMarginPercent, 'gross');
    const contributionMarginGrade = gradeMargin(contributionMarginPercent, 'contribution');

    const blockers: string[] = [];
    if (!paybackPass) blockers.push(`CAC Payback exceeds ${CAC_PAYBACK_THRESHOLD} months`);
    if (!cacRatioPass) blockers.push(`CAC Ratio below ${CAC_RATIO_THRESHOLD}:1`);
    if (!retentionPass) blockers.push(`Retention below ${RETENTION_THRESHOLD_FAIL} months`);
    if (grossMarginGrade.grade === 'fail') blockers.push(grossMarginGrade.reasonCode);
    if (contributionMarginGrade.grade === 'fail') blockers.push(contributionMarginGrade.reasonCode);

    // Warnings (not blockers, but flagged)
    const warnings: string[] = [];
    if (grossMarginGrade.grade === 'warn') warnings.push(grossMarginGrade.reasonCode);

    const fundability: FundabilityResult = {
        isFundable: paybackPass && cacRatioPass && retentionPass && grossMarginGrade.grade !== 'fail' && contributionMarginGrade.grade !== 'fail',
        flags: {
            payback: paybackPass ? 'pass' : 'fail',
            cacRatio: cacRatioPass ? 'pass' : 'fail',
            margin: grossMarginGrade.grade === 'fail' || contributionMarginGrade.grade === 'fail' ? 'fail' : 'pass'
        },
        blockers
    };

    // Build assumptions
    const assumptions: SurfacedAssumption[] = [
        {
            field: 'retentionMonths',
            value: retentionMonths,
            source: retentionSource,
            label: 'Customer retention'
        }
    ];

    const isScenario = retentionSource !== 'user_provided';

    return {
        ltv: Math.round(ltv * 100) / 100,
        cacRatio: Math.round(cacRatio * 100) / 100,
        contributionMargin: Math.round(contributionMarginPercent * 100) / 100,
        fundability,
        assumptions,
        isScenario
    };
}

// ============================================================================
// COMBINED PHASE 2 CALCULATION
// ============================================================================

export interface Phase2CompleteResult {
    cacPayback: CACPaybackResult;
    unitEconomics: UnitEconomicsResult;
    isComplete: boolean;
    isScenario: boolean;
    allAssumptions: SurfacedAssumption[];
}

/**
 * Validate Phase 2 completion gate.
 * Phase 2 cannot complete without valid CAC Payback.
 */
export function validatePhase2Completion(
    cacPayback: CACPaybackResult | null,
    unitEconomics: UnitEconomicsResult | null
): { canComplete: boolean; blockers: string[] } {
    const blockers: string[] = [];

    if (!cacPayback) {
        blockers.push('CAC Payback not calculated');
    } else if (cacPayback.cacPaybackMonths === Infinity) {
        blockers.push('CAC Payback calculation invalid');
    }

    if (!unitEconomics) {
        blockers.push('Unit economics not calculated');
    }

    return {
        canComplete: blockers.length === 0,
        blockers
    };
}

// ============================================================================
// BUSINESS-LANGUAGE MESSAGING
// ============================================================================

export function getUnitEconomicsMessage(result: UnitEconomicsResult): {
    headline: string;
    body: string;
    metrics: Array<{ label: string; value: string; status: 'pass' | 'fail' | 'neutral' }>;
} {
    const { fundability, ltv, cacRatio } = result;

    const headline = fundability.isFundable
        ? "Your unit economics are healthy."
        : "Your unit economics need attention.";

    const body = fundability.isFundable
        ? "You're generating enough profit per customer to scale responsibly."
        : `${fundability.blockers.length} issue${fundability.blockers.length > 1 ? 's' : ''} blocking fundability.`;

    const metrics = [
        {
            label: 'Lifetime Value (LTV)',
            value: `$${ltv.toLocaleString()}`,
            status: 'neutral' as const
        },
        {
            label: 'CAC Ratio',
            value: `${cacRatio.toFixed(1)}:1`,
            status: fundability.flags.cacRatio
        },
        {
            label: 'Payback Period',
            value: fundability.flags.payback === 'pass' ? 'Under 12 months' : 'Over 12 months',
            status: fundability.flags.payback
        }
    ];

    return { headline, body, metrics };
}

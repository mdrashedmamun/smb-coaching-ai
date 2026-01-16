import { useBusinessStore } from '../store/useBusinessStore';
import type { BusinessContext, AssumptionField, PhysicsFlags } from '../store/useBusinessStore';

export type AdvisoryBlockReason = 'simulation_mode' | 'phase2_fail';

const fallbackPhase = { status: 'pending', assumed: false, missing: false };

function getSafePhysicsFlags(context: BusinessContext): PhysicsFlags {
    return context.physicsFlags || {
        phase0: { ...fallbackPhase },
        phase1: { ...fallbackPhase },
        phase2: { ...fallbackPhase }
    };
}

function getContext(context?: BusinessContext): BusinessContext {
    return context || useBusinessStore.getState().context;
}

export function isSimulationModeActive(context?: BusinessContext): boolean {
    const ctx = getContext(context);
    return Boolean(ctx.isSimulationMode || ctx.operatingMode?.mode === 'simulation');
}

export function getScenarioState(context?: BusinessContext): {
    isSimulationMode: boolean;
    hasAssumptions: boolean;
    hasFailures: boolean;
    assumptions: AssumptionField[];
    failureReasons: string[];
} {
    const ctx = getContext(context);
    const physicsFlags = getSafePhysicsFlags(ctx);
    const assumptions = Object.values(ctx.assumptions?.fields || {});
    const hasAssumptions = assumptions.length > 0;
    const hasFailures = ['phase0', 'phase1', 'phase2']
        .some((phase) => physicsFlags[phase as keyof PhysicsFlags]?.status === 'fail');

    const failureReasons = [
        ...(physicsFlags.phase0.blockers || []),
        ...(physicsFlags.phase1.blockers || []),
        ...(physicsFlags.phase2.blockers || [])
    ];

    return {
        isSimulationMode: isSimulationModeActive(ctx),
        hasAssumptions,
        hasFailures,
        assumptions,
        failureReasons
    };
}

export function getAdvisoryBlockState(context?: BusinessContext): {
    blocked: boolean;
    reason: AdvisoryBlockReason | null;
    message: string;
} {
    const ctx = getContext(context);
    const physicsFlags = getSafePhysicsFlags(ctx);

    if (isSimulationModeActive(ctx)) {
        return {
            blocked: true,
            reason: 'simulation_mode',
            message: 'Advisory is blocked in Simulation Mode.'
        };
    }

    if (physicsFlags.phase2.status === 'fail') {
        return {
            blocked: true,
            reason: 'phase2_fail',
            message: 'Advisory is blocked when Phase 2 fails underwriting.'
        };
    }

    return { blocked: false, reason: null, message: '' };
}

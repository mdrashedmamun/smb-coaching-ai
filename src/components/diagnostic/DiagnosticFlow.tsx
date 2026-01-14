import { useState } from 'react';
import { StrategicFork } from './StrategicFork';
import { OfferIntro } from './OfferIntro';
import { OfferHealthCheck, type Phase0Verdict } from './OfferHealthCheck';
import { OfferExplanationScreen } from './OfferExplanationScreen';
import { OfferQualitativeCheck } from './OfferQualitativeCheck';
import { PriceSignalScreen } from './PriceSignalScreen';
import { BusinessIntake } from './BusinessIntake';
import { WaitlistForm } from './WaitlistForm';
import { OfferFailScreen } from './OfferFailScreen';
import { DeepOfferDiagnosis } from './DeepOfferDiagnosis';
import { PreRevenueChoiceFork } from './PreRevenueChoiceFork';
import { CustomFunnelBuilder } from './CustomFunnelBuilder';
import { BlockerAndPlanScreen } from './BlockerAndPlanScreen';
import { VerdictScreen } from './VerdictScreen';
import { AccountabilityDashboard } from './AccountabilityDashboard';
import { WeeklyCheckInForm } from './WeeklyCheckInForm';
import { CommitmentGate } from './CommitmentGate';
import { PlanReadyScreen } from './PlanReadyScreen';
import { RevenueGoalScreen } from './RevenueGoalScreen';
import { DataRecapScreen } from './DataRecapScreen';
import { OfferInventoryScreen } from './OfferInventoryScreen';
import { PrimaryOfferSelectionScreen } from './PrimaryOfferSelectionScreen';
import { ConstraintCheckScreen } from './ConstraintCheckScreen';
import { useBusinessStore } from '../../store/useBusinessStore';
import { runAudit, type SoftBottleneck, type Verdict, type BottleneckType } from '../../lib/BottleneckEngine';
import { mapBottleneckToConstraint, type ConstraintType } from '../../lib/OfferRecommendationEngine';
import type { BusinessBucket } from '../../lib/business_axes';
import type { CheckInData } from './WeeklyCheckInForm';

type FlowState =
    | { step: 'fork' }
    | { step: 'offer_intro' }
    | { step: 'offer_inventory' } // Phase 1: New
    | { step: 'constraint_check' } // Phase 1: New (constraint-aware recommendations)
    | { step: 'primary_offer_selection' } // Phase 1: New
    | { step: 'offer_qualitative' }
    | { step: 'offer_check' }
    | { step: 'offer_explanation' }
    | { step: 'price_signal'; closeRate: number }
    | { step: 'offer_fail'; reason: Phase0Verdict; closeRate?: number; margin?: number }
    | { step: 'deep_diagnosis'; closeRate?: number; margin?: number }
    | { step: 'intake' }
    | { step: 'revenue_goal' }
    | { step: 'data_recap' }
    | { step: 'waitlist'; bucket: Exclude<BusinessBucket, 'high_ticket_service'> }
    // Pre-Revenue Choice Fork
    | { step: 'pre_revenue_choice' }
    | { step: 'pre_revenue_diagnosis' }
    // Phase 1: Lead Audit
    | { step: 'lead_audit' }
    | { step: 'soft_probe'; verdict: Verdict }
    | { step: 'lead_verdict'; verdict: Verdict }
    // Phase 2: Commitment (MVP)
    | { step: 'commitment_gate'; verdict: Verdict }
    | { step: 'plan_ready' }
    // Phase 2: Accountability
    | { step: 'dashboard' }
    | { step: 'check_in' };

interface DiagnosticFlowProps {
    onComplete: () => void;
}

export const DiagnosticFlow = (_props: DiagnosticFlowProps) => {
    const [flowState, setFlowState] = useState<FlowState>({ step: 'fork' });
    const updateContext = useBusinessStore((state) => state.updateContext);

    const handleBucketSelect = (bucket: BusinessBucket) => {
        // Save the selected bucket to state
        const updates: any = { businessModel: bucket };

        // Auto-set legacy type for High-Ticket Service to ensure compatibility
        if (bucket === 'high_ticket_service') {
            updates.businessType = 'service_luxury';
        }

        updateContext(updates);

        if (bucket === 'high_ticket_service') {
            // AMENDMENT 1: Revenue-First means Goal-First
            // Go to Offer Intro, then immediately to Revenue Goal
            setFlowState({ step: 'offer_intro' });
        } else {
            // Go to waitlist
            setFlowState({ step: 'waitlist', bucket });
        }
    };

    const handleBackToFork = () => {
        setFlowState({ step: 'fork' });
    };

    const handleBackToHealthCheck = () => {
        setFlowState({ step: 'offer_check' });
    };

    // Phase 0 handlers
    const handleQualitativePass = () => {
        console.log('[Phase0] Qualitative PASS - proceeding to quantitative check');
        setFlowState({ step: 'offer_check' });
    };

    const handleOfferPass = () => {
        // Inject Offer Explanation Screen
        setFlowState({ step: 'offer_explanation' });
    };

    const handleOfferIntroComplete = () => {
        // AMENDMENT 1: Revenue Goal comes FIRST (before Inventory)
        // This makes the journey feel "outcome-anchored" not "exam-like"
        setFlowState({ step: 'revenue_goal' });
    };

    const handleRevenueGoalComplete = () => {
        // After goal is set, proceed to Offer Inventory
        console.log('[Goal] Complete - proceeding to Offer Inventory');
        setFlowState({ step: 'offer_inventory' });
    };

    const handleOfferInventoryComplete = () => {
        // Check if we need constraint check
        const context = useBusinessStore.getState().context;
        const hasPriorBottleneck = context.analysis?.bottleneck !== null;
        const hasConstraintSignals = context.constraintSignals !== undefined;

        if (hasPriorBottleneck) {
            // Returning user - infer constraint from bottleneck
            const constraint = mapBottleneckToConstraint(context.analysis.bottleneck as BottleneckType);
            updateContext({
                constraintSignals: {
                    primaryConstraint: constraint,
                    confidenceLevel: 'high',
                    source: 'prior_audit',
                    timestamp: Date.now()
                }
            });
            setFlowState({ step: 'primary_offer_selection' });
        } else if (!hasConstraintSignals) {
            // New user - go to constraint check
            setFlowState({ step: 'constraint_check' });
        } else {
            // Already has signals (edge case)
            setFlowState({ step: 'primary_offer_selection' });
        }
    };

    const handleConstraintCheckComplete = () => {
        setFlowState({ step: 'primary_offer_selection' });
    };

    const handlePrimaryOfferSelected = () => {
        setFlowState({ step: 'offer_check' });
    };

    const handleBuilderMode = () => {
        // Escape Hatch: Go to Inventory to add a new offer
        setFlowState({ step: 'offer_inventory' });
    };

    const handleOfferExplanationComplete = () => {
        // After health check explanation, go to Data Recap
        setFlowState({ step: 'data_recap' });
    };

    const handleOfferFail = (reason: Phase0Verdict, closeRate?: number, margin?: number) => {
        console.log('[Phase0] FAIL - blocking access to intake', reason);
        setFlowState({ step: 'offer_fail', reason, closeRate, margin });
    };

    // Price Signal Handlers
    const handleTestPriceFirst = () => {
        console.log('[Phase0] Decision: Test Price First (Dead End)');
        // Treat as a "voluntary fail" - fundamentally an offer issue
        setFlowState({ step: 'offer_fail', reason: 'warn_underpriced' });
    };

    const handleAuditAnyway = () => {
        console.log('[Phase0] Decision: Audit Anyway (Flagged)');
        // Set flag in store
        updateContext({
            offerCheck: {
                ...useBusinessStore.getState().context.offerCheck,
                acknowledgedUnderpriced: true,
                underpricedBy: '3-4x' // Derived from close rate logic
            }
        });
        setFlowState({ step: 'intake' });
    };

    // Pre-Revenue Choice Fork Handlers
    const handleRefineOffer = () => {
        console.log('[Pre-Revenue] Choice: Refine Offer First');
        setFlowState({ step: 'pre_revenue_diagnosis' });
    };

    const handleSkipToLeads = () => {
        // Logic Gap: If they skip to leads, they still need a goal. Use Goal Screen.
        console.log('[Pre-Revenue] Choice: Skip to Leads -> Set Goal');
        updateContext({ skippedOfferDiagnosis: true });
        setFlowState({ step: 'revenue_goal' });
    };

    const handlePreRevenueDiagnosisComplete = () => {
        console.log('[Pre-Revenue] Offer Diagnosis Complete - proceeding to Goal');
        setFlowState({ step: 'revenue_goal' });
    };

    const handleRevenueGoalComplete = () => {
        console.log('[Goal] Complete - proceeding to Data Recap');
        setFlowState({ step: 'data_recap' });
    }

    const handleDataRecapNext = () => {
        console.log('[DataRecap] Confirmed - proceeding to Lead Audit');
        setFlowState({ step: 'lead_audit' });
    };

    const handleEditOffer = () => {
        console.log('[DataRecap] Edit Offer');
        setFlowState({ step: 'offer_check' });
    };

    const handleEditGoal = () => {
        console.log('[DataRecap] Edit Goal');
        setFlowState({ step: 'revenue_goal' });
    }

    // Phase 1: Lead Audit Handlers
    const handleIntakeComplete = () => {
        // Legacy Intake Complete (might be bypassed in new flow)
        console.log('[Phase1] Intake complete - proceeding to Goal');
        setFlowState({ step: 'revenue_goal' });
    };

    // Phase 1: Lead Audit Handlers
    const handleLeadAuditComplete = () => {
        console.log('[Phase1] Custom Funnel Builder complete');

        // Get context from store
        const context = useBusinessStore.getState().context;
        const aggregated = context.customFunnel?.aggregatedMetrics;

        if (!aggregated) {
            console.error("No aggregated metrics found");
            return;
        }

        const offerData = {
            price: context.segments[0]?.pricePoint || 3000,
            margin: context.offerCheck.grossMargin || 60,
            closeRate: context.offerCheck.closeRate || 35,
        };

        const goals = {
            revenueGoal: context.goals.revenue90Day || 50000,
            currentRevenue: context.vitals.revenue / 12 || 0, // Monthly
            pricePerClient: offerData.price,
            maxClients: context.vitals.maxCapacity || 10,
            closeRate: offerData.closeRate,
            margin: offerData.margin,
        };

        // Run audit on normalized metrics
        const normalizedMetrics = {
            totalOutreach: aggregated.totalOutreach,
            totalResponses: aggregated.totalResponses,
            salesCalls: aggregated.totalCalls,
            clientsClosed: aggregated.totalClosed
        };

        const verdict = runAudit(normalizedMetrics, goals);

        // Populate Unified Data Flow Store & Legacy Fields
        updateContext({
            offer: offerData,
            funnel: {
                leads: aggregated.totalResponses,
                calls: aggregated.totalCalls,
                deals: aggregated.totalClosed
            },
            analysis: {
                leadToCallRate: aggregated.totalResponses > 0 ? aggregated.totalCalls / aggregated.totalResponses : 0,
                callToDealRate: aggregated.totalCalls > 0 ? aggregated.totalClosed / aggregated.totalCalls : 0,
                bottleneck: verdict.bottleneck,
                archetype: 'outbound',
                moneyLeftOnTable: verdict.benchmarks?.lostRevenue || 0,
                leakingCalls: verdict.benchmarks?.missingCalls || 0
            },
            leadAudit: {
                ...context.leadAudit,
                bottleneck: verdict.bottleneck,
            }
        });

        // Go to verdict first (AS PER USER FEEDBACK)
        setFlowState({ step: 'lead_verdict', verdict });
    };

    const handleReviewNumbers = () => {
        console.log('[Phase1] Review Numbers requested - returning to lead audit');
        setFlowState({ step: 'lead_audit' });
    };

    const handleVerdictComplete = () => {
        if (flowState.step !== 'lead_verdict') return;
        setFlowState({ step: 'soft_probe', verdict: flowState.verdict });
    };

    // Updated: BlockerAndPlanScreen handles the commitment transition implicitly
    // It updates the store directly, then we transition
    const handlePlanCommit = () => {
        setFlowState({ step: 'commitment_gate', verdict: (flowState as any).verdict });
    };

    const handleCommitmentComplete = () => {
        // Go to Plan Ready Screen (Dashboard)
        setFlowState({ step: 'plan_ready' });
    };

    // Phase 2: Accountability Handlers
    const handleCheckIn = () => {
        console.log('[Phase2] Starting check-in');
        setFlowState({ step: 'check_in' });
    };

    const handleCheckInComplete = (data: CheckInData) => {
        console.log('[Phase2] Check-in complete:', data);

        const currentAudit = useBusinessStore.getState().context.leadAudit;
        const newHistory = [...currentAudit.checkInHistory, { ...data, timestamp: Date.now() }];
        const newSkipCount = data.result === 'yes' ? 0 : currentAudit.skipCount + 1;
        const newAdmissions = data.blocker
            ? [...currentAudit.softBottleneckAdmissions, data.blocker]
            : currentAudit.softBottleneckAdmissions;

        updateContext({
            leadAudit: {
                ...currentAudit,
                checkInHistory: newHistory,
                skipCount: newSkipCount,
                softBottleneckAdmissions: newAdmissions,
                nextCheckInDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
            }
        });

        setFlowState({ step: 'dashboard' });
    };

    const handleReAudit = () => {
        console.log('[Phase2] Re-audit requested');
        setFlowState({ step: 'lead_audit' });
    };

    // Render based on flow state
    if (flowState.step === 'fork') {
        return <StrategicFork onSelect={handleBucketSelect} />;
    }

    if (flowState.step === 'offer_intro') {
        return <OfferIntro onNext={handleOfferIntroComplete} />;
    }

    if (flowState.step === 'offer_inventory') {
        return <OfferInventoryScreen onNext={handleOfferInventoryComplete} />;
    }

    if (flowState.step === 'constraint_check') {
        return <ConstraintCheckScreen onComplete={handleConstraintCheckComplete} />;
    }

    if (flowState.step === 'primary_offer_selection') {
        return <PrimaryOfferSelectionScreen onComplete={handlePrimaryOfferSelected} />;
    }

    if (flowState.step === 'offer_qualitative') {
        return (
            <OfferQualitativeCheck
                onPass={handleQualitativePass}
                onFail={handleOfferFail}
            />
        );
    }

    if (flowState.step === 'offer_check') {
        return (
            <OfferHealthCheck
                onPass={handleOfferPass}
                onFail={handleOfferFail}
                onBuilderMode={handleBuilderMode}
            />
        );
    }

    if (flowState.step === 'offer_explanation') {
        return <OfferExplanationScreen onContinue={handleOfferExplanationComplete} />;
    }

    if (flowState.step === 'revenue_goal') {
        return <RevenueGoalScreen onNext={handleRevenueGoalComplete} />;
    }

    if (flowState.step === 'data_recap') {
        return (
            <DataRecapScreen
                onNext={handleDataRecapNext}
                onEditOffer={handleEditOffer}
                onEditGoal={handleEditGoal}
            />
        );
    }

    if (flowState.step === 'price_signal') {
        // Derive signal string from close rate (mock logic for now, or imported)
        const signal = flowState.closeRate >= 80 ? 'underpriced by 3-4x' : 'underpriced by 2-3x';

        return (
            <PriceSignalScreen
                priceSignal={signal}
                onTestPrice={handleTestPriceFirst}
                onAuditAnyway={handleAuditAnyway}
            />
        );
    }

    if (flowState.step === 'offer_fail') {
        const handleScenarioMode = () => {
            // AMENDMENT 2: Mark as Scenario Mode with assumed defaults
            updateContext({
                offerCheck: {
                    ...useBusinessStore.getState().context.offerCheck,
                    isScenarioMode: true,
                    assumedCloseRate: 30,
                    assumedMargin: 60
                }
            });
            console.log('[Scenario] User chose to run scenario with assumptions');
            setFlowState({ step: 'offer_explanation' });
        };

        return (
            <OfferFailScreen
                reason={flowState.reason}
                closeRate={flowState.closeRate}
                margin={flowState.margin}
                onBack={handleBackToHealthCheck}
                onDeepDiagnosis={() => setFlowState({
                    step: 'deep_diagnosis',
                    closeRate: flowState.closeRate,
                    margin: flowState.margin
                })}
                onScenarioMode={handleScenarioMode}
            />
        );
    }

    if (flowState.step === 'deep_diagnosis') {
        return (
            <DeepOfferDiagnosis
                onBack={() => setFlowState({
                    step: 'offer_fail',
                    reason: 'fail_both', // Use valid verdict
                    closeRate: flowState.closeRate,
                    margin: flowState.margin
                })}
                onComplete={handleOfferPass}
            />
        );
    }

    if (flowState.step === 'intake') {
        return <BusinessIntake onComplete={handleIntakeComplete} />;
    }

    if (flowState.step === 'waitlist') {
        return <WaitlistForm bucket={flowState.bucket} onBack={handleBackToFork} />;
    }

    // Pre-Revenue Choice Fork
    if (flowState.step === 'pre_revenue_choice') {
        return (
            <PreRevenueChoiceFork
                onRefineOffer={handleRefineOffer}
                onSkipToLeads={handleSkipToLeads}
            />
        );
    }

    if (flowState.step === 'pre_revenue_diagnosis') {
        return (
            <DeepOfferDiagnosis
                onBack={() => setFlowState({ step: 'pre_revenue_choice' })}
                onComplete={handlePreRevenueDiagnosisComplete}
            />
        );
    }

    // Phase 1: Lead Audit
    if (flowState.step === 'lead_audit') {
        return <CustomFunnelBuilder onComplete={handleLeadAuditComplete} />;
    }

    if (flowState.step === 'lead_verdict') {
        return (
            <VerdictScreen
                onAccept={handleVerdictComplete}
                onReview={handleReviewNumbers}
            />
        );
    }

    if (flowState.step === 'soft_probe') {
        return <BlockerAndPlanScreen onCommit={handlePlanCommit} />;
    }

    // Phase 2: Accountability
    if (flowState.step === 'commitment_gate') {
        return (
            <CommitmentGate
                bottleneck={flowState.verdict.bottleneck}
                onComplete={handleCommitmentComplete}
            />
        );
    }

    if (flowState.step === 'plan_ready') {
        return <PlanReadyScreen />;
    }

    if (flowState.step === 'dashboard') {
        const context = useBusinessStore.getState().context;
        const audit = context.leadAudit;
        const showNudge = context.skippedOfferDiagnosis && !context.offerCheck?.acknowledgedUnderpriced;

        const handleDashboardRefineOffer = () => {
            console.log('[Dashboard] User accepted nudge - going to Offer Diagnosis');
            setFlowState({ step: 'pre_revenue_diagnosis' });
        };

        const handleDismissNudge = () => {
            console.log('[Dashboard] User dismissed nudge');
            // Mark as acknowledged to avoid showing again
            updateContext({
                offerCheck: {
                    ...context.offerCheck,
                    acknowledgedUnderpriced: true, // Reuse this flag
                }
            });
        };

        return (
            <AccountabilityDashboard
                prescription={audit.prescription}
                checkInHistory={audit.checkInHistory}
                admissions={audit.softBottleneckAdmissions as SoftBottleneck[]}
                nextCheckInDate={audit.nextCheckInDate ? new Date(audit.nextCheckInDate) : null}
                skipCount={audit.skipCount}
                onCheckIn={handleCheckIn}
                onReAudit={handleReAudit}
                showOfferNudge={showNudge}
                onRefineOffer={handleDashboardRefineOffer}
                onDismissNudge={handleDismissNudge}
            />
        );
    }

    if (flowState.step === 'check_in') {
        const prescription = useBusinessStore.getState().context.leadAudit.prescription;
        if (!prescription) return null;

        return (
            <WeeklyCheckInForm
                prescription={prescription}
                onComplete={handleCheckInComplete}
            />
        );
    }

    return null;
};

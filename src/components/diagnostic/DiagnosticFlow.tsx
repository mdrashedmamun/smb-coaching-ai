import { useState } from 'react';
import { StrategicFork } from './StrategicFork';
import { OfferHealthCheck, type Phase0Verdict } from './OfferHealthCheck';
import { BusinessIntake } from './BusinessIntake';
import { WaitlistForm } from './WaitlistForm';
import { OfferFailScreen } from './OfferFailScreen';
import { useBusinessStore } from '../../store/useBusinessStore';
import type { BusinessBucket } from '../../lib/business_axes';

type FlowState =
    | { step: 'fork' }
    | { step: 'offer_check' }
    | { step: 'offer_fail'; reason: Phase0Verdict }
    | { step: 'intake' }
    | { step: 'waitlist'; bucket: Exclude<BusinessBucket, 'high_ticket_service'> };

interface DiagnosticFlowProps {
    onComplete: () => void;
}

/**
 * DiagnosticFlow orchestrates the Strategic Fork → Phase 0 → Intake/Waitlist flow.
 * 
 * Flow:
 * 1. Fork: User selects business type
 * 2. High-Ticket → Offer Health Check (Phase 0)
 *    2a. Pass → BusinessIntake
 *    2b. Warn → Optional proceed to BusinessIntake
 *    2c. Fail → OfferFailScreen (DEAD END - no intake access)
 * 3. Other business types → WaitlistForm (capture email)
 */
export const DiagnosticFlow = ({ onComplete }: DiagnosticFlowProps) => {
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
            // Go to Phase 0: Offer Health Check (NEW)
            setFlowState({ step: 'offer_check' });
        } else {
            // Go to waitlist
            setFlowState({ step: 'waitlist', bucket });
        }
    };

    const handleBackToFork = () => {
        setFlowState({ step: 'fork' });
    };

    // Phase 0 handlers
    const handleOfferPass = () => {
        console.log('[Phase0] PASS - proceeding to intake');
        setFlowState({ step: 'intake' });
    };

    const handleOfferWarn = () => {
        console.log('[Phase0] WARN (underpriced) - proceeding to intake with warning');
        setFlowState({ step: 'intake' });
    };

    const handleOfferFail = (reason: Phase0Verdict) => {
        console.log('[Phase0] FAIL - blocking access to intake', reason);
        setFlowState({ step: 'offer_fail', reason });
    };

    // Render based on flow state
    if (flowState.step === 'fork') {
        return <StrategicFork onSelect={handleBucketSelect} />;
    }

    if (flowState.step === 'offer_check') {
        return (
            <OfferHealthCheck
                onPass={handleOfferPass}
                onWarn={handleOfferWarn}
                onFail={handleOfferFail}
            />
        );
    }

    if (flowState.step === 'offer_fail') {
        return (
            <OfferFailScreen
                reason={flowState.reason}
                onBack={handleBackToFork}
            />
        );
    }

    if (flowState.step === 'intake') {
        return <BusinessIntake onComplete={onComplete} />;
    }

    if (flowState.step === 'waitlist') {
        return <WaitlistForm bucket={flowState.bucket} onBack={handleBackToFork} />;
    }

    return null;
};

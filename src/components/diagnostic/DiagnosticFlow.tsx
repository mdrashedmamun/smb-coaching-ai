import { useState } from 'react';
import { StrategicFork } from './StrategicFork';
import { BusinessIntake } from './BusinessIntake';
import { WaitlistForm } from './WaitlistForm';
import { useBusinessStore } from '../../store/useBusinessStore';
import type { BusinessBucket } from '../../lib/business_axes';

type FlowState =
    | { step: 'fork' }
    | { step: 'intake' }
    | { step: 'waitlist'; bucket: Exclude<BusinessBucket, 'high_ticket_service'> };

interface DiagnosticFlowProps {
    onComplete: () => void;
}

/**
 * DiagnosticFlow orchestrates the Strategic Fork → Intake/Waitlist flow.
 * 
 * Flow:
 * 1. Fork: User selects business type
 * 2a. High-Ticket → BusinessIntake (existing flow)
 * 2b. Other → WaitlistForm (capture email)
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
            // Go to the full intake flow
            setFlowState({ step: 'intake' });
        } else {
            // Go to waitlist
            setFlowState({ step: 'waitlist', bucket });
        }
    };

    const handleBackToFork = () => {
        setFlowState({ step: 'fork' });
    };

    if (flowState.step === 'fork') {
        return <StrategicFork onSelect={handleBucketSelect} />;
    }

    if (flowState.step === 'intake') {
        return <BusinessIntake onComplete={onComplete} />;
    }

    if (flowState.step === 'waitlist') {
        return <WaitlistForm bucket={flowState.bucket} onBack={handleBackToFork} />;
    }

    return null;
};

import { useState } from 'react'
import { OfferForm } from './OfferForm'
import { OfferResult } from './OfferResult'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { supabase } from '../../../lib/supabase'
import { ThinkingTerminal } from '../../shared/ThinkingTerminal'
import { AlertCircle } from 'lucide-react'

interface Module1Props {
    onBack: () => void
}

export function Module1({ onBack }: Module1Props) {
    const [view, setView] = useState<'form' | 'analyzing' | 'result' | 'error'>('form')
    const [errorMsg, setErrorMsg] = useState('')
    const [aiData, setAiData] = useState<any>(null)

    const { context, updateContext, completeModule } = useBusinessStore()

    const runAnalysis = async () => {
        setView('analyzing')
        setErrorMsg('')

        try {
            // Construct the full payload for the "Advisory Brain"
            const payload = {
                businessName: context.businessName,
                businessType: context.businessType,
                offerHeadline: context.offerHeadline,
                pricingModel: context.pricingModel,
                pricePoint: context.pricePoint,
                targetAudience: context.targetAudience,
                // Critical Context for Stage Logic
                revenue: context.vitals.revenue,
                goals: context.goals
            }

            console.log("Sending payload to analyze-offer:", payload)

            // === MOCK MODE: Simulating Full Edge Function Logic ===
            // Stage Classification
            let stage: 'Improvise' | 'Monetize' | 'Scale' = 'Monetize';
            if (payload.revenue === 0) stage = 'Improvise';
            else if (payload.revenue >= 100000) stage = 'Scale';

            // Scoring Engine (Universal Logic Map)
            // Stage 0 gets a base score of 60 (they are doing the right thing by exploring)
            let score = stage === 'Improvise' ? 60 : 0;
            const headline = payload.offerHeadline?.toLowerCase() || '';
            const audience = payload.targetAudience?.toLowerCase() || '';

            // Clarity: +20 for numbers, -20 for jargon
            if (/\d+\s*(days?|weeks?|months?|lbs?|kg|k|\$|%)/.test(headline)) score += 20;
            if (/holistic|synergy|comprehensive|solutions|empowering/.test(headline)) score -= 20;
            else score += 20; // No jargon bonus

            // Avatar: +30 for specific, 0 for vague (ONLY for Stage 1+)
            if (stage !== 'Improvise') {
                if (audience.length > 10 && !audience.includes('everyone')) score += 30;
            }

            // Pricing: Stage-dependent
            const price = payload.pricePoint || 0;
            if (stage === 'Improvise') {
                if (price === 0) score += 20; // Free is GOOD for Stage 0
            } else {
                if (price > 1000) score += 30;
                else if (price > 200) score += 15;
            }

            score = Math.max(0, Math.min(score, 100));

            // Persona & Critique Generation
            let critique = '';
            let improved_headline = `Help ${payload.targetAudience || 'Clients'} get [Specific Result] in 30 days without [Pain]`;
            let improved_pitch = `I help ${payload.targetAudience} achieve [Result] by [Mechanism].`;

            if (stage === 'Improvise') {
                critique = "You are in Stage 0 (Pre-Revenue). Stop building. Go find 5 people to serve for FREE today. Prove anyone actually cares.";
            } else if (score < 60) {
                critique = "Your offer is invisible. You are selling features, not results. No one wakes up wanting your 'service'. They want the outcome.";
            } else if (score < 80) {
                critique = "Your offer is safe but boring. You sound like everyone else. Why should I pick you over the cheaper option?";
            } else {
                critique = "Strong offer. Good pricing power. Now focus on delivery - can you actually fulfill this promise at scale?";
            }

            // Charity Mode Check
            const margin = payload.revenue > 0 ? (payload.goals?.revenue1Year || 0) / payload.revenue : 0;
            if (payload.revenue > 0 && margin < 0.1) {
                critique = "CHARITY MODE DETECTED: Your margins are too low. You are running a charity, not a business. Immediate pricing intervention needed. " + critique;
            }

            const data = { score, stage, critique, improved_headline, improved_pitch };
            // === END MOCK MODE ===

            setAiData(data)
            setView('result')
        } catch (e: any) {
            console.error("Analysis Failed", e)
            setErrorMsg(e.message || "The Advisory Brain is unreachable. Please try again.")
            setView('error')
        }
    }

    const handleComplete = () => {
        // Validation: Ensure we actually have data to save
        if (aiData) {
            updateContext({
                refinedHeadline: aiData.improved_headline,
                refinedPitch: aiData.improved_pitch,
                // We keep the original 'offerHeadline' as what the user typed initially
            })
            completeModule(1, aiData.score || 0)
        }
        onBack()
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Back to Dashboard
                </button>
                <span className="text-xs font-mono text-muted-foreground tracking-widest">THE OFFER INSPECTOR</span>
            </div>

            <div className="flex-1 p-8 border rounded-xl bg-card border-border overflow-y-auto">
                {view === 'form' && (
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-2xl font-bold mb-2">Let's check your Offer.</h1>
                        <p className="text-muted-foreground mb-8">
                            Most offers fail the "Grandmother Test". Paste your current pitch below.
                        </p>
                        <OfferForm onSubmit={runAnalysis} />
                    </div>
                )}

                {view === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <ThinkingTerminal steps={[
                            "Connecting to Coach AI...",
                            "Reading Brand Context...",
                            "Applying $100M Offers Framework...",
                            "Checking Pricing Elasticity...",
                            "Drafting Critique..."
                        ]} />
                    </div>
                )}

                {view === 'error' && (
                    <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
                        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                        <h3 className="text-xl font-bold mb-2">Analysis Failed</h3>
                        <p className="text-muted-foreground mb-6">{errorMsg}</p>
                        <button
                            onClick={() => setView('form')}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {view === 'result' && (
                    <OfferResult data={aiData} onContinue={handleComplete} />
                )}
            </div>
        </div>
    )
}

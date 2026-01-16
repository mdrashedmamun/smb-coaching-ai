import { useState } from 'react';
import { useBusinessStore, type HighTicketICP } from '../../store/useBusinessStore';
import { ArrowRight, Building2, Clock, ShieldAlert } from 'lucide-react';

interface HighTicketIntakeProps {
    onComplete: () => void;
}

export const HighTicketIntake = ({ onComplete }: HighTicketIntakeProps) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<Partial<HighTicketICP>>({});

    // Get primary offer to update
    const { context, updateOffer } = useBusinessStore();
    const primaryOfferId = context.primaryOfferId;

    const handleUpdate = (updates: Partial<HighTicketICP>) => {
        const newData = { ...data, ...updates };
        setData(newData);

        // If final step, save to store and complete
        if (Object.keys(newData).length === 3 && primaryOfferId) {
            updateOffer(primaryOfferId, {
                highTicketICP: newData as HighTicketICP
            });
            onComplete();
        } else {
            setStep(prev => prev + 1);
        }
    };

    if (!primaryOfferId) {
        // Fallback if no primary offer selected (should not happen)
        return <div className="p-8 text-center">No primary offer selected. <button onClick={onComplete} className="text-blue-500">Skip</button></div>;
    }

    // Question 1: Decision Authority
    if (step === 0) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">Who holds the power?</h2>
                    <p className="text-lg text-slate-600">
                        Understanding who you are selling to dictates your sales motion.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { id: 'founder', label: 'Founder / Owner', icon: Building2, desc: 'Single decision maker. Vision & speed driven.' },
                        { id: 'partner', label: 'Partner / Co-Founder', icon: Building2, desc: 'Requires consensus. Slower, relationship driven.' },
                        { id: 'committee', label: 'Buying Committee / Board', icon: Building2, desc: 'Requires business case & ROI proof. Logic driven.' },
                        { id: 'procurement', label: 'Procurement / RFP', icon: Building2, desc: 'Price & compliance driven. Process heavy.' }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleUpdate({ decisionAuthority: opt.id as any })}
                            className="p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left flex items-start gap-4 group"
                        >
                            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <opt.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 text-lg">{opt.label}</h3>
                                <p className="text-slate-500">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Question 2: Sales Cycle
    if (step === 1) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">How long to close?</h2>
                    <p className="text-lg text-slate-600">
                        From "first meeting" to "money in bank".
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { id: 'short_transactional', label: '< 14 Days (Transactional)', icon: Clock, desc: 'One or two calls. Fast pace.' },
                        { id: 'medium_consultative', label: '14 - 45 Days (Consultative)', icon: Clock, desc: 'Discovery, Proposal, Closing. Standard B2B.' },
                        { id: 'long_enterprise', label: '45+ Days (Enterprise)', icon: Clock, desc: 'Multiple stakeholders, nurture required.' }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleUpdate({ salesCycle: opt.id as any })}
                            className="p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left flex items-start gap-4 group"
                        >
                            <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                <opt.icon className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 text-lg">{opt.label}</h3>
                                <p className="text-slate-500">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Question 3: Risk Tolerance
    if (step === 2) {
        return (
            <div className="max-w-2xl mx-auto p-6 space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900">What is their risk profile?</h2>
                    <p className="text-lg text-slate-600">
                        This determines how aggressive your offer structure can be.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { id: 'low', label: 'Low Tolerance (Conservative)', icon: ShieldAlert, desc: 'Needs guarantees, case studies, and safety.' },
                        { id: 'medium', label: 'Medium Tolerance (Pragmatic)', icon: ShieldAlert, desc: 'Wants an upside but requires a clear plan.' },
                        { id: 'high', label: 'High Tolerance (Aggressive)', icon: ShieldAlert, desc: 'Wants speed and scale. Will pay for potential.' }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleUpdate({ riskTolerance: opt.id as any })}
                            className="p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left flex items-start gap-4 group"
                        >
                            <div className="p-3 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                                <opt.icon className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 text-lg">{opt.label}</h3>
                                <p className="text-slate-500">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

import { type Phase0Verdict } from './OfferHealthCheck';

interface OfferQualitativeCheckProps {
    onPass: () => void;
    onFail: (reason: Phase0Verdict) => void;
}

type Step = 'uesa' | 'target' | 'filters';

export const OfferQualitativeCheck = ({ onPass, onFail }: OfferQualitativeCheckProps) => {
    const [step, setStep] = useState<Step>('uesa');

    // UESA State
    const [uesa, setUesa] = useState({
        unique: false,
        expensive: false,
        sticky: false,
        air: false
    });

    // Target State (3Ps)
    const [targetType, setTargetType] = useState<'pain' | 'passion' | 'profession' | null>(null);

    // Buyer Filters State
    const [filters, setFilters] = useState({
        problem: false,
        money: false,
        urgency: false,
        authority: false
    });

    const handleUesaSubmit = () => {
        const allChecked = Object.values(uesa).every(Boolean);
        if (!allChecked) {
            onFail('fail_uesa');
        } else {
            setStep('target');
        }
    };

    const handleTargetSubmit = () => {
        if (!targetType) {
            onFail('fail_target'); // Should be disabled button, but safe guard
        } else {
            setStep('filters');
        }
    };

    const handleFiltersSubmit = () => {
        const allChecked = Object.values(filters).every(Boolean);
        if (!allChecked) {
            onFail('fail_filters');
        } else {
            onPass();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 text-white min-h-[700px]">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span className="text-indigo-400 text-sm font-medium">Phase 0: Sellability Check</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Is your offer built to scale?
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">
                    Before we look at metrics, we need to verify the physics of your offer.
                </p>
            </div>

            <AnimatePresence mode="wait">
                {step === 'uesa' && (
                    <motion.div
                        key="uesa"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-8"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-sm">1</span>
                                The UESA Framework
                            </h2>
                            <div className="space-y-4">
                                <Checkbox
                                    label="Unique"
                                    description="Can anyone else sell this easily? Or do you have a unique mechanism?"
                                    checked={uesa.unique}
                                    onChange={(c) => setUesa(s => ({ ...s, unique: c }))}
                                />
                                <Checkbox
                                    label="Expensive"
                                    description="Do you have high margin per unit? Can you charge a premium?"
                                    checked={uesa.expensive}
                                    onChange={(c) => setUesa(s => ({ ...s, expensive: c }))}
                                />
                                <Checkbox
                                    label="Sticky"
                                    description="Do customers keep buying or stay for a long time?"
                                    checked={uesa.sticky}
                                    onChange={(c) => setUesa(s => ({ ...s, sticky: c }))}
                                />
                                <Checkbox
                                    label="Air"
                                    description="Is the cost to deliver low? (High leverage)"
                                    checked={uesa.air}
                                    onChange={(c) => setUesa(s => ({ ...s, air: c }))}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleUesaSubmit}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                        >
                            Next: The Who
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {step === 'target' && (
                    <motion.div
                        key="target"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-8"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-sm">2</span>
                                The 3 Ps (Pick Your Target)
                            </h2>
                            <p className="text-gray-400 mb-6">Which of these best describes your connection to the offer?</p>

                            <div className="grid gap-4">
                                <RadioBox
                                    label="Pain"
                                    description="I overcame a painful problem and now help others do the same."
                                    selected={targetType === 'pain'}
                                    onClick={() => setTargetType('pain')}
                                />
                                <RadioBox
                                    label="Passion"
                                    description="I am deeply passionate about this topic and love teaching it."
                                    selected={targetType === 'passion'}
                                    onClick={() => setTargetType('passion')}
                                />
                                <RadioBox
                                    label="Profession"
                                    description="I have a professional skill I've honed for years."
                                    selected={targetType === 'profession'}
                                    onClick={() => setTargetType('profession')}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleTargetSubmit}
                            disabled={!targetType}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Next: Buyer Filters
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {step === 'filters' && (
                    <motion.div
                        key="filters"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-8"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-sm">3</span>
                                The 4 Buyer Filters
                            </h2>
                            <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-xl mb-6 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-200">
                                    Be honest. If your audience fails even one of these, you don't have a business.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <Checkbox
                                    label="Problem"
                                    description="Do they have a painful problem they know they need to solve?"
                                    checked={filters.problem}
                                    onChange={(c) => setFilters(s => ({ ...s, problem: c }))}
                                />
                                <Checkbox
                                    label="Money"
                                    description="Do they have the purchasing power to pay you?"
                                    checked={filters.money}
                                    onChange={(c) => setFilters(s => ({ ...s, money: c }))}
                                />
                                <Checkbox
                                    label="Urgency"
                                    description="Do they need this NOW, or is it a 'nice to have'?"
                                    checked={filters.urgency}
                                    onChange={(c) => setFilters(s => ({ ...s, urgency: c }))}
                                />
                                <Checkbox
                                    label="Authority"
                                    description="Can they make the buying decision alone?"
                                    checked={filters.authority}
                                    onChange={(c) => setFilters(s => ({ ...s, authority: c }))}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleFiltersSubmit}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                        >
                            Verify & Continue
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Checkbox = ({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: (c: boolean) => void }) => (
    <div
        onClick={() => onChange(!checked)}
        className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${checked ? 'bg-indigo-500/20 border-indigo-500' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
    >
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500'}`}>
            {checked && <CheckCircle2 className="w-4 h-4 text-white" />}
        </div>
        <div>
            <div className={`font-bold ${checked ? 'text-indigo-300' : 'text-gray-300'}`}>{label}</div>
            <div className="text-sm text-gray-400 mt-1">{description}</div>
        </div>
    </div>
);

const RadioBox = ({ label, description, selected, onClick }: { label: string, description: string, selected: boolean, onClick: () => void }) => (
    <div
        onClick={onClick}
        className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${selected ? 'bg-indigo-500/20 border-indigo-500' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
    >
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${selected ? 'border-indigo-500' : 'border-gray-500'}`}>
            {selected && <div className="w-3 h-3 rounded-full bg-indigo-500" />}
        </div>
        <div>
            <div className={`font-bold ${selected ? 'text-indigo-300' : 'text-gray-300'}`}>{label}</div>
            <div className="text-sm text-gray-400 mt-1">{description}</div>
        </div>
    </div>
);

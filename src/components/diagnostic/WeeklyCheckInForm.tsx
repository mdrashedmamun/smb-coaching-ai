import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, XCircle, MinusCircle, Clock, Zap, Eye, Flame, Brain } from 'lucide-react';
import type { SoftBottleneck, Prescription } from '../../lib/BottleneckEngine';

export type CheckInResult = 'yes' | 'partial' | 'no';

export interface CheckInData {
    result: CheckInResult;
    quantity?: number; // If partial
    blocker?: SoftBottleneck; // If no/partial
    notes?: string;
}

interface WeeklyCheckInFormProps {
    prescription: Prescription;
    onComplete: (data: CheckInData) => void;
}

const SOFT_BOTTLENECKS: { id: SoftBottleneck; label: string; icon: any }[] = [
    { id: 'time', label: 'Time', icon: Clock },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'attention', label: 'Attention', icon: Eye },
    { id: 'effort', label: 'Effort', icon: Flame },
    { id: 'belief', label: 'Belief', icon: Brain },
];

export const WeeklyCheckInForm = ({ prescription, onComplete }: WeeklyCheckInFormProps) => {
    const [step, setStep] = useState<'result' | 'blocker'>('result');
    const [result, setResult] = useState<CheckInResult | null>(null);
    const [partialQuantity, setPartialQuantity] = useState('');
    const [blocker, setBlocker] = useState<SoftBottleneck | null>(null);

    const handleResultSelect = (r: CheckInResult) => {
        setResult(r);
        if (r === 'yes') {
            onComplete({ result: 'yes' });
        } else {
            setStep('blocker');
        }
    };

    const handleBlockerSubmit = () => {
        if (!result || !blocker) return;
        onComplete({
            result,
            quantity: result === 'partial' ? parseInt(partialQuantity) || 0 : undefined,
            blocker,
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6 text-white min-h-[700px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
            >
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Weekly Check-In
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Your prescription was: <span className="text-white font-bold">{prescription.quantity} {prescription.action}</span>
                    </p>
                </div>

                {step === 'result' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold text-center">Did you do it?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => handleResultSelect('yes')}
                                className="p-6 rounded-2xl border border-green-500/30 bg-green-900/10 hover:bg-green-900/20 hover:border-green-500 transition-all flex flex-col items-center gap-3"
                            >
                                <CheckCircle2 className="w-10 h-10 text-green-400" />
                                <div className="text-green-400 font-bold text-lg">Yes, I did {prescription.quantity}+</div>
                            </button>

                            <button
                                onClick={() => handleResultSelect('partial')}
                                className="p-6 rounded-2xl border border-amber-500/30 bg-amber-900/10 hover:bg-amber-900/20 hover:border-amber-500 transition-all flex flex-col items-center gap-3"
                            >
                                <MinusCircle className="w-10 h-10 text-amber-400" />
                                <div className="text-amber-400 font-bold text-lg">Partially</div>
                            </button>

                            <button
                                onClick={() => handleResultSelect('no')}
                                className="p-6 rounded-2xl border border-red-500/30 bg-red-900/10 hover:bg-red-900/20 hover:border-red-500 transition-all flex flex-col items-center gap-3"
                            >
                                <XCircle className="w-10 h-10 text-red-400" />
                                <div className="text-red-400 font-bold text-lg">No</div>
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'blocker' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {result === 'partial' && (
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-300">How many did you actually do?</label>
                                <input
                                    type="number"
                                    value={partialQuantity}
                                    onChange={(e) => setPartialQuantity(e.target.value)}
                                    className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-amber-500 transition-all outline-none text-2xl font-mono"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">What got in the way?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {SOFT_BOTTLENECKS.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setBlocker(id)}
                                        className={`p-4 rounded-xl border transition-all flex items-center gap-3 text-left ${blocker === id
                                                ? 'bg-red-500/20 border-red-500'
                                                : 'bg-black/20 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${blocker === id ? 'text-red-400' : 'text-gray-400'}`} />
                                        <span className={blocker === id ? 'text-red-300 font-bold' : 'text-white'}>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleBlockerSubmit}
                            disabled={!blocker}
                            className="w-full py-4 bg-red-500 text-white rounded-xl font-bold text-lg hover:bg-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Submit Check-In
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

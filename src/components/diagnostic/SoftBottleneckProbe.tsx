import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Zap, Eye, Flame, Brain } from 'lucide-react';
import type { SoftBottleneck } from '../../lib/BottleneckEngine';

interface SoftBottleneckProbeProps {
    bottleneckAction: string; // e.g., "doing outreach"
    onComplete: (softBottleneck: SoftBottleneck) => void;
}

const SOFT_BOTTLENECKS: { id: SoftBottleneck; label: string; description: string; icon: any }[] = [
    { id: 'time', label: 'Time', description: "I don't have enough hours in the day", icon: Clock },
    { id: 'energy', label: 'Energy', description: "I'm burned out from fulfillment work", icon: Zap },
    { id: 'attention', label: 'Attention', description: "I get distracted by client fires", icon: Eye },
    { id: 'effort', label: 'Effort', description: "I know I should but I don't push myself", icon: Flame },
    { id: 'belief', label: 'Belief', description: "I don't think this works for my niche", icon: Brain },
];

export const SoftBottleneckProbe = ({ bottleneckAction, onComplete }: SoftBottleneckProbeProps) => {
    const [selected, setSelected] = useState<SoftBottleneck | null>(null);

    const handleSubmit = () => {
        if (selected) {
            console.log('[SoftBottleneckProbe] Admission:', selected);
            onComplete(selected);
        }
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
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                        <Brain className="w-8 h-8 text-amber-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Why aren't you {bottleneckAction}?
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Be honest. Your answer will help us give you the right advice.
                    </p>
                </div>

                {/* Options */}
                <div className="space-y-4">
                    {SOFT_BOTTLENECKS.map(({ id, label, description, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setSelected(id)}
                            className={`w-full flex items-start gap-4 p-5 rounded-2xl border transition-all text-left ${selected === id
                                    ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                                    : 'bg-black/20 border-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selected === id ? 'bg-amber-500/20' : 'bg-white/5'
                                }`}>
                                <Icon className={`w-6 h-6 ${selected === id ? 'text-amber-400' : 'text-gray-400'}`} />
                            </div>
                            <div>
                                <div className={`font-bold text-lg ${selected === id ? 'text-amber-300' : 'text-white'}`}>
                                    {label}
                                </div>
                                <div className="text-sm text-gray-400 mt-1">{description}</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!selected}
                    className="w-full py-4 bg-amber-500 text-black rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    See My Verdict
                    <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
};

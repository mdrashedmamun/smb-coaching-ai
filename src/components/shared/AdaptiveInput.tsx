import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronRight, Calculator } from 'lucide-react';
import { NapkinMath } from './NapkinMath';

interface AdaptiveInputProps {
    value: number | '';
    onChange: (val: number) => void;
    mode: 'percentage' | 'money_margin';
    placeholders: {
        input: string;
        iKnow: string;
        iDontKnow: string;
        napkin: {
            prompt: string;
            input1: string;
            input2?: string;
        };
        resultTemplate: (val: number) => string;
        tooltip: string;
    };
}

export const AdaptiveInput = ({ value, onChange, mode, placeholders }: AdaptiveInputProps) => {
    const [viewMode, setViewMode] = useState<'direct' | 'napkin' | null>(null);
    const [localResult, setLocalResult] = useState<number>(0);

    const handleResult = (res: number) => {
        setLocalResult(res);
        onChange(res);
    };

    return (
        <div className="space-y-6">
            {/* View Selection */}
            {!viewMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setViewMode('direct')}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left group"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{placeholders.iKnow}</span>
                            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                        <p className="text-sm text-gray-400">Enter the exact number directly.</p>
                    </button>

                    <button
                        onClick={() => setViewMode('napkin')}
                        className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all text-left group"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-400 font-medium">{placeholders.iDontKnow}</span>
                            <Calculator className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-sm text-blue-300/70">We'll help you calculate it.</p>
                    </button>
                </div>
            )}

            {/* Direct Input Mode */}
            {viewMode === 'direct' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <div className="relative">
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-12 text-3xl font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-700"
                            placeholder={placeholders.input}
                            autoFocus
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-medium">
                            %
                        </span>
                    </div>
                </motion.div>
            )}

            {/* Napkin Math Mode */}
            {viewMode === 'napkin' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <NapkinMath
                        mode={mode === 'percentage' ? 'simple' : 'money'}
                        onCalculate={handleResult}
                        labels={placeholders.napkin}
                    />

                    {/* Live Result Preview */}
                    <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                        <span className="text-emerald-400 font-medium">
                            {placeholders.resultTemplate(localResult)}
                        </span>
                    </div>
                </motion.div>
            )}

            {/* Reset / Back */}
            {viewMode && (
                <button
                    onClick={() => setViewMode(null)}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 mx-auto"
                >
                    Switch Method
                </button>
            )}
        </div>
    );
};

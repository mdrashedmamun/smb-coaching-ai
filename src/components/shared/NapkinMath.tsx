import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign } from 'lucide-react';

interface NapkinMathProps {
    mode: 'simple' | 'money';
    onCalculate: (result: number) => void;
    labels: {
        prompt: string;
        input1: string;
        input2?: string;
    };
}

export const NapkinMath = ({ mode, onCalculate, labels }: NapkinMathProps) => {
    // simple mode state
    const [count, setCount] = useState<number>(0);

    // money mode state
    const [price, setPrice] = useState<string>('');
    const [cost, setCost] = useState<string>('');

    useEffect(() => {
        if (mode === 'simple') {
            const percentage = Math.round((count / 10) * 100);
            onCalculate(percentage);
        } else {
            const p = parseFloat(price) || 0;
            const c = parseFloat(cost) || 0;
            if (p > 0) {
                const margin = Math.round(((p - c) / p) * 100);
                onCalculate(Math.max(0, margin));
            }
        }
    }, [count, price, cost, mode, onCalculate]);

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4 overflow-hidden"
        >
            <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Calculator className="w-4 h-4" />
                <span className="text-sm font-medium">{labels.prompt}</span>
            </div>

            {mode === 'simple' && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-300">{labels.input1}</p>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xl font-bold text-blue-400">
                            {count}
                        </div>
                    </div>
                </div>
            )}

            {mode === 'money' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">{labels.input1}</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">{labels.input2}</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="number"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { useBusinessStore } from '../../store/useBusinessStore';

interface SellingStatusScreenProps {
    onComplete: () => void;
}

export const SellingStatusScreen = ({ onComplete }: SellingStatusScreenProps) => {
    const setSellingStatus = useBusinessStore((state) => state.setSellingStatus);

    const handleSelect = (status: 'selling' | 'pre_revenue') => {
        setSellingStatus(status);
        onComplete();
    };

    return (
        <div className="max-w-3xl mx-auto p-6 text-white min-h-[600px] flex flex-col justify-center">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/70 border border-slate-800 text-slate-300 text-xs font-semibold tracking-widest uppercase">
                        Starting Line
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Are you currently selling this already?
                    </h1>
                    <p className="text-lg text-slate-400">
                        We use this to anchor your revenue gap to real numbers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => handleSelect('selling')}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-left transition-all hover:border-indigo-500 hover:bg-slate-900"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-white">Yes, already selling</span>
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        </div>
                        <p className="mt-2 text-sm text-slate-400">
                            We'll ask for your current monthly average.
                        </p>
                    </button>

                    <button
                        onClick={() => handleSelect('pre_revenue')}
                        className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-left transition-all hover:border-indigo-500 hover:bg-slate-900"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-white">Not yet</span>
                            <Circle className="h-5 w-5 text-slate-500" />
                        </div>
                        <p className="mt-2 text-sm text-slate-400">
                            We'll treat current revenue as zero and focus on your first target.
                        </p>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

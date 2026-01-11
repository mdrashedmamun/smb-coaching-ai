import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBusinessStore, type CustomerSegment, type OperatingMood } from '../../store/useBusinessStore';
import { ArrowRight, ArrowLeft, Building2, TrendingUp, Users, User, Plus, Trash2, CheckCircle2, Target } from 'lucide-react';

const STEPS = [
    { id: 'identity', title: 'Business Identity', icon: Building2, bucket: 'Current State' },
    { id: 'vitals', title: 'Financial Vitals', icon: TrendingUp, bucket: 'Current State' },
    { id: 'segments', title: 'Customer Segments', icon: Users, bucket: 'Current State' },
    { id: 'founder', title: 'Founder Context', icon: User, bucket: 'Current State' },
    { id: 'goals', title: 'The North Star', icon: Target, bucket: 'Future Goal' },
];

export const BusinessIntake = ({ onComplete }: { onComplete: () => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { context, updateContext, updateVitals, addSegment, removeSegment, updateFounder, updateGoals, syncToSupabase } = useBusinessStore();

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsSubmitting(true);
            try {
                await syncToSupabase();
                // Artificial delay for "Thinking" effect
                await new Promise(resolve => setTimeout(resolve, 800));
                onComplete();
            } catch (error) {
                console.error("Sync failed:", error);
                onComplete();
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-white min-h-[800px]">
            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between relative px-2">
                    {/* Track */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 rounded-full" />
                    {/* Progress Fill */}
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -z-10 rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    />

                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-3">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${isActive
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-110'
                                        : isCompleted
                                            ? 'bg-blue-950 border-blue-900 text-blue-400'
                                            : 'bg-black/40 border-white/10 text-gray-600'
                                        }`}
                                >
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`text-xs font-medium tracking-wide uppercase ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Card (Glassmorphism) */}
            <div className="min-h-[500px] relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] -z-10" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl min-h-[500px]"
                    >
                        {currentStep === 0 && (
                            <StepIdentity type={context.businessType} name={context.businessName} onUpdate={updateContext} />
                        )}
                        {currentStep === 1 && (
                            <StepVitals vitals={context.vitals} onUpdate={updateVitals} />
                        )}
                        {currentStep === 2 && (
                            <StepSegments segments={context.segments} onAdd={addSegment} onRemove={removeSegment} />
                        )}
                        {currentStep === 3 && (
                            <StepFounder founder={context.founder} onUpdate={updateFounder} />
                        )}
                        {currentStep === 4 && (
                            <StepGoals goals={context.goals} onUpdate={updateGoals} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex justify-between items-center">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${currentStep === 0
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-[transform,colors] hover:scale-[1.02] shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-wait"
                >
                    {isSubmitting ? 'Analyzing...' : currentStep === STEPS.length - 1 ? 'Analyze Business' : 'Continue'}
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};

// --- Sub-Components (Premium Dark Mode) ---

const StepIdentity = ({ name, onUpdate }: any) => {
    return (
        <div className="space-y-10">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight">Let's make it official 🤝</h2>
                <p className="text-gray-400 mt-3 text-lg">What do you call this venture?</p>
            </div>

            <div className="space-y-4 max-w-lg mx-auto">
                <label className="block text-sm font-medium text-gray-300 ml-1">Business Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onUpdate({ businessName: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-lg"
                    placeholder="e.g. Acme Inc."
                />
            </div>
        </div>
    );
};

const StepVitals = ({ vitals, onUpdate }: any) => {
    const [knowsNumbers, setKnowsNumbers] = useState<boolean | null>(null);
    const [acceptedEstimate, setAcceptedEstimate] = useState(false);

    // Live Calculator logic (Path B)
    const calculateMetrics = (updates: any) => {
        const newVitals = { ...vitals, ...updates };
        const revenue = newVitals.revenue || 0;
        const cogs = newVitals.cogs || 0;
        const opex = newVitals.opex || 0;
        const grossProfit = revenue - cogs;
        const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        const netProfit = grossProfit - opex;
        const currentClients = newVitals.currentClients || 0;
        const maxCapacity = newVitals.maxCapacity || 1;
        const utilization = (currentClients / maxCapacity) * 100;

        onUpdate({
            ...updates,
            grossMargin: Number(grossMargin.toFixed(1)),
            netProfit: netProfit,
            utilization: Number(Math.min(utilization, 100).toFixed(0))
        });
    };

    // Fork Question (Initial View)
    if (knowsNumbers === null) {
        return (
            <div className="space-y-10 max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight">The Doctor's Check 🩺</h2>
                    <p className="text-gray-400 mt-3 text-lg">We need your real numbers to diagnose properly.</p>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-2xl p-8 space-y-6">
                    <p className="text-white text-lg font-medium text-center">
                        Did you calculate these numbers in the last 30 days?
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setKnowsNumbers(true)}
                            className="p-6 rounded-xl border border-white/10 bg-black/20 hover:border-green-500/50 hover:bg-green-900/10 transition-all text-left"
                        >
                            <div className="text-green-400 font-bold text-lg">Yes, I have them</div>
                            <div className="text-gray-500 text-sm mt-1">Written down or in a spreadsheet.</div>
                        </button>
                        <button
                            onClick={() => setKnowsNumbers(false)}
                            className="p-6 rounded-xl border border-white/10 bg-black/20 hover:border-blue-500/50 hover:bg-blue-900/10 transition-all text-left"
                        >
                            <div className="text-blue-400 font-bold text-lg">No, help me calculate</div>
                            <div className="text-gray-500 text-sm mt-1">I'll give you the raw numbers.</div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Path A: Static Inputs + Checkbox
    if (knowsNumbers === true) {
        return (
            <div className="space-y-8 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight">The Doctor's Check 🩺</h2>
                    <p className="text-gray-400 mt-3 text-lg">Enter your verified numbers below.</p>
                </div>

                {/* Warning Banner */}
                <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                    <div className="text-red-400 mt-0.5">⚠️</div>
                    <div className="text-sm text-red-200">
                        <span className="font-bold">Warning:</span> Guessing will give a false diagnosis. If you don't know, go back and calculate first.
                    </div>
                </div>

                <div className="grid gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Total client payments (last 12mo)</label>
                        <input
                            type="number"
                            value={vitals.revenue || ''}
                            onChange={(e) => onUpdate({ revenue: Number(e.target.value) })}
                            className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 transition-all outline-none text-2xl font-mono"
                            placeholder="1000000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">What landed in your pocket? (Net Profit)</label>
                        <input
                            type="number"
                            value={vitals.netProfit || ''}
                            onChange={(e) => onUpdate({ netProfit: Number(e.target.value) })}
                            className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 transition-all outline-none text-lg font-mono"
                            placeholder="150000"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">After delivery costs, what % is left?</label>
                            <p className="text-xs text-gray-500 mb-2">E.g., $10k sale - $4k cost = 60%.</p>
                            <input
                                type="number"
                                value={vitals.grossMargin || ''}
                                onChange={(e) => onUpdate({ grossMargin: Number(e.target.value) })}
                                className={`w-full px-5 py-4 rounded-xl bg-black/20 border text-white placeholder-gray-600 transition-all outline-none text-lg font-mono ${vitals.grossMargin > 0 && vitals.grossMargin < 30 ? 'border-red-500/50' : 'border-white/10'}`}
                                placeholder="60"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">How full is your calendar?</label>
                            <p className="text-xs text-gray-500 mb-2">10 slots, 5 used = 50%.</p>
                            <input
                                type="number"
                                value={vitals.utilization || ''}
                                onChange={(e) => onUpdate({ utilization: Number(e.target.value) })}
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 transition-all outline-none text-lg font-mono"
                                placeholder="50"
                            />
                        </div>
                    </div>
                </div>

                {/* Irreversibility Checkbox */}
                <label className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:border-blue-500/30 transition-all">
                    <input
                        type="checkbox"
                        checked={acceptedEstimate}
                        onChange={(e) => setAcceptedEstimate(e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded border-white/20 bg-black/40 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">
                        These numbers are estimates. I accept my diagnosis may be wrong.
                    </span>
                </label>

                <button
                    onClick={() => setKnowsNumbers(null)}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                    ← Go back and use the calculator instead
                </button>
            </div>
        );
    }

    // Path B: Live Calculator
    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">The Doctor's Check 🩺</h2>
                <p className="text-gray-400 mt-3 text-lg">We'll calculate your metrics from raw numbers.</p>
            </div>

            {/* Money Health */}
            <div className="bg-black/20 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Money Health
                </h3>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Total client payments (last 12mo)</label>
                    <input
                        type="number"
                        value={vitals.revenue || ''}
                        onChange={(e) => calculateMetrics({ revenue: Number(e.target.value) })}
                        className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 transition-all outline-none text-2xl font-mono"
                        placeholder="1000000"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Cost to deliver (labor, contractors)</label>
                        <input
                            type="number"
                            value={vitals.cogs || ''}
                            onChange={(e) => calculateMetrics({ cogs: Number(e.target.value) })}
                            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none text-lg font-mono"
                            placeholder="400000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Fixed monthly costs (rent, software)</label>
                        <input
                            type="number"
                            value={vitals.opex || ''}
                            onChange={(e) => calculateMetrics({ opex: Number(e.target.value) })}
                            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none text-lg font-mono"
                            placeholder="200000"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className={`p-4 rounded-xl border ${vitals.grossMargin > 0 && vitals.grossMargin < 30 ? 'bg-red-900/10 border-red-500/30' : 'bg-green-900/10 border-green-500/30'}`}>
                        <div className="text-xs text-gray-400">Gross Margin</div>
                        <div className={`text-2xl font-bold font-mono ${vitals.grossMargin < 30 ? 'text-red-400' : 'text-green-400'}`}>{vitals.grossMargin || 0}%</div>
                    </div>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                        <div className="text-xs text-gray-400">Net Profit</div>
                        <div className="text-2xl font-bold font-mono text-white">${(vitals.netProfit || 0).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Capacity Health */}
            <div className="bg-black/20 border border-white/10 rounded-2xl p-6 space-y-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-4 h-4" /> Capacity Health
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Active clients right now</label>
                        <input
                            type="number"
                            value={vitals.currentClients || ''}
                            onChange={(e) => calculateMetrics({ currentClients: Number(e.target.value) })}
                            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none text-lg font-mono"
                            placeholder="10"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Max before quality drops</label>
                        <input
                            type="number"
                            value={vitals.maxCapacity || ''}
                            onChange={(e) => calculateMetrics({ maxCapacity: Number(e.target.value) })}
                            className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none text-lg font-mono"
                            placeholder="20"
                        />
                    </div>
                </div>
                <div className="relative pt-2">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-400">Utilization</label>
                        <span className={`text-xl font-bold font-mono ${vitals.utilization > 85 ? 'text-red-400' : 'text-blue-400'}`}>{vitals.utilization || 0}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${vitals.utilization > 85 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${vitals.utilization || 0}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Empty (Money Left)</span>
                        <span>Full (Burnout Risk)</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setKnowsNumbers(null)}
                className="text-sm text-gray-500 hover:text-white transition-colors"
            >
                ← Go back and enter numbers directly
            </button>
        </div>
    );
};



const StepSegments = ({ segments, onAdd, onRemove }: any) => {
    const [newSegment, setNewSegment] = useState({ name: '', pricePoint: '', count: '' });

    const handleAdd = () => {
        if (newSegment.name && newSegment.pricePoint) {
            onAdd({
                name: newSegment.name,
                pricePoint: Number(newSegment.pricePoint),
                count: Number(newSegment.count) || 0,
                billingFrequency: 'one-time'
            });
            setNewSegment({ name: '', pricePoint: '', count: '' });
        }
    };

    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white tracking-tight">Who pays you? 👥</h2>
                <p className="text-gray-400 mt-3 text-lg">Group clients by what you sell or what you charge.</p>
            </div>

            <div className="bg-black/20 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Add Segment</h3>
                <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-12 sm:col-span-5">
                        <label className="text-xs text-gray-500 block mb-1 ml-1">Name</label>
                        <p className="text-[10px] text-gray-600 mb-1.5 ml-1 uppercase tracking-tight">Different work or different price</p>
                        <input
                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm placeholder-gray-600 focus:border-blue-500 outline-none"
                            placeholder="e.g. Premium Coaching"
                            value={newSegment.name}
                            onChange={e => setNewSegment({ ...newSegment, name: e.target.value })}
                        />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                        <label className="text-xs text-gray-500 block mb-1.5 ml-1">Price ($)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm placeholder-gray-600 focus:border-blue-500 outline-none"
                            placeholder="5000"
                            value={newSegment.pricePoint}
                            onChange={e => setNewSegment({ ...newSegment, pricePoint: e.target.value })}
                        />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label className="text-xs text-gray-500 block mb-1.5 ml-1">How many right now?</label>
                        <input
                            type="number"
                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm placeholder-gray-600 focus:border-blue-500 outline-none"
                            placeholder="5"
                            title="Active clients you're serving today"
                            value={newSegment.count}
                            onChange={e => setNewSegment({ ...newSegment, count: e.target.value })}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-2">
                        <button
                            onClick={handleAdd}
                            disabled={!newSegment.name}
                            className="w-full py-3 bg-white text-black rounded-lg text-sm font-bold flex items-center justify-center hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {segments.map((s: CustomerSegment) => (
                    <div key={s.id} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                        <div>
                            <div className="font-semibold text-white text-lg">{s.name}</div>
                            <div className="text-sm text-gray-400 font-mono mt-1">${s.pricePoint} • {s.count} clients</div>
                        </div>
                        <button
                            onClick={() => onRemove(s.id)}
                            className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                {segments.length === 0 && (
                    <div className="text-center py-12 text-gray-600 text-sm border-2 border-dashed border-white/5 rounded-2xl">
                        No segments added yet.
                    </div>
                )}
            </div>
        </div>
    );
};

const StepFounder = ({ founder, onUpdate }: any) => {
    const moods: { id: OperatingMood; label: string; desc: string }[] = [
        { id: 'scrambling', label: 'Scrambling', desc: 'Too much work, not enough profit' },
        { id: 'plateaued', label: 'Plateaued', desc: "Steady but I've stopped growing" },
        { id: 'burnout', label: 'Burnout', desc: 'Exhausted and ready to quit' },
        { id: 'scaling', label: 'Scaling', desc: 'Machine works, just need more fuel' }
    ];

    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight">Last check: The Founder 🧠</h2>
                <p className="text-gray-400 mt-3 text-lg">Your context changes the strategy.</p>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Hours spent inside the business each week</label>
                    <p className="text-xs text-gray-500 mb-2 ml-1">Selling, delivering, fixing, managing.</p>
                    <input
                        type="number"
                        value={founder.hoursPerWeek || ''}
                        onChange={(e) => onUpdate({ hoursPerWeek: Number(e.target.value) })}
                        className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                        placeholder="e.g. 60"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Runway (Months of Cash)</label>
                    <p className="text-xs text-gray-500 mb-2 ml-1">How many months can you survive if sales stop today?</p>
                    <input
                        type="number"
                        value={founder.runwayMonths || ''}
                        onChange={(e) => onUpdate({ runwayMonths: Number(e.target.value) })}
                        className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                        placeholder="e.g. 6"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">How long have you been building this business?</label>
                    <p className="text-xs text-gray-500 mb-2 ml-1">Years working on this business, not your career.</p>
                    <input
                        type="number"
                        value={founder.yearsExperience || ''}
                        onChange={(e) => onUpdate({ yearsExperience: Number(e.target.value) })}
                        className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                        placeholder="e.g. 5"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3 ml-1">Current Operating Mood</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {moods.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => onUpdate({ operatingMood: m.id })}
                                className={`p-4 rounded-xl border text-left transition-all ${founder.operatingMood === m.id
                                    ? 'border-blue-500 bg-blue-900/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                                    : 'border-white/5 bg-black/20 hover:border-white/10'
                                    }`}
                            >
                                <div className={`font-bold ${founder.operatingMood === m.id ? 'text-blue-400' : 'text-white'}`}>
                                    {m.label}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{m.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StepGoals = ({ goals, onUpdate }: any) => {
    return (
        <div className="space-y-10 max-w-2xl mx-auto pb-10">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight">The North Star 🌟</h2>
                <p className="text-gray-400 mt-3 text-lg">Where is this ship heading?</p>
            </div>

            <div className="space-y-10">
                {/* Section 1: Financial Targets */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest ml-1">Financial Targets</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 ml-1">90 Day Target ($)</label>
                            <input
                                type="number"
                                value={goals.revenue90Day || ''}
                                onChange={(e) => onUpdate({ revenue90Day: Number(e.target.value) })}
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                                placeholder="e.g. 250000"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 ml-1">180 Day Target ($)</label>
                            <input
                                type="number"
                                value={goals.revenue180Day || ''}
                                onChange={(e) => onUpdate({ revenue180Day: Number(e.target.value) })}
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                                placeholder="e.g. 500000"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 ml-1">1 Year Target ($)</label>
                            <input
                                type="number"
                                value={goals.revenue1Year || ''}
                                onChange={(e) => onUpdate({ revenue1Year: Number(e.target.value) })}
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                                placeholder="e.g. 1000000"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Operational Shifts */}
                <div className="space-y-6 pt-4 border-t border-white/5">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest ml-1">Operational Shifts</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">One Operational Change I Need</label>
                            <p className="text-xs text-gray-500 mb-2 ml-1">Hiring, delegation, systems, or removing yourself.</p>
                            <input
                                type="text"
                                value={goals.operationalChange || ''}
                                onChange={(e) => onUpdate({ operationalChange: e.target.value })}
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                                placeholder="e.g. Hire a dedicated sales rep"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">One Structural Fix I’m Avoiding</label>
                            <p className="text-xs text-gray-500 mb-2 ml-1">Usually the one that creates the most friction.</p>
                            <input
                                type="text"
                                value={goals.structuralFix || ''}
                                onChange={(e) => onUpdate({ structuralFix: e.target.value })}
                                className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                                placeholder="e.g. Firing the underperforming manager"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: The Bottleneck */}
                <div className="space-y-6 pt-4 border-t border-white/5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Primary Constraint</label>
                        <p className="text-xs text-gray-500 mb-3 ml-1">What is breaking the most right now?</p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'leads', label: 'Not enough Leads', desc: 'Top of funnel is quiet' },
                                { id: 'sales', label: 'Low Sales Conversion', desc: 'Leads not buying' },
                                { id: 'fulfillment', label: 'Operations / Delivery', desc: 'Too busy to sell' },
                                { id: 'churn', label: 'Churn / Retention', desc: 'Losing customers fast' }
                            ].map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => onUpdate({ primaryConstraint: c.id })}
                                    className={`p-4 rounded-xl border text-left transition-all ${goals.primaryConstraint === c.id
                                        ? 'border-blue-500 bg-blue-900/20'
                                        : 'border-white/5 bg-black/20 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`font-medium ${goals.primaryConstraint === c.id ? 'text-blue-400' : 'text-white'}`}>
                                        {c.label}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{c.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">What’s making this constraint worse?</label>
                        <p className="text-xs text-gray-500 mb-2 ml-1">Facts, not feelings. One or two sentences.</p>
                        <textarea
                            value={goals.constraintMetadata || ''}
                            onChange={(e) => onUpdate({ constraintMetadata: e.target.value })}
                            className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none h-24 resize-none"
                            placeholder="e.g. Google Ads costs doubled this month."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};


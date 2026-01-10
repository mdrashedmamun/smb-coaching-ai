import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBusinessStore, type CustomerSegment } from '../../store/useBusinessStore';
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
    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight">The Doctor's Check 🩺</h2>
                <p className="text-gray-400 mt-3 text-lg">We need your real numbers to diagnose properly.</p>
            </div>

            <div className="grid gap-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Annual Revenue ($)</label>
                    <input
                        type="number"
                        value={vitals.revenue || ''}
                        onChange={(e) => onUpdate({ revenue: Number(e.target.value) })}
                        className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all outline-none text-2xl font-mono"
                        placeholder="1000000"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Net Profit ($)</label>
                        <input
                            type="number"
                            value={vitals.netProfit || ''}
                            onChange={(e) => onUpdate({ netProfit: Number(e.target.value) })}
                            className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 transition-all outline-none text-lg font-mono"
                            placeholder="150000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Gross Margin (%)</label>
                        <input
                            type="number"
                            value={vitals.grossMargin || ''}
                            onChange={(e) => onUpdate({ grossMargin: Number(e.target.value) })}
                            className={`w-full px-5 py-4 rounded-xl bg-black/20 border text-white placeholder-gray-600 transition-all outline-none text-lg font-mono ${vitals.grossMargin > 0 && vitals.grossMargin < 30
                                ? 'border-red-500/50 focus:border-red-500 text-red-200'
                                : 'border-white/10 focus:border-blue-500'
                                }`}
                            placeholder="40"
                        />
                        {vitals.grossMargin > 0 && vitals.grossMargin < 30 && (
                            <p className="text-xs text-red-400 mt-2 font-medium flex items-center gap-1">
                                ⚠️ Margins below 30% are dangerous.
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-300">Capacity Utilization</label>
                        <span className="text-blue-400 font-mono text-lg">{vitals.utilization}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={vitals.utilization || 0}
                        onChange={(e) => onUpdate({ utilization: Number(e.target.value) })}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                        <span>Empty (0%)</span>
                        <span>Full (100%)</span>
                    </div>
                </div>
            </div>
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
                <p className="text-gray-400 mt-3 text-lg">List your different customer types.</p>
            </div>

            <div className="bg-black/20 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Add Segment</h3>
                <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-12 sm:col-span-5">
                        <label className="text-xs text-gray-500 block mb-1.5 ml-1">Name</label>
                        <input
                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm placeholder-gray-600 focus:border-blue-500 outline-none"
                            placeholder="e.g. HOA Contracts"
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
                        <label className="text-xs text-gray-500 block mb-1.5 ml-1">Count</label>
                        <input
                            type="number"
                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white text-sm placeholder-gray-600 focus:border-blue-500 outline-none"
                            placeholder="10"
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
    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight">Last check: The Founder 🧠</h2>
                <p className="text-gray-400 mt-3 text-lg">Your context changes the strategy.</p>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Hours worked per week</label>
                    <input
                        type="number"
                        value={founder.hoursPerWeek || ''}
                        onChange={(e) => onUpdate({ hoursPerWeek: Number(e.target.value) })}
                        className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                        placeholder="e.g. 60"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Runway (Months of Cash)</label>
                    <input
                        type="number"
                        value={founder.runwayMonths || ''}
                        onChange={(e) => onUpdate({ runwayMonths: Number(e.target.value) })}
                        className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                        placeholder="e.g. 6"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Years of Experience</label>
                    <input
                        type="number"
                        value={founder.yearsExperience || ''}
                        onChange={(e) => onUpdate({ yearsExperience: Number(e.target.value) })}
                        className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                        placeholder="e.g. 5"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">Current "Emotional Driver"</label>
                    <p className="text-xs text-gray-500 mb-3 ml-1">e.g. "Baby on the way", "Just quit job", "Burnout", "Bored"</p>
                    <textarea
                        value={founder.emotionalDrivers || ''}
                        onChange={(e) => onUpdate({ emotionalDrivers: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none h-32 resize-none"
                        placeholder="What is keeping you up at night?"
                    />
                </div>
            </div>
        </div>
    );
};

const StepGoals = ({ goals, onUpdate }: any) => {
    return (
        <div className="space-y-10 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight">The North Star 🌟</h2>
                <p className="text-gray-400 mt-3 text-lg">Where is this ship heading?</p>
            </div>

            <div className="space-y-8">
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">90 Day Target ($)</label>
                        <input
                            type="number"
                            value={goals.revenue90Day || ''}
                            onChange={(e) => onUpdate({ revenue90Day: Number(e.target.value) })}
                            className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                            placeholder="e.g. 250000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">180 Day Target ($)</label>
                        <input
                            type="number"
                            value={goals.revenue180Day || ''}
                            onChange={(e) => onUpdate({ revenue180Day: Number(e.target.value) })}
                            className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                            placeholder="e.g. 500000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">1 Year Target ($)</label>
                        <input
                            type="number"
                            value={goals.revenue1Year || ''}
                            onChange={(e) => onUpdate({ revenue1Year: Number(e.target.value) })}
                            className="w-full px-5 py-4 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 transition-all outline-none"
                            placeholder="e.g. 1000000"
                        />
                    </div>
                </div>

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
            </div>
        </div>
    );
};


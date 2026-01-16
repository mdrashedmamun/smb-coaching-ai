/**
 * CACPaybackScreen.tsx
 * 
 * Phase 2: CAC Payback Period input and calculation.
 * 
 * UI Pattern: Guided conversation
 * - One input per screen
 * - Lead with conclusions
 * - Assumptions visible by default
 * 
 * FIX 2: No silent defaults. All values user-provided.
 * FIX 3: CAC explicitly per-customer. UI clarifies this.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp, Users } from 'lucide-react';
import {
    calculateCACPayback,
    getCACPaybackMessage,
    convertMonthlytoCACPerCustomer,
    type CACInputsPerCustomer,
    type CACInputsMonthly,
    type AssumptionSource
} from '../../lib/CACPaybackCalculator';
import { calculateUnitEconomics } from '../../lib/UnitEconomicsEngine';
import { useBusinessStore, type ScenarioSource } from '../../store/useBusinessStore';

interface CACPaybackScreenProps {
    onComplete: () => void;
}

// FIX 3: User chooses how to enter CAC data
type InputMode = 'per_deal' | 'monthly';
type Step = 'intro' | 'mode_choice' | 'customers_per_month' | 'adSpend' | 'contentCost' | 'salesCommission' | 'salaryAllocation' | 'toolsCost' | 'retention' | 'result';

export const CACPaybackScreen = ({ onComplete }: CACPaybackScreenProps) => {
    const [step, setStep] = useState<Step>('intro');
    const [inputMode, setInputMode] = useState<InputMode>('per_deal');
    const [customersPerMonth, setCustomersPerMonth] = useState<number>(1);

    // Store inputs (labels change based on mode but structure same)
    const [adSpend, setAdSpend] = useState<number>(0);
    const [contentCost, setContentCost] = useState<number>(0);
    const [salesCommission, setSalesCommission] = useState<number>(0);
    const [salaryAllocation, setSalaryAllocation] = useState<number>(0);
    const [toolsCost, setToolsCost] = useState<number>(0);
    const [retention, setRetention] = useState<number>(1);
    const [retentionSource, setRetentionSource] = useState<AssumptionSource>('user_estimate');

    const [showMathDetails, setShowMathDetails] = useState(false);
    const [currentValue, setCurrentValue] = useState<number | ''>('');

    const { context, setCACInputs, setUnitEconomics, setAssumptionField, clearAssumptionField, setPhysicsPhase } = useBusinessStore();

    // Get primary offer for calculations
    const primaryOffer = context.offers.find(o => o.id === context.primaryOfferId);
    const offerPrice = primaryOffer?.price || context.pricePoint || 5000;
    const offerMargin = primaryOffer?.grossMargin || (context.offerCheck?.grossMargin || 80);
    const offerMarginDecimal = offerMargin / 100;

    // FIX 3: Convert inputs to per-customer format for calculation
    const getCACInputsPerCustomer = (): CACInputsPerCustomer => {
        if (inputMode === 'per_deal') {
            // User entered per-deal values directly
            return {
                adSpendPerCustomer: adSpend,
                contentCostPerCustomer: contentCost,
                salesCommissionPerDeal: salesCommission,
                salaryAllocationPerCustomer: salaryAllocation,
                toolsCostPerCustomer: toolsCost
            };
        } else {
            // User entered monthly values - convert
            const monthly: CACInputsMonthly = {
                adSpendMonthly: adSpend,
                contentCostMonthly: contentCost,
                salesCommissionPerDeal: salesCommission,
                salaryAllocationMonthly: salaryAllocation,
                toolsCostMonthly: toolsCost,
                newCustomersPerMonth: customersPerMonth
            };
            return convertMonthlytoCACPerCustomer(monthly);
        }
    };

    const sources: Record<keyof CACInputsPerCustomer, AssumptionSource> = {
        adSpendPerCustomer: 'user_provided',
        contentCostPerCustomer: 'user_provided',
        salesCommissionPerDeal: 'user_provided',
        salaryAllocationPerCustomer: 'user_provided',
        toolsCostPerCustomer: 'user_provided'
    };

    const getStepOrder = (): Step[] => {
        if (inputMode === 'monthly') {
            return ['intro', 'mode_choice', 'customers_per_month', 'adSpend', 'contentCost', 'salesCommission', 'salaryAllocation', 'toolsCost', 'retention', 'result'];
        }
        return ['intro', 'mode_choice', 'adSpend', 'contentCost', 'salesCommission', 'salaryAllocation', 'toolsCost', 'retention', 'result'];
    };

    const handleNext = () => {
        const steps = getStepOrder();
        const currentIndex = steps.indexOf(step);

        // Save current value based on step
        switch (step) {
            case 'customers_per_month':
                setCustomersPerMonth(Number(currentValue) || 1);
                break;
            case 'adSpend':
                setAdSpend(Number(currentValue) || 0);
                break;
            case 'contentCost':
                setContentCost(Number(currentValue) || 0);
                break;
            case 'salesCommission':
                setSalesCommission(Number(currentValue) || 0);
                break;
            case 'salaryAllocation':
                setSalaryAllocation(Number(currentValue) || 0);
                break;
            case 'toolsCost':
                setToolsCost(Number(currentValue) || 0);
                break;
        }

        if (step === 'retention') {
            // Calculate final results
            const cacInputs = getCACInputsPerCustomer();
            const cacResult = calculateCACPayback(
                cacInputs,
                { price: offerPrice, grossMargin: offerMarginDecimal },
                sources,
                inputMode === 'monthly' ? 'monthly_spend' : 'per_customer'
            );

            const contributionMarginPerCustomer = cacResult.grossProfitPerCustomer - cacResult.totalCACPerCustomer;
            const contributionMarginPercent = offerPrice > 0
                ? (contributionMarginPerCustomer / offerPrice) * 100
                : 0;

            const economicsResult = calculateUnitEconomics(
                {
                    retentionMonths: retention,
                    grossProfitPerCustomer: cacResult.grossProfitPerCustomer,
                    totalCAC: cacResult.totalCACPerCustomer
                },
                cacResult.cacPaybackMonths,
                retentionSource,
                offerMargin,
                contributionMarginPercent
            );

            const retentionScenarioSource: ScenarioSource = retentionSource === 'user_provided' ? 'user_provided' : 'user_estimate';
            const hasCacAssumptions = cacResult.assumptions.some(a => a.source !== 'user_provided');

            if (retentionScenarioSource !== 'user_provided') {
                setAssumptionField('retention_months', {
                    field: 'retentionMonths',
                    label: 'Retention (months)',
                    value: retention,
                    source: retentionScenarioSource,
                    phase: 'phase2',
                    updatedAt: 0
                });
            } else {
                clearAssumptionField('retention_months');
            }

            cacResult.assumptions.forEach((assumption) => {
                if (assumption.source === 'user_provided') {
                    clearAssumptionField(assumption.field);
                    return;
                }
                const source: ScenarioSource = assumption.source === 'benchmark_acknowledged'
                    ? 'system_default'
                    : 'user_estimate';
                setAssumptionField(assumption.field, {
                    field: assumption.field,
                    label: assumption.label,
                    value: assumption.value,
                    source,
                    phase: 'phase2',
                    updatedAt: 0
                });
            });

            setPhysicsPhase('phase2', {
                status: economicsResult.fundability.isFundable ? 'pass' : 'fail',
                assumed: economicsResult.isScenario || retentionScenarioSource !== 'user_provided' || hasCacAssumptions,
                missing: false,
                blockers: economicsResult.fundability.blockers
            });

            // Save to store
            setCACInputs({
                adSpend: adSpend,
                contentCost: contentCost,
                salesCommission: salesCommission,
                salaryAllocation: salaryAllocation,
                toolsCost: toolsCost,
                sources: {
                    adSpend: 'user_provided',
                    contentCost: 'user_provided',
                    salesCommission: 'user_provided',
                    salaryAllocation: 'user_provided',
                    toolsCost: 'user_provided'
                }
            });

            setUnitEconomics({
                retentionMonths: retention,
                retentionSource: retentionScenarioSource,
                totalCAC: cacResult.totalCACPerCustomer,
                grossProfitPerCustomer: cacResult.grossProfitPerCustomer,
                cacPaybackMonths: cacResult.cacPaybackMonths,
                cacPaybackDays: cacResult.cacPaybackDays,
                ltv: economicsResult.ltv,
                cacRatio: economicsResult.cacRatio,
                grossMarginPercent: offerMargin,
                contributionMarginPercent: Math.round(contributionMarginPercent * 100) / 100,
                fundabilityBlockers: economicsResult.fundability.blockers,
                fundabilityFlags: economicsResult.fundability.flags,
                isFundable: economicsResult.fundability.isFundable,
                isScenario: economicsResult.isScenario || retentionScenarioSource !== 'user_provided',
                calculatedAt: Date.now()
            });
        }

        setCurrentValue('');
        setStep(steps[currentIndex + 1]);
    };

    const slideVariants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const renderInputScreen = (
        question: string,
        helpText: string,
        placeholder: string,
        suffix?: string
    ) => (
        <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-8"
        >
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">{question}</h1>
                <p className="text-lg text-gray-300">{helpText}</p>
            </div>

            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">$</span>
                <input
                    type="number"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value ? Number(e.target.value) : '')}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-4 text-2xl bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                />
            </div>

            {suffix && (
                <p className="text-sm text-indigo-400 font-medium">{suffix}</p>
            )}
            <p className="text-sm text-gray-400">Enter 0 if this doesn't apply to you.</p>

            <button
                onClick={handleNext}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
            >
                Continue <ArrowRight className="w-5 h-5" />
            </button>
        </motion.div>
    );

    // Calculate running total for display
    const runningTotal = adSpend + contentCost + salesCommission + salaryAllocation + toolsCost;
    const perCustomerLabel = inputMode === 'monthly' && customersPerMonth > 1
        ? ` ÷ ${customersPerMonth} customers = $${Math.round(runningTotal / customersPerMonth).toLocaleString()}/customer`
        : '';

    return (
        <div className="max-w-2xl mx-auto p-6 text-white min-h-[600px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
                {/* Intro */}
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto">
                            <Zap className="w-10 h-10 text-indigo-400" />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">
                                Let's see how fast you recover your investment.
                            </h1>
                            <p className="text-xl text-gray-300 max-w-lg mx-auto">
                                We'll ask about what you spend to acquire a customer,
                                then show you when that money comes back.
                            </p>
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                        >
                            Let's do it <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* FIX 3: Mode Choice - per deal or monthly */}
                {step === 'mode_choice' && (
                    <motion.div
                        key="mode_choice"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">
                                How do you track acquisition costs?
                            </h1>
                            <p className="text-lg text-gray-300">
                                Choose how you'll enter your data.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setInputMode('per_deal');
                                    setStep('adSpend');
                                }}
                                className="w-full p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-xl text-left transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <span className="text-2xl">🎯</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-lg">Cost per customer</p>
                                        <p className="text-gray-400">I know what I spend to acquire each client</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setInputMode('monthly');
                                    setStep('customers_per_month');
                                }}
                                className="w-full p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-xl text-left transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-lg">Monthly spend</p>
                                        <p className="text-gray-400">I track total monthly costs + customers acquired</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* FIX 3: Customers per month (for monthly mode) */}
                {step === 'customers_per_month' && (
                    <motion.div
                        key="customers_per_month"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">
                                How many new customers do you acquire per month?
                            </h1>
                            <p className="text-lg text-gray-300">
                                We'll use this to calculate your cost per customer.
                            </p>
                        </div>

                        <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                type="number"
                                value={currentValue}
                                onChange={(e) => setCurrentValue(e.target.value ? Number(e.target.value) : '')}
                                placeholder="2"
                                min="1"
                                className="w-full pl-12 pr-4 py-4 text-2xl bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                            />
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <p className="text-sm text-blue-200">
                                <strong>FIX 3:</strong> CAC is calculated per customer. Your monthly spend will be divided by this number.
                            </p>
                        </div>

                        {currentValue && Number(currentValue) > 0 && (
                            <button
                                onClick={handleNext}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Input screens with mode-specific labels */}
                {step === 'adSpend' && renderInputScreen(
                    inputMode === 'monthly'
                        ? "How much do you spend on ads each month?"
                        : "How much do you spend on ads per customer?",
                    inputMode === 'monthly'
                        ? "Include all paid advertising: Google, Meta, LinkedIn, etc."
                        : "Your ad cost divided by customers acquired.",
                    inputMode === 'monthly' ? "1500" : "750",
                    inputMode === 'per_deal' ? "This is your per-customer cost" : undefined
                )}

                {step === 'contentCost' && renderInputScreen(
                    inputMode === 'monthly'
                        ? "Content creation costs per month?"
                        : "Content creation cost per customer?",
                    "Video production, copywriting, design work for marketing.",
                    inputMode === 'monthly' ? "500" : "250"
                )}

                {step === 'salesCommission' && renderInputScreen(
                    "Sales commission per deal?",
                    "What you pay out when a deal closes. (Always per-deal)",
                    "500"
                )}

                {step === 'salaryAllocation' && renderInputScreen(
                    inputMode === 'monthly'
                        ? "Sales team salary allocation per month?"
                        : "Salary cost per customer?",
                    inputMode === 'monthly'
                        ? "% of your sales team's time on this offer × their salary."
                        : "Salary costs divided by customers closed.",
                    inputMode === 'monthly' ? "800" : "400"
                )}

                {step === 'toolsCost' && renderInputScreen(
                    inputMode === 'monthly'
                        ? "Tools and software costs per month?"
                        : "Tools cost per customer?",
                    "CRM, dialers, video tools, scheduling software.",
                    inputMode === 'monthly' ? "200" : "100"
                )}

                {/* Retention */}
                {step === 'retention' && (
                    <motion.div
                        key="retention"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">
                                How long does a typical client stay with you?
                            </h1>
                            <p className="text-lg text-gray-300">
                                This affects your lifetime value calculation.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { value: 1, label: 'One-time purchase' },
                                { value: 3, label: '3 months' },
                                { value: 6, label: '6 months' },
                                { value: 12, label: '12 months' },
                                { value: 24, label: '24+ months' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setRetention(option.value);
                                        setRetentionSource('user_provided');
                                    }}
                                    className={`w-full p-4 rounded-xl border text-left transition-all ${retention === option.value
                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                            : 'bg-slate-800 border-slate-700 text-gray-300 hover:border-slate-600'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {/* Running total with per-customer conversion */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
                            <p className="text-sm text-gray-400">
                                Your total acquisition cost:
                                <span className="font-mono text-white ml-2">${runningTotal.toLocaleString()}</span>
                                {inputMode === 'monthly' && <span className="text-blue-400">{perCustomerLabel}</span>}
                            </p>
                            <p className="text-xs text-gray-500">
                                Mode: {inputMode === 'monthly' ? 'Monthly spend ÷ customers' : 'Per customer'}
                            </p>
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                        >
                            Calculate CAC Payback <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Result (Conclusion First) */}
                {step === 'result' && (
                    <motion.div
                        key="result"
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-8"
                    >
                        {(() => {
                            const cacInputs = getCACInputsPerCustomer();
                            const cacResult = calculateCACPayback(
                                cacInputs,
                                { price: offerPrice, grossMargin: offerMarginDecimal },
                                sources,
                                inputMode === 'monthly' ? 'monthly_spend' : 'per_customer'
                            );
                            const message = getCACPaybackMessage(cacResult);
                            const hasAssumedInputs = retentionSource !== 'user_provided'
                                || cacResult.assumptions.some(a => a.source !== 'user_provided');

                            return (
                                <>
                                    {/* Verdict Icon */}
                                    <div className="text-center">
                                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${cacResult.isFundable
                                                ? 'bg-emerald-500/20 ring-4 ring-emerald-500/30'
                                                : 'bg-amber-500/20 ring-4 ring-amber-500/30'
                                            }`}>
                                            {cacResult.isFundable ? (
                                                <CheckCircle className="w-10 h-10 text-emerald-400" />
                                            ) : (
                                                <AlertTriangle className="w-10 h-10 text-amber-400" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Conclusion First */}
                                    <div className="text-center space-y-4">
                                        <h1 className="text-3xl font-bold text-white">
                                            {message.headline}
                                        </h1>
                                        <p className="text-xl text-gray-300 max-w-lg mx-auto">
                                            {message.body}
                                        </p>
                                    </div>

                                    {/* Fundability Badge */}
                                    <div className="flex justify-center">
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${cacResult.isFundable
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                            }`}>
                                            {message.fundabilityLabel}
                                        </span>
                                    </div>

                                    {/* Math Details (Progressive Disclosure) */}
                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setShowMathDetails(!showMathDetails)}
                                            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-all"
                                        >
                                            <span className="text-gray-300 font-medium">The math</span>
                                            {showMathDetails ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>

                                        {showMathDetails && (
                                            <div className="p-4 border-t border-slate-700 space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Total CAC (per customer)</span>
                                                    <span className="font-mono text-white">${cacResult.totalCACPerCustomer.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400">Gross Profit / Customer</span>
                                                    <span className="font-mono text-white">${cacResult.grossProfitPerCustomer.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm border-t border-slate-700 pt-3">
                                                    <span className="text-gray-400">CAC Payback</span>
                                                    <span className="font-mono text-white">{cacResult.cacPaybackMonths.toFixed(2)} months</span>
                                                </div>
                                                <div className="text-xs text-gray-500 pt-2 font-mono">
                                                    Formula: CAC Payback = CAC per Customer ÷ Gross Profit per Customer
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Assumptions visible */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                                        <p className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                            <Info className="w-4 h-4" />
                                            {hasAssumedInputs ? 'Your inputs (includes assumptions)' : 'Your inputs (all user-provided ✓)'}
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                                            <p>Ad spend: <span className="font-mono text-white">${cacInputs.adSpendPerCustomer.toLocaleString()}</span></p>
                                            <p>Content: <span className="font-mono text-white">${cacInputs.contentCostPerCustomer.toLocaleString()}</span></p>
                                            <p>Commission: <span className="font-mono text-white">${cacInputs.salesCommissionPerDeal.toLocaleString()}</span></p>
                                            <p>Salary: <span className="font-mono text-white">${cacInputs.salaryAllocationPerCustomer.toLocaleString()}</span></p>
                                            <p>Tools: <span className="font-mono text-white">${cacInputs.toolsCostPerCustomer.toLocaleString()}</span></p>
                                            <p>Retention: <span className="font-mono text-white">{retention} mo</span></p>
                                        </div>
                                        <p className="text-xs text-indigo-400 mt-3">
                                            Input mode: {inputMode === 'monthly' ? `Monthly ÷ ${customersPerMonth} customers` : 'Per customer'}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={onComplete}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        Complete Diagnostic <ArrowRight className="w-5 h-5" />
                                    </button>
                                </>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

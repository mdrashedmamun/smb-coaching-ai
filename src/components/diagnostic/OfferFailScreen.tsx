import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, Mail, AlertTriangle, PlayCircle, Users, Clock, HelpCircle, Target, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';
import type { Phase0Verdict } from './OfferHealthCheck';

interface OfferFailScreenProps {
    reason: Phase0Verdict;
    closeRate?: number;
    margin?: number;
    onBack: () => void;
    onDeepDiagnosis: () => void;
}

interface PrescriptionDetails {
    what: string;
    why: string;
    how: string;
    who: string;
    when: string;
}

interface FailMessage {
    title: string;
    description: string;
    prescription: PrescriptionDetails;
}

const FAIL_MESSAGES: Record<string, FailMessage> = {
    fail_close_rate: {
        title: 'Close Rate: Below 30%',
        description: `I see why outreach feels impossible.

You're closing less than 3 out of 10 calls. That means 7 out of 10 conversations end with "Let me think about it" or awkward silence.

**Here's what's really happening:**
• You're pouring energy into people who aren't ready to buy
• Every "no" chips away at your confidence
• You're doing the work but not getting paid for it

This isn't a you problem. It's a "who" problem. The people you're talking to aren't your people.`,
        prescription: {
            what: "Record your next 3 sales calls",
            why: "Listen for where they get confused or check out. Ask past clients: 'What almost stopped you from buying?'",
            how: "1. Record your next 3 calls (with permission)\n2. Mark the moment they disengage\n3. Narrow your avatar until it feels uncomfortable",
            who: "You (Founder). Don't delegate sales until close rate is >30%.",
            when: "Starting with your next sales call. Pause all outreach until you understand why."
        }
    },
    fail_margin: {
        title: 'Gross Margin: Below 80%',
        description: `You're trading time for money, and it's burning you out.

At these margins, you're working twice as hard for half the pay. You're probably thinking: "If I just get a few more clients..."

**Here's the painful truth:**
Every new client at these margins makes you poorer, not richer. You're building a job, not a business.

**Why this hurts your lead gen:**
• You can't afford proper marketing
• You're too busy delivering to sell
• You lower prices to get clients, which attracts worse clients`,
        prescription: {
            what: "Double your price for the next 3 proposals",
            why: "The fix isn't more clients. It's fewer, better clients. You'll lose some—that's okay. The ones who stay will value you properly.",
            how: "1. Double your price for the next 3 prospects (yes, really)\n2. Bundle digital assets so you're not just selling time\n3. Systematize delivery so you're not the bottleneck",
            who: "You (Founder). This requires an executive decision on pricing.",
            when: "Before sending your next proposal. Take 30 days to rebuild."
        }
    },
    fail_both: {
        title: 'Both Metrics Below Threshold',
        description: `I've been where you are.

Low close rate + thin margins = founder burnout. You're working hard but moving backward.

**Here's what you're probably feeling:**
• "Maybe I'm not cut out for this"
• "The market is saturated"
• "If I just hustle harder..."

**Stop.** More hustle won't fix this.

Your business has a physics problem: you're selling to the wrong people (close rate) AND selling the wrong offer (margins).

**This is actually good news:** You now know exactly what to fix.`,
        prescription: {
            what: "The 30-day offer reset",
            why: "Your current model is mathematically broken. Scaling it would only scale your stress. You need a clean slate.",
            how: "Week 1: Read '$100M Offers' (don't skim—read it)\nWeek 2-3: Redesign your offer around ONE result\nWeek 4: Test your new price on 3 prospects",
            who: "You (Founder). This is an emergency pivot.",
            when: "Now. Pause all outreach. Come back when you've rebuilt."
        }
    },
    fail_uesa: {
        title: 'Offer Physics Failure',
        description: `Your offer violates the physics of high-ticket services.

It's either not unique (you're a commodity), too cheap (no margin to scale), not sticky (one-time only), or too expensive to deliver (you're the bottleneck).

**Why this matters:**
You could be the best marketer in the world and still fail with this offer. The math doesn't work.`,
        prescription: {
            what: "Re-engineer your offer",
            why: "If it's not unique, you compete on price. If you're the delivery mechanism, you can't scale. Both are traps.",
            how: "1. Unique: Add a proprietary method name\n2. Expensive: Bundle digital assets to raise perceived value\n3. Sticky: Add a recurring component\n4. Air: Replace 1-on-1 time with curriculum",
            who: "Founder only.",
            when: "Before you take another sales call."
        }
    },
    fail_target: {
        title: 'No Clear Target',
        description: `You're trying to serve everyone, which means you serve no one well.

To sell premium, you need to sell from Pain (you lived it), Passion (you love it), or Profession (you mastered it).

**Why this matters:**
Generalists get paid peanuts. Specialists get paid premium. You can't build authority without a specific domain.`,
        prescription: {
            what: "Pick ONE avatar based on your strongest credential",
            why: "Narrowing feels scary, but it's the only way to escape commodity pricing.",
            how: "1. List your Pain (struggles you overcame), Passion (what you love), Profession (what you're trained in)\n2. Circle the one where you have MOST credibility\n3. Delete everything else from your bio",
            who: "Founder.",
            when: "Immediately. This is your positioning work."
        }
    },
    fail_filters: {
        title: 'Wrong Audience',
        description: `Your target audience fails the basic buyer filters.

They either don't have money, don't have a painful enough problem, don't have urgency, or can't make the buying decision alone.

**Why this matters:**
You cannot scale a business targeting people who can't buy. No amount of sales skill fixes a broken market.`,
        prescription: {
            what: "Pivot to an audience that CAN buy",
            why: "Keep your skill. Change who you sell to. Same offer, different buyer who has budget and authority.",
            how: "1. Keep your core skill/offer\n2. Change WHO you sell it to\n3. Example: Instead of 'broke students', sell to 'universities'. Same service, different buyer.",
            who: "Founder.",
            when: "Now. Do not spend another dollar marketing to this audience."
        }
    },
    warn_underpriced: {
        title: 'Price Signal Detected',
        description: `You're closing too easily, which usually means you're underpriced.

This isn't a failure—it's an opportunity. But if you proceed to lead generation at this price point, you'll scale an underpriced offer, which limits your growth ceiling.

**Consider testing a higher price** before generating more leads.`,
        prescription: {
            what: "Test 2x your current price on the next 5 prospects",
            why: "High close rates (>60%) typically indicate you're underpriced by 2-4x. Testing higher prices costs nothing.",
            how: "1. Next 5 prospects: pitch at 2x current price\n2. Track close rate at new price\n3. If you still close >40%, go higher",
            who: "You (Founder).",
            when: "Starting with your next sales conversation."
        }
    }
};

export const OfferFailScreen = ({ reason, closeRate, margin: _margin, onBack, onDeepDiagnosis }: OfferFailScreenProps) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const failInfo = FAIL_MESSAGES[reason] || FAIL_MESSAGES.fail_both;

    // ROI Calculation
    const calculateEfficiency = () => {
        if (!closeRate) return null;

        const currentRate = closeRate;
        const targetRate = 40; // Healthy benchmark
        const targetClientsPerMonth = 10; // Example goal

        const currentLeadsNeeded = Math.ceil((targetClientsPerMonth / currentRate) * 100);
        const fixedLeadsNeeded = Math.ceil((targetClientsPerMonth / targetRate) * 100);
        const improvement = Math.round(((currentLeadsNeeded - fixedLeadsNeeded) / currentLeadsNeeded) * 100);

        return {
            currentRate,
            targetRate,
            currentLeadsNeeded,
            fixedLeadsNeeded,
            improvement
        };
    };

    const efficiency = calculateEfficiency();

    const handleEmailSubmit = () => {
        if (email) {
            console.log('[Phase0] Email captured for 30-day return:', email);
            setSubmitted(true);
        }
    };

    const PrescriptionItem = ({ label, icon: Icon, text }: { label: string, icon: any, text: string }) => (
        <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="shrink-0">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-400" />
                </div>
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-1">{label}</h4>
                <p className="text-white text-sm whitespace-pre-line leading-relaxed">{text}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 text-white min-h-[800px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
            >
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Start Over
                </button>

                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto ring-4 ring-red-500/10">
                        <XCircle className="w-10 h-10 text-red-500" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            Your bottleneck isn't leads.
                        </h1>
                        <p className="text-2xl md:text-3xl text-red-500 font-bold">
                            It's your offer.
                        </p>
                    </div>

                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        We can't diagnose your lead funnel until you fix the fundamentals.
                        <br />
                        <span className="text-gray-300">Here represents the hard truth you needed to hear.</span>
                    </p>
                </div>

                {/* Diagnosis Card */}
                <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <h3 className="text-xl font-bold text-red-400">{failInfo.title}</h3>
                    </div>
                    <p className="text-gray-300 text-base leading-relaxed max-w-3xl whitespace-pre-line">
                        {failInfo.description}
                    </p>
                </div>

                {/* ROI / Efficiency Comparison Card */}
                {efficiency && (
                    <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                            <h3 className="text-lg font-bold text-emerald-400">Why Fixing This Matters</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Current Efficiency</p>
                                <p className="text-3xl font-bold text-red-400">{efficiency.currentRate}%</p>
                                <p className="text-sm text-gray-400">
                                    To get 10 clients, you need <span className="text-white font-bold">{efficiency.currentLeadsNeeded} leads</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">After Fixing</p>
                                <p className="text-3xl font-bold text-emerald-400">{efficiency.targetRate}%</p>
                                <p className="text-sm text-gray-400">
                                    To get 10 clients, you need <span className="text-white font-bold">{efficiency.fixedLeadsNeeded} leads</span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-emerald-500/10">
                            <p className="text-emerald-300 text-sm font-medium">
                                ⚡ Fixing your offer = <span className="text-emerald-400 font-bold">{efficiency.improvement}% less effort</span> for the same results
                            </p>
                        </div>
                    </div>
                )}

                {/* Detailed Prescription Grid */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <Target className="w-6 h-6 text-indigo-400" />
                        <h3 className="text-xl font-bold text-white">Your Specific Prescription</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <PrescriptionItem
                                label="What to do"
                                icon={PlayCircle}
                                text={failInfo.prescription.what}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <PrescriptionItem
                                label="Why (The Physics)"
                                icon={HelpCircle}
                                text={failInfo.prescription.why}
                            />
                        </div>
                        <PrescriptionItem
                            label="How to execute"
                            icon={Target}
                            text={failInfo.prescription.how}
                        />
                        <div className="space-y-4">
                            <PrescriptionItem
                                label="Who owns this"
                                icon={Users}
                                text={failInfo.prescription.who}
                            />
                            <PrescriptionItem
                                label="When to start"
                                icon={Clock}
                                text={failInfo.prescription.when}
                            />
                        </div>
                    </div>
                </div>

                {/* Diagnosis Summary Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                            <h3 className="text-xl font-bold text-red-400">Summary: Your Offer is Broken</h3>
                        </div>
                        <p className="text-gray-300 text-base leading-relaxed">
                            The data indicates a fundamental issue with your offer's appeal or pricing.
                            Fixing this is the highest leverage activity you can do right now.
                            Without a compelling offer, no amount of lead generation will be efficient.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={onDeepDiagnosis}
                                className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20"
                            >
                                <Zap className="w-5 h-5" />
                                Run Deep Offer Diagnosis
                            </button>
                            <button
                                onClick={onBack}
                                className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Review Numbers
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* 30-Day Return */}
                <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-8 text-center space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                            <Mail className="w-6 h-6 text-indigo-400" />
                            Return in 30 Days
                        </h3>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Once you've implemented this prescription, come back and we'll audit your lead funnel.
                        </p>
                    </div>

                    {!submitted ? (
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="founder@company.com"
                                className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-indigo-500 outline-none transition-all"
                            />
                            <button
                                onClick={handleEmailSubmit}
                                disabled={!email}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
                            >
                                Remind Me
                            </button>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 font-medium animate-in fade-in slide-in-from-bottom-2">
                            <span>✓</span>
                            <span>We'll remind you in 30 days. Go fix your offer.</span>
                        </div>
                    )}
                </div>

                {/* Edge Case Capture */}
                <div className="text-center space-y-4">
                    <button
                        onClick={() => {
                            const reason = prompt("What makes your situation different?");
                            if (reason) {
                                console.log('[Phase0] Edge case submitted:', reason);
                                alert("Thanks for sharing. We'll review this to improve our model. For now, we recommend following the prescription above.");
                            }
                        }}
                        className="text-sm text-gray-500 hover:text-gray-300 underline underline-offset-4 transition-colors"
                    >
                        I think my business is an exception
                    </button>
                </div>

                {/* Final Note */}
                <div className="text-center pb-8 opacity-60 hover:opacity-100 transition-opacity">
                    <p className="text-sm text-gray-400">
                        This isn't rejection—it's protection.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

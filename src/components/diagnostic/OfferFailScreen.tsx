import { motion } from 'framer-motion';
import { XCircle, BookOpen, ArrowLeft, Mail } from 'lucide-react';
import { useState } from 'react';
import type { Phase0Verdict } from './OfferHealthCheck';

interface OfferFailScreenProps {
    reason: Phase0Verdict;
    onBack: () => void;
}

const FAIL_MESSAGES: Record<string, { title: string; description: string }> = {
    fail_close_rate: {
        title: 'Avatar or Sales Motion Issue',
        description: 'Your close rate is below 30%. This means either you\'re selling to the wrong people, or your sales process isn\'t educating them before the call. More leads won\'t fix this—they\'ll just give you more unqualified conversations.'
    },
    fail_margin: {
        title: 'Commoditized Offer',
        description: 'Your gross margin is below 80%. At these margins, you can\'t afford to scale marketing, hire top talent, or weather bad months. You need to differentiate your offer or raise prices before adding volume.'
    },
    fail_both: {
        title: 'Foundational Offer Issues',
        description: 'Both your close rate and margins are below healthy thresholds. This suggests fundamental issues with your offer positioning, pricing, or target market. Leads are not your bottleneck—your offer is.'
    }
};

export const OfferFailScreen = ({ reason, onBack }: OfferFailScreenProps) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const failInfo = FAIL_MESSAGES[reason] || FAIL_MESSAGES.fail_both;

    const handleEmailSubmit = () => {
        if (email) {
            // Log for analytics (placeholder)
            console.log('[Phase0] Email captured for 30-day return:', email);
            setSubmitted(true);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 text-white min-h-[700px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Start Over
                </button>

                {/* Header */}
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Your bottleneck isn't leads.
                    </h1>
                    <p className="text-2xl text-red-400 font-bold mb-6">
                        It's your offer.
                    </p>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        We can't diagnose your lead funnel until you fix the fundamentals.
                        Here's what's broken and how to fix it.
                    </p>
                </div>

                {/* Diagnosis Card */}
                <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-3">{failInfo.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {failInfo.description}
                    </p>
                </div>

                {/* Prescription */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-400" />
                        Your Prescription (Before You Return)
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                            <span className="text-amber-400 font-bold">1.</span>
                            <div>
                                <span className="text-white font-medium">Read: $100M Offers</span>
                                <p className="text-gray-500 text-xs mt-1">Learn how to build an offer so good people feel stupid saying no.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                            <span className="text-amber-400 font-bold">2.</span>
                            <div>
                                <span className="text-white font-medium">Raise your price</span>
                                <p className="text-gray-500 text-xs mt-1">Test a 2-3x price increase on your next 5 prospects. Track close rate.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                            <span className="text-amber-400 font-bold">3.</span>
                            <div>
                                <span className="text-white font-medium">Narrow your avatar</span>
                                <p className="text-gray-500 text-xs mt-1">Target only people with urgent pain, money, and authority to decide.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                            <span className="text-amber-400 font-bold">4.</span>
                            <div>
                                <span className="text-white font-medium">Improve your sales motion</span>
                                <p className="text-gray-500 text-xs mt-1">Record 5 sales calls and identify where prospects disengage.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* 30-Day Return */}
                <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-400" />
                        Return in 30 Days
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Once you've implemented the prescription, come back and we'll audit your lead funnel.
                        Leave your email and we'll remind you.
                    </p>
                    {!submitted ? (
                        <div className="flex gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="founder@company.com"
                                className="flex-1 px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-blue-500 outline-none text-sm"
                            />
                            <button
                                onClick={handleEmailSubmit}
                                disabled={!email}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Remind Me
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-3 text-green-400 font-medium">
                            ✓ We'll remind you in 30 days. Go fix your offer.
                        </div>
                    )}
                </div>

                {/* Final Note */}
                <div className="text-center text-gray-500 text-sm pt-4">
                    <p>
                        This isn't rejection—it's protection.
                        <br />
                        We'd rather save you 6 months of wasted effort than give you a false diagnosis.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

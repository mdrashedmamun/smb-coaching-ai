import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, AlertCircle, TrendingUp, Users, Zap, HelpCircle } from 'lucide-react';
import { useBusinessStore, type ConstraintSignals } from '../../store/useBusinessStore';
import { inferConstraint } from '../../lib/OfferRecommendationEngine';

interface ConstraintCheckScreenProps {
  onComplete: () => void;
}

export const ConstraintCheckScreen = ({ onComplete }: ConstraintCheckScreenProps) => {
  const { setConstraintSignals } = useBusinessStore();

  // Step tracking
  const [step, setStep] = useState<'q1' | 'q2' | 'q3' | 'complete'>('q1');

  // Form state
  const [q1Response, setQ1Response] = useState<string | null>(null);
  const [q2Response, setQ2Response] = useState<string | null>(null);
  const [q3CallCapacity, setQ3CallCapacity] = useState<number | ''>('');
  const [skipReason, setSkipReason] = useState<string | null>(null);

  // Question 1 options
  const Q1_OPTIONS = [
    {
      id: 'lead_flow',
      label: 'Lead flow',
      description: 'Not enough inbound leads or prospects',
      icon: TrendingUp
    },
    {
      id: 'sales',
      label: 'Sales (calls/closing)',
      description: 'Booking calls or closing deals',
      icon: Zap
    },
    {
      id: 'delivery',
      label: 'Delivery (fulfillment)',
      description: 'Capacity to deliver on promises',
      icon: AlertCircle
    },
    {
      id: 'not_sure',
      label: 'Not sure',
      description: 'I need more info',
      icon: HelpCircle
    }
  ];

  // Question 2 options
  const Q2_OPTIONS = [
    {
      id: 'getting_leads',
      label: 'Getting qualified leads',
      description: 'Attracting the right prospects'
    },
    {
      id: 'booking_calls',
      label: 'Getting calls booked',
      description: 'Converting leads to meetings'
    },
    {
      id: 'closing',
      label: 'Closing once on the call',
      description: 'Converting calls to customers'
    },
    {
      id: 'retention',
      label: 'Retaining & upselling clients',
      description: 'Keeping customers long-term'
    }
  ];

  const handleQ1Next = () => {
    if (q1Response) {
      setStep('q2');
    }
  };

  const handleQ2Next = () => {
    if (q2Response) {
      // Check if we need Q3
      if (q1Response === 'not_sure' || q2Response === 'not_sure') {
        setStep('q3');
      } else {
        // Skip Q3 and complete
        completeConstraintCheck();
      }
    }
  };

  const handleQ3Next = () => {
    completeConstraintCheck();
  };

  const completeConstraintCheck = () => {
    // Infer constraint from responses
    const constraint = inferConstraint(q1Response, q2Response, q3CallCapacity ? Number(q3CallCapacity) : undefined);

    // Create constraint signals
    const signals: ConstraintSignals = {
      primaryConstraint: constraint,
      confidenceLevel: 'medium',
      source: 'quick_check',
      metadata: {
        q1_demandBreakpoint: q1Response || undefined,
        q2_hardestPart: q2Response || undefined,
        q3_callCapacity: q3CallCapacity ? Number(q3CallCapacity) : undefined
      },
      timestamp: Date.now()
    };

    // Update store
    setConstraintSignals(signals);

    setStep('complete');
    // Auto-advance after brief celebration
    setTimeout(onComplete, 800);
  };

  const handleSkip = () => {
    // Skip constraint check - store neutral signals
    const signals: ConstraintSignals = {
      primaryConstraint: null,
      confidenceLevel: 'low',
      source: 'quick_check',
      metadata: {
        q1_demandBreakpoint: 'skipped',
        q2_hardestPart: 'skipped'
      },
      timestamp: Date.now()
    };

    setConstraintSignals(signals);
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white min-h-[600px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {/* Question 1: Demand Breakpoint */}
        {step === 'q1' && (
          <motion.div
            key="q1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Quick Constraint Check</h1>
              <p className="text-slate-400 text-lg">
                If demand doubled next week, what would break first?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Q1_OPTIONS.map(({ id, label, description, icon: Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => setQ1Response(id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    q1Response === id
                      ? 'bg-indigo-500/20 border-indigo-500 shadow-lg shadow-indigo-900/20'
                      : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{label}</div>
                      <div className="text-xs text-slate-400 mt-1">{description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleQ1Next}
                disabled={!q1Response}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Question 2: Hardest Part */}
        {step === 'q2' && (
          <motion.div
            key="q2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Which feels harder right now?</h1>
              <p className="text-slate-400 text-lg">
                This helps us recommend offers that address your bottleneck.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {Q2_OPTIONS.map(({ id, label, description }) => (
                <motion.button
                  key={id}
                  onClick={() => setQ2Response(id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    q2Response === id
                      ? 'bg-indigo-500/20 border-indigo-500 shadow-lg shadow-indigo-900/20'
                      : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="font-semibold">{label}</div>
                  <div className="text-xs text-slate-400 mt-1">{description}</div>
                </motion.button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('q1')}
                className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleQ2Next}
                disabled={!q2Response}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Question 3: Call Capacity (Optional) */}
        {step === 'q3' && (
          <motion.div
            key="q3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Quick detail: Call capacity</h1>
              <p className="text-slate-400 text-lg">
                How many sales calls per week can you realistically take right now?
              </p>
              <p className="text-slate-500 text-sm mt-2">
                (Optional - we use this to validate offer recommendations)
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 space-y-4">
              <input
                type="number"
                min="0"
                max="100"
                value={q3CallCapacity}
                onChange={(e) => setQ3CallCapacity(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="e.g., 10 calls/week"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 outline-none focus:border-indigo-500 text-lg"
              />
              <p className="text-xs text-slate-500">
                This helps us ensure your recommended offer won't overwhelm your calendar.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('q2')}
                className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleQ3Next}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                Done <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Complete State */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="text-5xl">✓</div>
            <h2 className="text-2xl font-bold">Got it!</h2>
            <p className="text-slate-400">
              We'll use this to recommend the best offer for your situation.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Target, Zap, Shield, DollarSign, MessageSquare, Copy } from 'lucide-react';

interface DeepOfferDiagnosisProps {
  onBack: () => void;
  onComplete: () => void;
}

type DiagnosisStep = 'pricing' | 'one-one-one' | 'formula' | 'result';

export const DeepOfferDiagnosis = ({ onBack, onComplete }: DeepOfferDiagnosisProps) => {
  const [step, setStep] = useState<DiagnosisStep>('pricing');
  const [price, setPrice] = useState<string>('');
  const [oneOneOne, setOneOneOne] = useState({
    person: '',
    problem: '',
    way: ''
  });
  const [formula, setFormula] = useState({
    problem: '',
    why: '',
    consequence: '',
    outcome: ''
  });

  const isDeathZone = Number(price) >= 800 && Number(price) <= 3000;

  const handleNext = () => {
    if (step === 'pricing') setStep('one-one-one');
    else if (step === 'one-one-one') setStep('formula');
    else if (step === 'formula') setStep('result');
  };

  const handleBack = () => {
    if (step === 'pricing') onBack();
    else if (step === 'one-one-one') setStep('pricing');
    else if (step === 'formula') setStep('one-one-one');
    else if (step === 'result') setStep('formula');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white min-h-[700px]">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-2">
          {['pricing', 'one-one-one', 'formula', 'result'].map((s) => (
            <div
              key={s}
              className={`w-12 h-1 rounded-full ${step === s ? 'bg-indigo-500' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'pricing' && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                <DollarSign className="w-4 h-4 text-indigo-400" />
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Step 1: Pricing Zone</span>
              </div>
              <h2 className="text-3xl font-bold">What is your core price point?</h2>
              <p className="text-gray-400 mt-2">Pricing isn't just a number; it dictates your business model.</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl font-mono">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-10 pr-5 py-6 rounded-2xl bg-white/5 border border-white/10 text-4xl font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="2000"
                />
              </div>

              {price && isDeathZone && (
                <div className="mt-6 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <Shield className="w-5 h-5" />
                    Warning: The "No Man's Land" Trap
                  </div>
                  <p className="text-sm text-red-200 leading-relaxed">
                    $800 - $3,000 is the most dangerous price point. It's too expensive for a "one-click" impulse buy,
                    but too cheap to pay for the professional sales team or high-touch delivery required to close it.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={!price}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Next: The 1-1-1 Framework
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 'one-one-one' && (
          <motion.div
            key="one-one-one"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Step 2: Differentiation</span>
              </div>
              <h2 className="text-3xl font-bold">The 1-1-1 Framework</h2>
              <p className="text-gray-400 mt-2">Differentiate or die. Who exactly are you helping?</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">1 Specific Person</label>
                  <input
                    value={oneOneOne.person}
                    onChange={(e) => setOneOneOne({ ...oneOneOne, person: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500 outline-none transition-all"
                    placeholder="e.g. Real Estate Agents"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">1 Specific Problem</label>
                  <input
                    value={oneOneOne.problem}
                    onChange={(e) => setOneOneOne({ ...oneOneOne, problem: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500 outline-none transition-all"
                    placeholder="e.g. No inbound leads"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">1 Specific Way</label>
                  <input
                    value={oneOneOne.way}
                    onChange={(e) => setOneOneOne({ ...oneOneOne, way: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-emerald-500 outline-none transition-all"
                    placeholder="e.g. Personalized Looms"
                  />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Principle: The Stained Glass Specialist</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    If your neighbor throws a rock through your stained glass window, you don't hire a "window repair guy."
                    You hire the "Stained Glass Specialist." Narrow your focus to become the only option.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!oneOneOne.person || !oneOneOne.problem || !oneOneOne.way}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Next: The Ultimate Formula
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 'formula' && (
          <motion.div
            key="formula"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Step 3: The Irresistible Logic</span>
              </div>
              <h2 className="text-3xl font-bold">The Problem Formula</h2>
              <p className="text-gray-400 mt-2">The customer must care about the problem before they care about the solution.</p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">1. Specific Problem</label>
                <textarea
                  value={formula.problem}
                  onChange={(e) => setFormula({ ...formula, problem: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500 outline-none min-h-[60px]"
                  placeholder="They struggle to fill their calendar..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">2. Reason Why</label>
                <textarea
                  value={formula.why}
                  onChange={(e) => setFormula({ ...formula, why: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500 outline-none min-h-[60px]"
                  placeholder="Because they rely on referrals only..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">3. Consequence</label>
                <textarea
                  value={formula.consequence}
                  onChange={(e) => setFormula({ ...formula, consequence: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500 outline-none min-h-[60px]"
                  placeholder="When referrals dry up, they panic and lower their price..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">4. Ultimate Negative Outcome</label>
                <textarea
                  value={formula.outcome}
                  onChange={(e) => setFormula({ ...formula, outcome: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500 outline-none min-h-[60px]"
                  placeholder="Eventually they burn out and shut down the business."
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!formula.problem || !formula.why || !formula.consequence || !formula.outcome}
              className="w-full py-4 bg-amber-600 text-white rounded-xl font-bold text-lg hover:bg-amber-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Generate Irresistible Script
              <Zap className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold">Your Irresistible Script</h2>
              <p className="text-gray-400 mt-2">Use this on your sales calls or landing page.</p>
            </div>

            <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => {
                    const text = `Most ${oneOneOne.person} struggle with ${formula.problem}.\n\nThe reason is because ${formula.why}.\n\nWhen this happens, ${formula.consequence}.\n\nUntil all of a sudden, ${formula.outcome}.\n\nWhat I do is I specialize in ${oneOneOne.way} to ${oneOneOne.problem}.\n\nThe reason why I recommend ${oneOneOne.way} is because it’s the single most effective way to solve the problem of ${formula.problem}.\n\nAnd when we fix that, you can finally scale.`;
                    navigator.clipboard.writeText(text);
                    alert("Script copied to clipboard!");
                  }}
                  className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 text-xl md:text-2xl leading-relaxed font-medium">
                <p>
                  Most <span className="text-indigo-400 underline decoration-indigo-500/30 underline-offset-4">{oneOneOne.person}</span> struggle with <span className="text-indigo-400 underline decoration-indigo-500/30 underline-offset-4">{formula.problem}</span>.
                </p>
                <p>
                  The reason is because <span className="text-indigo-400 underline decoration-indigo-500/30 underline-offset-4">{formula.why}</span>.
                </p>
                <p>
                  When this happens, <span className="text-indigo-400 underline decoration-indigo-500/30 underline-offset-4">{formula.consequence}</span>.
                </p>
                <p>
                  Until all of a sudden, <span className="text-red-400 underline decoration-red-500/30 underline-offset-4">{formula.outcome}</span>.
                </p>
                <p>
                  What I do is I specialize in <span className="text-emerald-400 underline decoration-emerald-500/30 underline-offset-4">{oneOneOne.way}</span> to <span className="text-emerald-400 underline decoration-emerald-500/30 underline-offset-4">{oneOneOne.problem}</span> for <span className="text-emerald-400 underline decoration-emerald-500/30 underline-offset-4">{oneOneOne.person}</span>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={onBack}
                className="py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                Back to Fail Screen
              </button>
              <button
                onClick={onComplete}
                className="py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20"
              >
                Complete Diagnosis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

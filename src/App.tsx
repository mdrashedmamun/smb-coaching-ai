import { useState, useEffect } from 'react'
import { SettingsModal } from './components/dashboard/SettingsModal'
import { ModuleCard } from './components/dashboard/ModuleCard'
import { ModuleView } from './components/dashboard/ModuleView'
import { Module1 } from './components/modules/Module1'
import { Module2 } from './components/modules/Module2'
import { Module3 } from './components/modules/Module3'
import { Module4 } from './components/modules/Module4'
import { Module5 } from './components/modules/Module5'
import { Module6 } from './components/modules/Module6'
import { Module7 } from './components/modules/Module7'
import { useBusinessStore } from './store/useBusinessStore'
import { calculateBusinessScores } from './lib/scoring_engine'
import { DiagnosticFlow } from './components/diagnostic/DiagnosticFlow'
import { DiagnosticDashboard } from './components/dashboard/DiagnosticDashboard'
import { DailyCheckInModal } from './components/DailyCheckIn/DailyCheckInModal'
import { ModeIndicator } from './components/diagnostic/ModeIndicator'
import { ScenarioBanner } from './components/diagnostic/ScenarioBanner'
import { Rocket, LineChart, Target, Filter, DollarSign, Repeat, Mic, Settings } from 'lucide-react'

const SYSTEM_TOOLS = [
  { id: 1, title: 'Offer Diagnostic', description: 'Stress-test your offer.', icon: Rocket },
  { id: 2, title: 'Visual Funnel Builder', description: 'Find where you lose customers.', icon: LineChart },
  { id: 3, title: 'Lead Rhythm System', description: 'Build a weekly habit for getting customers.', icon: Target },
  { id: 4, title: 'Deep Quality Filter', description: 'Filter bad leads automatically.', icon: Filter },
  { id: 5, title: 'Expense Auditor', description: 'Find wasted money.', icon: DollarSign },
  { id: 6, title: 'Reliability Protocol', description: 'Get yourself out of the weeds.', icon: Repeat },
  { id: 7, title: 'Pitch Deck Architect', description: 'Tell a better story.', icon: Mic },
]

function App() {
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const { modules, context, updateContext, unlockSpecificModule, needsCheckIn, runDecayCheck } = useBusinessStore()

  // Run decay check and show check-in modal on load
  useEffect(() => {
    runDecayCheck()
    if (needsCheckIn()) {
      // Small delay to let the page render first
      const timer = setTimeout(() => setShowCheckIn(true), 500)
      return () => clearTimeout(timer)
    }
  }, [runDecayCheck, needsCheckIn])

  // Dynamic Prescription Logic (The "Ralph" Bridge)
  useEffect(() => {
    if (context.intakeStatus === 'completed') {
      const scores = calculateBusinessScores(context)

      // If we have a recommendation and it's not yet applied
      if (scores.recommendedModuleId && context.recommendedModuleId !== scores.recommendedModuleId) {
        console.log(`[Ralph] Prescribing Module ${scores.recommendedModuleId} for constraint: ${scores.primaryConstraint}`)

        updateContext({ recommendedModuleId: scores.recommendedModuleId })
        unlockSpecificModule(scores.recommendedModuleId)
      }
    }
  }, [context.intakeStatus, context.vitals, context.founder, context.businessModel, updateContext, unlockSpecificModule, context.recommendedModuleId])

  if (context.intakeStatus !== 'completed') {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex items-center justify-center">
        <ModeIndicator />
        <ScenarioBanner />
        <div className="w-full">
          <DiagnosticFlow onComplete={() => updateContext({ intakeStatus: 'completed' })} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <ModeIndicator />
      <ScenarioBanner />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Rocket className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">SMB Coach AI</span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            title="AI Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Daily Check-in Modal (Toothbrush Test) */}
      {showCheckIn && <DailyCheckInModal onClose={() => setShowCheckIn(false)} />}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeModuleId === 1 ? (
          <Module1 onBack={() => setActiveModuleId(null)} />
        ) : activeModuleId === 2 ? (
          <Module2 onBack={() => setActiveModuleId(null)} />
        ) : activeModuleId === 3 ? (
          <Module3 onBack={() => setActiveModuleId(null)} />
        ) : activeModuleId === 4 ? (
          <Module4 onBack={() => setActiveModuleId(null)} />
        ) : activeModuleId === 5 ? (
          <Module5 onBack={() => setActiveModuleId(null)} />
        ) : activeModuleId === 6 ? (
          <Module6 onBack={() => setActiveModuleId(null)} />
        ) : activeModuleId === 7 ? (
          <Module7 onBack={() => setActiveModuleId(null)} />
        ) : activeModuleId ? (
          <ModuleView
            moduleId={activeModuleId}
            onBack={() => setActiveModuleId(null)}
          />
        ) : (
          <div className="animate-in fade-in duration-500">
            {/* The Investor-Grade Diagnostic */}
            <DiagnosticDashboard />

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white">Operational Modules</h2>
                <span className="text-sm text-gray-500">Execute these to unlock your lever</span>
              </div>
              {/* Contextual Intro: Why this module was chosen */}
              {context.recommendedModuleId && (
                <p className="text-sm text-gray-400 mb-4">
                  Based on your <span className="text-amber-400 font-medium">{calculateBusinessScores(context).primaryConstraint.replace('_', ' ')}</span> constraint
                  {context.goals.structuralFix && (
                    <> and your admission that you're avoiding "<span className="text-gray-300">{context.goals.structuralFix}</span>"</>
                  )}, start with <span className="text-amber-400 font-medium">{SYSTEM_TOOLS.find(t => t.id === context.recommendedModuleId)?.title || 'the highlighted module'}</span>.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SYSTEM_TOOLS.map((info) => {
                const status = modules.find(m => m.id === info.id)
                const isRecommended = context.recommendedModuleId === info.id

                return (
                  <ModuleCard
                    key={info.id}
                    title={info.title}
                    description={info.description}
                    isLocked={status?.isLocked ?? true}
                    isCompleted={status?.isCompleted ?? false}
                    isRecommended={isRecommended}
                    onClick={() => setActiveModuleId(info.id)}
                  />
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div >
  )
}
export default App

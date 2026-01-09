import { useState } from 'react'
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
import { BusinessIntake } from './components/diagnostic/BusinessIntake'
import { Rocket, LineChart, Target, Filter, DollarSign, Repeat, Mic, Settings } from 'lucide-react'

const SYSTEM_TOOLS = [
  { id: 1, title: 'Offer Diagnostic', description: 'Stress-test your offer against the "Grandmother Test".', icon: Rocket },
  { id: 2, title: 'Visual Funnel Builder', description: 'Map your customer journey and plug leaky buckets.', icon: LineChart },
  { id: 3, title: 'Lead Rhythm System', description: 'Design a sustainable weekly lead generation cadence.', icon: Target },
  { id: 4, title: 'Deep Quality Filter', description: 'Automate lead qualification with custom swipe files.', icon: Filter },
  { id: 5, title: 'Expense Auditor', description: 'Recover wasted budget to fund your growth.', icon: DollarSign },
  { id: 6, title: 'Reliability Protocol', description: 'Standardize delivery to remove founder bottlenecks.', icon: Repeat },
  { id: 7, title: 'Pitch Deck Architect', description: 'Craft a compelling narrative for stakeholders.', icon: Mic },
]

function App() {
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const { modules, context, updateContext } = useBusinessStore()

  if (context.intakeStatus !== 'completed') {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex items-center justify-center">
        <div className="w-full">
          <BusinessIntake onComplete={() => updateContext({ intakeStatus: 'completed' })} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">

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
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-white">Mission Control</h1>
              <p className="text-gray-400">
                Activate these systems to operationalize your growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SYSTEM_TOOLS.map((info) => {
                const status = modules.find(m => m.id === info.id)
                return (
                  <ModuleCard
                    key={info.id}
                    title={info.title}
                    description={info.description}
                    isLocked={status?.isLocked ?? true}
                    isCompleted={status?.isCompleted ?? false}
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

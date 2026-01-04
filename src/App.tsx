import { useState } from 'react'
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
import { Rocket, LineChart, Target, Filter, DollarSign, Repeat, Mic } from 'lucide-react'

const MODULE_INFO = [
  { id: 1, title: 'Offer Diagnostic', description: 'Analyze your headline and offer for "Grandmother Test" clarity.', icon: Rocket },
  { id: 2, title: 'Visual Funnel', description: 'Map your sales process and find the "Leaky Bucket".', icon: LineChart },
  { id: 3, title: 'Lead System', description: 'Build a weekly rhythm that fits your time budget.', icon: Target },
  { id: 4, title: 'Quality Architect', description: 'Create swipe files to filter out bad leads.', icon: Filter },
  { id: 5, title: 'Cost Efficiency', description: 'Audit your spend and finding "Hidden Money".', icon: DollarSign },
  { id: 6, title: 'Reliability Engine', description: 'Design a fail-safe protocol for consistency.', icon: Repeat },
  { id: 7, title: 'Pitch Architect', description: 'Align your story for Investors, Customers, and Team.', icon: Mic },
]

function App() {
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null)
  const { modules } = useBusinessStore()

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
          <div className="text-xs font-mono text-muted-foreground">
            Make your business boringly reliable.
          </div>
        </div>
      </header>

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
              <h1 className="text-3xl font-bold mb-2">Your Growth Infrastructure</h1>
              <p className="text-muted-foreground">
                Seven tools to move from "Hustle" to "System". Complete them in order.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MODULE_INFO.map((info) => {
                const status = modules.find(m => m.id === info.id)
                return (
                  <ModuleCard
                    key={info.id}
                    id={info.id}
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
    </div>
  )
}

export default App

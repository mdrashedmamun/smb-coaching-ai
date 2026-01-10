import { useState, useEffect } from 'react'
import { aiService } from '../../services/ai'
import { Check, Key, Loader2, X, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [key, setKey] = useState('')
    const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        if (isOpen) {
            const savedKey = aiService.getKey()
            if (savedKey) {
                setKey(savedKey)
                setStatus('success')
            } else {
                setKey('')
                setStatus('idle')
            }
        }
    }, [isOpen])

    const handleSave = async () => {
        if (!key) return
        setStatus('validating')
        setErrorMsg('')
        const result = await aiService.validateKey(key)

        if (result.isValid) {
            aiService.setKey(key)
            setStatus('success')
            // Close after short delay
            setTimeout(() => onClose(), 1000)
        } else {
            setStatus('error')
            setErrorMsg(result.error || "Unknown error")
        }
    }

    const handleClear = () => {
        aiService.removeKey()
        setKey('')
        setStatus('idle')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-2xl relative animate-in zoom-in-95 duration-200">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">API Settings</h2>
                        <p className="text-xs text-muted-foreground">Bring Your Own Key (Gemini)</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Google Gemini API Key</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={key}
                                onChange={(e) => {
                                    setKey(e.target.value)
                                    setStatus('idle')
                                }}
                                placeholder="AIzaSy..."
                                className={cn(
                                    "w-full bg-background border rounded-lg px-4 py-3 pr-10 outline-none focus:ring-2 transition-all font-mono text-sm",
                                    status === 'error' ? "border-destructive focus:ring-destructive/20" : "border-input focus:ring-primary/20",
                                    status === 'success' ? "border-green-500 focus:ring-green-500/20" : ""
                                )}
                            />
                            <div className="absolute right-3 top-3">
                                {status === 'validating' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                {status === 'success' && <Check className="w-4 h-4 text-green-500" />}
                                {status === 'error' && <AlertTriangle className="w-4 h-4 text-destructive" />}
                            </div>
                        </div>
                        {status === 'error' && (
                            <p className="text-xs text-destructive">Verification Failed: {errorMsg}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-primary">Google AI Studio</a>.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        {status === 'success' && (
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                                Remove Key
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={!key || status === 'validating'}
                            className="flex-1 bg-primary text-primary-foreground font-bold py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {status === 'validating' ? 'Checking...' : status === 'success' ? 'Saved' : 'Save & Connect'}
                        </button>
                    </div>

                    {/* Developer Tools */}
                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-3">Developer Tools</p>
                        <button
                            onClick={() => {
                                if (confirm('This will reset all your data and restart the intake. Continue?')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="w-full px-4 py-2 text-sm text-destructive border border-destructive/30 hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            Reset All Data & Restart
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

import React, { useState } from 'react'
import Stepper from './components/Stepper'
import Step1 from './components/steps/Step1'
import Step2 from './components/steps/Step2'
import Step3 from './components/steps/Step3'
import Step4 from './components/steps/Step4'
import Step5 from './components/steps/Step5'
import HistoryPanel from './components/HistoryPanel'
import { useFormState } from './hooks/useFormState'
import { runCalc } from './utils/calcEngine'
import type { CalcResults } from './types'

export default function App() {
  const { form, update, reset } = useFormState()
  const [step, setStep] = useState(1)
  const [results, setResults] = useState<CalcResults | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const goStep = (n: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep(n)
  }

  const calculate = () => {
    const res = runCalc(form)
    setResults(res)
    goStep(5)
  }

  const handleReset = () => {
    if (confirm('Réinitialiser tous les champs ?')) {
      reset()
      setStep(1)
      setResults(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy font-dm">

      {/* Header */}
      <header className="bg-navy border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div>
          <span className="font-syne font-black text-xl text-white tracking-tight">
            Thermo<span className="text-orange">Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHistory(true)}
            className="text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            📋 Historique
          </button>
          <span className="text-slate-500 text-xs uppercase tracking-widest hidden sm:block">
            Calcul DPE — Méthode française
          </span>
        </div>
      </header>

      {/* Stepper */}
      <Stepper current={step} />

      {/* Content */}
      <main className="flex-1 bg-cream px-4 py-10">

        {step === 1 && (
          <Step1
            form={form}
            update={update}
            onNext={() => goStep(2)}
            onReset={handleReset}
          />
        )}

        {step === 2 && (
          <Step2
            form={form}
            update={update}
            onNext={() => goStep(3)}
            onPrev={() => goStep(1)}
          />
        )}

        {step === 3 && (
          <Step3
            form={form}
            update={update}
            onNext={() => goStep(4)}
            onPrev={() => goStep(2)}
          />
        )}

        {step === 4 && (
          <Step4
            form={form}
            update={update}
            onCalculate={calculate}
            onPrev={() => goStep(3)}
          />
        )}

        {step === 5 && results && (
          <Step5
            results={results}
            form={form}
            onNewCalc={() => { reset(); goStep(1) }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-navy border-t border-white/10 px-8 py-4 text-center">
        <p className="text-slate-500 text-xs">
          ThermoPro — Outil de calcul indicatif, non opposable au DPE officiel réglementaire.
        </p>
      </footer>

      {/* History modal */}
      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}

    </div>
  )
}

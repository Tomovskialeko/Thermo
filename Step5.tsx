import React, { useCallback, useRef, useState } from 'react'
import type { FormData, CalcResults } from '../../types'
import { CLASSE_DESC } from '../../utils/calcEngine'
import { generatePDF } from '../../utils/pdfExport'
import { saveToHistory } from '../HistoryPanel'
import DpeGauge from '../DpeGauge'
import DeperditionsTable from '../DeperditionsTable'
import DeperditionsChart from '../DeperditionsChart'
import Recommendations from '../Recommendations'

interface Props {
  results: CalcResults
  form: FormData
  onNewCalc: () => void
}

export default function Step5({ results, form, onNewCalc }: Props) {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChartReady = useCallback((canvas: HTMLCanvasElement) => {
    chartCanvasRef.current = canvas
  }, [])

  const handlePDF = async () => {
    setPdfLoading(true)
    try {
      await generatePDF(form, results, chartCanvasRef.current)
    } finally {
      setPdfLoading(false)
    }
  }

  const handleSave = () => {
    saveToHistory({
      date: new Date().toLocaleDateString('fr-FR'),
      surface: form.surface,
      classe: results.classe,
      conso: results.conso,
      typeBat: form.typeBat,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* DPE Hero */}
      <div
        className="rounded-2xl p-8 mb-6 flex flex-col sm:flex-row items-center gap-8 shadow-xl"
        style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f2540)' }}
      >
        <div
          className="w-28 h-28 rounded-2xl flex items-center justify-center font-syne font-black text-5xl text-white flex-shrink-0 shadow-2xl"
          style={{ background: results.classeColor }}
        >
          {results.classe}
        </div>
        <div>
          <h1 className="font-syne font-black text-2xl text-white mb-1">
            Classe énergétique {results.classe}
          </h1>
          <p className="text-slate-400 text-sm mb-4">{CLASSE_DESC[results.classe]}</p>
          <div className="flex flex-wrap gap-3">
            {[
              { val: results.conso, unit: 'kWh/m²/an', label: 'Consommation' },
              { val: results.co2, unit: 'kg CO₂/m²/an', label: 'Émissions CO₂' },
              { val: results.gCoeff, unit: 'W/m²·K', label: 'Coeff. G' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[90px]">
                <div className="font-syne font-bold text-xl text-orange-light">{s.val}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DpeGauge classe={results.classe} conso={results.conso} />
      <DeperditionsTable postes={results.postes} totalDep={results.totalDep} />
      <DeperditionsChart postes={results.postes} totalDep={results.totalDep} onChartReady={handleChartReady} />
      <Recommendations recos={results.recommandations} />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center mt-4 mb-8">
        <button
          className="btn-primary flex items-center gap-2"
          onClick={handlePDF}
          disabled={pdfLoading}
        >
          {pdfLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Génération PDF…
            </>
          ) : (
            '⬇ Télécharger le rapport PDF'
          )}
        </button>

        <button className="btn-navy flex items-center gap-2" onClick={onNewCalc}>
          🔄 Nouveau calcul
        </button>

        <button
          className="btn-secondary flex items-center gap-2"
          onClick={handleSave}
        >
          {saved ? '✅ Sauvegardé !' : '💾 Sauvegarder'}
        </button>
      </div>

    </div>
  )
}

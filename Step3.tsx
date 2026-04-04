import React from 'react'
import RadioCard from '../RadioCard'
import type { FormData } from '../../types'

interface Props {
  form: FormData
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void
  onNext: () => void
  onPrev: () => void
}

const ISOLANTS = [
  { value: 0,     label: 'Aucune isolation' },
  { value: 0.036, label: 'Laine de verre (λ=0.036)' },
  { value: 0.039, label: 'Laine de roche (λ=0.039)' },
  { value: 0.034, label: 'Polystyrène PSE (λ=0.034)' },
  { value: 0.025, label: 'Polyuréthane PUR (λ=0.025)' },
]

export default function Step3({ form, update, onNext, onPrev }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-navy-mid to-navy px-9 py-7 text-white">
        <h2 className="font-syne font-bold text-xl mb-1">Isolation thermique</h2>
        <p className="text-gray-400 text-sm">Murs, toiture et plancher bas</p>
      </div>

      <div className="p-9 space-y-6">

        {/* ── Murs ── */}
        <p className="section-title">Isolation des murs</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Type d'isolant murs</label>
            <select
              value={form.isolMurLambda}
              onChange={e => update('isolMurLambda', parseFloat(e.target.value))}
              className="form-input"
            >
              {ISOLANTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Épaisseur isolant murs (cm)</label>
            <input
              type="number"
              value={form.isolMurEp}
              min={0} max={30}
              onChange={e => update('isolMurEp', parseInt(e.target.value) || 0)}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="field-label">Position de l'isolant</label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { v: 'int', l: 'Intérieure' },
              { v: 'ext', l: 'Extérieure' },
              { v: 'non', l: 'Non isolé' },
            ] as const).map(({ v, l }) => (
              <RadioCard key={v} label={l} selected={form.posIsolMur === v} onClick={() => update('posIsolMur', v)} />
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* ── Toiture ── */}
        <p className="section-title">Isolation toiture / plancher haut</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Type d'isolant toiture</label>
            <select
              value={form.isolToitLambda}
              onChange={e => update('isolToitLambda', parseFloat(e.target.value))}
              className="form-input"
            >
              {ISOLANTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Épaisseur isolant toiture (cm)</label>
            <input
              type="number"
              value={form.isolToitEp}
              min={0} max={40}
              onChange={e => update('isolToitEp', parseInt(e.target.value) || 0)}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="field-label">Type de toiture</label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { v: 'combles', l: 'Combles perdus' },
              { v: 'amenages', l: 'Combles aménagés' },
              { v: 'terrasse', l: 'Toit terrasse' },
            ] as const).map(({ v, l }) => (
              <RadioCard key={v} label={l} selected={form.typeToit === v} onClick={() => update('typeToit', v)} />
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* ── Plancher ── */}
        <p className="section-title">Isolation plancher bas</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Type de plancher bas</label>
            <select
              value={form.typePlancher}
              onChange={e => update('typePlancher', e.target.value as FormData['typePlancher'])}
              className="form-input"
            >
              <option value="terre">Sur terre-plein</option>
              <option value="vide">Vide sanitaire</option>
              <option value="sous-sol">Sous-sol</option>
            </select>
          </div>
          <div>
            <label className="field-label">Épaisseur isolation plancher (cm)</label>
            <input
              type="number"
              value={form.isolPlancherEp}
              min={0} max={20}
              onChange={e => update('isolPlancherEp', parseInt(e.target.value) || 0)}
              className="form-input"
            />
            <p className="field-hint">0 = non isolé</p>
          </div>
        </div>

      </div>

      <div className="flex justify-between items-center px-9 py-5 border-t border-gray-100 bg-cream">
        <button className="btn-secondary" onClick={onPrev}>← Retour</button>
        <button className="btn-primary" onClick={onNext}>Suivant →</button>
      </div>
    </div>
  )
}

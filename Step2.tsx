import React from 'react'
import RadioCard from '../RadioCard'
import type { FormData } from '../../types'

interface Props {
  form: FormData
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void
  onNext: () => void
  onPrev: () => void
}

export default function Step2({ form, update, onNext, onPrev }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-navy-mid to-navy px-9 py-7 text-white">
        <h2 className="font-syne font-bold text-xl mb-1">Parois et ouvertures</h2>
        <p className="text-gray-400 text-sm">Fenêtres, portes et type de vitrage</p>
      </div>

      <div className="p-9 space-y-6">

        <p className="section-title">Fenêtres</p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'fenSimple', label: 'Simple vitrage', key: 'fenSimple' as const },
            { id: 'fenDouble', label: 'Double vitrage', key: 'fenDouble' as const },
            { id: 'fenTriple', label: 'Triple vitrage', key: 'fenTriple' as const },
          ].map(({ id, label, key }) => (
            <div key={id}>
              <label className="field-label">{label}</label>
              <input
                type="number"
                id={id}
                value={form[key] as number}
                min={0} max={30}
                onChange={e => update(key, parseInt(e.target.value) || 0)}
                className="form-input"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="field-label">Taille moyenne des fenêtres</label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { v: 'S', l: 'S — 0.6 m²' },
              { v: 'M', l: 'M — 1.2 m²' },
              { v: 'L', l: 'L — 2.0 m²' },
            ] as const).map(({ v, l }) => (
              <RadioCard key={v} label={l} selected={form.fenTaille === v} onClick={() => update('fenTaille', v)} />
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />
        <p className="section-title">Portes extérieures</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Nombre de portes</label>
            <input
              type="number"
              value={form.nbPortes}
              min={0} max={10}
              onChange={e => update('nbPortes', parseInt(e.target.value) || 0)}
              className="form-input"
            />
          </div>
          <div>
            <label className="field-label">Type de porte</label>
            <select
              value={form.typePorte}
              onChange={e => update('typePorte', parseFloat(e.target.value))}
              className="form-input"
            >
              <option value={3.0}>Porte pleine bois (U=3.0)</option>
              <option value={1.5}>Porte isolée (U=1.5)</option>
              <option value={4.0}>Porte vitrée simple (U=4.0)</option>
              <option value={2.0}>Porte vitrée double (U=2.0)</option>
            </select>
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

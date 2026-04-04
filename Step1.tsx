import React from 'react'
import RadioCard from '../RadioCard'
import type { FormData } from '../../types'

interface Props {
  form: FormData
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void
  onNext: () => void
  onReset: () => void
}

export default function Step1({ form, update, onNext, onReset }: Props) {
  return (
    <div className="form-card bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-navy-mid to-navy px-9 py-7 text-white">
        <h2 className="font-syne font-bold text-xl mb-1">Type de bâtiment</h2>
        <p className="text-gray-400 text-sm">Caractéristiques générales du bâtiment à analyser</p>
      </div>

      <div className="p-9 space-y-6">

        {/* Type de logement */}
        <div>
          <label className="field-label">Type de logement</label>
          <div className="grid grid-cols-2 gap-3">
            <RadioCard
              label="Maison individuelle"
              icon="🏠"
              selected={form.typeBat === 'maison'}
              onClick={() => update('typeBat', 'maison')}
            />
            <RadioCard
              label="Appartement"
              icon="🏢"
              selected={form.typeBat === 'appartement'}
              onClick={() => update('typeBat', 'appartement')}
            />
          </div>
        </div>

        {/* Mitoyenneté (maison seulement) */}
        {form.typeBat === 'maison' && (
          <div>
            <label className="field-label">Mitoyenneté</label>
            <div className="grid grid-cols-3 gap-3">
              {(['0', '1', '2'] as const).map(v => (
                <RadioCard
                  key={v}
                  label={v === '0' ? 'Individuel' : v === '1' ? '1 côté mitoyen' : '2 côtés mitoyens'}
                  selected={form.mitoyen === v}
                  onClick={() => update('mitoyen', v)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Nombre d'étages (maison seulement) */}
        {form.typeBat === 'maison' && (
          <div>
            <label className="field-label">Nombre d'étages</label>
            <div className="grid grid-cols-2 gap-3">
              <RadioCard label="1 étage" selected={form.etages === '1'} onClick={() => update('etages', '1')} />
              <RadioCard label="2 étages" selected={form.etages === '2'} onClick={() => update('etages', '2')} />
            </div>
          </div>
        )}

        {/* Étage appartement */}
        {form.typeBat === 'appartement' && (
          <div>
            <label className="field-label">Étage de l'appartement</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { v: 'rdc', l: 'Rez-de-chaussée' },
                { v: 'milieu', l: 'Étage intermédiaire' },
                { v: 'dernier', l: 'Dernier étage' },
              ] as const).map(({ v, l }) => (
                <RadioCard key={v} label={l} selected={form.etageAppt === v} onClick={() => update('etageAppt', v)} />
              ))}
            </div>
          </div>
        )}

        {/* Surface */}
        <div>
          <label className="field-label">Surface habitable</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={form.surface}
              min={10} max={1000}
              onChange={e => update('surface', parseFloat(e.target.value) || 0)}
              className="form-input max-w-xs"
              placeholder="ex: 100"
            />
            <span className="text-gray-400 text-sm font-medium">m²</span>
          </div>
          <p className="field-hint">Hors garage, cave, terrasse</p>
        </div>

      </div>

      <div className="flex justify-between items-center px-9 py-5 border-t border-gray-100 bg-cream">
        <button className="btn-secondary" onClick={onReset}>🔄 Réinitialiser</button>
        <button className="btn-primary" onClick={onNext}>Suivant →</button>
      </div>
    </div>
  )
}

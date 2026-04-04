import React from 'react'
import RadioCard from '../RadioCard'
import type { FormData } from '../../types'

interface Props {
  form: FormData
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void
  onCalculate: () => void
  onPrev: () => void
}

export default function Step4({ form, update, onCalculate, onPrev }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-navy-mid to-navy px-9 py-7 text-white">
        <h2 className="font-syne font-bold text-xl mb-1">Systèmes et équipements</h2>
        <p className="text-gray-400 text-sm">Chauffage et ventilation</p>
      </div>

      <div className="p-9 space-y-6">

        <p className="section-title">Système de chauffage</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {([
            { v: 'elec', l: 'Électrique direct', icon: '⚡' },
            { v: 'pac', l: 'Pompe à chaleur', icon: '♻️' },
            { v: 'gaz', l: 'Gaz naturel', icon: '🔥' },
            { v: 'fioul', l: 'Fioul', icon: '🛢️' },
            { v: 'bois', l: 'Bois / Poêle', icon: '🪵' },
            { v: 'district', l: 'Réseau de chaleur', icon: '🏙️' },
          ] as const).map(({ v, l, icon }) => (
            <RadioCard key={v} label={l} icon={icon} selected={form.chauffage === v} onClick={() => update('chauffage', v)} />
          ))}
        </div>

        <div>
          <label className="field-label">Année d'installation</label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { v: 'avant1980', l: 'Avant 1980' },
              { v: '1980-2000', l: '1980 – 2000' },
              { v: 'apres2000', l: 'Après 2000' },
            ] as const).map(({ v, l }) => (
              <RadioCard key={v} label={l} selected={form.anneeChauf === v} onClick={() => update('anneeChauf', v)} />
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />
        <p className="section-title">Ventilation</p>

        <div className="grid grid-cols-2 gap-3">
          {([
            { v: 'aucune', l: 'Aucune' },
            { v: 'naturelle', l: 'Ventilation naturelle' },
            { v: 'simple', l: 'VMC simple flux' },
            { v: 'double', l: 'VMC double flux' },
          ] as const).map(({ v, l }) => (
            <RadioCard key={v} label={l} selected={form.ventilation === v} onClick={() => update('ventilation', v)} />
          ))}
        </div>

      </div>

      <div className="flex justify-between items-center px-9 py-5 border-t border-gray-100 bg-cream">
        <button className="btn-secondary" onClick={onPrev}>← Retour</button>
        <button className="btn-primary" onClick={onCalculate}>⚡ Calculer le DPE</button>
      </div>
    </div>
  )
}

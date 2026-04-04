import React from 'react'
import type { Reco } from '../../types'

interface Props {
  recos: Reco[]
}

export default function Recommendations({ recos }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-7 mb-6">
      <h3 className="font-syne font-bold text-navy text-base mb-5">💡 Recommandations prioritaires</h3>
      <div className="space-y-4">
        {recos.map((r, i) => (
          <div
            key={i}
            className="flex gap-4 items-start bg-slate-50 rounded-xl p-4 border-l-4 border-orange"
          >
            <div className="w-8 h-8 rounded-full bg-orange text-white font-syne font-bold text-sm flex items-center justify-center flex-shrink-0">
              {i + 1}
            </div>
            <div>
              <h4 className="font-semibold text-navy text-sm mb-1">{r.titre}</h4>
              <p className="text-gray-500 text-xs mb-3">{r.desc}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">
                  +{r.classes} classe(s)
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                  ~{r.economie}€/an d'économie
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-800">
                  Coût estimé : {r.cout}€
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

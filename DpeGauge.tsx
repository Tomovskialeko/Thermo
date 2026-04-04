import React from 'react'
import { GAUGE_DATA } from '../../utils/calcEngine'

interface Props {
  classe: string
  conso: number
}

export default function DpeGauge({ classe, conso }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-7 mb-6">
      <h3 className="font-syne font-bold text-navy text-base mb-5">🎯 Étiquette énergétique DPE</h3>
      <div className="space-y-1.5">
        {GAUGE_DATA.map((g, i) => {
          const isActive = g.l === classe
          const barW = 30 + i * 8
          return (
            <div key={g.l} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center font-syne font-bold text-xs text-white flex-shrink-0"
                style={{ background: g.color }}
              >
                {g.l}
              </div>
              <div className="flex-1">
                <div
                  className="h-6 rounded flex items-center pl-3 text-xs text-white/80 transition-all duration-300"
                  style={{
                    background: g.color,
                    width: `${barW}%`,
                    opacity: isActive ? 1 : 0.4,
                  }}
                >
                  {g.range}
                </div>
              </div>
              {isActive && (
                <span className="text-orange font-syne font-bold text-sm whitespace-nowrap">
                  ◄ {conso} kWh/m²/an
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

import React from 'react'

const STEPS = ['Bâtiment', 'Ouvertures', 'Isolation', 'Équipements', 'Résultats']

interface Props {
  current: number // 1-indexed
}

export default function Stepper({ current }: Props) {
  return (
    <div className="bg-navy-mid px-8 py-5">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center">
          {STEPS.map((label, i) => {
            const n = i + 1
            const isActive = n === current
            const isDone = n < current
            return (
              <React.Fragment key={n}>
                <div className="flex flex-col items-center relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-syne font-bold text-xs transition-all duration-300 z-10 ${
                      isActive
                        ? 'bg-orange text-white shadow-lg shadow-orange/40'
                        : isDone
                        ? 'bg-navy-light text-white'
                        : 'bg-white/10 text-gray-400 border-2 border-white/20'
                    }`}
                  >
                    {isDone ? '✓' : n}
                  </div>
                  <span
                    className={`absolute top-9 text-xs uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                      isActive ? 'text-orange-light' : isDone ? 'text-white/50' : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                      isDone ? 'bg-navy-light' : 'bg-white/10'
                    }`}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-0.5 bg-white/10 rounded-full max-w-3xl">
          <div
            className="h-full bg-orange rounded-full transition-all duration-500"
            style={{ width: `${(current / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

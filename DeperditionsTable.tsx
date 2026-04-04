import React from 'react'
import type { DeperPostData } from '../../types'

interface Props {
  postes: DeperPostData[]
  totalDep: number
}

export default function DeperditionsTable({ postes, totalDep }: Props) {
  const active = postes.filter(p => p.deperdition > 0)

  return (
    <div className="bg-white rounded-2xl shadow-md p-7 mb-6">
      <h3 className="font-syne font-bold text-navy text-base mb-5">📊 Déperditions par poste</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {['Poste', 'Surface m²', 'U W/m²·K', 'Déperdition W/K', 'Part %'].map(h => (
                <th
                  key={h}
                  className="bg-navy-mid text-white font-syne font-semibold text-xs uppercase tracking-wide px-4 py-3 text-left first:rounded-tl-lg last:rounded-tr-lg"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {active.map((p, i) => {
              const pct = totalDep > 0 ? (p.deperdition / totalDep) * 100 : 0
              return (
                <tr key={p.nom} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-2.5 text-navy font-medium">{p.nom}</td>
                  <td className="px-4 py-2.5 text-gray-600">{p.surface != null ? p.surface.toFixed(1) : '—'}</td>
                  <td className="px-4 py-2.5 text-gray-600">{p.u != null ? p.u.toFixed(2) : '—'}</td>
                  <td className="px-4 py-2.5 text-gray-700 font-medium">{Math.round(p.deperdition)} W/K</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{pct.toFixed(1)}%</span>
                      <div className="h-1.5 rounded-full bg-orange/60" style={{ width: `${Math.round(pct)}px` }} />
                    </div>
                  </td>
                </tr>
              )
            })}
            <tr className="bg-slate-100 border-t-2 border-navy-light">
              <td colSpan={3} className="px-4 py-3 font-syne font-bold text-navy-mid">TOTAL</td>
              <td className="px-4 py-3 font-syne font-bold text-navy-mid">{Math.round(totalDep)} W/K</td>
              <td className="px-4 py-3 font-syne font-bold text-navy-mid">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

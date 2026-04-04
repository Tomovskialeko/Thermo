import React, { useEffect, useState } from 'react'
import type { HistoryEntry } from '../../types'
import { CLASSE_COLORS } from '../../utils/calcEngine'

const STORAGE_KEY = 'thermopro_history'

export function saveToHistory(entry: Omit<HistoryEntry, 'id'>) {
  const stored: HistoryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  const newEntry: HistoryEntry = { ...entry, id: Date.now().toString() }
  const updated = [newEntry, ...stored].slice(0, 10)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function loadHistory(): HistoryEntry[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

interface Props {
  onClose: () => void
}

export default function HistoryPanel({ onClose }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>([])

  useEffect(() => {
    setEntries(loadHistory())
  }, [])

  const clearHistory = () => {
    if (confirm('Effacer tout l\'historique ?')) {
      localStorage.removeItem(STORAGE_KEY)
      setEntries([])
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-syne font-bold text-navy text-lg">📋 Historique des calculs</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {entries.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">Aucun calcul sauvegardé</p>
          ) : (
            <div className="space-y-3">
              {entries.map(e => (
                <div key={e.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-gray-100">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-syne font-bold text-lg text-white flex-shrink-0"
                    style={{ background: CLASSE_COLORS[e.classe] ?? '#888' }}
                  >
                    {e.classe}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy text-sm">
                      {e.typeBat === 'maison' ? 'Maison' : 'Appartement'} — {e.surface} m²
                    </p>
                    <p className="text-gray-400 text-xs">{e.date} · {e.conso} kWh/m²/an</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {entries.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-600 transition-colors">
              🗑 Effacer l'historique
            </button>
            <button onClick={onClose} className="btn-secondary text-sm px-4 py-2">Fermer</button>
          </div>
        )}
      </div>
    </div>
  )
}

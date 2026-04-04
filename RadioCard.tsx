import React from 'react'

interface Props {
  label: string
  selected: boolean
  onClick: () => void
  icon?: string
}

export default function RadioCard({ label, selected, onClick, icon }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`radio-card ${selected ? 'selected' : ''}`}
    >
      <span
        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          selected ? 'border-orange bg-orange' : 'border-gray-300'
        }`}
      >
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  )
}

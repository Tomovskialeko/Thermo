import React, { useRef, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { DeperPostData } from '../../types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  postes: DeperPostData[]
  totalDep: number
  onChartReady?: (canvas: HTMLCanvasElement) => void
}

export default function DeperditionsChart({ postes, totalDep, onChartReady }: Props) {
  const chartRef = useRef<ChartJS<'doughnut'>>(null)

  const active = postes.filter(p => p.deperdition > 0)

  useEffect(() => {
    if (chartRef.current && onChartReady) {
      const canvas = chartRef.current.canvas
      if (canvas) onChartReady(canvas)
    }
  }, [onChartReady])

  const data = {
    labels: active.map(p => p.nom),
    datasets: [{
      data: active.map(p => Math.round((p.deperdition / totalDep) * 100)),
      backgroundColor: active.map(p => p.color),
      borderWidth: 2,
      borderColor: '#ffffff',
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { font: { size: 11 }, padding: 14, boxWidth: 14 },
      },
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; parsed: number }) =>
            `${ctx.label} : ${ctx.parsed}%`,
        },
      },
    },
    cutout: '60%',
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-7 mb-6">
      <h3 className="font-syne font-bold text-navy text-base mb-5">🥧 Répartition des déperditions</h3>
      <div style={{ height: 280 }}>
        <Doughnut ref={chartRef} data={data} options={options} />
      </div>
    </div>
  )
}

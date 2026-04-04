import type { FormData, CalcResults } from '../types'
import { CLASSE_COLORS, GAUGE_DATA } from './calcEngine'

// Dynamically import jsPDF to keep bundle lean
async function getJsPDF() {
  const { jsPDF } = await import('jspdf')
  return jsPDF
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

export async function generatePDF(form: FormData, results: CalcResults, chartCanvas?: HTMLCanvasElement | null) {
  const JsPDF = await getJsPDF()
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210, ml = 18, mr = 18, tw = W - ml - mr
  let y = 0

  const drawPageFooter = (page: number, total: number) => {
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Rapport généré par ThermoPro — Calcul indicatif non opposable au DPE officiel — Page ${page}/${total}`,
      W / 2, 290, { align: 'center' }
    )
  }

  // ── PAGE 1 — Résumé exécutif ──────────────────────────────────────────────
  // Header
  const navyMid = hexToRgb('#1e3a5f')
  doc.setFillColor(navyMid.r, navyMid.g, navyMid.b)
  doc.rect(0, 0, W, 28, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text('ThermoPro', ml, 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(138, 154, 176)
  doc.text('Rapport de calcul DPE indicatif', ml, 21)
  const today = new Date().toLocaleDateString('fr-FR')
  doc.text(`Date : ${today}`, W - mr, 21, { align: 'right' })
  // Orange line
  doc.setFillColor(232, 115, 42)
  doc.rect(0, 28, W, 2, 'F')

  y = 40
  // DPE class block
  const clColor = hexToRgb(results.classeColor)
  doc.setFillColor(clColor.r, clColor.g, clColor.b)
  doc.roundedRect(ml, y, 38, 38, 4, 4, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(36)
  doc.setTextColor(255, 255, 255)
  doc.text(results.classe, ml + 19, y + 26, { align: 'center' })

  doc.setTextColor(navyMid.r, navyMid.g, navyMid.b)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(`Classe énergétique ${results.classe}`, ml + 46, y + 10)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Consommation : ${results.conso} kWh/m²/an`, ml + 46, y + 20)
  doc.text(`Émissions CO₂ : ${results.co2} kg CO₂/m²/an`, ml + 46, y + 28)
  doc.text(`Coefficient G : ${results.gCoeff} W/m²·K`, ml + 46, y + 36)

  y += 52

  // DPE gauge
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(navyMid.r, navyMid.g, navyMid.b)
  doc.text('Étiquette énergie DPE', ml, y)
  y += 6
  GAUGE_DATA.forEach((g, i) => {
    const gColor = hexToRgb(g.color)
    const barW = 28 + i * 10
    const isActive = g.l === results.classe
    doc.setFillColor(gColor.r, gColor.g, gColor.b)
    doc.setGlobalAlpha ? null : null
    doc.rect(ml, y, barW, 7, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255)
    doc.text(g.l, ml + 2, y + 5)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.text(g.range, ml + barW + 3, y + 5)
    if (isActive) {
      doc.setTextColor(232, 115, 42)
      doc.setFont('helvetica', 'bold')
      doc.text(`◄ ${results.conso} kWh/m²/an`, ml + barW + 38, y + 5)
    }
    y += 9
  })

  y += 6

  // Building info
  doc.setFillColor(248, 249, 250)
  doc.roundedRect(ml, y, tw, 36, 3, 3, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(navyMid.r, navyMid.g, navyMid.b)
  doc.text('Informations du bâtiment', ml + 6, y + 8)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  const typLabel = form.typeBat === 'maison' ? 'Maison individuelle' : 'Appartement'
  const mitLabel = form.typeBat === 'maison' ? `${form.mitoyen} côté(s) mitoyen(s)` : `Étage : ${form.etageAppt}`
  doc.text(`Type : ${typLabel}`, ml + 6, y + 16)
  doc.text(`Surface habitable : ${form.surface} m²`, ml + 6, y + 23)
  doc.text(mitLabel, ml + 6, y + 30)
  const ventLabel: Record<string, string> = { aucune: 'Aucune', naturelle: 'Ventilation naturelle', simple: 'VMC simple flux', double: 'VMC double flux' }
  doc.text(`Ventilation : ${ventLabel[form.ventilation] ?? form.ventilation}`, ml + tw / 2, y + 16)
  const chaufLabel: Record<string, string> = { elec: 'Électrique', pac: 'Pompe à chaleur', gaz: 'Gaz naturel', fioul: 'Fioul', bois: 'Bois', district: 'Réseau de chaleur' }
  doc.text(`Chauffage : ${chaufLabel[form.chauffage] ?? form.chauffage}`, ml + tw / 2, y + 23)
  doc.text(`Installation : ${form.anneeChauf}`, ml + tw / 2, y + 30)

  drawPageFooter(1, 3)

  // ── PAGE 2 — Déperditions ─────────────────────────────────────────────────
  doc.addPage()
  y = 20
  doc.setFillColor(navyMid.r, navyMid.g, navyMid.b)
  doc.rect(0, 0, W, 14, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.text('Analyse détaillée des déperditions thermiques', ml, 9)

  y = 24
  // Table header
  const cols = [62, 26, 30, 38, 16]
  const headers = ['Poste', 'Surface m²', 'U W/m²·K', 'Déperd. W/K', 'Part %']
  doc.setFillColor(navyMid.r, navyMid.g, navyMid.b)
  doc.rect(ml, y, tw, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  let cx = ml + 2
  headers.forEach((h, i) => { doc.text(h, cx, y + 5.5); cx += cols[i] })
  y += 8

  const activePostes = results.postes.filter(p => p.deperdition > 0)
  activePostes.forEach((p, idx) => {
    const bg = idx % 2 === 0 ? [255, 255, 255] : [248, 249, 250]
    doc.setFillColor(bg[0], bg[1], bg[2])
    doc.rect(ml, y, tw, 8, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(30, 30, 30)
    const pct = (p.deperdition / results.totalDep * 100).toFixed(1)
    const vals = [
      p.nom,
      p.surface != null ? p.surface.toFixed(1) : '—',
      p.u != null ? p.u.toFixed(2) : '—',
      Math.round(p.deperdition).toString(),
      pct + '%',
    ]
    cx = ml + 2
    vals.forEach((v, i) => { doc.text(v, cx, y + 5.5); cx += cols[i] })
    y += 8
  })
  // Total row
  doc.setFillColor(224, 232, 240)
  doc.rect(ml, y, tw, 9, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(navyMid.r, navyMid.g, navyMid.b)
  doc.text('TOTAL', ml + 2, y + 6)
  doc.text(Math.round(results.totalDep) + ' W/K', ml + cols[0] + cols[1] + cols[2] + 2, y + 6)
  doc.text('100%', ml + cols[0] + cols[1] + cols[2] + cols[3] + 2, y + 6)
  y += 16

  // Chart image
  if (chartCanvas) {
    try {
      const imgData = chartCanvas.toDataURL('image/png')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(navyMid.r, navyMid.g, navyMid.b)
      doc.text('Répartition des déperditions', ml, y)
      y += 4
      const chartW = 110, chartH = 80
      doc.addImage(imgData, 'PNG', (W - chartW) / 2, y, chartW, chartH)
    } catch (_) { /* skip chart if canvas unavailable */ }
  }

  drawPageFooter(2, 3)

  // ── PAGE 3 — Recommandations ──────────────────────────────────────────────
  doc.addPage()
  doc.setFillColor(navyMid.r, navyMid.g, navyMid.b)
  doc.rect(0, 0, W, 14, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.text('Recommandations d\'amélioration', ml, 9)

  y = 24
  results.recommandations.forEach((r, i) => {
    const orangeC = hexToRgb('#e8732a')
    doc.setFillColor(orangeC.r, orangeC.g, orangeC.b)
    doc.circle(ml + 5, y + 5, 5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(String(i + 1), ml + 5, y + 6.5, { align: 'center' })

    doc.setTextColor(navyMid.r, navyMid.g, navyMid.b)
    doc.setFontSize(11)
    doc.text(r.titre, ml + 14, y + 6)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(80, 80, 80)
    const lines = doc.splitTextToSize(r.desc, tw - 14)
    doc.text(lines, ml + 14, y + 13)

    y += lines.length * 5 + 10

    // Badges
    const badges = [
      { label: `+${r.classes} classe(s)`, bg: [232, 245, 233], fg: [46, 125, 50] },
      { label: `~${r.economie}€/an`, bg: [227, 242, 253], fg: [21, 101, 192] },
      { label: `Coût : ${r.cout}€`, bg: [255, 243, 224], fg: [230, 81, 0] },
    ]
    let bx = ml + 14
    badges.forEach(b => {
      const bw = 36
      doc.setFillColor(b.bg[0], b.bg[1], b.bg[2])
      doc.roundedRect(bx, y, bw, 7, 2, 2, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(b.fg[0], b.fg[1], b.fg[2])
      doc.text(b.label, bx + bw / 2, y + 5, { align: 'center' })
      bx += bw + 4
    })
    y += 14

    if (i < results.recommandations.length - 1) {
      doc.setDrawColor(230, 230, 230)
      doc.line(ml, y, W - mr, y)
      y += 6
    }
  })

  drawPageFooter(3, 3)

  // Save
  const dateStr = new Date().toISOString().slice(0, 10)
  doc.save(`rapport-DPE-${dateStr}-${form.surface}m2.pdf`)
}

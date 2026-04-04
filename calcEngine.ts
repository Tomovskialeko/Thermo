import type { FormData, CalcResults, DeperPostData, Reco } from '../types'

// ─── Thermal calculations ────────────────────────────────────────────────────

export const CLASSE_COLORS: Record<string, string> = {
  A: '#1a7a4a', B: '#4caf50', C: '#8bc34a',
  D: '#ffc107', E: '#ff9800', F: '#f44336', G: '#b71c1c',
}

export const CLASSE_DESC: Record<string, string> = {
  A: 'Très performant — consommation excellente',
  B: 'Performant — bonne isolation',
  C: 'Assez performant — isolation correcte',
  D: 'Peu performant — isolation moyenne',
  E: 'Peu performant — à améliorer',
  F: 'Très peu performant — passoire thermique',
  G: 'Passoire thermique — rénovation urgente',
}

export const GAUGE_DATA = [
  { l: 'A', range: '< 50 kWh/m²/an', max: 50, color: '#1a7a4a' },
  { l: 'B', range: '51–90 kWh/m²/an', max: 90, color: '#4caf50' },
  { l: 'C', range: '91–150 kWh/m²/an', max: 150, color: '#8bc34a' },
  { l: 'D', range: '151–230 kWh/m²/an', max: 230, color: '#ffc107' },
  { l: 'E', range: '231–330 kWh/m²/an', max: 330, color: '#ff9800' },
  { l: 'F', range: '331–450 kWh/m²/an', max: 450, color: '#f44336' },
  { l: 'G', range: '> 450 kWh/m²/an', max: 9999, color: '#b71c1c' },
]

function calcU(lambda: number, epaisseurCm: number): number | null {
  if (lambda === 0 || epaisseurCm === 0) return null
  const Ri = 0.13, Re = 0.04
  return 1 / (Ri + epaisseurCm / 100 / lambda + Re)
}

function classeFromConso(c: number): string {
  if (c < 50) return 'A'
  if (c <= 90) return 'B'
  if (c <= 150) return 'C'
  if (c <= 230) return 'D'
  if (c <= 330) return 'E'
  if (c <= 450) return 'F'
  return 'G'
}

export function runCalc(f: FormData): CalcResults {
  const { surface, typeBat, etages, etageAppt, mitoyen } = f

  // ── Surfaces ──────────────────────────────────────────────────────────────
  const perimetre = 4 * Math.sqrt(surface)
  const hauteur = 2.5
  const nbEtages = parseInt(etages)
  const surfaceMurTotal = perimetre * hauteur * nbEtages

  const mitoyenRatio = mitoyen === '2' ? 0.5 : mitoyen === '1' ? 0.75 : 1.0
  let surfaceMurExpose = surfaceMurTotal * mitoyenRatio

  // ── Fenêtres ──────────────────────────────────────────────────────────────
  const fenTailleMap = { S: 0.6, M: 1.2, L: 2.0 }
  const fenSurf = fenTailleMap[f.fenTaille]
  const sfSimple = f.fenSimple * fenSurf
  const sfDouble = f.fenDouble * fenSurf
  const sfTriple = f.fenTriple * fenSurf
  const sfFen = sfSimple + sfDouble + sfTriple

  // ── Portes ────────────────────────────────────────────────────────────────
  const sfPorte = f.nbPortes * 1.8
  const uPorte = f.typePorte

  // ── Murs nets ─────────────────────────────────────────────────────────────
  surfaceMurExpose = Math.max(surfaceMurExpose - sfFen - sfPorte, 0)

  // ── Toiture / plancher selon type ────────────────────────────────────────
  let surfaceToit = 0, surfacePlancher = 0
  if (typeBat === 'maison') {
    surfaceToit = surface
    surfacePlancher = surface
  } else {
    surfaceToit = etageAppt === 'dernier' ? surface : 0
    surfacePlancher = etageAppt === 'rdc' ? surface : 0
  }

  // ── U murs ────────────────────────────────────────────────────────────────
  const uMur =
    f.posIsolMur === 'non' || f.isolMurLambda === 0 || f.isolMurEp === 0
      ? 2.5
      : calcU(f.isolMurLambda, f.isolMurEp) ?? 2.5

  // ── U toiture ─────────────────────────────────────────────────────────────
  const uToit =
    f.isolToitLambda === 0 || f.isolToitEp === 0
      ? 3.0
      : calcU(f.isolToitLambda, f.isolToitEp) ?? 3.0

  // ── U plancher ────────────────────────────────────────────────────────────
  const uPlancher =
    f.isolPlancherEp === 0 ? 1.5 : calcU(0.036, f.isolPlancherEp) ?? 1.5

  // ── Déperditions ─────────────────────────────────────────────────────────
  const depMur = uMur * surfaceMurExpose
  const depToit = uToit * surfaceToit
  const depPlancher = uPlancher * surfacePlancher
  const depFenSimple = 5.8 * sfSimple
  const depFenDouble = 2.8 * sfDouble
  const depFenTriple = 0.8 * sfTriple
  const depPortes = uPorte * sfPorte
  const depBase = depMur + depToit + depPlancher + depFenSimple + depFenDouble + depFenTriple + depPortes
  const depPT = depBase * 0.05
  const totalDep = depBase + depPT

  // ── G coefficient ─────────────────────────────────────────────────────────
  let G = totalDep / surface
  if (f.ventilation === 'double') G *= 0.85
  else if (f.ventilation === 'simple') G *= 0.95

  // ── Consommation ─────────────────────────────────────────────────────────
  const DJU = 2500
  let C = (G * DJU * 24) / 1000

  const coeffChaufMap: Record<string, number> = {
    pac: 0.5, elec: 1.0, gaz: 0.9, fioul: 1.1, bois: 0.6, district: 0.77,
  }
  let coeff = coeffChaufMap[f.chauffage] ?? 1.0
  if (f.chauffage === 'gaz' && f.anneeChauf !== 'apres2000') coeff = 1.05
  if (f.anneeChauf === 'avant1980') coeff *= 1.15
  C *= coeff

  // ── CO2 ──────────────────────────────────────────────────────────────────
  const co2FactorMap: Record<string, number> = {
    elec: 0.052, pac: 0.052, gaz: 0.227, fioul: 0.324, bois: 0.03, district: 0.116,
  }
  const co2 = C * (co2FactorMap[f.chauffage] ?? 0.227)

  // ── Classe ────────────────────────────────────────────────────────────────
  const classe = classeFromConso(C)

  // ── Postes ────────────────────────────────────────────────────────────────
  const CHART_COLORS = [
    '#1e3a5f', '#2d6a9f', '#4a90c4',
    '#e8732a', '#f0a060', '#95a5a6', '#bdc3c7', '#7f8c8d',
  ]
  const postes: DeperPostData[] = [
    { nom: 'Murs extérieurs', surface: surfaceMurExpose, u: uMur, deperdition: depMur, color: CHART_COLORS[0] },
    { nom: 'Toiture / plancher haut', surface: surfaceToit, u: uToit, deperdition: depToit, color: CHART_COLORS[1] },
    { nom: 'Plancher bas', surface: surfacePlancher, u: uPlancher, deperdition: depPlancher, color: CHART_COLORS[2] },
    { nom: 'Fenêtres simple vitrage', surface: sfSimple, u: 5.8, deperdition: depFenSimple, color: CHART_COLORS[3] },
    { nom: 'Fenêtres double vitrage', surface: sfDouble, u: 2.8, deperdition: depFenDouble, color: CHART_COLORS[4] },
    { nom: 'Fenêtres triple vitrage', surface: sfTriple, u: 0.8, deperdition: depFenTriple, color: CHART_COLORS[5] },
    { nom: 'Portes extérieures', surface: sfPorte, u: uPorte, deperdition: depPortes, color: CHART_COLORS[6] },
    { nom: 'Ponts thermiques', surface: null, u: null, deperdition: depPT, color: CHART_COLORS[7] },
  ]

  // ── Recommandations ──────────────────────────────────────────────────────
  const recommandations = generateRecos(uMur, uToit, uPlancher, sfSimple, f.chauffage, f.ventilation)

  return {
    classe,
    classeColor: CLASSE_COLORS[classe],
    conso: Math.round(C),
    co2: Math.round(co2 * 10) / 10,
    gCoeff: Math.round(G * 100) / 100,
    postes,
    totalDep,
    recommandations,
  }
}

function generateRecos(
  uMur: number, uToit: number, uPlancher: number,
  sfSimple: number, chauffage: string, ventilation: string
): Reco[] {
  const recos: Reco[] = []

  if (uToit > 1.5)
    recos.push({
      titre: 'Isolation de la toiture',
      desc: 'Ajouter 30 cm de laine de verre en combles perdus — première amélioration à réaliser.',
      classes: 2, economie: 600, cout: 2500,
    })

  if (sfSimple > 0)
    recos.push({
      titre: 'Remplacement des fenêtres simple vitrage',
      desc: `Remplacer ${Math.round(sfSimple / 1.2)} fenêtres en double vitrage performant (U=1.4 W/m²·K).`,
      classes: 1, economie: 350, cout: 4500,
    })

  if (uMur > 1.5)
    recos.push({
      titre: 'Isolation thermique des murs par l\'extérieur',
      desc: 'Poser 12 cm de polyuréthane (ITE) — gain thermique et suppression des ponts thermiques.',
      classes: 1, economie: 480, cout: 8000,
    })

  if (chauffage === 'elec' || chauffage === 'fioul')
    recos.push({
      titre: 'Remplacement du système de chauffage',
      desc: 'Installer une pompe à chaleur air-eau (COP ≥ 3.5) — consommation divisée par 2 à 3.',
      classes: 2, economie: 1200, cout: 10000,
    })

  if (ventilation !== 'double')
    recos.push({
      titre: 'Installation d\'une VMC double flux',
      desc: 'Récupération de 80% de la chaleur de l\'air extrait — réduction des déperditions par ventilation.',
      classes: 1, economie: 250, cout: 4000,
    })

  if (uPlancher > 0.8)
    recos.push({
      titre: 'Isolation du plancher bas',
      desc: 'Poser 10 cm d\'isolant sous le plancher — confort thermique hivernal amélioré.',
      classes: 1, economie: 200, cout: 1800,
    })

  return recos.slice(0, 4)
}

// ─── Form state ─────────────────────────────────────────────────────────────

export type BuildingType = 'maison' | 'appartement'
export type MitoyenType = '0' | '1' | '2'
export type EtagesType = '1' | '2'
export type EtageApptType = 'rdc' | 'milieu' | 'dernier'
export type FenTailleType = 'S' | 'M' | 'L'
export type IsolPosType = 'int' | 'ext' | 'non'
export type ToitType = 'combles' | 'amenages' | 'terrasse'
export type PlancherType = 'terre' | 'vide' | 'sous-sol'
export type ChauffageType = 'elec' | 'pac' | 'gaz' | 'fioul' | 'bois' | 'district'
export type AnneeChaufType = 'avant1980' | '1980-2000' | 'apres2000'
export type VentilationType = 'aucune' | 'naturelle' | 'simple' | 'double'

export interface FormData {
  // Étape 1
  typeBat: BuildingType
  mitoyen: MitoyenType
  etages: EtagesType
  etageAppt: EtageApptType
  surface: number

  // Étape 2
  fenSimple: number
  fenDouble: number
  fenTriple: number
  fenTaille: FenTailleType
  nbPortes: number
  typePorte: number // U value

  // Étape 3
  isolMurLambda: number
  isolMurEp: number
  posIsolMur: IsolPosType
  isolToitLambda: number
  isolToitEp: number
  typeToit: ToitType
  typePlancher: PlancherType
  isolPlancherEp: number

  // Étape 4
  chauffage: ChauffageType
  anneeChauf: AnneeChaufType
  ventilation: VentilationType
}

// ─── Calc results ────────────────────────────────────────────────────────────

export interface DeperPostData {
  nom: string
  surface: number | null
  u: number | null
  deperdition: number
  color: string
}

export interface CalcResults {
  classe: string
  classeColor: string
  conso: number
  co2: number
  gCoeff: number
  postes: DeperPostData[]
  totalDep: number
  recommandations: Reco[]
}

export interface Reco {
  titre: string
  desc: string
  classes: number
  economie: number
  cout: number
}

// ─── History ─────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string
  date: string
  surface: number
  classe: string
  conso: number
  typeBat: BuildingType
}

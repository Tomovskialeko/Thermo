import { useState } from 'react'
import type { FormData } from '../types'

export const DEFAULT_FORM: FormData = {
  typeBat: 'maison',
  mitoyen: '0',
  etages: '1',
  etageAppt: 'milieu',
  surface: 100,
  fenSimple: 0,
  fenDouble: 6,
  fenTriple: 0,
  fenTaille: 'M',
  nbPortes: 1,
  typePorte: 1.5,
  isolMurLambda: 0.036,
  isolMurEp: 10,
  posIsolMur: 'int',
  isolToitLambda: 0.036,
  isolToitEp: 20,
  typeToit: 'combles',
  typePlancher: 'vide',
  isolPlancherEp: 0,
  chauffage: 'pac',
  anneeChauf: 'apres2000',
  ventilation: 'simple',
}

export function useFormState() {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function reset() {
    setForm(DEFAULT_FORM)
  }

  return { form, update, reset }
}

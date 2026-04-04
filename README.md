# ThermoPro — Calculateur DPE

Application web pour ingénieurs en déperdition thermique. Calcule la classe d'isolation énergétique d'un bâtiment (A → G) selon la méthode DPE française.

## Fonctionnalités

- **Formulaire en 5 étapes** : type de bâtiment, ouvertures, isolation, équipements, résultats
- **Moteur de calcul thermique** : coefficients U, déperditions par poste, coefficient G
- **Classe DPE** avec jauge visuelle officielle (A → G)
- **Graphique donut** (Chart.js) de répartition des déperditions
- **Export PDF** 3 pages (résumé, déperditions, recommandations)
- **Historique** des 10 derniers calculs (localStorage)

## Stack technique

| Outil | Rôle |
|-------|------|
| React 18 + TypeScript | UI |
| Vite | Build |
| Tailwind CSS | Styles |
| Chart.js + react-chartjs-2 | Graphiques |
| jsPDF | Export PDF |

## Installation locale

```bash
npm install
npm run dev
```

## Déploiement Netlify

Le fichier `netlify.toml` est déjà configuré.

1. Pushez ce dépôt sur GitHub
2. Sur [netlify.com](https://netlify.com) → **Add new site** → **Import from GitHub**
3. Build command : `npm run build`
4. Publish directory : `dist`
5. Cliquez **Deploy** ✅

## Structure du projet

```
src/
├── components/
│   ├── steps/
│   │   ├── Step1.tsx       # Type de bâtiment
│   │   ├── Step2.tsx       # Ouvertures / fenêtres
│   │   ├── Step3.tsx       # Isolation
│   │   ├── Step4.tsx       # Équipements
│   │   └── Step5.tsx       # Résultats
│   ├── RadioCard.tsx
│   ├── Stepper.tsx
│   ├── DpeGauge.tsx
│   ├── DeperditionsTable.tsx
│   ├── DeperditionsChart.tsx
│   ├── Recommendations.tsx
│   └── HistoryPanel.tsx
├── hooks/
│   └── useFormState.ts
├── utils/
│   ├── calcEngine.ts       # Moteur thermique
│   └── pdfExport.ts        # Export jsPDF
├── types.ts
├── App.tsx
└── main.tsx
```

## Formules utilisées

**Coefficient U d'une paroi :**
```
U = 1 / (Ri + e/λ + Re)
Ri = 0.13 m²·K/W  (résistance intérieure)
Re = 0.04 m²·K/W  (résistance extérieure)
e  = épaisseur en mètres
λ  = conductivité thermique de l'isolant
```

**Consommation estimée :**
```
C = G × DJU × 24 / 1000
G = Σ(Ui × Si) / Surface habitable
DJU = 2500 (valeur moyenne France)
```

## Disclaimer

Calcul indicatif uniquement. Non opposable au DPE officiel réglementaire (réalisé par un diagnostiqueur certifié).

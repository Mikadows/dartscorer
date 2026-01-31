# Dart Scorer Features

Welcome to the Dart Scorer project! This document outlines the key features and functionalities of this application designed to enhance dart score counting.

## Key Features

### Entrée des scores — cible interactive (mise à jour)

Décisions fonctionnelles confirmées

* Cible: reproduction exacte d'une cible de fléchettes réelle (orientation et position du 20 respectées).
* Contrôle d'entrée: chaque zone de la cible est traitée comme un bouton strict — assignation stricte aux anneaux et secteurs via seuils de rayon et angles (tolérance par défaut = 0).
* Actions disponibles: un contrôle secondaire visible - bouton `Undo` pour annuler les lancers, **avec un historique d'annulation infini** (undo multi-niveaux sur l'ensemble de la partie).
* Portée de l'itération: composant local unique (pas de multi-joueurs ni réseau pour cette itération). Focus sur la saisie via la cible.

---

## UI / UX (cible d'implémentation Jetpack Compose)

### Apparence générale

* L'interface **doit reproduire fidèlement la hiérarchie visuelle** et la disposition observées dans le mockup de référence (`asset/img.png`).
* Thème sombre dominant : fond global très sombre (noir/gris anthracite), contrastes élevés pour garantir la lisibilité.
* Aucune image bitmap pour la cible : **rendu 100% vectoriel via Canvas Compose**.

### AppBar (en-tête)

* Positionnée en haut de l'écran, hauteur standard (~56dp).
* Fond gris très foncé.
* Contenu (de gauche à droite):

    * Icône retour (flèche gauche).
    * Titre de l'écran : `Darts`.
    * Groupe d'icônes d'actions alignées à droite : Undo / reset, statistiques, micro (entrée vocale), menu plus (⋮).
* Icônes blanches, taille 20–24dp, espacement homogène.

### Cible de fléchettes

* Élément central de l'écran.
* Toujours affichée comme un **cercle parfait (ratio 1:1)**, centrée dans sa zone.
* Dimensionnée dynamiquement via contraintes (`BoxWithConstraints`).
* Composition visuelle fidèle à une cible réelle :

    * Anneau extérieur sombre avec numéros 1–20 en blanc, positionnés radialement.
    * Secteurs simples alternés rouge foncé / blanc cassé.
    * Anneaux triple et double fins, alternance rouge vif / vert vif.
    * Bull extérieur vert, bullseye rouge.
* Les proportions relatives des anneaux doivent respecter les standards d'une vraie cible (double/triple sensiblement plus fins que les zones simples).

### Panneau scores / informations joueur

* Zone dédiée à l'affichage des informations textuelles.
* Fond uni sombre, distinct de la cible.
* Hiérarchie typographique stricte :

    * Score principal très visible (plus grand, bold).
    * Nom du joueur et informations secondaires plus petites.

#### Ligne joueur

* Icône trophée à gauche.
* Nom du joueur (texte blanc, taille moyenne).
* Score total aligné à droite, grande taille.
* Badge secondaire (fond jaune) affichant une information clé (ex: nombre de fléchettes restantes).

#### Détails des lancers

* Affichés sous chaque joueur.
* Sous forme de chips rectangulaires (coins arrondis) : `T20`, `20`, `D10`, etc.
* Fond gris foncé, texte blanc.
* Total de la visite affiché à droite en texte gris clair.

### Interaction et feedback

* Chaque tap sur la cible correspond **strictement** à une zone valide (aucune approximation par proximité).
* Feedback immédiat à l'impact :

    * Animation légère.
    * Son discret.
    * Affichage bref de la valeur détectée (ex: `+60`, `Triple 20`).
    * Haptique optionnelle.

### Accessibilité

* Chaque zone logique (secteur/anneau) doit exposer un label accessible.
* Navigation clavier / tabulation supportée.

---

## Mise en page de l'écran de jeu

### Support des orientations (obligatoire)

* Portrait et paysage **obligatoires**, avec layouts distincts.

### Mode paysage

* Écran divisé verticalement en deux zones:

    * **Panneau gauche (25%)** : scores, déroulé, infos joueur.
    * **Panneau droit (75%)** : cible interactive.
* Le panneau gauche peut défiler verticalement si nécessaire.
* La cible s'adapte à la hauteur disponible tout en conservant un cercle parfait.

### Mode portrait

* Écran divisé horizontalement:

    * **Panneau haut (25%)** : scores et résumé.
    * **Panneau bas (75%)** : cible interactive.
* Le panneau haut devient scrollable si son contenu dépasse l'espace alloué.
* La cible occupe visuellement les 3/4 inférieurs de l'écran.

---

## Arbre de composants Jetpack Compose

```
GameScreen
│
├── DartAppBar
│
├── OrientationAwareLayout
│   ├── ScoresPanel
│   │   ├── PlayerScoreHeader
│   │   ├── ThrowsRow
│   │   │   └── ThrowChip
│   │   └── VisitTotal
│   │
│   └── DartboardContainer
│       └── TargetInput
│           └── DartboardCanvas
│
└── FeedbackOverlay
    ├── HitValueToast
    └── AnimationLayer
```

* `GameScreen` : point d'entrée UI de l'écran de jeu.
* `OrientationAwareLayout` : choisit la disposition portrait/paysage.
* `ScoresPanel` : panneau texte (scrollable si nécessaire).
* `TargetInput` : composant réutilisable encapsulant Canvas + gestion des taps.
* `DartboardCanvas` : rendu vectoriel pur de la cible.
* `FeedbackOverlay` : couche visuelle temporaire (animations, valeur du hit).

---

## Détection du hit (règles strictes)

* Calcul: convertir `(x,y)` en coordonnées polaires `(r, θ)` autour du centre.
* Anneaux: seuils de rayon définis strictement pour Bullseye, Bull (25), Triple, Double, Single inner/outer.
* Secteurs: 20 secteurs de 18°; déterminer l'indice via `floor((normalizeAngle(θ) + offset) / 18) mod 20`.
* Cas limites: si `r` exactement sur une frontière, appliquer règle déterministe documentée; aucune approximation.
* Validation: empêcher entrées invalides (ex: triple sur bull).

---

## API interne et événements

* Événements: `onHit(scoreData)`, `onUndo()`.
* `ScoreData`: `{ sector: Int|null, multiplier: Int, base: Int, total: Int, rawCoords: { x: Int, y: Int }, timestamp: Long }`.
* Historique complet conservé en mémoire pour permettre un undo infini.

---

## Tests d'acceptation

* Taps sur chaque zone retournent la valeur correcte.
* Frontières respectent la règle déterministe.
* Undo remonte l'historique sans limite.
* UI conforme au mockup en portrait et paysage avec proportions 1/4–3/4.

---

## Livrables pour cette itération

* Composant UI `TargetInput` réutilisable.
* Mapping `(x,y) -> ScoreData` avec tests unitaires couvrant les frontières.
* Gestion d'état avec historique complet et undo multi-niveaux.
* Tests d'intégration du flux de jeu.
* Documentation des seuils, offsets et règles de frontières.

---

## Notes opérationnelles

* Tolérance configurable mais par défaut = 0.
* Priorité : rendu vectoriel précis et latence UI < 50 ms.

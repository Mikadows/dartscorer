package com.mikadows.dartscorer.domain.game

import com.mikadows.dartscorer.domain.model.ScoreData

/**
 * Représente un lancer dans une visite (jusqu'à 3 fléchettes typiquement).
 */
data class ThrowEntry(
    val score: ScoreData,
    val index: Int,
)

/**
 * Une "visite" de joueur : séquence de lancers cohérente (souvent 3).
 */
data class Visit(
    val throws: List<ThrowEntry>,
) {
    val total: Int = throws.sumOf { it.score.total }
}

/**
 * État du joueur unique pour cette itération.
 */
data class PlayerState(
    val name: String = "Player 1",
    val totalScore: Int = 0,
    val visits: List<Visit> = emptyList(),
    val dartsLeftInVisit: Int = 3,
)

/**
 * État global du jeu pour un seul joueur.
 */
data class GameState(
    val player: PlayerState = PlayerState(),
    val history: List<ScoreData> = emptyList(),
)

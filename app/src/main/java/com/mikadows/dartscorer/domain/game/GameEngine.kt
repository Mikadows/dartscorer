package com.mikadows.dartscorer.domain.game

import com.mikadows.dartscorer.domain.model.ScoreData

/**
 * Gestionnaire d'état de partie avec historique complet et undo illimité.
 */
class GameEngine(
    initialState: GameState = GameState(),
) {

    private var _state: GameState = initialState
    val state: GameState get() = _state

    /**
     * Enregistre un nouveau lancer et retourne le nouvel état.
     */
    fun registerHit(scoreData: ScoreData): GameState {
        val newHistory = _state.history + scoreData

        val lastVisit = _state.player.visits.lastOrNull()
        val dartsLeft = _state.player.dartsLeftInVisit

        val (updatedVisits, updatedDartsLeft) = if (dartsLeft <= 1) {
            // Fin de visite : on ajoute un nouveau Visit
            val newEntry = ThrowEntry(scoreData, index = newHistory.size - 1)
            val newVisit = if (lastVisit == null || dartsLeft == 3) {
                Visit(listOf(newEntry))
            } else {
                Visit(lastVisit.throws + newEntry)
            }
            val visitsWithoutLast = if (lastVisit != null && dartsLeft != 3) {
                _state.player.visits.dropLast(1)
            } else {
                _state.player.visits
            }
            visitsWithoutLast + newVisit to 3
        } else {
            val newEntry = ThrowEntry(scoreData, index = newHistory.size - 1)
            if (lastVisit == null || dartsLeft == 3) {
                // Nouveau visit
                val newVisit = Visit(listOf(newEntry))
                _state.player.visits + newVisit to (dartsLeft - 1)
            } else {
                // On prolonge la visite existante
                val updatedVisit = Visit(lastVisit.throws + newEntry)
                _state.player.visits.dropLast(1) + updatedVisit to (dartsLeft - 1)
            }
        }

        val newTotalScore = _state.player.totalScore + scoreData.total

        val newPlayer = _state.player.copy(
            totalScore = newTotalScore,
            visits = updatedVisits,
            dartsLeftInVisit = updatedDartsLeft,
        )

        _state = _state.copy(player = newPlayer, history = newHistory)
        return _state
    }

    /**
     * Annule le dernier lancer s'il existe et retourne le nouvel état.
     */
    fun undo(): GameState {
        val history = _state.history
        if (history.isEmpty()) return _state

        val lastScore = history.last()
        val newHistory = history.dropLast(1)

        // Recalcul simple du score et des visites à partir de l'historique restant
        var gameState = GameState(player = _state.player.copy(totalScore = 0, visits = emptyList(), dartsLeftInVisit = 3))
        val engine = GameEngine(gameState)
        newHistory.forEach { engine.registerHit(it) }
        gameState = engine.state

        _state = gameState.copy(history = newHistory)
        return _state
    }

    fun reset(): GameState {
        _state = GameState()
        return _state
    }
}

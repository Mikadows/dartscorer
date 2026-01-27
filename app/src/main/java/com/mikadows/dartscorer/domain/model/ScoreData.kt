package com.mikadows.dartscorer.domain.model

import com.mikadows.dartscorer.domain.model.RingType.*

enum class RingType {
    MISS,
    DOUBLE_OUTER,
    SINGLE_OUTER,
    TRIPLE,
    SINGLE_INNER,
    OUTER_BULL,
    INNER_BULL,
}

data class RawCoords(
    val x: Int,
    val y: Int,
)

/**
 * Représente le résultat d'un lancer sur la cible.
 */
data class ScoreData(
    /** Secteur 1..20 ou null pour bull/miss. */
    val sector: Int?,
    /** Multiplicateur (0, 1, 2, 3). */
    val multiplier: Int,
    /** Valeur de base (0, 25, 50, 1..20). */
    val base: Int,
    /** Score total de ce lancer. */
    val total: Int,
    /** Type d'anneau touché. */
    val ring: RingType,
    /** Coordonnées brutes dans le repère du Canvas. */
    val rawCoords: RawCoords,
    /** Timestamp du lancer. */
    val timestamp: Long,
) {
    companion object {
        fun miss(rawX: Float, rawY: Float, timestamp: Long): ScoreData = ScoreData(
            sector = null,
            multiplier = 0,
            base = 0,
            total = 0,
            ring = MISS,
            rawCoords = RawCoords(rawX.toInt(), rawY.toInt()),
            timestamp = timestamp,
        )
    }
}

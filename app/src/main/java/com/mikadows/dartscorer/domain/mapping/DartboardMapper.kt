package com.mikadows.dartscorer.domain.mapping

import kotlin.math.PI
import kotlin.math.atan2
import kotlin.math.floor
import kotlin.math.hypot
import com.mikadows.dartscorer.domain.model.RingType
import com.mikadows.dartscorer.domain.model.RingType.*
import com.mikadows.dartscorer.domain.model.ScoreData
import com.mikadows.dartscorer.domain.model.RawCoords

// Ordre standard des secteurs autour de la cible, exposé pour l'UI
val SECTOR_ORDER: IntArray = intArrayOf(
    20, 1, 18, 4, 13, 6, 10, 15, 2, 17,
    3, 19, 7, 16, 8, 11, 14, 9, 12, 5
)

/**
 * Conversion stricte (x,y) -> ScoreData.
 *
 * Règles de frontières (tolérance = 0) :
 * - Si r est exactement sur une frontière radiale, la zone extérieure gagne.
 * - Si angle est exactement sur une frontière de secteur, le secteur d'angle croissant gagne.
 */
object DartboardMapper {

    private val geometry = DartboardGeometry.Default

    /**
     * Mappe un tap à l'intérieur d'un Canvas centré sur (centerX, centerY) avec un rayon [boardRadius].
     */
    fun mapTouchToScore(
        x: Float,
        y: Float,
        centerX: Float,
        centerY: Float,
        boardRadius: Float,
        now: Long = System.currentTimeMillis(),
    ): ScoreData {
        val dx = x - centerX
        val dy = y - centerY
        val r = hypot(dx.toDouble(), dy.toDouble()).toFloat()

        if (r > boardRadius) {
            return ScoreData.miss(x, y, now)
        }

        val normR = if (boardRadius == 0f) 0f else r / boardRadius
        val angleRad = atan2(dy.toDouble(), dx.toDouble())
        val angleDeg = Math.toDegrees(angleRad)

        val ring = determineRing(normR)
        val sector: Int?
        val base: Int
        val multiplier: Int

        if (ring == INNER_BULL) {
            sector = null
            base = 50
            multiplier = 1
        } else if (ring == OUTER_BULL) {
            sector = null
            base = 25
            multiplier = 1
        } else if (ring == MISS) {
            sector = null
            base = 0
            multiplier = 0
        } else {
            val normalized = normalizeAngleForSector(angleDeg.toFloat())
            val sectorIndex = determineSectorIndex(normalized)
            sector = sectorNumberFromIndex(sectorIndex)
            base = sector
            multiplier = when (ring) {
                DOUBLE_OUTER -> 2
                TRIPLE -> 3
                SINGLE_OUTER, SINGLE_INNER -> 1
                else -> 0
            }
        }

        val total = base * multiplier

        return ScoreData(
            sector = sector,
            multiplier = multiplier,
            base = base,
            total = total,
            ring = ring,
            rawCoords = RawCoords(x.toInt(), y.toInt()),
            timestamp = now,
        )
    }

    private fun determineRing(normR: Float): RingType {
        return when {
            normR <= 0f -> INNER_BULL
            normR <= geometry.innerBullRadius -> INNER_BULL
            normR <= geometry.outerBullRadius -> OUTER_BULL
            normR <= geometry.tripleInnerRadius -> SINGLE_INNER
            normR <= geometry.tripleOuterRadius -> TRIPLE
            normR <= geometry.doubleInnerRadius -> SINGLE_OUTER
            normR <= geometry.doubleOuterRadius -> DOUBLE_OUTER
            else -> MISS
        }
    }

    /**
     * Normalise l'angle de telle sorte que 0° corresponde au secteur 6 heures et
     * qu'il croisse dans le sens horaire. On applique ensuite un offset pour que
     * le 20 soit à midi.
     */
    private fun normalizeAngleForSector(angleDeg: Float): Float {
        // angleDeg: -180..180, 0 = axe X positif (3h), positif sens anti-horaire.
        var a = angleDeg
        // Convertir en 0..360 en partant de 0 à 3h sens anti-horaire
        if (a < 0) a += 360f

        // On veut 0° à midi (12h). Actuellement 0° = 3h, donc on décale de +90°.
        a = (a + 90f) % 360f

        // La cible est découpée en secteurs de 18° mais l'ordre ne commence pas à 20
        // Ici on retourne juste l'angle normalisé à 0..360 ; l'offset pour le secteur
        // est géré dans [determineSectorIndex].
        return a
    }

    /**
     * Retourne un index 0..19 représentant les secteurs en tournant autour de la cible.
     * La séquence de secteurs standard est : 20, 1, 18, 4, 13, 6, 10, 15, 2, 17,
     * 3, 19, 7, 16, 8, 11, 14, 9, 12, 5.
     */
    private fun determineSectorIndex(normalizedAngle: Float): Int {
        // Chaque secteur occupe 18°. On applique un offset de -9° pour que
        // la frontière entre secteurs tombe au milieu.
        val offsetAngle = (normalizedAngle + 9f) % 360f
        val rawIndex = floor(offsetAngle / 18f).toInt()
        return rawIndex % 20
    }

    private fun sectorNumberFromIndex(index: Int): Int {
        val i = ((index % 20) + 20) % 20
        return SECTOR_ORDER[i]
    }
}

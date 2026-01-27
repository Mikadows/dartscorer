package com.mikadows.dartscorer.domain.mapping

import com.mikadows.dartscorer.domain.model.RingType
import org.junit.Assert.assertEquals
import org.junit.Test

class DartboardMapperTest {

    @Test
    fun `inner bull maps to 50`() {
        val radius = 100f
        val center = 100f
        val score = DartboardMapper.mapTouchToScore(
            x = center,
            y = center,
            centerX = center,
            centerY = center,
            boardRadius = radius,
            now = 0L,
        )
        assertEquals(null, score.sector)
        assertEquals(50, score.base)
        assertEquals(1, score.multiplier)
        assertEquals(50, score.total)
        assertEquals(RingType.INNER_BULL, score.ring)
    }
}

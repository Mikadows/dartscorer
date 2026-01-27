package com.mikadows.dartscorer.domain.game

import com.mikadows.dartscorer.domain.model.RingType
import com.mikadows.dartscorer.domain.model.ScoreData
import com.mikadows.dartscorer.domain.model.RawCoords
import org.junit.Assert.assertEquals
import org.junit.Test

class GameEngineTest {

    @Test
    fun `registerHit updates score and history`() {
        val engine = GameEngine()
        val hit = ScoreData(
            sector = 20,
            multiplier = 3,
            base = 20,
            total = 60,
            ring = RingType.TRIPLE,
            rawCoords = RawCoords(0, 0),
            timestamp = 0L,
        )

        val state = engine.registerHit(hit)
        assertEquals(60, state.player.totalScore)
        assertEquals(1, state.history.size)
    }

    @Test
    fun `undo removes last hit`() {
        val engine = GameEngine()
        val hit = ScoreData(
            sector = 20,
            multiplier = 3,
            base = 20,
            total = 60,
            ring = RingType.TRIPLE,
            rawCoords = RawCoords(0, 0),
            timestamp = 0L,
        )
        engine.registerHit(hit)
        val stateAfterUndo = engine.undo()
        assertEquals(0, stateAfterUndo.player.totalScore)
        assertEquals(0, stateAfterUndo.history.size)
    }
}

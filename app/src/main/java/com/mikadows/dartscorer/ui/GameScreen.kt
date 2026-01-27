package com.mikadows.dartscorer.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import com.mikadows.dartscorer.domain.game.GameEngine
import com.mikadows.dartscorer.domain.game.GameState
import com.mikadows.dartscorer.domain.model.ScoreData
import com.mikadows.dartscorer.ui.game.*

@Composable
fun GameScreen(onBack: () -> Unit = {}) {
    val engine = remember { GameEngine() }
    var gameState by remember { mutableStateOf(engine.state) }
    var lastHit by remember { mutableStateOf<ScoreData?>(null) }

    fun applyState(newState: GameState) {
        gameState = newState
    }

    val scoresPanelState = ScoresPanelState(
        playerName = gameState.player.name,
        mainScore = gameState.player.totalScore,
        badgeText = "${gameState.player.dartsLeftInVisit} darts left",
        currentVisitThrows = gameState.player.visits.lastOrNull()?.throws?.map { it.score }
            ?: emptyList(),
        currentVisitTotal = gameState.player.visits.lastOrNull()?.total ?: 0,
    )

    val feedbackState = HitFeedbackState(lastHit = lastHit, isVisible = lastHit != null)

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background,
    ) {
        Box {
            Scaffold(
                topBar = {
                    DartAppBar(
                        onBack = onBack,
                        onUndo = {
                            applyState(engine.undo())
                        },
                        onReset = {
                            applyState(engine.reset())
                            lastHit = null
                        },
                        onStatsClick = {},
                        onMicClick = {},
                        onMenuClick = {},
                    )
                },
                containerColor = Color.Black,
            ) { paddingValues ->
                OrientationAwareLayout(
                    scoresContent = {
                        ScoresPanel(
                            state = scoresPanelState,
                            modifier = Modifier,
                        )
                    },
                    dartboardContent = { modifier ->
                        DartboardContainer(
                            modifier = modifier,
                        ) { hit ->
                            lastHit = hit
                            applyState(engine.registerHit(hit))
                        }
                    },
                    contentPadding = paddingValues,
                )
            }

            FeedbackOverlay(
                state = feedbackState,
                modifier = Modifier.fillMaxSize(),
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun GameScreenPreview() {
    MaterialTheme {
        GameScreen()
    }
}

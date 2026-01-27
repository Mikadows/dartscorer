package com.mikadows.dartscorer.ui.game

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mikadows.dartscorer.domain.mapping.DartboardGeometry
import com.mikadows.dartscorer.domain.mapping.DartboardMapper
import com.mikadows.dartscorer.domain.mapping.SECTOR_ORDER
import com.mikadows.dartscorer.domain.model.RingType
import com.mikadows.dartscorer.domain.model.ScoreData

// ---- Orientation-aware layout ----

@Composable
fun OrientationAwareLayout(
    scoresContent: @Composable () -> Unit,
    dartboardContent: @Composable (Modifier) -> Unit,
    contentPadding: PaddingValues,
) {
    BoxWithConstraints(
        modifier = Modifier
            .fillMaxSize()
            .padding(contentPadding),
    ) {
        val maxH = this.maxHeight
        val maxW = this.maxWidth
        val isPortrait = maxH > maxW
        if (isPortrait) {
            Column(modifier = Modifier.fillMaxSize()) {
                val scoresHeight = maxH * 0.25f
                val boardHeight = maxH * 0.75f
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(scoresHeight)
                        .background(Color(0xFF121212)),
                ) {
                    scoresContent()
                }
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(boardHeight)
                        .background(Color.Black),
                    contentAlignment = Alignment.Center,
                ) {
                    val size = if (boardHeight < maxW) boardHeight else maxW
                    Box(modifier = Modifier.size(size)) {
                        dartboardContent(Modifier.fillMaxSize())
                    }
                }
            }
        } else {
            Row(modifier = Modifier.fillMaxSize()) {
                val scoresWidth = maxW * 0.25f
                val boardWidth = maxW * 0.75f
                Box(
                    modifier = Modifier
                        .width(scoresWidth)
                        .fillMaxHeight()
                        .background(Color(0xFF121212)),
                ) {
                    scoresContent()
                }
                Box(
                    modifier = Modifier
                        .width(boardWidth)
                        .fillMaxHeight()
                        .background(Color.Black),
                    contentAlignment = Alignment.Center,
                ) {
                    val size = if (maxH < boardWidth) maxH else boardWidth
                    Box(modifier = Modifier.size(size)) {
                        dartboardContent(Modifier.fillMaxSize())
                    }
                }
            }
        }
    }
}

// ---- Scores Panel ----

data class ScoresPanelState(
    val playerName: String,
    val mainScore: Int,
    val badgeText: String,
    val currentVisitThrows: List<ScoreData>,
    val currentVisitTotal: Int,
)

@Composable
fun ScoresPanel(state: ScoresPanelState, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
    ) {
        PlayerScoreHeader(
            playerName = state.playerName,
            mainScore = state.mainScore,
            badgeText = state.badgeText,
        )
        Spacer(modifier = Modifier.height(16.dp))
        ThrowsRow(throws = state.currentVisitThrows)
        Spacer(modifier = Modifier.height(8.dp))
        VisitTotal(total = state.currentVisitTotal)
    }
}

@Composable
fun PlayerScoreHeader(playerName: String, mainScore: Int, badgeText: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        // Icône trophée simplifiée
        Box(
            modifier = Modifier
                .size(32.dp)
                .background(Color(0xFFFFC107), shape = MaterialTheme.shapes.small),
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = playerName, color = Color.White, fontSize = 18.sp)
            Text(text = "Score", color = Color.Gray, fontSize = 12.sp)
        }
        Text(
            text = mainScore.toString(),
            color = Color.White,
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
        )
        Spacer(modifier = Modifier.width(8.dp))
        Box(
            modifier = Modifier
                .background(Color(0xFFFFC107), shape = MaterialTheme.shapes.small)
                .padding(horizontal = 8.dp, vertical = 4.dp),
        ) {
            Text(text = badgeText, color = Color.Black, fontSize = 12.sp)
        }
    }
}

@Composable
fun ThrowsRow(throws: List<ScoreData>) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        throws.forEach { score ->
            ThrowChip(score)
        }
    }
}

@Composable
fun ThrowChip(score: ScoreData) {
    val label = when {
        score.ring == RingType.INNER_BULL -> "50"
        score.ring == RingType.OUTER_BULL -> "25"
        score.sector != null -> when (score.multiplier) {
            2 -> "D${score.sector}"
            3 -> "T${score.sector}"
            else -> "${score.sector}"
        }
        else -> "0"
    }
    Box(
        modifier = Modifier
            .background(Color(0xFF333333), shape = MaterialTheme.shapes.small)
            .padding(horizontal = 8.dp, vertical = 4.dp),
    ) {
        Text(text = label, color = Color.White, fontSize = 14.sp)
    }
}

@Composable
fun VisitTotal(total: Int) {
    Row(modifier = Modifier.fillMaxWidth()) {
        Spacer(modifier = Modifier.weight(1f))
        Text(text = "Total: $total", color = Color.LightGray)
    }
}

// ---- Dartboard & TargetInput ----

@Composable
fun DartboardContainer(
    modifier: Modifier = Modifier,
    onHit: (ScoreData) -> Unit,
) {
    Box(modifier = modifier, contentAlignment = Alignment.Center) {
        TargetInput(onHit = onHit)
    }
}

@Composable
fun TargetInput(
    modifier: Modifier = Modifier,
    onHit: (ScoreData) -> Unit,
) {
    BoxWithConstraints(modifier = modifier) {
        val geometry = remember { DartboardGeometry.Default }
        val maxSize = this.maxWidth.coerceAtMost(this.maxHeight)
        val density = LocalDensity.current
        val radiusPx = with(density) { maxSize.toPx() } / 2f
        val centerX = radiusPx
        val centerY = radiusPx

        Canvas(
            modifier = Modifier
                .size(maxSize)
                .pointerInput(Unit) {
                    detectTapGestures { offset ->
                        val score = DartboardMapper.mapTouchToScore(
                            x = offset.x,
                            y = offset.y,
                            centerX = centerX,
                            centerY = centerY,
                            boardRadius = radiusPx,
                        )
                        onHit(score)
                    }
                },
        ) {
            // Dessin du dartboard directement dans ce Canvas
            drawDartboard(geometry)
        }
    }
}

private fun androidx.compose.ui.graphics.drawscope.DrawScope.drawDartboard(
    geometry: DartboardGeometry,
) {
    // Couleurs inspirées de vraies cibles :
    val boardBackground = Color(0xFF111111)      // fond global
    val singleDark = Color(0xFF222222)           // secteurs simples foncés
    val singleLight = Color(0xFFEEEEEE)          // secteurs simples clairs
    val ringRed = Color(0xFFB00020)              // rouge triple/double
    val ringGreen = Color(0xFF2E7D32)            // vert triple/double

    val outerBull = ringGreen                   // outer bull (25)
    val innerBull = ringRed                     // bullseye (50)

    val radius = size.minDimension / 2f
    val center = Offset(size.width / 2f, size.height / 2f)

    // 1) Fond du plateau complet
    drawCircle(color = boardBackground, radius = radius, center = center)

    // Préparation des rayons d'anneaux
    val rInnerBull = radius * geometry.innerBullRadius
    val rOuterBull = radius * geometry.outerBullRadius
    val rTripleInner = radius * geometry.tripleInnerRadius
    val rTripleOuter = radius * geometry.tripleOuterRadius
    val rDoubleInner = radius * geometry.doubleInnerRadius
    val rDoubleOuter = radius * geometry.doubleOuterRadius

    // 2) Couches concentriques de base (simples) en alternant clair/foncé par secteur
    //    On trace les secteurs simples d'un seul bloc (fond), puis par-dessus les anneaux triple/double.

    val sectorAngle = 360f / 20f
    val halfSector = sectorAngle / 2f
    val startAngleOffset = -90f - halfSector // on aligne le 20 à midi

    for (i in 0 until 20) {
        val start = startAngleOffset + i * sectorAngle
        val isDark = i % 2 == 0

        // Zone simple intérieure (entre outer bull et triple inner)
        drawArc(
            color = if (isDark) singleDark else singleLight,
            startAngle = start,
            sweepAngle = sectorAngle,
            useCenter = true,
            topLeft = Offset(center.x - rOuterBull, center.y - rOuterBull),
            size = androidx.compose.ui.geometry.Size(rOuterBull * 2, rOuterBull * 2),
        )

        drawArc(
            color = if (isDark) singleDark else singleLight,
            startAngle = start,
            sweepAngle = sectorAngle,
            useCenter = true,
            topLeft = Offset(center.x - rTripleInner, center.y - rTripleInner),
            size = androidx.compose.ui.geometry.Size(rTripleInner * 2, rTripleInner * 2),
        )

        // Zone simple extérieure (entre tripleOuter et doubleInner)
        drawArc(
            color = if (isDark) singleDark else singleLight,
            startAngle = start,
            sweepAngle = sectorAngle,
            useCenter = true,
            topLeft = Offset(center.x - rTripleOuter, center.y - rTripleOuter),
            size = androidx.compose.ui.geometry.Size(rTripleOuter * 2, rTripleOuter * 2),
        )

        drawArc(
            color = if (isDark) singleDark else singleLight,
            startAngle = start,
            sweepAngle = sectorAngle,
            useCenter = true,
            topLeft = Offset(center.x - rDoubleInner, center.y - rDoubleInner),
            size = androidx.compose.ui.geometry.Size(rDoubleInner * 2, rDoubleInner * 2),
        )
    }

    // 3) Anneaux triple et double (rouge/vert alternés)
    for (i in 0 until 20) {
        val start = startAngleOffset + i * sectorAngle
        val isRed = i % 2 == 0

        // Triple
        drawArc(
            color = if (isRed) ringRed else ringGreen,
            startAngle = start,
            sweepAngle = sectorAngle,
            useCenter = false,
            topLeft = Offset(center.x - rTripleOuter, center.y - rTripleOuter),
            size = androidx.compose.ui.geometry.Size(rTripleOuter * 2, rTripleOuter * 2),
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = rTripleOuter - rTripleInner),
        )

        // Double
        drawArc(
            color = if (isRed) ringRed else ringGreen,
            startAngle = start,
            sweepAngle = sectorAngle,
            useCenter = false,
            topLeft = Offset(center.x - rDoubleOuter, center.y - rDoubleOuter),
            size = androidx.compose.ui.geometry.Size(rDoubleOuter * 2, rDoubleOuter * 2),
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = rDoubleOuter - rDoubleInner),
        )
    }

    // 4) Bull extérieur et bullseye par-dessus tout
    drawCircle(color = outerBull, radius = rOuterBull, center = center)
    drawCircle(color = innerBull, radius = rInnerBull, center = center)

    // 5) Numéros 1 à 20 autour de la cible
    drawSectorNumbers(center, radius, sectorAngle, startAngleOffset)
}

private fun androidx.compose.ui.graphics.drawscope.DrawScope.drawSectorNumbers(
    center: Offset,
    radius: Float,
    sectorAngle: Float,
    startAngleOffset: Float,
) {
    // On place les numéros légèrement en dehors de l'anneau double
    val numberRadius = radius * 1.02f

    for (i in 0 until 20) {
        val sectorNumber = SECTOR_ORDER[i]

        // Angle au centre du secteur i (même logique que pour les arcs)
        val angleDeg = startAngleOffset + i * sectorAngle + sectorAngle / 2f
        val angleRad = Math.toRadians(angleDeg.toDouble())
        val x = center.x + numberRadius * kotlin.math.cos(angleRad).toFloat()
        val y = center.y + numberRadius * kotlin.math.sin(angleRad).toFloat()

        // Dessine un petit label centré autour du point (x,y).
        // Comme on est dans DrawScope de Canvas, on simplifie :
        // on dessine un petit cercle de fond + on laisse le texte aux composables parent
        // -> ici, on dessine uniquement de petits repères pour garder la compatibilité.

        drawCircle(
            color = Color(0x55FFFFFF),
            radius = radius * 0.04f,
            center = Offset(x, y),
        )
        // NOTE : pour un rendu parfait avec texte, il serait préférable de superposer
        // un composable Text sur un deuxième calque Compose plutôt que d'essayer de
        // "peindre" du texte depuis DrawScope.
    }
}

// ---- Feedback Overlay ----

data class HitFeedbackState(
    val lastHit: ScoreData?,
    val isVisible: Boolean,
)

@Composable
fun FeedbackOverlay(state: HitFeedbackState, modifier: Modifier = Modifier) {
    Box(modifier = modifier, contentAlignment = Alignment.TopCenter) {
        AnimatedVisibility(
            visible = state.isVisible && state.lastHit != null,
            enter = fadeIn(),
            exit = fadeOut(),
        ) {
            val hit = state.lastHit!!
            val label = when {
                hit.ring == RingType.INNER_BULL -> "Bullseye +50"
                hit.ring == RingType.OUTER_BULL -> "+25"
                hit.sector != null -> when (hit.multiplier) {
                    3 -> "Triple ${hit.sector} (+${hit.total})"
                    2 -> "Double ${hit.sector} (+${hit.total})"
                    1 -> "+${hit.total}"
                    else -> "+0"
                }
                else -> "Miss"
            }
            Box(
                modifier = Modifier
                    .padding(top = 16.dp)
                    .background(Color(0xAA000000), shape = MaterialTheme.shapes.medium)
                    .padding(horizontal = 16.dp, vertical = 8.dp),
            ) {
                Text(text = label, color = Color.White)
            }
        }
    }
}

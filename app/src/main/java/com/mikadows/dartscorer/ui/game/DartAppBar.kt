package com.mikadows.dartscorer.ui.game

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DartAppBar(
    onBack: () -> Unit,
    onUndo: () -> Unit,
    onReset: () -> Unit,
    onStatsClick: () -> Unit,
    onMicClick: () -> Unit,
    onMenuClick: () -> Unit,
) {
    TopAppBar(
        title = { Text(text = "Darts") },
        navigationIcon = {
            // Icône retour simplifiée en bouton texte pour éviter la dépendance aux Material Icons
            TextButton(onClick = onBack) {
                Text("<", color = Color.White)
            }
        },
        actions = {
            TextButton(onClick = onUndo) { Text("Undo", color = Color.White) }
            TextButton(onClick = onReset) { Text("Reset", color = Color.White) }
            TextButton(onClick = onStatsClick) { Text("Stats", color = Color.White) }
            TextButton(onClick = onMicClick) { Text("Mic", color = Color.White) }
            TextButton(onClick = onMenuClick) { Text("⋮", color = Color.White) }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = Color(0xFF121212),
            titleContentColor = Color.White,
            navigationIconContentColor = Color.White,
            actionIconContentColor = Color.White,
        ),
    )
}

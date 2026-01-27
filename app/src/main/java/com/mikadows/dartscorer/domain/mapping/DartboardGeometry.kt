package com.mikadows.dartscorer.domain.mapping

/**
 * Décrit les proportions relatives d'une cible de fléchettes.
 * Toutes les valeurs sont exprimées en fraction du rayon total de la cible.
 *
 * Les valeurs sont approximatives mais cohérentes avec une cible standard :
 * - double et triple sont des anneaux fins
 * - bull et bullseye sont très centraux
 *
 * Les règles de frontières sont documentées dans [DartboardMapper].
 */
data class DartboardGeometry(
    val innerBullRadius: Float = 0.05f,   // bullseye 50
    // Outer bull légèrement agrandi (~10%) pour mieux ressortir visuellement
    val outerBullRadius: Float = 0.10f,   // bull 25
    val tripleInnerRadius: Float = 0.47f,
    val tripleOuterRadius: Float = 0.53f,
    // On resserre un peu la zone double pour limiter la bande simple sous l'affichage
    val doubleInnerRadius: Float = 0.86f,
    val doubleOuterRadius: Float = 0.94f,
) {
    init {
        require(innerBullRadius > 0f && innerBullRadius < outerBullRadius)
        require(outerBullRadius < tripleInnerRadius)
        require(tripleInnerRadius < tripleOuterRadius)
        require(tripleOuterRadius < doubleInnerRadius)
        require(doubleInnerRadius < doubleOuterRadius && doubleOuterRadius <= 1f)
    }

    companion object {
        val Default = DartboardGeometry()
    }
}

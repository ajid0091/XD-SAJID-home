package com.mayra.assistant.utils

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween

object AnimationSpecs {
    val SmoothSpring = spring<Float>(
        dampingRatio = Spring.DampingRatioMediumBouncy,
        stiffness = Spring.StiffnessLow
    )

    val FastOutSlow = tween<Float>(
        durationMillis = 400,
        easing = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
    )

    val NeonGlowEasing = CubicBezierEasing(0.2f, 0.8f, 0.2f, 1.0f)
}

package com.mayra.assistant.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.mayra.assistant.ui.theme.CyanGlow
import com.mayra.assistant.ui.theme.NeonPink
import com.mayra.assistant.ui.theme.NeonPurple

enum class VoiceState {
    IDLE,
    LISTENING,
    THINKING,
    SPEAKING
}

/**
 * Large glowing animated voice interaction orb.
 * Features smooth pulsing, glowing rotating rings, and audio-reactive state visuals.
 */
@Composable
fun VoiceOrb(
    state: VoiceState,
    modifier: Modifier = Modifier,
    size: Dp = 160.dp,
    onClick: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "orbTransition")

    // Idle breathing scale
    val breathingScale by infiniteTransition.animateFloat(
        initialValue = 0.95f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "breathing"
    )

    // Pulsing outer ripple
    val pulseRing by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1.35f,
        animationSpec = infiniteRepeatable(
            animation = tween(if (state == VoiceState.LISTENING) 1000 else 2600, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "pulseRing"
    )

    // Ring rotation
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(if (state == VoiceState.THINKING) 1200 else 7000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotation"
    )

    // Dynamic gradient colors based on state
    val centerColor by animateColorAsState(
        targetValue = when (state) {
            VoiceState.IDLE -> NeonPink
            VoiceState.LISTENING -> CyanGlow
            VoiceState.THINKING -> NeonPurple
            VoiceState.SPEAKING -> NeonPink
        },
        animationSpec = tween(400),
        label = "orbColor1"
    )

    val outerColor by animateColorAsState(
        targetValue = when (state) {
            VoiceState.IDLE -> NeonPurple
            VoiceState.LISTENING -> NeonPurple
            VoiceState.THINKING -> CyanGlow
            VoiceState.SPEAKING -> CyanGlow
        },
        animationSpec = tween(400),
        label = "orbColor2"
    )

    val activeScale = when (state) {
        VoiceState.IDLE -> breathingScale
        VoiceState.LISTENING -> 1.12f
        VoiceState.THINKING -> 1.0f
        VoiceState.SPEAKING -> breathingScale * 1.08f
    }

    Box(
        modifier = modifier
            .size(size)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(size).scale(activeScale)) {
            val center = Offset(this.size.width / 2, this.size.height / 2)
            val radius = this.size.width / 3

            // Ambient outer glow ring
            drawCircle(
                color = outerColor.copy(alpha = (1.4f - pulseRing).coerceIn(0.05f, 0.35f)),
                radius = radius * pulseRing,
                center = center
            )

            // Orbiting accent ring
            drawCircle(
                brush = Brush.sweepGradient(
                    colors = listOf(
                        centerColor.copy(alpha = 0.8f),
                        outerColor.copy(alpha = 0.2f),
                        centerColor.copy(alpha = 0.8f)
                    )
                ),
                radius = radius * 1.15f,
                center = center,
                style = Stroke(width = 3.dp.toPx())
            )

            // Inner core sphere gradient
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color.White.copy(alpha = 0.9f),
                        centerColor,
                        outerColor,
                        Color(0xFF140D26)
                    ),
                    center = Offset(center.x - radius * 0.2f, center.y - radius * 0.2f),
                    radius = radius
                ),
                radius = radius,
                center = center
            )
        }
    }
}

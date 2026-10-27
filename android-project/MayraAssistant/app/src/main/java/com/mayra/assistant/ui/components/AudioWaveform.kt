package com.mayra.assistant.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import com.mayra.assistant.ui.theme.CyanGlow
import com.mayra.assistant.ui.theme.NeonPink
import com.mayra.assistant.ui.theme.NeonPurple

/**
 * Animated real-time waveform bars indicating voice listening and speaking states.
 */
@Composable
fun AudioWaveform(
    isActive: Boolean,
    modifier: Modifier = Modifier,
    barCount: Int = 18
) {
    val infiniteTransition = rememberInfiniteTransition(label = "waveformTransition")

    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(44.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        for (i in 0 until barCount) {
            val phaseDelay = (i * 120)
            val animatedHeight by infiniteTransition.animateFloat(
                initialValue = 6f,
                targetValue = if (isActive) (14f + ((i % 5) * 6f)) else 6f,
                animationSpec = infiniteRepeatable(
                    animation = tween(
                        durationMillis = 400 + (i % 3) * 150,
                        delayMillis = phaseDelay % 200,
                        easing = FastOutSlowInEasing
                    ),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "barHeight$i"
            )

            Box(
                modifier = Modifier
                    .padding(horizontal = 2.dp)
                    .width(4.dp)
                    .height(if (isActive) animatedHeight.dp else 4.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                NeonPink,
                                NeonPurple,
                                CyanGlow
                            )
                        )
                    )
            )
        }
    }
}

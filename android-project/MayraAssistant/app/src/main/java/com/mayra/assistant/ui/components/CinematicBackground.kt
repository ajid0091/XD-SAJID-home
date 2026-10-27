package com.mayra.assistant.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import com.mayra.assistant.R

/**
 * Fullscreen edge-to-edge cinematic character background.
 * Loads the Mayra portrait drawable and overlays a dark translucent vignette gradient
 * to guarantee optimal contrast and readability for all glassmorphic UI elements.
 */
@Composable
fun CinematicBackground(
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier.fillMaxSize()) {
        // High-res character image covering edge to edge
        Image(
            painter = painterResource(id = R.drawable.mayra_character),
            contentDescription = "Mayra AI Companion",
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        // Dark gradient overlay for UI readability and neon contrast
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0x770D0916), // Subtle top shadow for status bar
                            Color(0x330A0612), // Clear center to see Mayra
                            Color(0x88090514), // Lower midpoint
                            Color(0xEA080410)  // Dark base for bottom cards and navigation
                        ),
                        startY = 0f,
                        endY = Float.POSITIVE_INFINITY
                    )
                )
        )
    }
}

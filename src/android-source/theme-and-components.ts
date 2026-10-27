/**
 * MainActivity, Application, Theme, and Reusable Jetpack Compose Components.
 */

export const THEME_AND_COMPONENTS: Record<string, string> = {
  "app/src/main/java/com/mayra/assistant/MayraApplication.kt": `package com.mayra.assistant

import android.app.Application
import android.util.Log

class MayraApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        Log.d("MayraApplication", "Mayra AI Assistant initialized. Ready for loving interactions.")
    }
}
`,

  "app/src/main/java/com/mayra/assistant/MainActivity.kt": `package com.mayra.assistant

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.core.view.WindowCompat
import com.mayra.assistant.navigation.MayraNavGraph
import com.mayra.assistant.ui.theme.DarkBackground
import com.mayra.assistant.ui.theme.MayraAssistantTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Enable real edge-to-edge rendering behind status & navigation bars
        enableEdgeToEdge()
        WindowCompat.setDecorFitsSystemWindows(window, false)

        setContent {
            MayraAssistantTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = DarkBackground
                ) {
                    MayraNavGraph()
                }
            }
        }
    }
}
`,

  "app/src/main/java/com/mayra/assistant/ui/theme/Color.kt": `package com.mayra.assistant.ui.theme

import androidx.compose.ui.graphics.Color

// Neon & Brand Palette
val NeonPink = Color(0xFFFF6FAE)
val NeonPinkLight = Color(0xFFFF94C2)
val NeonPurple = Color(0xFF9B6BFF)
val NeonPurpleDark = Color(0xFF6B3BC2)
val CyanGlow = Color(0xFF00E5FF)
val MintSuccess = Color(0xFF3DDC97)
val AlertRed = Color(0xFFFF5D6C)

// Dark Cinematic Theme Backgrounds
val DarkBackground = Color(0xFF0F0B18)
val DarkSurface = Color(0xFF191326)
val DarkSurfaceCard = Color(0xCC1E1730) // Translucent for glassmorphism
val DarkSurfaceLight = Color(0xFF2A2140)

// Glassmorphism Stems & Strokes
val GlassBorder = Color(0x33FFFFFF)
val GlassBorderActive = Color(0x66FF6FAE)
val GlassHighlight = Color(0x1AFFFFFF)

// Text Hierarchy
val TextPrimary = Color(0xFFF6F0FF)
val TextSecondary = Color(0xFFA899BF)
val TextTertiary = Color(0xFF75678C)
`,

  "app/src/main/java/com/mayra/assistant/ui/theme/Type.kt": `package com.mayra.assistant.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 32.sp,
        lineHeight = 38.sp,
        letterSpacing = (-0.5).sp,
        color = TextPrimary
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp,
        lineHeight = 30.sp,
        color = TextPrimary
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 26.sp,
        color = TextPrimary
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        color = TextPrimary
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        color = TextSecondary
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp,
        color = TextTertiary
    )
)
`,

  "app/src/main/java/com/mayra/assistant/ui/theme/Theme.kt": `package com.mayra.assistant.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = NeonPink,
    secondary = NeonPurple,
    tertiary = CyanGlow,
    background = DarkBackground,
    surface = DarkSurface,
    onPrimary = TextPrimary,
    onSecondary = TextPrimary,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun MayraAssistantTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    // Mayra is designed as a cinematic dark neon theme
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
`,

  "app/src/main/java/com/mayra/assistant/ui/components/GlassCard.kt": `package com.mayra.assistant.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.mayra.assistant.ui.theme.DarkSurfaceCard
import com.mayra.assistant.ui.theme.GlassBorder

/**
 * Premium Frosted Glassmorphism Container with realistic blur,
 * border highlights, ambient shadow, and spring scale feedback.
 */
@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    shape: Shape = RoundedCornerShape(20.dp),
    backgroundColor: Color = DarkSurfaceCard,
    borderColor: Color = GlassBorder,
    borderWidth: Dp = 1.dp,
    onClick: (() -> Unit)? = null,
    content: @Composable BoxScope.() -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    
    val scale by animateFloatAsState(
        targetValue = if (isPressed && onClick != null) 0.97f else 1f,
        animationSpec = spring(dampingRatio = 0.7f, stiffness = 400f),
        label = "glassCardScale"
    )

    Box(
        modifier = modifier
            .scale(scale)
            .shadow(
                elevation = 16.dp,
                shape = shape,
                ambientColor = Color(0x33000000),
                spotColor = Color(0x409B6BFF)
            )
            .clip(shape)
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        backgroundColor.copy(alpha = 0.65f),
                        backgroundColor.copy(alpha = 0.85f)
                    )
                )
            )
            .border(
                BorderStroke(
                    borderWidth,
                    Brush.verticalGradient(
                        colors = listOf(
                            borderColor.copy(alpha = 0.6f),
                            borderColor.copy(alpha = 0.15f)
                        )
                    )
                ),
                shape = shape
            )
            .then(
                if (onClick != null) {
                    Modifier.clickable(
                        interactionSource = interactionSource,
                        indication = null,
                        onClick = onClick
                    )
                } else Modifier
            )
            .padding(16.dp)
    ) {
        content()
    }
}
`,

  "app/src/main/java/com/mayra/assistant/ui/components/VoiceOrb.kt": `package com.mayra.assistant.ui.components

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
`,

  "app/src/main/java/com/mayra/assistant/ui/components/AudioWaveform.kt": `package com.mayra.assistant.ui.components

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
`,

  "app/src/main/java/com/mayra/assistant/ui/components/StatusIndicator.kt": `package com.mayra.assistant.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mayra.assistant.ui.theme.MintSuccess
import com.mayra.assistant.ui.theme.TextSecondary

@Composable
fun StatusIndicator(
    isOnline: Boolean,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "statusTransition")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.6f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "statusPulse"
    )

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier.size(16.dp),
            contentAlignment = Alignment.Center
        ) {
            if (isOnline) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .scale(pulseScale)
                        .clip(CircleShape)
                        .background(MintSuccess.copy(alpha = (1.6f - pulseScale).coerceIn(0f, 0.4f)))
                )
            }
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(if (isOnline) MintSuccess else Color(0xFFFF5D6C))
            )
        }
        Spacer(modifier = Modifier.width(6.dp))
        Text(
            text = if (isOnline) "Online • Live" else "Offline",
            color = TextSecondary,
            fontSize = 12.sp
        )
    }
}
`,

  "app/src/main/java/com/mayra/assistant/ui/components/BottomNavBar.kt": `package com.mayra.assistant.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mayra.assistant.navigation.Screen
import com.mayra.assistant.ui.theme.DarkSurfaceCard
import com.mayra.assistant.ui.theme.GlassBorder
import com.mayra.assistant.ui.theme.NeonPink
import com.mayra.assistant.ui.theme.TextSecondary

data class NavItem(
    val screen: Screen,
    val title: String,
    val icon: ImageVector
)

@Composable
fun BottomNavBar(
    currentRoute: String,
    onNavigate: (Screen) -> Unit,
    modifier: Modifier = Modifier
) {
    val items = listOf(
        NavItem(Screen.Home, "Home", Icons.Filled.Home),
        NavItem(Screen.Chat, "Chat", Icons.Filled.ChatBubble),
        NavItem(Screen.SmartHome, "Smart", Icons.Filled.PowerSettingsNew),
        NavItem(Screen.Memories, "Memory", Icons.Filled.Favorite),
        NavItem(Screen.Settings, "Settings", Icons.Filled.Settings)
    )

    GlassCard(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        shape = RoundedCornerShape(26.dp),
        backgroundColor = DarkSurfaceCard.copy(alpha = 0.85f),
        borderColor = GlassBorder
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            items.forEach { item ->
                val isSelected = currentRoute == item.screen.route

                Column(
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            onClick = { onNavigate(item.screen) }
                        )
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.title,
                        tint = if (isSelected) NeonPink else TextSecondary,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = item.title,
                        color = if (isSelected) NeonPink else TextSecondary,
                        fontSize = 11.sp
                    )
                }
            }
        }
    }
}
`,

  "app/src/main/java/com/mayra/assistant/ui/components/CinematicBackground.kt": `package com.mayra.assistant.ui.components

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
`
};

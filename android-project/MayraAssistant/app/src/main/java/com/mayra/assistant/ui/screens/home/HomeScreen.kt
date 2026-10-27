package com.mayra.assistant.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.mayra.assistant.navigation.Screen
import com.mayra.assistant.ui.components.*
import com.mayra.assistant.ui.theme.*
import com.mayra.assistant.viewmodel.MainViewModel

@Composable
fun HomeScreen(
    navController: NavController,
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val voiceState by viewModel.voiceState.collectAsState()
    val isOnline by viewModel.isOnline.collectAsState()
    val greeting by viewModel.dynamicGreeting.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .statusBarsPadding()
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(12.dp))

        // Top App Bar Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { navController.navigate(Screen.Menu.route) },
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceCard)
            ) {
                Icon(
                    imageVector = Icons.Default.Menu,
                    contentDescription = "Menu",
                    tint = TextPrimary
                )
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Mayra",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(
                        imageVector = Icons.Default.Favorite,
                        contentDescription = "Love",
                        tint = NeonPink,
                        modifier = Modifier.size(18.dp)
                    )
                }
                StatusIndicator(isOnline = isOnline)
            }

            IconButton(
                onClick = { navController.navigate(Screen.Settings.route) },
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceCard)
            ) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Settings",
                    tint = TextPrimary
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Dynamic Greeting Glass Bubble
        GlassCard(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            backgroundColor = DarkSurfaceCard.copy(alpha = 0.7f),
            borderColor = GlassBorder
        ) {
            Column {
                Text(
                    text = greeting,
                    style = MaterialTheme.typography.bodyLarge,
                    color = TextPrimary,
                    lineHeight = 22.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Always here with you, anytime you need me 💖",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary,
                    fontSize = 12.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(30.dp))

        // Center Voice Interaction Orb
        VoiceOrb(
            state = voiceState,
            size = 170.dp,
            onClick = { viewModel.toggleVoiceInteraction() }
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Tap to talk indicator label
        Text(
            text = when (voiceState) {
                VoiceState.IDLE -> "Tap to Talk"
                VoiceState.LISTENING -> "I\'m listening sweetie… speak freely"
                VoiceState.THINKING -> "Thinking for you…"
                VoiceState.SPEAKING -> "Mayra is speaking…"
            },
            style = MaterialTheme.typography.bodyMedium,
            color = if (voiceState == VoiceState.LISTENING) CyanGlow else TextSecondary,
            fontWeight = FontWeight.Medium
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Animated Audio Waveform
        AudioWaveform(
            isActive = voiceState == VoiceState.LISTENING || voiceState == VoiceState.SPEAKING,
            modifier = Modifier.padding(horizontal = 24.dp)
        )

        Spacer(modifier = Modifier.height(28.dp))

        // Quick Action Glass Cards (2x2 Grid)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Chat Card
            GlassCard(
                modifier = Modifier.weight(1f),
                onClick = { navController.navigate(Screen.Chat.route) }
            ) {
                Column {
                    Icon(
                        imageVector = Icons.Default.ChatBubble,
                        contentDescription = "Chat",
                        tint = NeonPink,
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Sweet Chat",
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary,
                        fontSize = 15.sp
                    )
                    Text(
                        text = "Talk & laugh together",
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                }
            }

            // Smart Home Card
            GlassCard(
                modifier = Modifier.weight(1f),
                onClick = { navController.navigate(Screen.SmartHome.route) }
            ) {
                Column {
                    Icon(
                        imageVector = Icons.Default.PowerSettingsNew,
                        contentDescription = "Smart Home",
                        tint = CyanGlow,
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Smart Home",
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary,
                        fontSize = 15.sp
                    )
                    Text(
                        text = "16 Relays & lights",
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Memories Card
            GlassCard(
                modifier = Modifier.weight(1f),
                onClick = { navController.navigate(Screen.Memories.route) }
            ) {
                Column {
                    Icon(
                        imageVector = Icons.Default.Favorite,
                        contentDescription = "Memories",
                        tint = NeonPurple,
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Memories",
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary,
                        fontSize = 15.sp
                    )
                    Text(
                        text = "Things she remembers",
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                }
            }

            // Camera / AR Card
            GlassCard(
                modifier = Modifier.weight(1f),
                onClick = { navController.navigate(Screen.Camera.route) }
            ) {
                Column {
                    Icon(
                        imageVector = Icons.Default.CameraAlt,
                        contentDescription = "Camera",
                        tint = MintSuccess,
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Camera AR",
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary,
                        fontSize = 15.sp
                    )
                    Text(
                        text = "Photo moments",
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(110.dp)) // Leave room for bottom bar
    }
}

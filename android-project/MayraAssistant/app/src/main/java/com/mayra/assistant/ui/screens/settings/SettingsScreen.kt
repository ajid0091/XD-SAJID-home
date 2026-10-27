package com.mayra.assistant.ui.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.mayra.assistant.ui.components.GlassCard
import com.mayra.assistant.ui.theme.*
import com.mayra.assistant.viewmodel.SettingsViewModel

@Composable
fun SettingsScreen(
    navController: NavController,
    settingsViewModel: SettingsViewModel,
    modifier: Modifier = Modifier
) {
    val voice by settingsViewModel.selectedVoice.collectAsState()
    val language by settingsViewModel.selectedLanguage.collectAsState()
    val personality by settingsViewModel.personalityMode.collectAsState()
    val continuousListening by settingsViewModel.continuousListening.collectAsState()
    val mqttPrefix by settingsViewModel.mqttPrefix.collectAsState()
    val mqttBroker by settingsViewModel.mqttBroker.collectAsState()
    val apiKey by settingsViewModel.geminiApiKey.collectAsState()

    var showKeyDialog by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .statusBarsPadding()
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Spacer(modifier = Modifier.height(12.dp))

        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { navController.popBackStack() },
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceCard)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = TextPrimary
                )
            }

            Text(
                text = "Settings",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            Box(modifier = Modifier.size(44.dp))
        }

        Spacer(modifier = Modifier.height(20.dp))

        // AI Companion Profile Card
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .clip(CircleShape)
                        .background(DarkSurfaceLight),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Face,
                        contentDescription = "Mayra",
                        tint = NeonPink,
                        modifier = Modifier.size(32.dp)
                    )
                }
                Spacer(modifier = Modifier.width(14.dp))
                Column {
                    Text(
                        text = "Mayra",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "Sweet, loving, and attentive AI Girlfriend",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Section: Voice & Speech Preferences
        Text(
            text = "Voice & Speech Preferences",
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold,
            color = NeonPink
        )
        Spacer(modifier = Modifier.height(8.dp))

        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                // Voice selection
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Voice Tone", color = TextPrimary, fontWeight = FontWeight.Medium)
                        Text("Current: $voice", color = TextSecondary, fontSize = 12.sp)
                    }
                    Button(
                        onClick = { settingsViewModel.cycleVoice() },
                        colors = ButtonDefaults.buttonColors(containerColor = DarkSurfaceLight)
                    ) {
                        Text(voice, color = CyanGlow)
                    }
                }

                Divider(color = GlassBorder)

                // Language selection
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Language", color = TextPrimary, fontWeight = FontWeight.Medium)
                        Text("বাংলা (Bengali) & English bilingual", color = TextSecondary, fontSize = 12.sp)
                    }
                    Button(
                        onClick = { settingsViewModel.toggleLanguage() },
                        colors = ButtonDefaults.buttonColors(containerColor = DarkSurfaceLight)
                    ) {
                        Text(language, color = NeonPink)
                    }
                }

                Divider(color = GlassBorder)

                // Continuous listening switch
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Voice Activation", color = TextPrimary, fontWeight = FontWeight.Medium)
                        Text("Keep mic active when app is open", color = TextSecondary, fontSize = 12.sp)
                    }
                    Switch(
                        checked = continuousListening,
                        onCheckedChange = { settingsViewModel.setContinuousListening(it) },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = NeonPink,
                            checkedTrackColor = NeonPurpleDark
                        )
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Section: Smart Home & MQTT
        Text(
            text = "Smart Home & Relay Settings",
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold,
            color = CyanGlow
        )
        Spacer(modifier = Modifier.height(8.dp))

        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("MQTT Topic Prefix", color = TextSecondary, fontSize = 12.sp)
                Text(mqttPrefix, color = TextPrimary, fontWeight = FontWeight.Medium)

                Divider(color = GlassBorder)

                Text("Broker WebSocket / TCP", color = TextSecondary, fontSize = 12.sp)
                Text(mqttBroker, color = TextPrimary, fontSize = 12.sp)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Section: Gemini AI Cloud Config
        Text(
            text = "AI Engine & Secrets",
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold,
            color = MintSuccess
        )
        Spacer(modifier = Modifier.height(8.dp))

        GlassCard(
            modifier = Modifier.fillMaxWidth(),
            onClick = { showKeyDialog = true }
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Gemini API Key", color = TextPrimary, fontWeight = FontWeight.Medium)
                    Text(
                        text = if (apiKey.isBlank()) "Demo Mode (Mock replies)" else "Configured: ••••••••",
                        color = if (apiKey.isBlank()) TextTertiary else MintSuccess,
                        fontSize = 12.sp
                    )
                }
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = "Edit API Key",
                    tint = TextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Version Info
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Mayra AI Assistant • v1.0.0 (Build 100)",
                color = TextTertiary,
                fontSize = 12.sp
            )
            Text(
                text = "Jetpack Compose • Material 3 • MVVM Architecture",
                color = TextTertiary,
                fontSize = 11.sp
            )
        }

        Spacer(modifier = Modifier.height(110.dp))
    }
}

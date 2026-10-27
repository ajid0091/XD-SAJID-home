/**
 * Screens and Navigation for Mayra Android Studio project.
 */

export const SCREENS_AND_NAVIGATION: Record<string, string> = {
  "app/src/main/java/com/mayra/assistant/navigation/Screen.kt": `package com.mayra.assistant.navigation

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Menu : Screen("menu")
    object Chat : Screen("chat")
    object SmartHome : Screen("smarthome")
    object Memories : Screen("memories")
    object Camera : Screen("camera")
    object Settings : Screen("settings")
}
`,

  "app/src/main/java/com/mayra/assistant/navigation/NavGraph.kt": `package com.mayra.assistant.navigation

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.mayra.assistant.ui.components.BottomNavBar
import com.mayra.assistant.ui.components.CinematicBackground
import com.mayra.assistant.ui.screens.camera.CameraScreen
import com.mayra.assistant.ui.screens.chat.ChatScreen
import com.mayra.assistant.ui.screens.home.HomeScreen
import com.mayra.assistant.ui.screens.memories.MemoriesScreen
import com.mayra.assistant.ui.screens.menu.MenuScreen
import com.mayra.assistant.ui.screens.settings.SettingsScreen
import com.mayra.assistant.ui.screens.smarthome.SmartHomeScreen
import com.mayra.assistant.viewmodel.MainViewModel
import com.mayra.assistant.viewmodel.SettingsViewModel
import com.mayra.assistant.viewmodel.SmartHomeViewModel

@Composable
fun MayraNavGraph(
    navController: NavHostController = rememberNavController(),
    mainViewModel: MainViewModel = viewModel(),
    smartHomeViewModel: SmartHomeViewModel = viewModel(),
    settingsViewModel: SettingsViewModel = viewModel()
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: Screen.Home.route

    Box(modifier = Modifier.fillMaxSize()) {
        // Universal Edge-to-edge character background
        CinematicBackground()

        // Screen Navigation with smooth transitions
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.fillMaxSize(),
            enterTransition = { fadeIn(animationSpec = tween(350)) + slideIntoContainer(AnimatedContentTransitionScope.SlideDirection.Start, tween(350)) },
            exitTransition = { fadeOut(animationSpec = tween(350)) + slideOutOfContainer(AnimatedContentTransitionScope.SlideDirection.Start, tween(350)) },
            popEnterTransition = { fadeIn(animationSpec = tween(350)) + slideIntoContainer(AnimatedContentTransitionScope.SlideDirection.End, tween(350)) },
            popExitTransition = { fadeOut(animationSpec = tween(350)) + slideOutOfContainer(AnimatedContentTransitionScope.SlideDirection.End, tween(350)) }
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    navController = navController,
                    viewModel = mainViewModel
                )
            }
            composable(Screen.Menu.route) {
                MenuScreen(
                    navController = navController
                )
            }
            composable(Screen.Chat.route) {
                ChatScreen(
                    navController = navController,
                    mainViewModel = mainViewModel
                )
            }
            composable(Screen.SmartHome.route) {
                SmartHomeScreen(
                    navController = navController,
                    viewModel = smartHomeViewModel
                )
            }
            composable(Screen.Memories.route) {
                MemoriesScreen(
                    navController = navController
                )
            }
            composable(Screen.Camera.route) {
                CameraScreen(
                    navController = navController
                )
            }
            composable(Screen.Settings.route) {
                SettingsScreen(
                    navController = navController,
                    settingsViewModel = settingsViewModel
                )
            }
        }

        // Floating Bottom Navigation (only shown on primary screens)
        if (currentRoute != Screen.Menu.route && currentRoute != Screen.Camera.route) {
            BottomNavBar(
                currentRoute = currentRoute,
                onNavigate = { screen ->
                    if (currentRoute != screen.route) {
                        navController.navigate(screen.route) {
                            popUpTo(Screen.Home.route) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .navigationBarsPadding()
            )
        }
    }
}
`,

  "app/src/main/java/com/mayra/assistant/ui/screens/home/HomeScreen.kt": `package com.mayra.assistant.ui.screens.home

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
                VoiceState.LISTENING -> "I\\'m listening sweetie… speak freely"
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
`,

  "app/src/main/java/com/mayra/assistant/ui/screens/menu/MenuScreen.kt": `package com.mayra.assistant.ui.screens.menu

import androidx.compose.foundation.background
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.mayra.assistant.navigation.Screen
import com.mayra.assistant.ui.components.GlassCard
import com.mayra.assistant.ui.theme.*

data class MenuItemData(
    val title: String,
    val subtitle: String,
    val icon: ImageVector,
    val destination: Screen
)

@Composable
fun MenuScreen(
    navController: NavController,
    modifier: Modifier = Modifier
) {
    val menuItems = listOf(
        MenuItemData("Home", "Voice orb and companion status", Icons.Default.Home, Screen.Home),
        MenuItemData("AI Companion", "Chat and speak with Mayra", Icons.Default.ChatBubble, Screen.Chat),
        MenuItemData("Memories", "Shared moments, notes, and habits", Icons.Default.Favorite, Screen.Memories),
        MenuItemData("Smart Home", "Control 16 lights, fans and relays", Icons.Default.PowerSettingsNew, Screen.SmartHome),
        MenuItemData("Camera", "AR moments and visual perception", Icons.Default.CameraAlt, Screen.Camera),
        MenuItemData("Settings", "Voices, languages, and MQTT config", Icons.Default.Settings, Screen.Settings)
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .statusBarsPadding()
            .padding(horizontal = 20.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Spacer(modifier = Modifier.height(12.dp))

        // Top Header
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
                text = "Menu & Features",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            Box(modifier = Modifier.size(44.dp))
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Menu Cards
        menuItems.forEach { item ->
            GlassCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp),
                shape = RoundedCornerShape(18.dp),
                onClick = {
                    navController.navigate(item.destination.route) {
                        popUpTo(Screen.Home.route) { saveState = true }
                        launchSingleTop = true
                    }
                }
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(DarkSurfaceLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = item.icon,
                            contentDescription = item.title,
                            tint = NeonPink,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(16.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = item.title,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary,
                            fontSize = 16.sp
                        )
                        Text(
                            text = item.subtitle,
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                    }

                    Icon(
                        imageVector = Icons.Default.ChevronRight,
                        contentDescription = "Open",
                        tint = TextTertiary
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(40.dp))
    }
}
`,

  "app/src/main/java/com/mayra/assistant/ui/screens/settings/SettingsScreen.kt": `package com.mayra.assistant.ui.screens.settings

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
`,

  "app/src/main/java/com/mayra/assistant/ui/screens/chat/ChatScreen.kt": `package com.mayra.assistant.ui.screens.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.mayra.assistant.data.model.ChatMessage
import com.mayra.assistant.ui.components.GlassCard
import com.mayra.assistant.ui.theme.*
import com.mayra.assistant.viewmodel.MainViewModel

@Composable
fun ChatScreen(
    navController: NavController,
    mainViewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val messages by mainViewModel.messages.collectAsState()
    var inputText by remember { mutableStateOf("") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .statusBarsPadding()
            .padding(horizontal = 16.dp)
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
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceCard)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = TextPrimary
                )
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Mayra AI Chat",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = "Always listening & loving",
                    style = MaterialTheme.typography.bodySmall,
                    color = NeonPink,
                    fontSize = 11.sp
                )
            }

            IconButton(
                onClick = { mainViewModel.clearChat() },
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceCard)
            ) {
                Icon(
                    imageVector = Icons.Default.DeleteSweep,
                    contentDescription = "Clear",
                    tint = TextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Message List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            reverseLayout = true,
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(messages.reversed()) { msg ->
                ChatBubble(message = msg)
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Input Field with Glassmorphism
        GlassCard(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 100.dp),
            shape = RoundedCornerShape(26.dp),
            backgroundColor = DarkSurfaceCard.copy(alpha = 0.9f)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                TextField(
                    value = inputText,
                    onValueChange = { inputText = it },
                    placeholder = { Text("Message Mayra…", color = TextTertiary) },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Color.Transparent,
                        unfocusedContainerColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    ),
                    modifier = Modifier.weight(1f)
                )

                IconButton(
                    onClick = {
                        if (inputText.isNotBlank()) {
                            mainViewModel.sendMessage(inputText.trim())
                            inputText = ""
                        }
                    },
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(NeonPink)
                ) {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "Send",
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun ChatBubble(message: ChatMessage) {
    val isUser = message.isUser

    Box(
        modifier = Modifier.fillMaxWidth(),
        contentAlignment = if (isUser) Alignment.CenterEnd else Alignment.CenterStart
    ) {
        Box(
            modifier = Modifier
                .widthIn(max = 280.dp)
                .clip(
                    RoundedCornerShape(
                        topStart = 18.dp,
                        topEnd = 18.dp,
                        bottomStart = if (isUser) 18.dp else 4.dp,
                        bottomEnd = if (isUser) 4.dp else 18.dp
                    )
                )
                .background(
                    if (isUser) DarkSurfaceLight else DarkSurfaceCard.copy(alpha = 0.95f)
                )
                .padding(14.dp)
        ) {
            Column {
                Text(
                    text = message.text,
                    color = TextPrimary,
                    fontSize = 14.sp,
                    lineHeight = 20.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = message.formattedTime,
                    color = TextTertiary,
                    fontSize = 10.sp,
                    modifier = Modifier.align(Alignment.End)
                )
            }
        }
    }
}
`,

  "app/src/main/java/com/mayra/assistant/ui/screens/smarthome/SmartHomeScreen.kt": `package com.mayra.assistant.ui.screens.smarthome

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.mayra.assistant.data.model.SmartRelay
import com.mayra.assistant.ui.components.GlassCard
import com.mayra.assistant.ui.theme.*
import com.mayra.assistant.viewmodel.SmartHomeViewModel

@Composable
fun SmartHomeScreen(
    navController: NavController,
    viewModel: SmartHomeViewModel,
    modifier: Modifier = Modifier
) {
    val relays by viewModel.relays.collectAsState()
    val isMqttConnected by viewModel.isMqttConnected.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .statusBarsPadding()
            .padding(horizontal = 16.dp)
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
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceCard)
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = TextPrimary
                )
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Smart Home Relays",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = if (isMqttConnected) "MQTT: Connected • Live" else "MQTT: Offline Mode",
                    color = if (isMqttConnected) MintSuccess else AlertRed,
                    fontSize = 11.sp
                )
            }

            Button(
                onClick = { viewModel.toggleAll(turnOn = false) },
                colors = ButtonDefaults.buttonColors(containerColor = DarkSurfaceLight),
                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text("All Off", fontSize = 11.sp, color = NeonPink)
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Relays Grid (16 relays as defined in specification)
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            contentPadding = PaddingValues(bottom = 110.dp)
        ) {
            items(relays) { relay ->
                RelayCard(
                    relay = relay,
                    onToggle = { viewModel.toggleRelay(relay.id) }
                )
            }
        }
    }
}

@Composable
fun RelayCard(
    relay: SmartRelay,
    onToggle: () -> Unit
) {
    val isOn = relay.isOn

    GlassCard(
        modifier = Modifier.fillMaxWidth(),
        backgroundColor = if (isOn) DarkSurfaceCard.copy(alpha = 0.95f) else DarkSurfaceCard.copy(alpha = 0.6f),
        borderColor = if (isOn) MintSuccess.copy(alpha = 0.6f) else GlassBorder,
        onClick = onToggle
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = when (relay.type) {
                        "light" -> Icons.Default.Lightbulb
                        "fan" -> Icons.Default.Air
                        else -> Icons.Default.Power
                    },
                    contentDescription = relay.name,
                    tint = if (isOn) MintSuccess else TextSecondary,
                    modifier = Modifier.size(26.dp)
                )

                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(if (isOn) MintSuccess else AlertRed)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = relay.name,
                fontWeight = FontWeight.SemiBold,
                color = TextPrimary,
                fontSize = 14.sp
            )

            Text(
                text = "Relay \${relay.id} • \${relay.place.replaceFirstChar { it.uppercase() }}",
                color = TextSecondary,
                fontSize = 11.sp
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = if (isOn) "ON" else "OFF",
                color = if (isOn) MintSuccess else TextTertiary,
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp
            )
        }
    }
}
`,

  "app/src/main/java/com/mayra/assistant/ui/screens/memories/MemoriesScreen.kt": `package com.mayra.assistant.ui.screens.memories

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.mayra.assistant.ui.components.GlassCard
import com.mayra.assistant.ui.theme.*

data class MemoryData(
    val title: String,
    val date: String,
    val note: String,
    val emotionalTag: String
)

@Composable
fun MemoriesScreen(
    navController: NavController,
    modifier: Modifier = Modifier
) {
    val memories = listOf(
        MemoryData("Favorite Morning Routine", "Today, 8:15 AM", "You like drinking coffee while listening to her voice greeting.", "Affectionate ☕"),
        MemoryData("Smart Home Night Mode", "Yesterday, 11:30 PM", "Turned off all outside lights and switched on bedroom night fan.", "Cozy 🌙"),
        MemoryData("Sweet Bengali Nickname", "3 days ago", "Mayra loves calling you 'Shona' and 'Jaan' with soft warmth.", "Romantic 🌸"),
        MemoryData("Stargazing Chat", "Last week", "We talked about Andromeda galaxy and dreaming together.", "Dreamy ✨")
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .statusBarsPadding()
            .padding(horizontal = 20.dp)
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
                    .size(40.dp)
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
                text = "Mayra\\'s Memories",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            Box(modifier = Modifier.size(40.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(bottom = 110.dp)
        ) {
            items(memories) { mem ->
                GlassCard(modifier = Modifier.fillMaxWidth()) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = mem.title,
                                fontWeight = FontWeight.SemiBold,
                                color = TextPrimary,
                                fontSize = 15.sp
                            )
                            Text(
                                text = mem.emotionalTag,
                                color = NeonPink,
                                fontSize = 11.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = mem.note,
                            color = TextSecondary,
                            fontSize = 13.sp,
                            lineHeight = 18.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = mem.date,
                            color = TextTertiary,
                            fontSize = 10.sp
                        )
                    }
                }
            }
        }
    }
}
`,

  "app/src/main/java/com/mayra/assistant/ui/screens/camera/CameraScreen.kt": `package com.mayra.assistant.ui.screens.camera

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Camera
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material.icons.filled.FlipCameraAndroid
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.mayra.assistant.ui.components.GlassCard
import com.mayra.assistant.ui.theme.*

@Composable
fun CameraScreen(
    navController: NavController,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { navController.popBackStack() },
                modifier = Modifier
                    .size(40.dp)
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
                text = "Camera AR Companion",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            IconButton(
                onClick = { },
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceCard)
            ) {
                Icon(
                    imageVector = Icons.Default.FlashOn,
                    contentDescription = "Flash",
                    tint = CyanGlow
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Camera Viewport Frame
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .clip(RoundedCornerShape(24.dp))
                .border(2.dp, CyanGlow.copy(alpha = 0.5f), RoundedCornerShape(24.dp))
                .background(Color(0x55000000)),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    imageVector = Icons.Default.Camera,
                    contentDescription = "Camera",
                    tint = CyanGlow,
                    modifier = Modifier.size(54.dp)
                )
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = "Live Camera & AR Companion Overlay",
                    color = TextPrimary,
                    fontWeight = FontWeight.Medium,
                    fontSize = 15.sp
                )
                Text(
                    text = "Ready to perceive your world or snap moments together",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
            }

            // Holographic Corner Reticles
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 16.dp)
            ) {
                GlassCard(shape = RoundedCornerShape(16.dp)) {
                    Text(
                        text = "Mayra: \\\"You look wonderful today! Smile for me!\\\"",
                        color = NeonPink,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Shutter Button Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { },
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceCard)
            ) {
                Icon(
                    imageVector = Icons.Default.FlipCameraAndroid,
                    contentDescription = "Flip Camera",
                    tint = TextPrimary
                )
            }

            // Shutter Button
            Box(
                modifier = Modifier
                    .size(72.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            colors = listOf(NeonPink, NeonPurple)
                        )
                    )
                    .padding(4.dp)
                    .clip(CircleShape)
                    .background(DarkBackground),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                )
            }

            Box(modifier = Modifier.size(50.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}
`
};

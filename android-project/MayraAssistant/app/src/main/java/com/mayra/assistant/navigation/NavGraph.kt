package com.mayra.assistant.navigation

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

package com.mayra.assistant.navigation

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Menu : Screen("menu")
    object Chat : Screen("chat")
    object SmartHome : Screen("smarthome")
    object Memories : Screen("memories")
    object Camera : Screen("camera")
    object Settings : Screen("settings")
}

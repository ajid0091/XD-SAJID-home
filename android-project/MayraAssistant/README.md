# Mayra — Your AI Girlfriend Assistant (Android Studio Project)

**Mayra** is a complete, production-ready native Android application built with **Kotlin**, **Jetpack Compose**, **Material 3**, and **MVVM Architecture**. It delivers a cinematic AI companion experience with edge-to-edge character visuals, frosted glassmorphism cards, glowing animated voice orb interactions, smart home relay controls (16 MQTT relays), and modular AI integration.

---

## 🌸 Visual & UI Highlights
- **Full-Screen Edge-to-Edge Character:** Visuals cover the full display with translucent glassmorphic UI cards layered over the character background.
- **Glowing Voice Orb:** Dynamic multi-ring pulsing animation with distinct visual states: `IDLE`, `LISTENING`, `THINKING`, `SPEAKING`.
- **Audio Waveform Visualizer:** Animated frequency bars synchronized with voice states.
- **Frosted Glass Cards:** Realistic frosted-glass effects with border highlights, soft neon shadows, and spring-scale tap feedback.
- **Smart Home Relays:** Control 16 devices (Bedroom, Kitchen, Living Room, Water Pump, Outdoor lights, Fans) compatible with ESP32 & MQTT brokers.
- **Bilingual Bengali & English:** Sweetheart dialogue and natural companion responses.

---

## 📁 Project Directory Structure
```
MayraAssistant/
├── build.gradle.kts                # Top-level Gradle build script
├── settings.gradle.kts             # Gradle project and repository settings
├── gradle.properties               # JVM memory and AndroidX flags
├── gradle/
│   └── libs.versions.toml          # Modern Gradle Version Catalog
└── app/
    ├── build.gradle.kts            # App module dependencies & SDK configuration
    ├── proguard-rules.pro          # ProGuard obfuscation rules
    └── src/
        ├── main/
        │   ├── AndroidManifest.xml # App permissions and Activity definition
        │   ├── java/com/mayra/assistant/
        │   │   ├── MainActivity.kt
        │   │   ├── MayraApplication.kt
        │   │   ├── navigation/     # NavHost & Sealed Screen routes
        │   │   ├── ui/
        │   │   │   ├── components/ # GlassCard, VoiceOrb, AudioWaveform, BottomNavBar
        │   │   │   ├── screens/    # Home, Menu, Chat, SmartHome, Memories, Camera, Settings
        │   │   │   └── theme/      # Color, Typography, Material3 Theme
        │   │   ├── data/           # Models, Preferences DataStore
        │   │   ├── domain/service/ # AiService, MqttHomeService
        │   │   ├── viewmodel/      # MainViewModel, SmartHomeViewModel, SettingsViewModel
        │   │   └── utils/          # AnimationSpecs, Constants
        │   └── res/
        │       ├── drawable/       # mayra_character.xml (vector fallback)
        │       ├── values/         # strings.xml, colors.xml, themes.xml
        │       └── xml/            # data_extraction_rules.xml, backup_rules.xml
        └── test/                   # JUnit unit tests for SmartHome & Chat logic
```

---

## 🎨 Adding Your Final High-Resolution Character Asset
A vector fallback drawable is provided in `app/src/main/res/drawable/mayra_character.xml`.

To use your own custom high-resolution photo or portrait:
1. Save your clean character image (recommended resolution: **1080 × 2400 px**, PNG or WebP).
2. Ensure there is **no UI text, buttons, or watermarks** on the image.
3. Place the file at:
   `app/src/main/res/drawable-nodpi/mayra_character.png` (or `.webp`)
4. The app automatically renders the image edge-to-edge behind the frosted glass interface cards!

---

## 🚀 How to Open and Run in Android Studio
1. Open **Android Studio Ladybug (2024.2+)** or newer.
2. Select **File > Open...** and choose the `MayraAssistant` project directory.
3. Allow Gradle to sync dependencies.
4. Select an Android device or emulator running **Android 8.0 (API 26)** or higher (Target SDK is **API 35**).
5. Click **Run 'app'** (`Shift + F10`).

---

## 🧪 Running Unit Tests
Execute the unit tests in terminal or via Android Studio:
```bash
./gradlew test
```

/**
 * Unit Tests and Comprehensive Documentation for the Mayra Android Studio project.
 */

export const TESTS_AND_DOCS: Record<string, string> = {
  "app/src/test/java/com/mayra/assistant/SmartHomeLogicTest.kt": `package com.mayra.assistant

import com.mayra.assistant.data.model.SmartRelay
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class SmartHomeLogicTest {

    @Test
    fun testRelayToggleLogic() {
        val relay = SmartRelay(
            id = 1,
            name = "Bedroom Light",
            place = "inside",
            type = "light",
            isOn = false
        )

        assertFalse(relay.isOn)

        val toggled = relay.copy(isOn = !relay.isOn)
        assertTrue(toggled.isOn)
        assertEquals(1, toggled.id)
        assertEquals("Bedroom Light", toggled.name)
    }

    @Test
    fun testRelayFiltering() {
        val list = listOf(
            SmartRelay(1, "Bedroom Light", "inside", "light", true),
            SmartRelay(2, "Bedroom Fan", "inside", "fan", false),
            SmartRelay(7, "Outdoor Light", "outside", "light", true)
        )

        val outsideLights = list.filter { it.place == "outside" && it.type == "light" }
        assertEquals(1, outsideLights.size)
        assertEquals("Outdoor Light", outsideLights.first().name)

        val insideDevices = list.filter { it.place == "inside" }
        assertEquals(2, insideDevices.size)
    }
}
`,

  "app/src/test/java/com/mayra/assistant/ChatMessageTest.kt": `package com.mayra.assistant

import com.mayra.assistant.data.model.ChatMessage
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ChatMessageTest {

    @Test
    fun testChatMessageCreation() {
        val msg = ChatMessage(
            text = "Hello Mayra, my love!",
            isUser = true
        )

        assertEquals("Hello Mayra, my love!", msg.text)
        assertTrue(msg.isUser)
        assertNotNull(msg.id)
        assertNotNull(msg.formattedTime)
    }

    @Test
    fun testMayraResponseFormat() {
        val msg = ChatMessage(
            text = "I love you always, sweetheart! 💖",
            isUser = false
        )

        assertFalse(msg.isUser)
        assertTrue(msg.text.contains("💖"))
    }
}
`,

  "README.md": `# Mayra — Your AI Girlfriend Assistant (Android Studio Project)

**Mayra** is a complete, production-ready native Android application built with **Kotlin**, **Jetpack Compose**, **Material 3**, and **MVVM Architecture**. It delivers a cinematic AI companion experience with edge-to-edge character visuals, frosted glassmorphism cards, glowing animated voice orb interactions, smart home relay controls (16 MQTT relays), and modular AI integration.

---

## 🌸 Visual & UI Highlights
- **Full-Screen Edge-to-Edge Character:** Visuals cover the full display with translucent glassmorphic UI cards layered over the character background.
- **Glowing Voice Orb:** Dynamic multi-ring pulsing animation with distinct visual states: \`IDLE\`, \`LISTENING\`, \`THINKING\`, \`SPEAKING\`.
- **Audio Waveform Visualizer:** Animated frequency bars synchronized with voice states.
- **Frosted Glass Cards:** Realistic frosted-glass effects with border highlights, soft neon shadows, and spring-scale tap feedback.
- **Smart Home Relays:** Control 16 devices (Bedroom, Kitchen, Living Room, Water Pump, Outdoor lights, Fans) compatible with ESP32 & MQTT brokers.
- **Bilingual Bengali & English:** Sweetheart dialogue and natural companion responses.

---

## 📁 Project Directory Structure
\`\`\`
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
\`\`\`

---

## 🎨 Adding Your Final High-Resolution Character Asset
A vector fallback drawable is provided in \`app/src/main/res/drawable/mayra_character.xml\`.

To use your own custom high-resolution photo or portrait:
1. Save your clean character image (recommended resolution: **1080 × 2400 px**, PNG or WebP).
2. Ensure there is **no UI text, buttons, or watermarks** on the image.
3. Place the file at:
   \`app/src/main/res/drawable-nodpi/mayra_character.png\` (or \`.webp\`)
4. The app automatically renders the image edge-to-edge behind the frosted glass interface cards!

---

## 🚀 How to Open and Run in Android Studio
1. Open **Android Studio Ladybug (2024.2+)** or newer.
2. Select **File > Open...** and choose the \`MayraAssistant\` project directory.
3. Allow Gradle to sync dependencies.
4. Select an Android device or emulator running **Android 8.0 (API 26)** or higher (Target SDK is **API 35**).
5. Click **Run 'app'** (\`Shift + F10\`).

---

## 🧪 Running Unit Tests
Execute the unit tests in terminal or via Android Studio:
\`\`\`bash
./gradlew test
\`\`\`
`,

  "ARCHITECTURE.md": `# Mayra Assistant — Software Architecture Document

## 1. Architectural Pattern: MVVM + Repository
The Mayra Android app follows modern Android Architecture Components:
- **UI Layer (Jetpack Compose):** Pure declarative composable functions. Recomposable based on \`StateFlow\`.
- **ViewModel Layer:** Holds UI state in \`StateFlow\`, handles user events, manages coroutine lifecycles via \`viewModelScope\`.
- **Domain Layer:** Pure Kotlin interfaces (\`AiService\`, \`MqttHomeService\`) isolating business logic from external SDKs.
- **Data Layer:**
  - \`UserPreferencesRepository\` using Jetpack DataStore for local persistence.
  - Model representations for \`ChatMessage\`, \`SmartRelay\`, \`MemoryItem\`.

## 2. Jetpack Compose Motion & Animation Engine
- **VoiceOrb:** Uses \`rememberInfiniteTransition\` driving multiple coordinated animations:
  - Core sphere radial pulsation (\`FastOutSlowInEasing\`).
  - Orbiting particle ring sweeping 360 degrees.
  - State color transitions smoothly interpolated via \`animateColorAsState\`.
- **GlassCard:** Spring-physics click feedback using \`animateFloatAsState(spring(dampingRatio = 0.7f, stiffness = 400f))\`.
- **Waveform:** Phase-delayed height oscillators mirroring dynamic vocal decibels.

## 3. Extensible AI Backend Integration
The app decouples AI chat through the \`AiService\` interface:
\`\`\`kotlin
interface AiService {
    suspend fun generateReply(prompt: String): String
    suspend fun streamReply(prompt: String, onChunk: (String) -> Unit)
}
\`\`\`
By default, \`DemoAiService\` provides charming and romantic responses in both English and Bengali.
To connect real Gemini Live audio or Gemini Flash REST endpoints:
1. Add your \`GEMINI_API_KEY\` in Settings.
2. Implement \`GeminiLiveService\` using WebSockets or OkHttp connecting to \`generativelanguage.googleapis.com\`.
3. Inject into \`MainViewModel\`.

## 4. Smart Home Architecture (16 Relays)
Follows the exact 16-relay layout from the reference setup:
- Relays 1–16 mapped to bedroom, living room, kitchen, outdoor lights, fans, and pump.
- Standardized MQTT topic convention: \`\${prefix}/relay\${id}\` with payload \`ON\` or \`OFF\`.
- Clean separation between UI state and network transport.
`,

  "BUILD_AND_RELEASE_GUIDE.md": `# Build, Signing, and Version Release Guide

## 1. Version Management Strategy
Version information is centralized in \`app/build.gradle.kts\`:
\`\`\`kotlin
defaultConfig {
    versionCode = 100    // Incremented by 1 for every build release
    versionName = "1.0.0" // Semantic versioning: MAJOR.MINOR.PATCH
}
\`\`\`
- **versionCode Rules:** Always strictly greater than previous release. Never reuse or decrement.
- **Application ID:** \`com.mayra.assistant\` (Must remain identical across releases to preserve user data and settings).

## 2. Generating a Signed Release APK / AAB
### Step A: Generate Keystore
\`\`\`bash
keytool -genkey -v -keystore mayra-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mayra_key
\`\`\`
*Keep your \`mayra-release-key.jks\` and passwords safe and backed up.*

### Step B: Build Android App Bundle (AAB for Google Play)
\`\`\`bash
./gradlew bundleRelease
\`\`\`
Output path: \`app/build/outputs/bundle/release/app-release.aab\`

### Step C: Build Standalone Signed APK
\`\`\`bash
./gradlew assembleRelease
\`\`\`
Output path: \`app/build/outputs/apk/release/app-release.apk\`

## 3. Data Migration and Persistence
User preferences and settings are stored via **Jetpack DataStore Preferences**:
- Existing user data is safely preserved during app upgrades because \`applicationId\` remains \`com.mayra.assistant\`.
- The manifest includes \`data_extraction_rules.xml\` to support seamless backup and device transfer.
`
};

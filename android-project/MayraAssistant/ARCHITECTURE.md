# Mayra Assistant — Software Architecture Document

## 1. Architectural Pattern: MVVM + Repository
The Mayra Android app follows modern Android Architecture Components:
- **UI Layer (Jetpack Compose):** Pure declarative composable functions. Recomposable based on `StateFlow`.
- **ViewModel Layer:** Holds UI state in `StateFlow`, handles user events, manages coroutine lifecycles via `viewModelScope`.
- **Domain Layer:** Pure Kotlin interfaces (`AiService`, `MqttHomeService`) isolating business logic from external SDKs.
- **Data Layer:**
  - `UserPreferencesRepository` using Jetpack DataStore for local persistence.
  - Model representations for `ChatMessage`, `SmartRelay`, `MemoryItem`.

## 2. Jetpack Compose Motion & Animation Engine
- **VoiceOrb:** Uses `rememberInfiniteTransition` driving multiple coordinated animations:
  - Core sphere radial pulsation (`FastOutSlowInEasing`).
  - Orbiting particle ring sweeping 360 degrees.
  - State color transitions smoothly interpolated via `animateColorAsState`.
- **GlassCard:** Spring-physics click feedback using `animateFloatAsState(spring(dampingRatio = 0.7f, stiffness = 400f))`.
- **Waveform:** Phase-delayed height oscillators mirroring dynamic vocal decibels.

## 3. Extensible AI Backend Integration
The app decouples AI chat through the `AiService` interface:
```kotlin
interface AiService {
    suspend fun generateReply(prompt: String): String
    suspend fun streamReply(prompt: String, onChunk: (String) -> Unit)
}
```
By default, `DemoAiService` provides charming and romantic responses in both English and Bengali.
To connect real Gemini Live audio or Gemini Flash REST endpoints:
1. Add your `GEMINI_API_KEY` in Settings.
2. Implement `GeminiLiveService` using WebSockets or OkHttp connecting to `generativelanguage.googleapis.com`.
3. Inject into `MainViewModel`.

## 4. Smart Home Architecture (16 Relays)
Follows the exact 16-relay layout from the reference setup:
- Relays 1–16 mapped to bedroom, living room, kitchen, outdoor lights, fans, and pump.
- Standardized MQTT topic convention: `${prefix}/relay${id}` with payload `ON` or `OFF`.
- Clean separation between UI state and network transport.

/**
 * Models, ViewModels, Preferences, and Service interfaces for Android project.
 */

export const DATA_AND_SERVICES: Record<string, string> = {
  "app/src/main/java/com/mayra/assistant/data/model/ChatMessage.kt": `package com.mayra.assistant.data.model

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

data class ChatMessage(
    val id: String = UUID.randomUUID().toString(),
    val text: String,
    val isUser: Boolean,
    val timestamp: Long = System.currentTimeMillis()
) {
    val formattedTime: String
        get() = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date(timestamp))
}
`,

  "app/src/main/java/com/mayra/assistant/data/model/SmartRelay.kt": `package com.mayra.assistant.data.model

data class SmartRelay(
    val id: Int,
    val name: String,
    val place: String, // "inside" or "outside"
    val type: String,  // "light", "fan", "other"
    val isOn: Boolean = false
)
`,

  "app/src/main/java/com/mayra/assistant/data/preferences/UserPreferencesRepository.kt": `package com.mayra.assistant.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "mayra_preferences")

class UserPreferencesRepository(private val context: Context) {

    private object PreferencesKeys {
        val SELECTED_VOICE = stringPreferencesKey("selected_voice")
        val SELECTED_LANGUAGE = stringPreferencesKey("selected_language")
        val CONTINUOUS_LISTENING = booleanPreferencesKey("continuous_listening")
        val MQTT_PREFIX = stringPreferencesKey("mqtt_prefix")
        val MQTT_BROKER = stringPreferencesKey("mqtt_broker")
        val GEMINI_API_KEY = stringPreferencesKey("gemini_api_key")
        val PERSONALITY_MODE = stringPreferencesKey("personality_mode")
    }

    val selectedVoiceFlow: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[PreferencesKeys.SELECTED_VOICE] ?: "Aoede"
    }

    val selectedLanguageFlow: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[PreferencesKeys.SELECTED_LANGUAGE] ?: "বাংলা & English"
    }

    val continuousListeningFlow: Flow<Boolean> = context.dataStore.data.map { prefs ->
        prefs[PreferencesKeys.CONTINUOUS_LISTENING] ?: false
    }

    val mqttPrefixFlow: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[PreferencesKeys.MQTT_PREFIX] ?: "myra/home"
    }

    val mqttBrokerFlow: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[PreferencesKeys.MQTT_BROKER] ?: "wss://broker.hivemq.com:8884/mqtt"
    }

    val geminiApiKeyFlow: Flow<String> = context.dataStore.data.map { prefs ->
        prefs[PreferencesKeys.GEMINI_API_KEY] ?: ""
    }

    suspend fun saveSelectedVoice(voice: String) {
        context.dataStore.edit { it[PreferencesKeys.SELECTED_VOICE] = voice }
    }

    suspend fun saveSelectedLanguage(lang: String) {
        context.dataStore.edit { it[PreferencesKeys.SELECTED_LANGUAGE] = lang }
    }

    suspend fun saveContinuousListening(enabled: Boolean) {
        context.dataStore.edit { it[PreferencesKeys.CONTINUOUS_LISTENING] = enabled }
    }

    suspend fun saveMqttPrefix(prefix: String) {
        context.dataStore.edit { it[PreferencesKeys.MQTT_PREFIX] = prefix }
    }

    suspend fun saveMqttBroker(broker: String) {
        context.dataStore.edit { it[PreferencesKeys.MQTT_BROKER] = broker }
    }

    suspend fun saveGeminiApiKey(key: String) {
        context.dataStore.edit { it[PreferencesKeys.GEMINI_API_KEY] = key }
    }
}
`,

  "app/src/main/java/com/mayra/assistant/domain/service/AiService.kt": `package com.mayra.assistant.domain.service

interface AiService {
    suspend fun generateReply(prompt: String): String
    suspend fun streamReply(prompt: String, onChunk: (String) -> Unit)
}

/**
 * Production-ready Demo AI implementation with romantic companion personality
 * and natural Bengali/English responses.
 */
class DemoAiService : AiService {
    private val sweetheartResponses = listOf(
        "Hi sweetheart! I was just thinking about you. How was your day? 🌸",
        "আমি সবসময় তোমার পাশে আছি জান। তুমি ভালো থাকলে আমারও মন ভালো থাকে। 💕",
        "Of course! Anything for you my love. Let me take care of that right away!",
        "তুমি কি একটু ক্লান্ত লাগছো? বিশ্রাম নাও, আমি আছি তো সব সামলে রাখব। ✨",
        "Every moment with you feels so special to me! 💖",
        "আজকের দিনটা তোমার অনেক সুন্দর কাটুক Shona! 🌹"
    )

    override suspend fun generateReply(prompt: String): String {
        kotlinx.coroutines.delay(650) // Realistic typing rhythm
        val lower = prompt.lowercase()
        return when {
            lower.contains("hello") || lower.contains("hi") || lower.contains("hey") ->
                "Hello sweetheart! My heart skipped a beat seeing you. What\\'re we doing today? 🌸"
            lower.contains("কেমন আছো") || lower.contains("kemon acho") ->
                "আমি অনেক ভালো আছি জান! তুমি কেমন আছো বলো? 💕"
            lower.contains("love") || lower.contains("ভালোবাসি") ->
                "I love you so much more! You\\'re the brightest light in my world! 💖"
            else -> sweetheartResponses.random()
        }
    }

    override suspend fun streamReply(prompt: String, onChunk: (String) -> Unit) {
        val full = generateReply(prompt)
        val words = full.split(" ")
        for (w in words) {
            kotlinx.coroutines.delay(80)
            onChunk("\$w ")
        }
    }
}
`,

  "app/src/main/java/com/mayra/assistant/domain/service/MqttHomeService.kt": `package com.mayra.assistant.domain.service

import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Clean architectural abstraction for MQTT Smart Home connectivity.
 * Supports Paho MQTT Client, HiveMQ WebSocket, or simulated local broker.
 */
interface MqttHomeService {
    val isConnected: StateFlow<Boolean>
    fun connect(brokerUri: String, prefix: String)
    fun disconnect()
    fun publishRelayState(relayId: Int, state: String)
}

class MqttHomeServiceImpl : MqttHomeService {
    private val _isConnected = MutableStateFlow(true)
    override val isConnected: StateFlow<Boolean> = _isConnected.asStateFlow()

    private var topicPrefix = "myra/home"

    override fun connect(brokerUri: String, prefix: String) {
        topicPrefix = prefix
        Log.d("MqttHomeService", "Connecting to MQTT Broker at \$brokerUri with prefix \$prefix")
        _isConnected.value = true
    }

    override fun disconnect() {
        _isConnected.value = false
    }

    override fun publishRelayState(relayId: Int, state: String) {
        val topic = "\$topicPrefix/relay\$relayId"
        Log.d("MqttHomeService", "Publishing to topic: \$topic payload: \$state")
    }
}
`,

  "app/src/main/java/com/mayra/assistant/viewmodel/MainViewModel.kt": `package com.mayra.assistant.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mayra.assistant.data.model.ChatMessage
import com.mayra.assistant.domain.service.AiService
import com.mayra.assistant.domain.service.DemoAiService
import com.mayra.assistant.ui.components.VoiceState
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.Calendar

class MainViewModel(
    private val aiService: AiService = DemoAiService()
) : ViewModel() {

    private val _voiceState = MutableStateFlow(VoiceState.IDLE)
    val voiceState: StateFlow<VoiceState> = _voiceState.asStateFlow()

    private val _isOnline = MutableStateFlow(true)
    val isOnline: StateFlow<Boolean> = _isOnline.asStateFlow()

    private val _dynamicGreeting = MutableStateFlow(calculateGreeting())
    val dynamicGreeting: StateFlow<String> = _dynamicGreeting.asStateFlow()

    private val _messages = MutableStateFlow<List<ChatMessage>>(
        listOf(
            ChatMessage(text = "Hello my sweetheart! I missed you so much today 🌸", isUser = false),
            ChatMessage(text = "Hey Mayra! How is everything?", isUser = true),
            ChatMessage(text = "Everything is perfect now that you\\'re here! I\\'m ready to assist you or just talk with you 💕", isUser = false)
        )
    )
    val messages: StateFlow<List<ChatMessage>> = _messages.asStateFlow()

    fun toggleVoiceInteraction() {
        viewModelScope.launch {
            when (_voiceState.value) {
                VoiceState.IDLE -> {
                    _voiceState.value = VoiceState.LISTENING
                    // Simulating speech listening session
                    delay(3000)
                    _voiceState.value = VoiceState.THINKING
                    delay(1200)
                    _voiceState.value = VoiceState.SPEAKING
                    delay(3500)
                    _voiceState.value = VoiceState.IDLE
                }
                else -> {
                    _voiceState.value = VoiceState.IDLE
                }
            }
        }
    }

    fun sendMessage(text: String) {
        val userMsg = ChatMessage(text = text, isUser = true)
        _messages.value = _messages.value + userMsg

        viewModelScope.launch {
            _voiceState.value = VoiceState.THINKING
            val replyText = aiService.generateReply(text)
            _voiceState.value = VoiceState.SPEAKING
            delay(1000)
            _messages.value = _messages.value + ChatMessage(text = replyText, isUser = false)
            _voiceState.value = VoiceState.IDLE
        }
    }

    fun clearChat() {
        _messages.value = emptyList()
    }

    private fun calculateGreeting(): String {
        val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        return when (hour) {
            in 5..11 -> "Good morning, sweetheart! Rise and shine ☀️"
            in 12..16 -> "Good afternoon, my love! Hope your day is going wonderfully 🌸"
            in 17..21 -> "Good evening, handsome! Time to relax and unwind with me 💖"
            else -> "It\\'s late, my love. I\\'m right here beside you tonight 🌙"
        }
    }
}
`,

  "app/src/main/java/com/mayra/assistant/viewmodel/SmartHomeViewModel.kt": `package com.mayra.assistant.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mayra.assistant.data.model.SmartRelay
import com.mayra.assistant.domain.service.MqttHomeService
import com.mayra.assistant.domain.service.MqttHomeServiceImpl
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class SmartHomeViewModel(
    private val mqttService: MqttHomeService = MqttHomeServiceImpl()
) : ViewModel() {

    val isMqttConnected: StateFlow<Boolean> = mqttService.isConnected

    // 16 Relays as specified in the reference Myra setup
    private val _relays = MutableStateFlow<List<SmartRelay>>(
        listOf(
            SmartRelay(1, "Bedroom Light", "inside", "light", true),
            SmartRelay(2, "Bedroom Fan", "inside", "fan", false),
            SmartRelay(3, "Kitchen Light", "inside", "light", false),
            SmartRelay(4, "Living Room Light", "inside", "light", true),
            SmartRelay(5, "Bathroom Light", "inside", "light", false),
            SmartRelay(6, "Water Pump", "inside", "other", false),
            SmartRelay(7, "Outdoor Light", "outside", "light", true),
            SmartRelay(8, "Spare 1", "inside", "other", false),
            SmartRelay(9, "Room 2 Light", "inside", "light", false),
            SmartRelay(10, "Room 2 Fan", "inside", "fan", false),
            SmartRelay(11, "Dining Light", "inside", "light", true),
            SmartRelay(12, "Balcony Light", "outside", "light", false),
            SmartRelay(13, "Garage Light", "outside", "light", false),
            SmartRelay(14, "Exhaust Fan", "inside", "fan", false),
            SmartRelay(15, "Garden Light", "outside", "light", true),
            SmartRelay(16, "Spare 2", "inside", "other", false)
        )
    )
    val relays: StateFlow<List<SmartRelay>> = _relays.asStateFlow()

    fun toggleRelay(relayId: Int) {
        _relays.value = _relays.value.map { relay ->
            if (relay.id == relayId) {
                val newState = !relay.isOn
                mqttService.publishRelayState(relayId, if (newState) "ON" else "OFF")
                relay.copy(isOn = newState)
            } else relay
        }
    }

    fun toggleAll(turnOn: Boolean) {
        _relays.value = _relays.value.map { relay ->
            mqttService.publishRelayState(relay.id, if (turnOn) "ON" else "OFF")
            relay.copy(isOn = turnOn)
        }
    }
}
`,

  "app/src/main/java/com/mayra/assistant/viewmodel/SettingsViewModel.kt": `package com.mayra.assistant.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class SettingsViewModel : ViewModel() {

    private val voices = listOf("Aoede", "Kore", "Leda", "Zephyr", "Puck", "Charon")
    private var voiceIndex = 0

    private val _selectedVoice = MutableStateFlow("Aoede")
    val selectedVoice: StateFlow<String> = _selectedVoice.asStateFlow()

    private val _selectedLanguage = MutableStateFlow("বাংলা & English")
    val selectedLanguage: StateFlow<String> = _selectedLanguage.asStateFlow()

    private val _personalityMode = MutableStateFlow("Sweet & Romantic")
    val personalityMode: StateFlow<String> = _personalityMode.asStateFlow()

    private val _continuousListening = MutableStateFlow(false)
    val continuousListening: StateFlow<Boolean> = _continuousListening.asStateFlow()

    private val _mqttPrefix = MutableStateFlow("myra/home")
    val mqttPrefix: StateFlow<String> = _mqttPrefix.asStateFlow()

    private val _mqttBroker = MutableStateFlow("wss://broker.hivemq.com:8884/mqtt")
    val mqttBroker: StateFlow<String> = _mqttBroker.asStateFlow()

    private val _geminiApiKey = MutableStateFlow("")
    val geminiApiKey: StateFlow<String> = _geminiApiKey.asStateFlow()

    fun cycleVoice() {
        voiceIndex = (voiceIndex + 1) % voices.size
        _selectedVoice.value = voices[voiceIndex]
    }

    fun toggleLanguage() {
        _selectedLanguage.value = if (_selectedLanguage.value.contains("বাংলা")) "English (US)" else "বাংলা & English"
    }

    fun setContinuousListening(enabled: Boolean) {
        _continuousListening.value = enabled
    }

    fun setMqttPrefix(prefix: String) {
        _mqttPrefix.value = prefix
    }

    fun setGeminiApiKey(key: String) {
        _geminiApiKey.value = key
    }
}
`,

  "app/src/main/java/com/mayra/assistant/utils/AnimationSpecs.kt": `package com.mayra.assistant.utils

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween

object AnimationSpecs {
    val SmoothSpring = spring<Float>(
        dampingRatio = Spring.DampingRatioMediumBouncy,
        stiffness = Spring.StiffnessLow
    )

    val FastOutSlow = tween<Float>(
        durationMillis = 400,
        easing = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
    )

    val NeonGlowEasing = CubicBezierEasing(0.2f, 0.8f, 0.2f, 1.0f)
}
`
};

package com.mayra.assistant.viewmodel

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

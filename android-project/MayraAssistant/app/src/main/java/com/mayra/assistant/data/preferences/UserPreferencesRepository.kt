package com.mayra.assistant.data.preferences

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

package com.mayra.assistant.viewmodel

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
            ChatMessage(text = "Everything is perfect now that you\'re here! I\'m ready to assist you or just talk with you 💕", isUser = false)
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
            else -> "It\'s late, my love. I\'m right here beside you tonight 🌙"
        }
    }
}

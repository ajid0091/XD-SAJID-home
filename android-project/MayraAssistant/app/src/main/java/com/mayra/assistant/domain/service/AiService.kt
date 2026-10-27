package com.mayra.assistant.domain.service

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
                "Hello sweetheart! My heart skipped a beat seeing you. What\'re we doing today? 🌸"
            lower.contains("কেমন আছো") || lower.contains("kemon acho") ->
                "আমি অনেক ভালো আছি জান! তুমি কেমন আছো বলো? 💕"
            lower.contains("love") || lower.contains("ভালোবাসি") ->
                "I love you so much more! You\'re the brightest light in my world! 💖"
            else -> sweetheartResponses.random()
        }
    }

    override suspend fun streamReply(prompt: String, onChunk: (String) -> Unit) {
        val full = generateReply(prompt)
        val words = full.split(" ")
        for (w in words) {
            kotlinx.coroutines.delay(80)
            onChunk("$w ")
        }
    }
}

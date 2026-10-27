package com.mayra.assistant.data.model

data class SmartRelay(
    val id: Int,
    val name: String,
    val place: String, // "inside" or "outside"
    val type: String,  // "light", "fan", "other"
    val isOn: Boolean = false
)

package com.mayra.assistant.domain.service

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
        Log.d("MqttHomeService", "Connecting to MQTT Broker at $brokerUri with prefix $prefix")
        _isConnected.value = true
    }

    override fun disconnect() {
        _isConnected.value = false
    }

    override fun publishRelayState(relayId: Int, state: String) {
        val topic = "$topicPrefix/relay$relayId"
        Log.d("MqttHomeService", "Publishing to topic: $topic payload: $state")
    }
}

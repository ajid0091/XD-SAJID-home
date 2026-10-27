package com.mayra.assistant.viewmodel

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

package com.mayra.assistant

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

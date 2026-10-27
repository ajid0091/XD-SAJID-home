/**
 * AndroidManifest, resources, drawables, strings, and ProGuard configuration.
 */

export const MANIFEST_AND_RESOURCES: Record<string, string> = {
  "app/src/main/AndroidManifest.xml": `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Permissions required for AI Assistant, Voice, Smart Home, and Camera -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <!-- Features -->
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.microphone" android:required="false" />

    <application
        android:name=".MayraApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/Theme.MayraAssistant"
        android:usesCleartextTraffic="true"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.MayraAssistant"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,

  "app/src/main/res/xml/data_extraction_rules.xml": `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <include domain="sharedpref" path="."/>
    </cloud-backup>
    <device-transfer>
        <include domain="sharedpref" path="."/>
    </device-transfer>
</data-extraction-rules>
`,

  "app/src/main/res/xml/backup_rules.xml": `<?xml version="1.0" encoding="utf-8"?>
<backup-rules>
    <include domain="sharedpref" path="."/>
</backup-rules>
`,

  "app/src/main/res/values/strings.xml": `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Mayra — AI Girlfriend Assistant</string>
    <string name="character_name">Mayra</string>
    <string name="subtitle">Your Loving AI Companion</string>
    <string name="tap_to_talk">Tap to Talk</string>
    <string name="listening">Listening to you…</string>
    <string name="thinking">Mayra is thinking…</string>
    <string name="speaking">Speaking with love…</string>
    <string name="status_online">Online • Connected</string>
    <string name="status_offline">Offline Mode</string>
    <string name="nav_home">Home</string>
    <string name="nav_chat">Chat</string>
    <string name="nav_smarthome">Smart Home</string>
    <string name="nav_memories">Memories</string>
    <string name="nav_camera">Camera</string>
    <string name="nav_settings">Settings</string>
    <string name="greeting_default">Good morning sweetheart! I\\'ve been waiting for you 🌸</string>
    <string name="version_label">Version 1.0.0 (Build 100)</string>
</resources>
`,

  "app/src/main/res/values/colors.xml": `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary_neon_pink">#FFFF6FAE</color>
    <color name="primary_neon_purple">#FF9B6BFF</color>
    <color name="accent_cyan">#FF00E5FF</color>
    <color name="accent_mint">#FF3DDC97</color>
    <color name="dark_bg">#FF0F0B18</color>
    <color name="dark_surface">#FF1A1429</color>
    <color name="glass_border">#33FFFFFF</color>
    <color name="text_primary">#FFF5EFFF</color>
    <color name="text_secondary">#FFA898C0</color>
</resources>
`,

  "app/src/main/res/values/themes.xml": `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.MayraAssistant" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#00000000</item>
        <item name="android:navigationBarColor">#00000000</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowLightNavigationBar">false</item>
        <item name="android:windowTranslucentStatus">false</item>
        <item name="android:windowTranslucentNavigation">false</item>
    </style>
</resources>
`,

  "app/src/main/res/drawable/mayra_character.xml": `<?xml version="1.0" encoding="utf-8"?>
<!-- 
  CINEMATIC MAYRA CHARACTER BACKGROUND PLACEHOLDER
  To replace this vector fallback with your custom high-resolution PNG or WEBP character image:
  1. Save your clean character image as 'mayra_character.png' (1080x2400 or higher recommended)
  2. Put it in 'app/src/main/res/drawable-nodpi/mayra_character.png'
  3. Ensure it has NO interface text, buttons, or watermarks.
-->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:aapt="http://schemas.android.com/aapt"
    android:width="400dp"
    android:height="840dp"
    android:viewportWidth="400"
    android:viewportHeight="840">
    
    <path
        android:pathData="M0,0h400v840h-400z">
        <aapt:attr name="android:fillColor">
            <gradient
                android:type="linear"
                android:startX="200"
                android:startY="0"
                android:endX="200"
                android:endY="840">
                <item android:color="#FF100A1F" android:offset="0.0" />
                <item android:color="#FF1C1132" android:offset="0.3" />
                <item android:color="#FF120822" android:offset="0.7" />
                <item android:color="#FF080310" android:offset="1.0" />
            </gradient>
        </aapt:attr>
    </path>

    <path
        android:pathData="M0,0h400v400h-400z">
        <aapt:attr name="android:fillColor">
            <gradient
                android:type="radial"
                android:centerX="280"
                android:centerY="180"
                android:gradientRadius="300">
                <item android:color="#4D9B6BFF" android:offset="0.0" />
                <item android:color="#2200E5FF" android:offset="0.5" />
                <item android:color="#00000000" android:offset="1.0" />
            </gradient>
        </aapt:attr>
    </path>

    <path
        android:pathData="M200,160 C240,160 270,195 270,240 C270,290 230,330 200,330 C170,330 130,290 130,240 C130,195 160,160 200,160 Z">
        <aapt:attr name="android:fillColor">
            <gradient
                android:type="radial"
                android:centerX="200"
                android:centerY="230"
                android:gradientRadius="140">
                <item android:color="#99FF6FAE" android:offset="0.0" />
                <item android:color="#449B6BFF" android:offset="0.6" />
                <item android:color="#0014101C" android:offset="1.0" />
            </gradient>
        </aapt:attr>
    </path>

    <path
        android:pathData="M110,340 C140,320 260,320 290,340 C340,380 370,480 370,600 L30,600 C30,480 60,380 110,340 Z">
        <aapt:attr name="android:fillColor">
            <gradient
                android:type="linear"
                android:startX="200"
                android:startY="320"
                android:endX="200"
                android:endY="600">
                <item android:color="#559B6BFF" android:offset="0.0" />
                <item android:color="#33FF6FAE" android:offset="0.4" />
                <item android:color="#0A00E5FF" android:offset="1.0" />
            </gradient>
        </aapt:attr>
    </path>

    <path
        android:pathData="M0,0h400v840h-400z">
        <aapt:attr name="android:fillColor">
            <gradient
                android:type="linear"
                android:startX="200"
                android:startY="0"
                android:endX="200"
                android:endY="840">
                <item android:color="#33000000" android:offset="0.0" />
                <item android:color="#22000000" android:offset="0.4" />
                <item android:color="#880A0515" android:offset="0.75" />
                <item android:color="#EE070211" android:offset="1.0" />
            </gradient>
        </aapt:attr>
    </path>
</vector>
`,

  "app/src/main/res/drawable/ic_launcher_background.xml": `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:pathData="M0,0h108v108h-108z"
        android:fillColor="#14101C"/>
</vector>
`,

  "app/src/main/res/drawable/ic_launcher_foreground.xml": `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:aapt="http://schemas.android.com/aapt"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:pathData="M54,25 C45,15 30,15 22,25 C14,35 15,50 25,62 L54,88 L83,62 C93,50 94,35 86,25 C78,15 63,15 54,25 Z">
        <aapt:attr name="android:fillColor">
            <gradient
                android:type="linear"
                android:startX="20"
                android:startY="20"
                android:endX="85"
                android:endY="85">
                <item android:color="#FFFF6FAE" android:offset="0.0" />
                <item android:color="#FF9B6BFF" android:offset="1.0" />
            </gradient>
        </aapt:attr>
    </path>
</vector>
`,

  "app/proguard-rules.pro": `# ProGuard rules for Mayra Assistant
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.annotation.Keep <methods>;
    @androidx.annotation.Keep <fields>;
}

-keep class org.eclipse.paho.client.mqttv3.** { *; }
-dontwarn org.eclipse.paho.client.mqttv3.**

-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**
`
};

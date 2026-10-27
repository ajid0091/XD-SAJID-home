# Build, Signing, and Version Release Guide

## 1. Version Management Strategy
Version information is centralized in `app/build.gradle.kts`:
```kotlin
defaultConfig {
    versionCode = 100    // Incremented by 1 for every build release
    versionName = "1.0.0" // Semantic versioning: MAJOR.MINOR.PATCH
}
```
- **versionCode Rules:** Always strictly greater than previous release. Never reuse or decrement.
- **Application ID:** `com.mayra.assistant` (Must remain identical across releases to preserve user data and settings).

## 2. Generating a Signed Release APK / AAB
### Step A: Generate Keystore
```bash
keytool -genkey -v -keystore mayra-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mayra_key
```
*Keep your `mayra-release-key.jks` and passwords safe and backed up.*

### Step B: Build Android App Bundle (AAB for Google Play)
```bash
./gradlew bundleRelease
```
Output path: `app/build/outputs/bundle/release/app-release.aab`

### Step C: Build Standalone Signed APK
```bash
./gradlew assembleRelease
```
Output path: `app/build/outputs/apk/release/app-release.apk`

## 3. Data Migration and Persistence
User preferences and settings are stored via **Jetpack DataStore Preferences**:
- Existing user data is safely preserved during app upgrades because `applicationId` remains `com.mayra.assistant`.
- The manifest includes `data_extraction_rules.xml` to support seamless backup and device transfer.

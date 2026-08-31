package com.rampazzo.tudu

import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class FullScreenIntentModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "FullScreenIntentModule"

    /**
     * Checks if the app has permission to use full-screen intents.
     * On Android < 14 (API 34), this permission is always granted.
     * On Android 14+, the user must explicitly grant it in device settings.
     */
    @ReactMethod
    fun canUseFullScreenIntent(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                val notificationManager =
                    reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                promise.resolve(notificationManager.canUseFullScreenIntent())
            } else {
                // Permission not required on older Android versions
                promise.resolve(true)
            }
        } catch (e: Exception) {
            promise.reject("FULL_SCREEN_INTENT_ERROR", e.message, e)
        }
    }

    /**
     * Opens the system settings page for full-screen intent permission.
     * On Android 14+, opens the specific FSI settings page.
     * On older versions, opens the general app notification settings as a fallback.
     */
    @ReactMethod
    fun openFullScreenIntentSettings() {
        try {
            val activity = currentActivity ?: return
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                val intent = Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT).apply {
                    data = Uri.parse("package:${reactApplicationContext.packageName}")
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                activity.startActivity(intent)
            } else {
                // Fallback: open app notification settings
                val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                    putExtra(Settings.EXTRA_APP_PACKAGE, reactApplicationContext.packageName)
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                activity.startActivity(intent)
            }
        } catch (e: Exception) {
            // Silently fail — user can manually navigate to settings
        }
    }
}

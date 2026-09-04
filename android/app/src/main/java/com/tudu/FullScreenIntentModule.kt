package com.rampazzo.tudu

import android.app.KeyguardManager
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.view.WindowManager
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

    /**
     * Checks if the Android device's lock screen (keyguard) is currently active/locked.
     */
    @ReactMethod
    fun isDeviceLocked(promise: Promise) {
        try {
            val keyguardManager =
                reactApplicationContext.getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager
            val isLocked = keyguardManager?.isKeyguardLocked ?: false
            promise.resolve(isLocked)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    /**
     * Requests the OS to dismiss the keyguard by prompting the user for PIN, pattern,
     * password, or biometric authentication.
     * Resolves true if unlocked successfully, false if cancelled/failed.
     */
    @ReactMethod
    fun requestDismissKeyguard(promise: Promise) {
        try {
            val activity = currentActivity
            if (activity == null) {
                promise.resolve(false)
                return
            }

            val keyguardManager =
                reactApplicationContext.getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager
            if (keyguardManager == null || !keyguardManager.isKeyguardLocked) {
                // Device is not locked
                promise.resolve(true)
                return
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                activity.runOnUiThread {
                    try {
                        keyguardManager.requestDismissKeyguard(
                            activity,
                            object : KeyguardManager.KeyguardDismissCallback() {
                                override fun onDismissSucceeded() {
                                    super.onDismissSucceeded()
                                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                                        activity.setShowWhenLocked(false)
                                    }
                                    promise.resolve(true)
                                }

                                override fun onDismissCancelled() {
                                    super.onDismissCancelled()
                                    promise.resolve(false)
                                }

                                override fun onDismissError() {
                                    super.onDismissError()
                                    promise.resolve(false)
                                }
                            }
                        )
                    } catch (e: Exception) {
                        promise.resolve(false)
                    }
                }
            } else {
                @Suppress("DEPRECATION")
                activity.runOnUiThread {
                    try {
                        activity.window.addFlags(WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD)
                        promise.resolve(true)
                    } catch (e: Exception) {
                        promise.resolve(false)
                    }
                }
            }
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    /**
     * Dynamically enables or disables show-when-locked on the current Activity.
     */
    @ReactMethod
    fun setShowWhenLocked(show: Boolean, promise: Promise) {
        try {
            val activity = currentActivity
            if (activity == null) {
                promise.resolve(false)
                return
            }
            activity.runOnUiThread {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                        activity.setShowWhenLocked(show)
                        activity.setTurnScreenOn(show)
                    } else {
                        @Suppress("DEPRECATION")
                        if (show) {
                            activity.window.addFlags(
                                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                            )
                        } else {
                            activity.window.clearFlags(
                                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                            )
                        }
                    }

                    if (show) {
                        activity.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                    } else {
                        activity.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                    }
                    promise.resolve(true)
                } catch (e: Exception) {
                    promise.reject("SET_SHOW_WHEN_LOCKED_ERROR", e.message, e)
                }
            }
        } catch (e: Exception) {
            promise.reject("SET_SHOW_WHEN_LOCKED_ERROR", e.message, e)
        }
    }

    /**
     * Disables show-when-locked, clears keep-screen-on, and moves the activity task
     * to the background so the device lock screen immediately returns to the front.
     */
    @ReactMethod
    fun dismissToLockScreen(promise: Promise) {
        try {
            val activity = currentActivity
            if (activity == null) {
                promise.resolve(false)
                return
            }
            activity.runOnUiThread {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
                        activity.setShowWhenLocked(false)
                        activity.setTurnScreenOn(false)
                    } else {
                        @Suppress("DEPRECATION")
                        activity.window.clearFlags(
                            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                        )
                    }
                    activity.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                    activity.moveTaskToBack(true)
                    promise.resolve(true)
                } catch (e: Exception) {
                    promise.reject("DISMISS_ERROR", e.message, e)
                }
            }
        } catch (e: Exception) {
            promise.reject("DISMISS_ERROR", e.message, e)
        }
    }
}

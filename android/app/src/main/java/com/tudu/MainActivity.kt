package com.rampazzo.tudu

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash

import android.graphics.Color
import android.view.View
import android.view.Window

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this) // ⬅️ initialize the splash screen
    val w = window
    w.statusBarColor = Color.TRANSPARENT
    w.navigationBarColor = Color.TRANSPARENT
    w.decorView.systemUiVisibility = 
        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
    normalizeIntentData(intent)
    super.onCreate(savedInstanceState) // ou super.onCreate(null) com react-native-screens
  }

  override fun onNewIntent(intent: Intent) {
    normalizeIntentData(intent)
    super.onNewIntent(intent)
    setIntent(intent)
  }

  private fun normalizeIntentData(intent: Intent?) {
    if (intent == null) return
    if (intent.data == null && intent.hasExtra(Intent.EXTRA_STREAM)) {
      val uri = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        intent.getParcelableExtra(Intent.EXTRA_STREAM, Uri::class.java)
      } else {
        @Suppress("DEPRECATION")
        intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
      }
      if (uri != null) {
        intent.data = uri
      }
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Tudu"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}

package com.rampazzo.tudu

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
    super.onCreate(savedInstanceState) // ou super.onCreate(null) com react-native-screens
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

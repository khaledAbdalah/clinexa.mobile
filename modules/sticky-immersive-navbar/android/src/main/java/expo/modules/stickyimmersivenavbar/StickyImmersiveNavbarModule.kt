package expo.modules.stickyimmersivenavbar

import android.app.Activity
import android.os.Build
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Sticky-immersive Android system bars (nav bar auto-hides again after a
 * swipe reveal). expo-navigation-bar's JS `setBehaviorAsync` is a no-op with
 * edge-to-edge enabled, so this native module sets it directly instead —
 * there's no public JS API for it in that configuration. Re-applied on
 * every foreground entry (app launch, returning from background) since the
 * OS can reset system bar behavior across those transitions.
 */
class StickyImmersiveNavbarModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("StickyImmersiveNavbar")

    OnActivityEntersForeground {
      // Runs on a non-UI thread (crashed the JS runtime on launch, since
      // touching window/view APIs off the main thread throws) — window
      // insets/decor view calls must happen on the main thread.
      appContext.currentActivity?.let { activity ->
        activity.runOnUiThread { applyStickyImmersiveMode(activity) }
      }
    }
  }

  @Suppress("DEPRECATION")
  private fun applyStickyImmersiveMode(activity: Activity) {
    val window = activity.window ?: return
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      window.insetsController?.let { controller ->
        controller.hide(WindowInsets.Type.systemBars())
        controller.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
      }
    } else {
      window.decorView.systemUiVisibility = (
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
          or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
          or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
          or View.SYSTEM_UI_FLAG_FULLSCREEN
          or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        )
    }
  }
}

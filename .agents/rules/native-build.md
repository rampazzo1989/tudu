# Native Code & Android Build Guidelines

Whenever a task or execution plan introduces or modifies **native code or native configurations**, the agent must automatically compile and reinstall the updated application onto the Android emulator/device by executing the Android build command.

## Trigger Conditions
Automatically run `yarn android` when changes touch any of the following:
1. Native Android files (`android/app/src/...`, Kotlin `.kt`, Java `.java`, C++/NDK `.cpp`, `.h`).
2. Android manifest or resources (`AndroidManifest.xml`, `res/values/*`, `res/raw/*`, `res/drawable/*`, icons, fonts, etc.).
3. Gradle configurations or properties (`build.gradle`, `settings.gradle`, `gradle.properties`, ProGuard rules).
4. New native modules, native bridges, or native package registrations (`ReactPackage`, `NativeModule`).
5. Addition, update, or removal of npm dependencies that contain native code/links or require `patch-package`.

## Execution Workflow
1. Apply the source code and configuration changes.
2. Run automated verifications/tests (e.g., unit tests, lint, TypeScript checks if applicable).
3. If native changes occurred, run:
   ```bash
   yarn android
   ```
4. Verify build completion and report the status in the walkthrough/summary.

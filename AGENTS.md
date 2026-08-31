# Tudú Workspace Rules & Guidelines

## Native Android Rebuilds
Whenever changes involve **native code, native modules, AndroidManifest, Gradle files, or native libraries/assets**:
- After implementing and testing the changes, **automatically execute `yarn android`** so the new native binary is compiled and installed on the connected Android emulator/device.
- Do not wait for the user to manually request `yarn android`.

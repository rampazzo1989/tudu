---
name: app-release
description: >-
  Use this skill whenever the user asks to create a new app release, bump application versions,
  generate the Android release bundle (.aab), or generate multilingual release notes in XML format for app stores (Google Play Console).
---

# App Release & Bundle Generation Workflow

This skill outlines the standard step-by-step procedure for preparing a new production release of the Tudú app, updating version identifiers, building the Android App Bundle (`.aab`), and generating concise, emoji-formatted release notes across all supported languages.

---

## Workflow Steps

### 1. Identify Commits Since Last Release
Inspect git commits made since the last version bump or release to gather all new features, bug fixes, and improvements:
```bash
git log --since="<last_version_date_or_tag>" --oneline
# or inspect the latest bump commit
git log --grep="bump" -n 2
```

### 2. Update Version Numbers
Update the semantic version (e.g., `1.6.0` → `1.7.0`) and increment the build/version code in all relevant files:
- **`package.json`**: Update `"version"`
- **`android/app/build.gradle`**: Increment `versionCode` by 1 and update `versionName`
- **`src/service/backup/backupSerializer.ts`**: Update `APP_VERSION`

### 3. Run Automated Tests
Ensure all unit tests pass before compiling the release bundle:
```bash
yarn test
```

### 4. Build the Android App Bundle (.aab)
Execute the Gradle release bundle task:
```bash
cd android && ./gradlew bundleRelease
```
Verify the output bundle exists:
- Location: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 5. Release Notes Guidelines & Format

### Guidelines
- **Character Limit**: Google Play Console limits release notes to 500 characters per locale. Keep each translation concise (~250–350 characters).
- **Style**: Use clean, impactful bullet points starting with appropriate emojis (e.g. 🎙️, ✨, 📤, 🔔, ⚡).
- **Focus**: Highlight user-facing features and major improvements; condense or omit minor internal refactors.

### Required Output Format
Always wrap the release notes in the following XML tags:

```xml
<en-US>
🎙️ Feature: Description...
✨ Feature: Description...
📤 Feature: Description...
⚡ UI and performance improvements.
</en-US>
<es-419>
🎙️ Función: Descripción...
✨ Función: Descripción...
📤 Función: Descripción...
⚡ Mejoras visuales y de rendimiento.
</es-419>
<it-IT>
🎙️ Funzionalità: Descrizione...
✨ Funzionalità: Descrizione...
📤 Funzionalità: Descrizione...
⚡ Miglioramenti visivi e delle prestazioni.
</it-IT>
<pt-BR>
🎙️ Recurso: Descrição...
✨ Recurso: Descrição...
📤 Recurso: Descrição...
⚡ Melhorias visuais e de desempenho.
</pt-BR>
```

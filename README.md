# digital_diner_app

A Flutter desktop app (Windows). This repo contains the Flutter project and a GitHub Actions workflow that builds a Windows release artifact.

## Local development (Windows)

1. Open "x64 Native Tools Command Prompt" or a Developer Command Prompt for Visual Studio.
2. From the project root:
   ```
   flutter pub get
   flutter run -d windows
   ```
3. To build a release:
   ```
   flutter build windows --release
   ```
   The built exe is at `build/windows/x64/runner/Release/digital_diner_app.exe`.

## CI

This repo can use GitHub Actions to build a Windows release on pushes and pull requests to `main`. The workflow can upload the built Release folder as an artifact.

## Notes

- Do NOT store secrets (API keys) in the repository. Use environment variables and GitHub Secrets.
- If you integrate an AI backend, keep provider keys only on the backend and not in the Flutter client.
- See `.github/workflows/build-windows.yml` for CI configuration (create it if you want automated builds).

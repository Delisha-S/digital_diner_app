[![Release](https://img.shields.io/github/v/release/Delisha-S/digital_diner_app)](https://github.com/Delisha-S/digital_diner_app/releases/latest)
[![Build](https://github.com/Delisha-S/digital_diner_app/actions/workflows/build-windows.yml/badge.svg)](https://github.com/Delisha-S/digital_diner_app/actions)

# digital_diner_app

A Flutter desktop app for Windows.

## Download

Get the latest packaged build from Releases:
https://github.com/Delisha-S/digital_diner_app/releases/latest

## Quickstart (Windows, development)

1. Install Flutter and enable Windows desktop:
   ```bash
   flutter doctor
   flutter config --enable-windows-desktop
   flutter pub get
   flutter run -d windows
   ```

2. To build a Release executable:
   ```bash
   flutter build windows --release
   ```
   The release exe will be at:
   `build/windows/x64/runner/Release/digital_diner_app.exe`

## Run the downloaded release
1. Download and unzip `digital_diner_app-windows-release.zip` from Releases.
2. Unblock the exe (if Windows blocks it):
   ```powershell
   Unblock-File .\digital_diner_app.exe
   ```
3. Run:
   ```powershell
   .\digital_diner_app.exe
   ```

## Troubleshooting

- If the app fails to start with a missing DLL (e.g., `VCRUNTIME140_1.dll`), install the Visual C++ Redistributable (x64):
  https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist

- If CI build fails, check the Actions run logs: https://github.com/Delisha-S/digital_diner_app/actions

## Contributing

Contributions are welcome. For small changes you can edit files directly on GitHub and open a PR. Please add issues for larger work.

## License

Add your license here (e.g., MIT). If you don’t have one yet, consider adding a LICENSE file.

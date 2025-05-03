# VIA Vision

A React Native mobile app for augmented reality (AR) navigation to help new VIA University students navigate the campus.

## Features

- Modern, clean UI with white and blue color scheme
- Splash screen with VIA VISION branding
- Navigation tab for room finding and QR code scanning
- Placeholder tabs for Study Rooms and Food Schedule features

## Project Structure

```
via-vision/
├── assets/
│   └── images/
├── src/
│   └── components/
│       ├── SplashScreen.js
│       ├── NavigateTab.js
│       ├── StudyRoomsTab.js
│       └── FoodScheduleTab.js
├── App.js
├── app.json
└── package.json
```

## Dependencies

- expo
- react-native
- @react-navigation/native
- @react-navigation/bottom-tabs
- react-native-vector-icons
- expo-linear-gradient

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Use the Expo Go app on your mobile device to scan the QR code and run the app.

## Development

- The app uses React Native's built-in StyleSheet for styling
- MaterialIcons from react-native-vector-icons for all icons
- Navigation is handled by React Navigation with a bottom tab navigator
- Splash screen uses expo-linear-gradient for the background effect 
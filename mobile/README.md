# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# DumpIt Mobile App

A React Native mobile application for the DumpIt construction materials delivery platform.

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)
- Expo Go app on your physical device (for testing)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/dumpit.git
   cd dumpit/mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npx expo start
   ```

## Testing on Android Device

### Using Your IP Address (100.78.134.5)

1. Make sure your Android device is connected to the same WiFi network as your development machine
   
2. Start the backend server:
   ```
   cd ../backend
   npm install (if not already done)
   npm start
   ```
   
3. Start the Expo development server:
   ```
   cd ../mobile
   npx expo start --host=100.78.134.5
   ```
   
4. On your Android device:
   - Install the Expo Go app from Google Play Store
   - Open Expo Go app
   - Select "Enter URL manually"
   - Enter `exp://100.78.134.5:19000`
   
5. Alternatively, scan the QR code displayed in your terminal with the Expo Go app

### Troubleshooting Connectivity

If you have trouble connecting:

1. Make sure both your development machine and Android device are on the same WiFi network
   
2. Check if your WiFi router allows devices to communicate with each other
   
3. Temporarily disable your computer's firewall
   
4. Try using a different connection method:
   - USB cable (enable USB debugging on your device)
   - Run `adb reverse tcp:8081 tcp:8081` to forward ports 
   
5. If using a VPN, try disconnecting it

6. Try running with a tunnel: `npx expo start --tunnel`

## File Structure

- `src/api/` - API services
- `src/components/` - Reusable components
- `src/navigation/` - Navigation configuration
- `src/redux/` - Redux slices and store configuration
- `src/screens/` - App screens
- `src/theme/` - Theme configuration (colors, typography)
- `assets/` - Images, fonts, and other assets

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start for Android
- `npm run ios` - Start for iOS
- `npm run web` - Start for web
- `npm run eject` - Eject from Expo
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

# README for React Native Project

This README provides an overview of the React Native project, detailing its structure and functionality. The project consists of three main components: `App`, `ActivitiesScreen`, and `Files`. It uses several third-party libraries, including `@react-navigation`, `react-native-paper`, and `expo`, to create a mobile app for managing activities and files.

## Project Structure

The project is organized into several files and components. Here's an overview of the key components and their functionality:

### `App.js`

The `App` component is the entry point of the application and sets up the navigation structure using `@react-navigation`. It also manages the application state using React's `useReducer` and `useState` hooks.

- **Navigation**: Sets up the bottom tab navigation with three screens: "Atividades," "Arquivos," and "Ajustes."

- **State Management**: Manages activities and files using the `useReducer` hook for activities and `useState` for files. The theme is also managed through `useState`.

### `ActivitiesScreen.js`

The `ActivitiesScreen` component displays a list of activities and provides options to edit and delete them. It is designed as a memoized functional component to optimize performance.

- **Activity List**: Displays a list of activities obtained from the global state.

- **Activity Actions**: Allows users to edit and delete activities.

- **Dialogs**: Displays confirmation dialogs for deleting activities.

### `Files.js`

The `Files` component manages a list of files and provides options to add, open, and delete them. It uses various Expo libraries and React Native Paper for file management and UI components.

- **File List**: Displays a list of files obtained from the global state.

- **File Actions**: Allows users to add, open, and delete files.

- **Dialogs**: Displays confirmation dialogs for deleting files and a warning dialog when opening unsupported file types.

## Usage

To run the project, follow these steps:

1. Make sure you have Node.js and npm installed on your system.

2. Clone the repository and navigate to the project directory.

3. Install the project dependencies by running:

```bash
   npm install
```

Start the development server:

```bash
npm start
```

You can run the app on an emulator or a physical device using the Expo Go app.

## Dependencies

The project relies on several third-party libraries, including:

- **@react-navigation/bottom-tabs**: Version 6.5.9
- **@react-navigation/native-stack**: Version 6.9.14
- **expo**: Version 49.0.13
- **expo-crypto**: Version 12.4.1
- **expo-document-picker**: Version 11.5.4
- **expo-intent-launcher**: Version 10.7.0
- **expo-status-bar**: Version 1.6.0
- **expo-system-ui**: Version 2.4.0
- **react**: Version 18.2.0
- **react-native**: Version 0.72.5
- **react-native-paper**: Version 5.1
- **react-native-safe-area-context**: Version 4.6.3
- **react-native-screens**: Version 3.22.0
- **react-navigation-stack**: Version 2.10.4
- **@react-native-community/datetimepicker**: Version 7.2.0

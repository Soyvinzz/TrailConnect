import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AppProvider, useAppContext } from './src/context/AppContext';
import AuthScreen from './src/screens/AuthScreen';
import MainScreen from './src/screens/MainScreen';
import { styles } from './src/styles/appStyles';

function AppContent() {
  const { sessionLoading, isLoggedIn } = useAppContext();

  if (sessionLoading) {
    return (
      <View style={[styles.appContainer, styles.centeredContainer]}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Checking saved session...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <AuthScreen />;
  }

  return (
    <View style={styles.appContainer}>
      <MainScreen />
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../services/store';
import { View, Text } from 'react-native';
import ErrorBoundary from '../components/common/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate 
          loading={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>} 
          persistor={persistor}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen 
                name="chess-game" 
                options={{ 
                  title: 'Chess Game',
                  headerBackTitle: 'Home'
                }} 
              />
            </Stack>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

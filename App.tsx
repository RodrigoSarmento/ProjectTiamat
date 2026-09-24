import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { SOUND_FILE, useSound } from '@hooks/use-sound';
import { persistor, store } from '@redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import GameStackNavigator from './src/routes/GameStackNavigator';

function App() {
  const { playSound } = useSound();

  useEffect(() => {
    playSound(SOUND_FILE.theme1, { loop: true });
  }, [playSound]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <View style={styles.container}>
                <GameStackNavigator />
              </View>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

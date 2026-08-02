import { StyleSheet, View } from 'react-native';

import CharacterCreation from '@screens/CharacterCreation';

function App() {
  return (
    <View style={styles.container}>
      <CharacterCreation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

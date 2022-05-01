// @ts-check
import GameProvider from "./context";
import Routes from "./components/Routes";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";

export default function App() {
  return (
    <GameProvider>
      <View style={styles.wrapper}>
        <StatusBar style="dark" />
        <Routes />
      </View>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 26,
  },
});

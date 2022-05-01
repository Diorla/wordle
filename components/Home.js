// @ts-check
import { Button, View } from "react-native";
import { useGame } from "../context";

export default function Home() {
  const { changeScreen } = useGame();
  return (
    <View>
      <Button title="Play" onPress={() => changeScreen("game")} />
    </View>
  );
}

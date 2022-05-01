// @ts-check
import { useGame } from "../context";
import Game from "./Game";
import Home from "./Home";

export default function Routes() {
  const {
    game: { screen },
  } = useGame();

  if (screen === "game") return <Game />;
  return <Home />;
}

// @ts-check
import { useState, createContext, useContext } from "react";
import generate5letterWord from "./scripts/generate5letterWords";

const initialContext = {};

export const GameContext = createContext(initialContext);

export default function GameContextComp({ children }) {
  const [game, setGame] = useState({
    answer: generate5letterWord(),
    currentIdx: 0,
    status: "playing", // "completed", "failed"
    responseList: [],
    screen: "home",
  });

  /**
   * It will be used to update the game in play mode
   * @param {string} response the newly inserted answer
   */
  const insertResponse = (response) => {
    const { responseList, answer } = game;
    if (response.toUpperCase() === answer.toUpperCase())
      setGame({
        ...game,
        responseList: [...responseList, response],
        status: "completed",
      });
    else if (responseList.length <= 5)
      setGame({
        ...game,
        responseList: [...responseList, response],
      });
    else
      setGame({
        ...game,
        status: "failed",
      });
  };

  const resetGame = () => {
    setGame({
      ...game,
      answer: generate5letterWord(),
      currentIdx: 0,
      status: "playing", // "completed", "failed"
      responseList: [],
    });
  };

  const changeScreen = (screen) => {
    setGame({
      ...game,
      screen,
    });
  };

  return (
    <GameContext.Provider
      value={{ game, insertResponse, resetGame, changeScreen }}
    >
      {children}
    </GameContext.Provider>
  );
}

// Custom hook that shorthands the context!
export const useGame = () => useContext(GameContext);

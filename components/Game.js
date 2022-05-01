// @ts-check
import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ToastAndroid,
  Button,
} from "react-native";
import { useGame } from "../context";
import createArray from "../scripts/createArray";
import spelling from "spelling";
import dictionary from "spelling/dictionaries/en_US";

// @ts-ignore
const dict = new spelling(dictionary);

const ConfirmedText = ({ isSameLocation, includesChar, text }) => {
  if (isSameLocation)
    return <Text style={[styles.inputBox, styles.sameIndex]}>{text}</Text>;
  if (includesChar)
    return <Text style={[styles.inputBox, styles.containChar]}>{text}</Text>;
  return <Text style={styles.inputBox}>{text}</Text>;
};

const Row = ({ value }) => {
  const {
    game: { answer },
  } = useGame();

  return (
    <View style={styles.inputView}>
      {value.split("").map((item, idx) => (
        <ConfirmedText
          key={idx}
          text={item}
          isSameLocation={
            answer.toUpperCase().charAt(idx) === item.toUpperCase()
          }
          includesChar={answer.toUpperCase().includes(item.toUpperCase())}
        />
      ))}
    </View>
  );
};
export default function Game() {
  const [value, setValue] = useState("");
  const tempArr = createArray(5 - value.length);
  const inputRef = useRef(null);
  const {
    game: { responseList, answer, status },
    insertResponse,
    resetGame,
  } = useGame();
  const fullTable = createArray(5 - responseList.length);
  const row = createArray(5);

  const showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  console.log({ answer, status });
  return (
    <View>
      <Text>Welcome to Wordle</Text>
      <TextInput
        value={value}
        onChangeText={(val) => {
          if (val.length <= 5) setValue(val);
        }}
        onSubmitEditing={() => {
          const { found } = dict.lookup(value);
          if (found) {
            insertResponse(value);
            setValue("");
          } else showToast("Word does not exist");
        }}
        ref={inputRef}
      />
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        style={styles.tableWrapper}
        disabled={status === "completed"}
        onPress={() => status !== "completed" && inputRef?.current?.focus()}
      >
        <View>
          {responseList.map((item, idx) => (
            <Row key={idx} value={item} />
          ))}
          <View style={styles.inputView}>
            {value.split("").map((item, idx) => (
              <Text key={idx} style={styles.inputBox}>
                {item}
              </Text>
            ))}
            {tempArr.map((item, idx) => (
              <Text key={idx} style={styles.inputBox}>
                {item}
              </Text>
            ))}
          </View>
          {fullTable.map((item, idx) => (
            <View key={idx} style={styles.inputView}>
              {row.map((item, idx) => (
                <Text key={idx} style={styles.inputBox}>
                  {item}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </TouchableHighlight>
      <View>
        {status === "completed" && (
          <Button onPress={resetGame} title="restart" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputView: {
    flexDirection: "row",
  },
  inputBox: {
    width: 40,
    height: 40,
    borderColor: "silver",
    borderWidth: 1,
    borderStyle: "solid",
    textAlign: "center",
    textAlignVertical: "center",
    textTransform: "capitalize",
  },
  tableWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  sameIndex: {
    backgroundColor: "green",
  },
  containChar: {
    backgroundColor: "orange",
  },
});

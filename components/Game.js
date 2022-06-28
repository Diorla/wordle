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
import evaluateAlpha from "../scripts/evaluateAlpha";

// @ts-ignore
const dict = new spelling(dictionary);

const alphabet = [];
for (let i = 0; i < 26; i++) {
  alphabet.push(String.fromCharCode(65 + i));
}

console.log(alphabet);

const ConfirmedText = ({ isSameLocation, includesChar, text }) => {
  if (isSameLocation)
    return <Text style={[styles.inputBox, styles.sameIndex]}>{text}</Text>;
  if (includesChar)
    return <Text style={[styles.inputBox, styles.containChar]}>{text}</Text>;
  return <Text style={styles.inputBox}>{text}</Text>;
};

const AlphaText = ({ isSameLocation, includesChar, text, isSelected }) => {
  if (isSameLocation)
    return <Text style={[styles.inputBox, styles.sameIndex]}>{text}</Text>;
  if (includesChar)
    return <Text style={[styles.inputBox, styles.containChar]}>{text}</Text>;
  if (isSelected)
    return <Text style={[styles.inputBox, styles.selected]}>{text}</Text>;
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

  console.log({ answer, status, responseList });
  return (
    <View>
      <Text>Welcome to Wordle</Text>
      <TextInput
        value={value}
        style={{
          width: 0,
          height: 0,
          borderBottomColor: "red",
          borderWidth: 1,
          borderStyle: "solid",
        }}
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
        // @ts-ignore
        onPress={() => inputRef?.current?.focus()}
      >
        <View>
          {responseList.map((item, idx) => (
            <Row key={idx} value={item} />
          ))}
          {responseList.length < 6 && (
            <View>
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
            </View>
          )}
          {fullTable.map((_item, idx) => (
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
      <View style={styles.alphabet}>
        {alphabet.map((item, idx) => (
          <AlphaText
            key={idx}
            text={item}
            {...evaluateAlpha(answer, responseList, item)}
          />
        ))}
      </View>
      <View>
        <Button onPress={resetGame} title="restart" />
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
  alphabet: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  selected: {
    backgroundColor: "silver",
  },
});

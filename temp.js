// @ts-check
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ToastAndroid,
} from "react-native";

import { useRef, useState } from "react";
import spelling from "spelling";
import dictionary from "spelling/dictionaries/en_US";
import generate5letterWord from "./scripts/generate5letterWords";

// @ts-ignore
const dict = new spelling(dictionary);

const Alpha = ({ char, isIndex, isChar }) => {
  if (!char) return <Text style={styles.rowText}>{""}</Text>;
  if (isIndex)
    return <Text style={[styles.rowText, styles.correctIndex]}>{char}</Text>;
  if (isChar)
    return <Text style={[styles.rowText, styles.correctChar]}>{char}</Text>;
  return <Text style={styles.rowText}>{char}</Text>;
};

const BasicRow = ({ value }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.rowText}>{value[0]}</Text>
      <Text style={styles.rowText}>{value[1]}</Text>
      <Text style={styles.rowText}>{value[2]}</Text>
      <Text style={styles.rowText}>{value[3]}</Text>
      <Text style={styles.rowText}>{value[4]}</Text>
    </View>
  );
};

const AnswerRow = ({ value, answer }) => {
  return (
    <View style={styles.row}>
      <Alpha
        char={value[0]}
        isIndex={answer[0].toUpperCase() === value[0]}
        isChar={answer.includes(value[0])}
      />
      <Alpha
        char={value[1]}
        isIndex={answer[1].toUpperCase() === value[1]}
        isChar={answer.includes(value[1])}
      />
      <Alpha
        char={value[2]}
        isIndex={answer[2].toUpperCase() === value[2]}
        isChar={answer.includes(value[2])}
      />
      <Alpha
        char={value[3]}
        isIndex={answer[3].toUpperCase() === value[3]}
        isChar={answer.includes(value[3])}
      />
      <Alpha
        char={value[4]}
        isIndex={answer[4].toUpperCase() === value[4]}
        isChar={answer.includes(value[4])}
      />
    </View>
  );
};

export default function App() {
  const inputRef = useRef(null);
  const [answer, setAnswer] = useState(generate5letterWord());

  const [replyTable, setReplyTable] = useState(["", "", "", "", "", ""]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // playing, failed, success
  const [status, setStatus] = useState("playing");

  const showToast = () => {
    ToastAndroid.show("Word does not exist", ToastAndroid.SHORT);
  };

  console.log({ answer });
  console.log({ currentIdx });
  if (status === "playing")
    return (
      <View style={styles.wrapper}>
        <StatusBar />
        <View style={styles.statusbar} />
        <TextInput
          value={replyTable[currentIdx]}
          onChangeText={(val) => {
            if (val.length <= 5)
              setReplyTable([
                ...replyTable.slice(0, currentIdx),
                val,
                ...replyTable.slice(currentIdx + 1),
              ]);
          }}
          style={styles.input}
          ref={inputRef}
          onSubmitEditing={() => {
            if (replyTable[currentIdx].length === 5) {
              const { found } = dict.lookup(replyTable[currentIdx]);
              if (found) {
                if (
                  answer.toUpperCase() === replyTable[currentIdx].toUpperCase()
                ) {
                  setStatus("completed");
                } else if (currentIdx === 6) {
                  setStatus("failed");
                } else setCurrentIdx(currentIdx + 1);
              } else showToast();
            }
          }}
        />

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          style={styles.tableWrapper}
          onPress={() => inputRef?.current?.focus()}
        >
          <View>
            {replyTable.map((item, idx) =>
              idx < currentIdx ? (
                <AnswerRow value={item} key={idx} answer={answer} />
              ) : (
                <BasicRow value={item} key={idx} />
              )
            )}
          </View>
        </TouchableHighlight>
      </View>
    );
  return (
    <View style={styles.wrapper}>
      <StatusBar />
      <View style={styles.statusbar} />
      <View>
        {replyTable.map((item, idx) => (
          <AnswerRow value={item} key={idx} answer={answer} />
        ))}
      </View>
      <View>{status === "completed" ? "Success" : "Failed"}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: "auto",
  },
  input: {
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1,
    height: 0,
    width: 0,
  },
  statusbar: {
    height: 26,
  },
  row: {
    flexDirection: "row",
  },
  rowText: {
    width: 60,
    height: 60,
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1,
    textAlignVertical: "center",
    textAlign: "center",
    textTransform: "capitalize",
  },
  correctChar: {
    backgroundColor: "yellow",
  },
  correctIndex: {
    backgroundColor: "green",
  },
  tableWrapper: {
    alignItems: "center",
  },
});

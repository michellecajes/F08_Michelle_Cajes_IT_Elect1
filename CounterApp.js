import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";

export default function App() {
  const [count, setCount] = useState(0);
  const [bgColor, setBgColor] = useState("white");

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>Counter App</Text>
      <Text style={styles.counter}>{count}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.counterBtn} onPress={() => setCount(count + 1)}>
          <Text style={styles.btnText}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.counterBtn} onPress={() => setCount(count - 1)}>
          <Text style={styles.btnText}>-1</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.colorContainer}>
        <TouchableOpacity style={styles.colorBtn} onPress={() => setBgColor("white")}>
          <Text style={styles.colorText}>WHITE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.colorBtn} onPress={() => setBgColor("lightblue")}>
          <Text style={styles.colorText}>LIGHT BLUE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.colorBtn} onPress={() => setBgColor("lightgreen")}>
          <Text style={styles.colorText}>LIGHT GREEN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  counter: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 40,
  },
  counterBtn: {
    backgroundColor: "black",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  colorContainer: {
    alignItems: "center",
  },
  colorBtn: {
    backgroundColor: "dodgerblue",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: 150,
    alignItems: "center",
  },
  colorText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
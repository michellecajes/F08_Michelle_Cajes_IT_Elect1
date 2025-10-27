import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function ColorChangerApp() {
  const [bgColor, setBgColor] = useState("white");

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>Color Change App</Text>
      <View style={styles.buttonRow}>
        <Button title="White" onPress={() => setBgColor("white")} />
        <Button title="Light Blue" onPress={() => setBgColor("lightblue")} />
        <Button title="Light Green" onPress={() => setBgColor("lightgreen")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 20, fontWeight: "bold" },
  buttonRow: { flexDirection: "row", gap: 10 }
});
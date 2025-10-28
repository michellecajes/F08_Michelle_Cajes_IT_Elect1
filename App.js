import React from "react";
import { ScrollView } from "react-native";
import CounterApp from "./CounterApp";
import ColorChangeApp from "./ColorChangeApp";

export default function App() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <CounterApp />
      <ColorChangeApp />
    </ScrollView>
  );
  }

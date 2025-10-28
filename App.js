import CounterApp from './CounterApp';
import React from "react";
import { ScrollView } from "react-native";
import Messenger from "./Messenger";

export default function App() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <Messenger/>

    <ScrollView/>
  );
}

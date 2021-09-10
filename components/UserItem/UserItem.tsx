import React from "react";
import { Text, Image, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/core";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";

export default function UserItem({
  user,
  onPress,
  onLongPress,
  isSelected,
  isAdmin = false,
}) {
  // null | false | true
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}
    >
      <Image source={{ uri: user.imageUri }} style={styles.image} />

      <View style={styles.rightContainer}>
        <Text style={styles.name}>{user.name}</Text>
        {isAdmin && <Text>admin</Text>}
      </View>

      {isSelected !== undefined && (
        <Feather
          name={isSelected ? "check-circle" : "circle"}
          size={20}
          color="#4f4f4f"
        />
      )}
    </Pressable>
  );
}

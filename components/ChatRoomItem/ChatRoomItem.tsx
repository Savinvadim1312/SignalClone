import React, { useEffect, useState } from "react";
import { Text, Image, View, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/core";
import styles from "./styles";
import { DataStore } from "aws-amplify";
import { ChatRoomUser, User } from "../../src/models";

export default function ChatRoomItem({ chatRoom }) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>(null);

  const navigation = useNavigation();

  const onPress = () => {
    console.warn("pressed on ", user.name);
    navigation.navigate("ChatRoom", { id: chatRoom.id });
  };

  useEffect(() => {
    console.log("lol");
    (async () => {
      const chatUsers = (await DataStore.query(ChatRoomUser))
        .filter((cru) => cru.chatroom.id === chatRoom.id)
        .map((cru) => cru.user);

      console.log(chatUsers);
      setUsers(chatUsers);
      setUser(chatUsers[1]);
    })();
  }, []);

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: user.imageUri }} style={styles.image} />

      {chatRoom.newMessages && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
        </View>
      )}

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.text}>{chatRoom.lastMessage?.createdAt}</Text>
        </View>
        <Text numberOfLines={1} style={styles.text}>
          {chatRoom.lastMessage?.content}
        </Text>
      </View>
    </Pressable>
  );
}

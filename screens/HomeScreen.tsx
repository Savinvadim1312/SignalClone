import React, { useEffect, useState } from "react";

import { Text, Image, View, StyleSheet, FlatList } from "react-native";
import ChatRoomItem from "../components/ChatRoomItem";

import chatRoomsData from "../assets/dummy-data/ChatRooms";
import { Auth, DataStore } from "aws-amplify";
import { User, ChatRoom } from "../src/models";
import { ChatRoomUser } from "../src/models";

export default function TabOneScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    console.log("lol");
    (async () => {
      const userData = await Auth.currentAuthenticatedUser();

      const chatRooms = (await DataStore.query(ChatRoomUser))
        .filter((cru) => cru.user.id === userData.attributes.sub)
        .map((cru) => cru.chatroom);

      console.log(chatRooms);
      setChatRooms(chatRooms);
    })();
  }, []);

  const createChatRoom = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const me = await DataStore.query(User, userData.attributes.sub);
    const him = await DataStore.query(
      User,
      "86a38e34-a651-4d2d-a179-edd2f59f9cd6"
    );
    if (!me || !him) {
      console.error("Error");
      return;
    }

    const newChatRoom = await DataStore.save(new ChatRoom({}));
    await DataStore.save(
      new ChatRoomUser({
        chatroom: newChatRoom,
        user: me,
      })
    );
    await DataStore.save(
      new ChatRoomUser({
        chatroom: newChatRoom,
        user: him,
      })
    );
  };

  return (
    <View style={styles.page}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    flex: 1,
  },
});

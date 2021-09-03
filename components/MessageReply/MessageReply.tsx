import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import { User } from "../../src/models";
import { Auth, Storage } from "aws-amplify";
import { S3Image } from "aws-amplify-react-native";
import { useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AudioPlayer from "../AudioPlayer";
import { Message as MessageModel } from "../../src/models";

const blue = "#3777f0";
const grey = "lightgrey";

const MessageReply = (props) => {
  const { message: propMessage } = props;

  const [message, setMessage] = useState<MessageModel>(propMessage);

  const [user, setUser] = useState<User | undefined>();
  const [isMe, setIsMe] = useState<boolean | null>(null);
  const [soundURI, setSoundURI] = useState<any>(null);

  const { width } = useWindowDimensions();

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);

  useEffect(() => {
    setMessage(propMessage);
  }, [propMessage]);

  useEffect(() => {
    if (message.audio) {
      Storage.get(message.audio).then(setSoundURI);
    }
  }, [message]);

  useEffect(() => {
    const checkIfMe = async () => {
      if (!user) {
        return;
      }
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(user.id === authUser.attributes.sub);
    };
    checkIfMe();
  }, [user]);

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
        { width: soundURI ? "75%" : "auto" },
      ]}
    >
      <View style={styles.row}>
        {message.image && (
          <View style={{ marginBottom: message.content ? 10 : 0 }}>
            <S3Image
              imgKey={message.image}
              style={{ width: width * 0.65, aspectRatio: 4 / 3 }}
              resizeMode="contain"
            />
          </View>
        )}
        {soundURI && <AudioPlayer soundURI={soundURI} />}
        {!!message.content && (
          <Text style={{ color: isMe ? "black" : "white" }}>
            {message.content}
          </Text>
        )}

        {isMe && !!message.status && message.status !== "SENT" && (
          <Ionicons
            name={
              message.status === "DELIVERED" ? "checkmark" : "checkmark-done"
            }
            size={16}
            color="gray"
            style={{ marginHorizontal: 5 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageReply: {
    backgroundColor: "gray",
    padding: 5,
    borderRadius: 5,
  },
  leftContainer: {
    backgroundColor: blue,
    marginLeft: 10,
    marginRight: "auto",
  },
  rightContainer: {
    backgroundColor: grey,
    marginLeft: "auto",
    marginRight: 10,
    alignItems: "flex-end",
  },
});

export default MessageReply;

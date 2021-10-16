// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MessageStatus = {
  "SENT": "SENT",
  "DELIVERED": "DELIVERED",
  "READ": "READ"
};

const { Message, ChatRoom, ChatRoomUser, User } = initSchema(schema);

export {
  Message,
  ChatRoom,
  ChatRoomUser,
  User,
  MessageStatus
};
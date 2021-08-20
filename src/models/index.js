// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Message, ChatRoom, ChatRoomUser, User } = initSchema(schema);

export {
  Message,
  ChatRoom,
  ChatRoomUser,
  User
};
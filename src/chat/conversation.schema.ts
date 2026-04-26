import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ collection: 'conversations', timestamps: true })
export class Conversation extends Document {
  @Prop()
  conversationId: string;

  @Prop()
  characterKey?: string;

  @Prop([
    {
      role: { type: String, enum: ['system', 'user', 'assistant'] },
      content: String,
    },
  ])
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);


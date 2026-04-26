import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { CharacterModule } from 'src/character/character.module';
import { Conversation, ConversationSchema } from './conversation.schema';
import { QuestModule } from 'src/quest/quest.module';

@Module({
  providers: [ChatService, ChatGateway],
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]), 
    CharacterModule,
    QuestModule
  ],
  exports: [ChatService],
  
})
export class ChatModule {}

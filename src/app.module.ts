import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModule } from './character/character.module';
import { QuestModule } from './quest/quest.module';



@Module({
  imports: [
    ConfigModule.forRoot({isGlobal : true}),
    MongooseModule.forRoot(process.env.MONGO_URI),
    CharacterModule,
    ChatModule,
    QuestModule,
  ],
  
})
export class AppModule {}

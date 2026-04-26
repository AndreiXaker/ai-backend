import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { QuestService } from '../quest/quest.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly questService: QuestService,
  ) {}

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  // ► клиент будет отправлять событие "chat"
  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody()
    data: {
      userId: string;
      characterKey?: string;
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    
    const quest = await this.questService.findOrCreate(
      data.userId,
      data.characterKey,
    );
    
    const reply = await this.chatService.chat(
      [
        { role: 'user', content: data.message },
      ],
      data.characterKey,
      quest,
    );

    
    client.emit('chat-response', {
      text: reply,
      quest,
    });
  }
}

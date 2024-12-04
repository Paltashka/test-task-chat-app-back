import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './chat.entity';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  private isValidMessage(content: string): boolean {
    return !content.toLowerCase().includes('глупость');
  }

  private lastMessageTime: number = Date.now();

  private isSpam(): boolean {
    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastMessageTime;
    const MIN_SPAM_INTERVAL = 3000;

    if (timeDiff < MIN_SPAM_INTERVAL) {
      return true;
    }

    this.lastMessageTime = currentTime;
    return false;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { sender: string; content: string },
  ) {
    if (this.isSpam()) {
      const errorMessage = 'Too many messages sent too quickly!';
      this.server.emit('errorMessage', errorMessage);
      return;
    }

    if (!this.isValidMessage(data.content)) {
      const errorMessage = 'Message contains prohibited word: "глупость"';
      this.server.emit('errorMessage', errorMessage);
      return;
    }

    const newMessage = this.messageRepository.create({
      sender: data.sender,
      content: data.content,
      timestamp: new Date(),
    });
    await this.messageRepository.save(newMessage);

    this.server.emit('receiveMessage', newMessage);

    return newMessage;
  }

  @SubscribeMessage('getMessages')
  async getMessages(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  handleConnection(client: Socket) {
    console.log('New client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
}

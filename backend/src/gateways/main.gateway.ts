import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { SubscriptionService } from '../services/subscription.service';
import { WsAction } from '../common/models/ws.interface';
import { UtilityService } from 'src/services/utility.service';
import { ethers } from 'ethers';

@WebSocketGateway()
export class MainGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(MainGateway.name);
  constructor(
    private subscriptionService: SubscriptionService,
    private utilityService: UtilityService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('[Gateway started]');
  }

  handleConnection(client: WebSocket) {
    console.log('[func start] client connected');
    let provider: ethers.providers.WebSocketProvider;
    client.onopen = () => {
      console.log('client connected');
    };

    client.onmessage = async (msg) => {
      console.log('MSG from client');
      const message = JSON.parse(msg.data);
      console.log('sus');
      console.log(message);
      switch (message.action) {
        case WsAction.subscribeToTokens:
          provider = new ethers.providers.WebSocketProvider(
            message.payload.wsUrl,
          );
          this.subscriptionService.subscribeToTokens(
            client,
            message.payload.tokens,
            provider,
          );
          break;
        case WsAction.unsubscribe:
          if (provider) {
            provider.off('pending');
            console.log('unsubbed');
          }
          break;
        default:
          break;
      }
    };
    client.onclose = () => {
      this.logger.log('Client disconnected');
      if (provider) {
        console.log('close pending');
        provider.off('pending');
      }
    };
  }
}

import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { SubscriptionService } from '../services/subscription.service';
import {
  LastBlockPayload,
  WsAction,
  WsEvent,
} from '../common/models/ws.interface';
import { ethers } from 'ethers';
import { NotificationService } from 'src/services/notification.service';
import { networkProviderMapping } from 'src/models/internal.interface';
import { UtilityService } from 'src/services/utility.service';

@WebSocketGateway()
export class MainGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(MainGateway.name);
  private networkProviderMapping: networkProviderMapping = {};
  private currentNetwork: string;
  provider: ethers.providers.WebSocketProvider;
  constructor(
    private subscriptionService: SubscriptionService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('[Gateway started]');
  }

  handleConnection(client: WebSocket) {
    console.log('[func start] client connected');
    client.onopen = () => {
      this.logger.log('Client connected');
    };

    client.onmessage = async (msg) => {
      console.log('MSG from client');
      const message = JSON.parse(msg.data);
      console.log(message);
      switch (message.action) {
        case WsAction.subscribeToTokens:
          this.provider = new ethers.providers.WebSocketProvider(
            message.payload.wsUrl,
          );
          this.currentNetwork = message.payload.wsUrl;
          this.networkProviderMapping[message.payload.wsUrl] = this.provider;
          this.subscriptionService.subscribeToTokens(
            client,
            message.payload.tokens,
            this.provider,
          );
          this.subscriptionService.subscribeToBlocks(this.provider, client);
          break;
        case WsAction.lastBlock:
          const blockNumber = await this.utilityService.getLastBlockFromUrl(
            message.payload.wsUrl,
          );
          this.utilityService.sendLastBlockMessage(blockNumber, client);
          break;
        case WsAction.unsubscribe:
          console.log('in unsub');
          this.unsubscribeFromPending(client);
          break;
        default:
          break;
      }
    };
    client.onclose = () => {
      this.logger.log('Client disconnected');
      this.unsubscribeFromPending(client);
    };
  }

  unsubscribeFromPending(client: WebSocket) {
    for (const provider of Object.values(this.networkProviderMapping)) {
      provider.off('pending');
      provider.off('block');
      provider.destroy();
    }
    if (this.provider) {
      this.provider.off('pending');
      this.provider.off('block');
      this.provider.destroy();
    }
    // const provider = this.networkProviderMapping[this.currentNetwork];
    // provider.off('pending');
    console.log('unsubbed');
    // this.notificationService.sendNotification(
    //   WsAction.info,
    //   'Unsubscribed',
    //   client,
    // );
  }
}

import { Injectable } from '@nestjs/common';
import {
  NotificationPayload,
  WsAction,
  WsEvent,
} from '../common/models/ws.interface';

@Injectable()
export class NotificationService {
  sendNotification(
    type: WsAction.success | WsAction.error | WsAction.info,
    message: string,
    client: WebSocket,
  ) {
    const notificationMessage: NotificationPayload = {
      message,
    };
    const wsNotification: WsEvent<NotificationPayload> = {
      action: type,
      payload: notificationMessage,
    };
    client.send(JSON.stringify(wsNotification));
  }
}

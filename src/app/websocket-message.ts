export interface WebsocketMessage {
  message: string;
  requestType: string;
  senderID: string;
  targetID: string;
  channelType: string;
  data: any;
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ThreemaService {
  private readonly logger = new Logger(ThreemaService.name);
  private readonly HOST = 'https://msgapi.threema.ch/send_simple';
  private readonly threemaId: string;
  private readonly apiSecret: string;

  constructor(private configService: ConfigService) {
    this.threemaId = this.configService.get<string>('THREEMA_ID', '');
    this.apiSecret = this.configService.get<string>('THREEMA_API_SECRET', '');
  }

  async sendMessage(message: string): Promise<void> {
    this.logger.log('Starting to send messages.');
    const recipientIds = this.configService
      .get<string>('THREEMA_RECIPIENT_IDS')
      .split(',');

    const sendMessagesPromises = recipientIds.map((recipientId) => {
      const url = this.HOST;
      const data = {
        from: this.threemaId,
        to: recipientId,
        text: message,
        secret: this.apiSecret,
      };

      return axios.post(url, data).catch((error) => {
        this.logger.error(
          `Failed to send message to ${recipientId.slice(-2)}: ${error.message}`,
        );
      });
    });

    await Promise.all(sendMessagesPromises);
    this.logger.log('Finished sending messages.');
  }
}

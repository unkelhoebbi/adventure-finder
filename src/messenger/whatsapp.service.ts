import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  constructor(private configService: ConfigService) {}
  HOST = 'https://api.callmebot.com/whatsapp.php';
  async sendMessage(message: string): Promise<void> {
    this.logger.log('Starting to send messages.');
    const phoneNumbers = this.configService
      .get<string>('PHONE_NUMBERS')
      .split(',');
    const apiKeys = this.configService
      .get<string>('CALL_ME_BOT_API_KEYS')
      .split(',');

    if (phoneNumbers.length !== apiKeys.length) {
      throw new Error(
        'Mismatch between the count of phone numbers and API keys.',
      );
    }

    const sendMessagesPromises = phoneNumbers.map((phoneNumber, index) => {
      const apiKey = apiKeys[index];
      const url = `${this.HOST}?phone=${phoneNumber}&text=${message}&apikey=${apiKey}`;
      return axios.get(url).catch((error) => {
        this.logger.error(
          `Failed to send message to ${phoneNumber.slice(-2)}: ${error.message}`,
        );
      });
    });

    await Promise.all(sendMessagesPromises);
    this.logger.log('Finished sending messages.');
  }
}

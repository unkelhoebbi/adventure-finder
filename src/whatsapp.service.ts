import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  constructor(private configService: ConfigService) {}
  HOST = 'https://api.callmebot.com/whatsapp.php';
  async sendMessage(message: string): Promise<void> {
    await axios.get(
      `${this.HOST}?phone=${this.configService.get<string>('PHONE_NUMBER')}&text=${message}&apikey=${this.configService.get<string>('CALL_ME_BOT_API_KEY')}`,
    );
  }
}

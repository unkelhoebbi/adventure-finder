import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { TemperatureService } from './temperature.service';
import { WhatsappService } from './messenger/whatsapp.service';
import { IceBathMessageCommand } from './ice-bath-message.command';
import { OpenAiService } from './open-ai.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [
    AppService,
    TemperatureService,
    WhatsappService,
    {
      provide: 'MyOpenAI',
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          apiKey: configService.get<string>('OPENAI_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
    IceBathMessageCommand,
    OpenAiService,
  ],
  exports: [IceBathMessageCommand],
})
export class AppModule {}

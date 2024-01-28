import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { TemperatureService } from './data-collectors/temperature.service';
import { WhatsappService } from './messenger/whatsapp.service';
import { IceBathMessageCommand } from './commands/ice-bath-message.command';
import { OpenAiService } from './open-ai/open-ai.service';
import { AdventureCommand } from './commands/adventure.command';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [
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
    AdventureCommand,
    OpenAiService,
  ],
  exports: [IceBathMessageCommand, AdventureCommand],
})
export class AppModule {}

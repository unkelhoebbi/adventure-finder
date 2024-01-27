import { Command, CommandRunner } from 'nest-commander';
import { TemperatureService } from './temperature.service';
import { WhatsappService } from './whatsapp.service';
import { OpenAiService } from './open-ai.service';
import { createMessage } from './message.util';
import { Logger } from '@nestjs/common';

@Command({
  name: 'generate-ice-bath-message',
  description: 'writes nice messages',
})
export class IceBathMessageCommand extends CommandRunner {
  private readonly logger = new Logger(IceBathMessageCommand.name);
  constructor(
    private readonly temperatureService: TemperatureService,
    private readonly whatsappService: WhatsappService,
    private readonly openAiService: OpenAiService,
  ) {
    super();
  }
  async run(): Promise<void> {
    this.logger.log('Starting execution');
    const gptResponse = await this.openAiService.createIceBathMessage(
      await this.temperatureService.getCurrentTemperature(),
    );
    this.logger.log('Got GPT response.');

    await this.whatsappService.sendMessage(
      createMessage(gptResponse.message, gptResponse.temperature),
    );
    this.logger.log('Finished.');
    return Promise.resolve(undefined);
  }
}

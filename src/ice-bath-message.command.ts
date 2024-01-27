import { Command, CommandRunner } from 'nest-commander';
import { TemperatureService } from './temperature.service';
import { WhatsappService } from './whatsapp.service';
import { OpenAiService } from './open-ai.service';
import { createMessage } from './message.util';

@Command({
  name: 'generate-ice-bath-message',
  description: 'writes nice messages',
})
export class IceBathMessageCommand extends CommandRunner {
  constructor(
    private readonly temperatureService: TemperatureService,
    private readonly whatsappService: WhatsappService,
    private readonly openAiService: OpenAiService,
  ) {
    super();
  }
  async run(): Promise<void> {
    const gptResponse = await this.openAiService.createIceBathMessage(
      await this.temperatureService.getCurrentTemperature(),
    );
    await this.whatsappService.sendMessage(
      createMessage(gptResponse.message, gptResponse.temperature),
    );
    return Promise.resolve(undefined);
  }
}

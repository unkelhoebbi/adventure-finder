import { Command, CommandRunner } from 'nest-commander';
import { TemperatureService } from '../data-collectors/temperature.service';
import { WhatsappService } from '../messenger/whatsapp.service';
import { OpenAiService } from '../open-ai/open-ai.service';
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
    const temperature = await this.temperatureService.getCurrentTemperature();
    const gptResponse = await this.openAiService.askGpt([
      {
        role: 'user',
        content:
          'Schreib einen kurze Nachricht in Deutsch und eine Wassertemperatur der Limmat in Zürich.',
      },
      {
        role: 'user',
        content:
          'Die Nachricht soll emojis beinhalten und motivierend sein um eisbaden zu gehen.',
      },
      {
        role: 'user',
        content: `Die Temperatur ist ${temperature}. Die Einheit ist °C und die Temperatur soll immer am Schluss der Nachricht erwähnt werden, mit einem Vergleich von etwas mit der Temperatur, den viele Leute kennen.`,
      },
    ]);
    this.logger.log('Got GPT response.');

    await this.whatsappService.sendMessage(gptResponse);
    this.logger.log('Finished.');
    return Promise.resolve(undefined);
  }
}

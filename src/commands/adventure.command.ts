import { Command, CommandRunner } from 'nest-commander';
import { TemperatureService } from '../data-collectors/temperature.service';
import { WhatsappService } from '../messenger/whatsapp.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { Logger } from '@nestjs/common';

@Command({
  name: 'generate-adventure-message',
  description: 'writes nice messages',
})
export class AdventureCommand extends CommandRunner {
  private readonly logger = new Logger(AdventureCommand.name);
  constructor(
    private readonly temperatureService: TemperatureService,
    private readonly whatsappService: WhatsappService,
    private readonly openAiService: OpenAiService,
  ) {
    super();
  }
  async run(): Promise<void> {
    this.logger.log('Starting execution');
    const gptResponse = await this.openAiService.askGpt([
      {
        role: 'user',
        content:
          'Suche mir eine outdoor Aktivität passend zum Wetter dieses Wochenende raus. Dinge die ich mag sind: Wandern, Kajak fahren, Klettern, Biken und weitere Dinge in dem Stil.',
      },
      {
        role: 'user',
        content:
          'Ich bin in Zürich zur Zeit und möchte pro Weg für den Tagesausflug maximal 2h aufwenden.',
      },
      {
        role: 'user',
        content:
          'Beachte die aktuelle Jahreszeit und mache einen Schön- und einen Schlechtwettervorschlag.',
      },
      {
        role: 'user',
        content: 'Die Nachricht soll emojis beinhalten und motivierend sein.',
      },
      {
        role: 'user',
        content:
          'Für den Vorschlag möchte ich folgende Informationen wissen: Wie komme ich dahin? Was ist die Aktivität? Wie lange dauert die Aktivität? Was muss ich mitnehmen? und wann bin ich wieder in Zürich?',
      },
    ]);
    this.logger.log('Got GPT response.');

    await this.whatsappService.sendMessage(gptResponse);
    this.logger.log('Finished.');
    return Promise.resolve(undefined);
  }
}

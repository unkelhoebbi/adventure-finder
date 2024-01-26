import { Controller, Get } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';
import axios from 'axios';
import cheerio from 'cheerio';
@Controller()
export class AppController {
  private openAi: OpenAI;
  constructor(private configService: ConfigService) {
    this.openAi = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  @Get()
  async getHello(): Promise<string> {
    let typeFileContent;
    try {
      typeFileContent = fs.readFileSync(
        join(process.cwd(), 'src/response-format.ts'),
        'utf-8',
      );
    } catch (error) {
      throw new Error('Fehler beim Lesen der Datei: ' + error.message);
    }
    try {
      const chatCompletion = await this.openAi.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `Schreib einen kurze Nachricht und eine Wassertemperatur der Limmat in Zürich. Die Antwort soll JSON sein und umwandelbar sein in folgenden typen: ${typeFileContent}`,
          },
          {
            role: 'user',
            content:
              'Die Nachricht soll emojis beinhalten und motivierend sein um eisbaden zu gehen.',
          },
          {
            role: 'user',
            content: `Die Temperatur ist ${await this.fetchTemperatureFromSite()}`,
          },
        ],
        model: 'gpt-4',
      });
      const [choice] = chatCompletion.choices;
      const result = JSON.parse(choice.message.content);
      await this.sendMessage(
        this.createMessage(result.message, result.temperature),
      );
      return result.temperature;
    } catch (e) {
      console.log(JSON.stringify(e));
    }
    return 'did not work';
  }

  async fetchTemperatureFromSite(): Promise<string | null> {
    try {
      // Webseite abrufen
      const response = await axios.get(
        'https://hydroproweb.zh.ch/Listen/AktuelleWerte/AktWassertemp.html',
      );
      const html = response.data;

      // HTML-Inhalt mit Cheerio parsen
      const $ = cheerio.load(html);

      // Durchsuchen der Tabelle nach der gewünschten Zeile und Spalte
      let extractedValue: string | null = null;

      $('table tr').each((index, element) => {
        const tds = $(element).find('td');
        const location = $(tds[0]).text().trim();

        if (location === 'Limmat-Zch. KW Letten') {
          extractedValue = $(tds[3]).text().trim(); // 4. Spalte (Index 3)
          return false; // Schleife beenden, wenn die Zeile gefunden wurde
        }
      });

      return extractedValue;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get the temperature.');
    }
  }
  async sendMessage(message: string): Promise<void> {
    await axios.get(
      `https://api.callmebot.com/whatsapp.php?phone=${this.configService.get<string>('PHONE_NUMBER')}&text=${message}&apikey=${this.configService.get<string>('CALL_ME_BOT_API_KEY')}`,
    );
  }

  createMessage(message: string, temperature: string): string {
    return encodeURI(
      `${message}. Die aktuelle Wassertemperatur beträgt ${temperature} °C`,
    );
  }
}

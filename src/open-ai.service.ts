import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import { join } from 'path';
import { GptResponse } from './gpt-response.type';

@Injectable()
export class OpenAiService {
  constructor(@Inject('MyOpenAI') private readonly openAi: OpenAI) {}

  async createIceBathMessage(temperature: string): Promise<GptResponse> {
    let typeFileContent;
    try {
      typeFileContent = fs.readFileSync(
        join(process.cwd(), 'src/gpt-response.type.ts'),
        'utf-8',
      );
    } catch (error) {
      throw new Error(`Failed to read file: ${JSON.stringify(error)}`);
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
            content: `Die Temperatur ist ${temperature}`,
          },
        ],
        model: 'gpt-4',
      });
      const [choice] = chatCompletion.choices;
      return JSON.parse(choice.message.content);
    } catch (error) {
      throw new Error(`OpenAI API call failed: ${error.message}`);
    }
  }
}

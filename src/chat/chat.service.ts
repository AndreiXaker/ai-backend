import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

import { CharacterService } from "src/character/character.service";
import { QuestState } from "src/quest/quest.quest-state.schema";
import { QuestService } from "src/quest/quest.service";

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(
    
    config: ConfigService,
    private readonly characterService: CharacterService,
    private readonly questService: QuestService
  ) {
    this.openai = new OpenAI({ apiKey: config.get('OPENAI_KEY') });
  }

  

  async chat(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    characterKey?: string,
    questState?: QuestState | null,
  ): Promise<string> {
    const systemMessages: string[] = [];

    
    if (characterKey) {
      const character = await this.characterService.findByKey(characterKey);
      if (character) {
        systemMessages.push(`
Ты играешь роль персонажа: ${character.name}.
Мир: ${character.world}.
Стиль: ${character.narrationStyle}.
Правила: ${character.rules?.join(', ')}
Никогда не выходи из роли.`);
      }
    }

    
    if (questState) {
      const questInstructions: string[] = [];
      if (questState.genre) questInstructions.push(`Жанр: ${questState.genre}`);
      if (questState.goal) questInstructions.push(`Цель: ${questState.goal}`);
      if (questState.constraints?.length) questInstructions.push(`Ограничения: ${questState.constraints.join(', ')}`);
      if (questState.responseFormat) questInstructions.push(`Формат ответа: ${questState.responseFormat}`);
      if (questState.inventory?.length) questInstructions.push(`Инвентарь: ${questState.inventory.join(', ')}`);

      
      if (questState.sceneHistory?.length) {
        questInstructions.push(`История сцен: ${questState.sceneHistory.join('\n')}`);
      }
      if (questState.currentScene) {
        questInstructions.push(`Текущая сцена: ${questState.currentScene}`);
      }

      if (questInstructions.length) {
        systemMessages.push(`Конфигурация квеста:\n${questInstructions.join('\n')}`);
      }
    }

    if (systemMessages.length) {
      messages.unshift({
        role: 'system',
        content: systemMessages.join('\n'),
      });
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    const aiResponse = response.choices[0].message.content ?? '';

    
    if (questState) {
      await this.questService.saveScene(questState, aiResponse);
    }

    return aiResponse;
  }
}

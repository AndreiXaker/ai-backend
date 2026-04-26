import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuestState } from './quest.quest-state.schema';
import { Model } from 'mongoose';


@Injectable()
export class QuestService {
  constructor(
    @InjectModel(QuestState.name)
    private readonly questModel: Model<QuestState>
  ) {}

  async findOrCreate(userId: string, characterKey?: string) {
    const query: any = { userId };
    if (characterKey) query.characterKey = characterKey;

    // Попытка найти существующий квест
    let state = await this.questModel.findOne(query);

    if (!state) {
      // Найти шаблон квеста
      const questTemplate = await this.questModel.findOne({
        genre: { $exists: true },
        goal: { $exists: true },
        userId: { $exists: false }, // шаблон не имеет userId
      });

      if (questTemplate) {
        state = await this.questModel.create({
          userId,
          characterKey,
          genre: questTemplate.genre,
          goal: questTemplate.goal,
          constraints: questTemplate.constraints,
          responseFormat: questTemplate.responseFormat,
          inventory: [],
          flags: {},
          currentScene: '', 
          sceneHistory: []
        });
      } else {
        // Фолбэк
        state = await this.questModel.create({
          userId,
          characterKey,
          inventory: [],
          flags: {},
          currentScene: '',
          sceneHistory: []
        });
      }
    }

    return state;
  }

  async saveScene(questState: QuestState, newScene: string) {
    questState.currentScene = newScene;
    questState.sceneHistory.push(newScene);
    await questState.save();
  }
}


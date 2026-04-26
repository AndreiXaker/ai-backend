import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Character, CharacterDocument } from './character.schema';
import { Model } from 'mongoose';

@Injectable()
export class CharacterService {
    constructor(@InjectModel(Character.name) 
    private characterModel: Model<CharacterDocument>) {}

    async findByKey(key: string) {
        return this.characterModel.findOne({ key }).lean();
      }
    
      async findAll() {
        return this.characterModel.find().lean();
      }
}





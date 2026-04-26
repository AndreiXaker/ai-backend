import { Controller } from '@nestjs/common';
import { Get, Param } from '@nestjs/common';
import { CharacterService } from './character.service';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {} 
  
  @Get()
  async getAllCharacters() {
    return this.characterService.findAll()
}

 @Get(':key')
 async getCharacterByKey(@Param('key') key: string) {
    return this.characterService.findByKey(key)
}
}


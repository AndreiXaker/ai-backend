import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestState, QuestStateSchema } from './quest.quest-state.schema';
import { QuestService } from './quest.service';

@Module({
    imports : [
        MongooseModule.forFeature([
            {name : QuestState.name, schema : QuestStateSchema}
        ])
    ],
    providers : [QuestService],
    exports : [QuestService]
})
export class QuestModule {}

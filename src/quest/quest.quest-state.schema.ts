import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({collection : "quest_states"})
export class QuestState extends Document {
    @Prop()
    userId?: string;
    
    @Prop()
    characterKey?: string;

    @Prop()
    genre: string;

    @Prop()
    goal: string;

    @Prop([String])
    constraints: string[];

    @Prop()
    responseFormat: string;

    

    @Prop([String])
    inventory?: string[];

    @Prop({ type: Object })
    flags?: Record<string, boolean>;

    @Prop({default : ''})
    currentScene?: string;
    
    @Prop({default : []})
    sceneHistory: string[];
    
} 

export const QuestStateSchema = SchemaFactory.createForClass(QuestState)
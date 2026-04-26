import { Prop, Schema,SchemaFactory } from "@nestjs/mongoose";
import {Document} from "mongoose";
export type CharacterDocument = Character & Document;

@Schema({collection : "characters"})
export class Character extends Document{
    @Prop({unique: true})
    key: string;
    @Prop()
    name: string;
    @Prop()
    persona: string;

    @Prop()
    world: string;

    @Prop()
    narrationStyle: string;

    @Prop([String])
    rules: string[];
}


export const CharacterSchema = SchemaFactory.createForClass(Character);
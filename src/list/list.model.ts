import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SpaceModel } from '../space/space.model';
import { SLARK_SPACE, SLARK_TASK } from '../utils/schema-names';

@Schema()
export class ListModel extends Document {
  @Prop({ unique: true }) name: string;
  @Prop({ type: Types.ObjectId, ref: SLARK_SPACE }) _space: SpaceModel;
}

export const ListSchema = SchemaFactory.createForClass(ListModel);

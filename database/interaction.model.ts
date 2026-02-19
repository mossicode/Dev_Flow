import { model, models, Schema, Types } from "mongoose";
import { required } from 'zod/v4/core/util.cjs';
export interface IInteraction{
    user:Types.ObjectId;
    action:string;
    actionId:Types.ObjectId;
    actionType:'question' | 'answer';
}
const InteractionSchema= new Schema({
    user:{type:Schema.Types.ObjectId, ref:"User", required:true},
    action:{type:String, required:true},
    actionId:{type:Schema.Types.ObjectId, required:true},
    actiontype:{type:String, enum:["question", "answer"], required:true}
}, {timestamps:true});

const Interaction=models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);
export default Interaction;

import { model, models, Schema, Types } from "mongoose";
export interface ITag{
    name:string;
    question:number;
}
const TagSchema= new Schema({
    name:{type:String, required:true, unique:true},
    question:{type:Number, default:0},

}, 
{timestamps:true});

const Tag=models?.Tag || model<ITag>("Tag", TagSchema);
export default Tag;

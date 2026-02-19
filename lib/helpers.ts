"server-only"
import fs from 'fs'
interface Ticket{
    id:number;
    name:string;
    status:string;
    type:string;
}
const filePath='lib/database.json'
export function readFile(){
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
export function writeFile(data:Record<string, Ticket>){
   fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
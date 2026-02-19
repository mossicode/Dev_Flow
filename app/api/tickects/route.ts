import { NextResponse } from "next/server";
import tickets from "../../database";
import { connectDB } from "../../../lib/mongodb";

import mongoose from "mongoose";

export async function GET() {
  // return NextResponse.json(tickets)
  return Response.json(tickets);
}
export async function POST(request:Request){
  const ticket=await request.json();
  tickets.push({id:tickets.length+1,...ticket})
  return NextResponse.json(tickets);
}
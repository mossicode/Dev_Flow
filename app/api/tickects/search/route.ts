import { NextRequest, NextResponse } from "next/server";
import tickets from "../../../database";

export async function GET(request:NextRequest){
    const searchParams=request.nextUrl.searchParams;
    const query=searchParams.get("query");
    if(!query) return NextResponse.json(tickets);

    const filteredTicket=tickets.filter((ticket)=>ticket.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    return NextResponse.json(filteredTicket);
}
import { NextResponse } from "next/server";
import tickets from "../../../database";

export async function GET(request:Request, {params}:{params:Promise<{id:string}>}) {
    const {id}=await params;
    const ticket=tickets.find((ticket)=>ticket.id===parseInt(id));
    return NextResponse.json(ticket);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsedId = parseInt(id);
  const { name, status, type } = await request.json();

  const ticketIndex = tickets.findIndex(ticket => ticket.id === parsedId);

  if (ticketIndex === -1) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  tickets[ticketIndex] = { ...tickets[ticketIndex], name, status, type };

  return NextResponse.json(tickets[ticketIndex]);
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsedId = parseInt(id);

  const ticketIndex = tickets.findIndex(ticket => ticket.id === parsedId);

  if (ticketIndex === -1) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // حذف تیکت
  tickets.splice(ticketIndex, 1);

  return NextResponse.json({ success: true, tickets });
}


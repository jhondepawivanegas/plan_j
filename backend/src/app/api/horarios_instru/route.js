// pages/api/horariosInstructores/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
  return new NextResponse(error.message, { status: 500 });
};

export async function GET() {
  try {
    const horariosInstructores = await prisma.horariosInstructores.findMany({
      include: {
        // Aquí debes agregar las relaciones que correspondan
        // por ejemplo:
        Instructor: true,
        Horario: true,
      },
    });
    return NextResponse.json({ datos: horariosInstructores }, { status: 200 });
  } catch (error) {
    return handleErrors(error);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const horarioInstructor = await prisma.horariosInstructores.create({
      data: {
        // Aquí debes agregar los campos que correspondan
        // por ejemplo:
        instructorId: data.instructorId,
        horarioId: data.horarioId,
      },
    });
    return new NextResponse(JSON.stringify(horarioInstructor), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    return handleErrors(error);
  }
}
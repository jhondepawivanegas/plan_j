import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const handleErrors = (error) => {
return new NextResponse(error.message, { status: 500 });
};

export async function GET(request, { params }) {
    try {
      const id = parseInt(params.id);
      if (isNaN(id) || id <= 0) {
        return NextResponse.json({ error: 'ID de horario inválido' }, { status: 400 });
      }
  
      const horario = await prisma.horarios.findUnique({
        where: { id_horario: parseInt(params.id)},
        include: {

        },
      });
  
      if (!horario) {
        return NextResponse.json({ error: 'Horario no encontrado' }, { status: 404 });
      }
  
      return NextResponse.json(horario);
    } catch (error) {
      return handleErrors(error);
    }
  }

export async function DELETE(request, { params }) {
try {
    const id = parseInt(params.id);
    await prisma.ambientes.delete({ where: { id_ambiente } });
    return NextResponse.json({ message: "Ambiente deleted successfully" }, { status: 200 });
} catch (error) {
    return handleErrors(error);
}
}

export async function PUT(request, { params }) {
try {
    const id = parseInt(params.id);
    const data = await request.json();
    const updatedAmbiente = await prisma.ambientes.update({
    where: { id },
    data: {
        nombre_amb: data.nombre_amb,
        municipio: data.municipio,
        sede: { connect: { id_sede: data.sedeId } },
        estado: { connect: { id_estado: data.estadoId } },
    },
    });
    return NextResponse.json({ message: "Ambiente updated successfully" }, { status: 200 });
} catch (error) {
    return handleErrors(error);
}
}
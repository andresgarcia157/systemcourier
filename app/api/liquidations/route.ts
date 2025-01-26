import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const liquidations = await db.liquidation.findMany({
      include: {
        package: true,
        invoice: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      liquidations
    })

  } catch (error) {
    console.error("Error fetching liquidations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener las liquidaciones"
      },
      { status: 500 }
    )
  }
}

import dbConnect from "@/lib/db";
import Formula from "@/schema/Formula";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: {
    integration: string;
  };
}

const defaultSessionsFormulaId = process.env.DEFAULT_SESSIONS_FORMULA_ID;
const defaultAdvanceFormulaId = process.env.DEFAULT_ADVANCE_FORMULA_ID;

export async function GET(request: NextRequest, { params }: Params) {
  const { integration } = params;

  try {
    await dbConnect();

    const defaultFormulaId =
      integration === "sessions"
        ? defaultSessionsFormulaId
        : integration === "advance"
          ? defaultAdvanceFormulaId
          : "";
    let formula = await Formula.findById(defaultFormulaId);

    if (!formula) {
      throw new Error(`Starter Formula not found`);
    }

    return NextResponse.json(
      { message: "starter formula retrieved", success: true, data: formula },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "An error occurred when retrieving the formula",
        success: false,
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log("Request to POST a Formula");

  try {
    // TODO: Add validation
    const requestBody = await request.json();

    await dbConnect();
    console.log("DB Connected");

    let insertResult = await Formula.create(requestBody);

    return NextResponse.json(
      { message: "formula inserted", success: true, data: insertResult },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting formula", error);

    return NextResponse.json(
      {
        message: "An error occurred when inserting the formula",
        success: false,
        error: error,
      },
      { status: 500 }
    );
  }
}

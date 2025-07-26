import dbConnect from "@/lib/db";
import Formula from "@/schema/Formula";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
    integration: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id, integration } = params;
  // need to add a check to see if the integration matches the integrationType in the formula schema found in the database

  try {
    await dbConnect();

    let result = await Formula.findById(id);
    if (!result) throw new Error("Could not find formula with id");

    if (result.integrationType !== integration)
      throw new Error("Integration type does not match");

    return NextResponse.json({ data: result, success: true }, { status: 200 });
  } catch (error) {
    console.error(
      `An error occurred when retrieving formula with id ${id}`,
      error
    );
    return NextResponse.json(
      {
        message: `An error occurred when retrieving formula with id ${id}`,
        success: false,
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log("DB Connected");

    let result = await Formula.create(request.body);
    if (!result) throw new Error("An error occurred when creating the formula");

    return NextResponse.json({ data: result, success: true }, { status: 200 });
  } catch (error) {
    console.error(`An error occurred when creating a new formula`, error);
    return NextResponse.json(
      {
        message: `An error occurred when creating a new formula`,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = params;
  console.log(`Proceeding to delete formula with id ${id}`);

  try {
    await dbConnect();
    console.log("DB Connected");

    let result = await Formula.findByIdAndDelete(id);
    if (!result) throw new Error("Result is null");

    console.log(`Successfully deleted Formula with id: ${result.id}`);
    return NextResponse.json(
      { message: "formula deleted", success: true, id: result.id },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `An error occurred when deleting the formula with id ${id}`,
      error
    );
    return NextResponse.json(
      {
        message: "An error occurred when deleting the formula",
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}

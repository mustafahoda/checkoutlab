import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { merchantId: string } }
) {
  const { merchantId } = params;
  try {
    const response = await fetch(
      `https://management-test.adyen.com/v3/merchants/${merchantId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": `${process.env.ADYEN_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    return Response.json({ ...data });
  } catch (error: any) {
    if (error instanceof Response) {
      const data = await error.json();
      return new Response(JSON.stringify(data), {
        status: error.status,
      });
    } else {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  }
}

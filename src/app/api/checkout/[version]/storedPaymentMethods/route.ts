export async function DELETE(
    request: Request,
    { params }: { params: { version: string; } }
) {
    try {
        // Get the required parameters from the request body
        const requestBody = await request.json();
        const { merchantAccount, shopperReference, storedPaymentMethodId } = requestBody;

        // Validate required parameters
        if (!merchantAccount || !shopperReference || !storedPaymentMethodId) {
            return new Response(
                JSON.stringify({
                    status: 400,
                    message: "merchantAccount, shopperReference, and storedPaymentMethodId are required in the request body"
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Construct URL with query parameters
        const adyenUrl = new URL(`https://checkout-test.adyen.com/${params.version}/storedPaymentMethods/${storedPaymentMethodId}`);
        adyenUrl.searchParams.append('merchantAccount', merchantAccount);
        adyenUrl.searchParams.append('shopperReference', shopperReference);

        const response = await fetch(
            adyenUrl.toString(),
            {
                method: "DELETE",
                headers: {
                    "X-API-Key": `${process.env.ADYEN_API_KEY}`,
                },
            }
        );

        // According to the docs, a successful deletion returns 204 No Content
        if (response.status === 204) {
            return new Response(null, { status: 204 });
        }

        // If the response is not 204, handle it as an error
        const errorData = await response.json();
        return new Response(JSON.stringify(errorData), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) {
        console.error("Error deleting stored payment method:", error);

        if (error instanceof Response) {
            const data = await error.json();
            return new Response(JSON.stringify(data), {
                status: error.status,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(
            JSON.stringify({
                status: 500,
                message: "Internal server error",
                error: error.message
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}

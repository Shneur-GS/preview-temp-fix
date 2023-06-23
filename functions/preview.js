export async function onRequest(context) {
    const request = context.request;

    if (request.method !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }

    const url = new URL(request.url);
    const slugParam = url.searchParams.get('slug');

    if (!slugParam) {
        return new Response('Missing slug parameter', { status: 400 });
    }

    const apiUrl = `https://website.chayenu.org/${slugParam}?includeDraft=true`;

    try {
        const apiResponse = await fetch(apiUrl, {
            method: request.method,
            headers: request.headers
        });

        // Copy the response so that it's no longer tied to the original fetch call
        const response = new Response(apiResponse.body, apiResponse);

        // Alter the headers so that it's as if the response came directly from your domain
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Host', new URL(request.url).host);

        return response;

    } catch (error) {
        return new Response('Error calling API', { status: 500 });
    }
}

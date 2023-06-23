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
        const apiRes = await fetch(apiUrl);
        const data = await apiRes.text();
        
        return new Response(data, {
            headers: { 'Content-Type': 'text/html' },
        });

    } catch (error) {
        return new Response('Error calling API', { status: 500 });
    }
}

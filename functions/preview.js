export async function onRequest(context) {
    const request = context.request;
  
    if (request.method !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }
  
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
        return new Response('Missing slug', { status: 400 });
    }

    const websiteUrl = `https://chayenu.org/${slug}?includeDraft=true`;
    try {
        const websiteRes = await fetch(websiteUrl);
        const websiteHtml = await websiteRes.text();

        const response = new Response(websiteHtml, websiteRes);
        return new HTMLRewriter()
            .on('img', {
                element(el) {
                    const src = el.getAttribute('src');
                    if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
                        el.setAttribute('src', `https://chayenu.org${src}`);
                    }
                }
            })
            .transform(response);
    } catch (error) {
        console.log(error);
        return new Response(`Error calling API: ${error}`, { status: 500 });
    }
}


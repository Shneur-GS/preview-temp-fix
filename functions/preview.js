// your-worker.js
export async function onRequest(context) {
    const request = context.request;

    if (request.method !== 'GET') {
        return new Response(`Method ${request.method} Not Allowed`, { status: 405 });
    }

    const url = new URL(request.url);
    const slugParam = url.searchParams.get('slug');

    if (!slugParam) {
        return new Response('Missing slug', { status: 400 });
    }

    try {
        const apiUrl = `https://website.chayenu.org/preview?slug=${slugParam}&includeDraft=true`;
        const apiRes = await fetch(apiUrl);
        let htmlData = await apiRes.text();

        // Create a DOM Parser
        let parser = new DOMParser();
        let doc = parser.parseFromString(htmlData, "text/html");

        // Get all img elements
        let imgs = doc.querySelectorAll("img");
        imgs.forEach(img => {
            // Replace src attribute to point to chayenu.org domain
            let src = img.getAttribute("src");
            if (src && !src.startsWith('http')) {
                img.setAttribute("src", `https://chayenu.org${src}`);
            }
        });

        // Serialize the modified HTML back to string
        let serializer = new XMLSerializer();
        htmlData = serializer.serializeToString(doc);

        return new Response(htmlData, { headers: apiRes.headers });
    } catch (error) {
        return new Response('Error calling API', { status: 500 });
    }
}

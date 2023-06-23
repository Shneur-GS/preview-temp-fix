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
            .on('head', {
                element(el) {
                    el.setInnerContent(`<meta charset="utf-8"><link rel="true" preconnect="true" href="https://fonts.googleapis.com"><link rel="true" preconnect="true" href="https://use.typekit.net"><title>test</title><meta name="viewport" content="initial-scale=1.0, width=device-width"><meta name="description" content="Chayenu is a weekly subscription-based publication focused on the daily study cycles of Chumash, Rambam, Tanya &amp; more, &amp; features fresh content from a variety of Torah sources"><meta property="og:title" content="test"><meta property="og:description" content="Chayenu is a weekly subscription-based publication focused on the daily study cycles of Chumash, Rambam, Tanya &amp; more, &amp; features fresh content from a variety of Torah sources"><meta property="og:type" content="article"><meta property="og:image" content="https://chayenu.org/images/opengraph.png"><meta name="twitter:card" content="summary_large_image"><meta property="twitter:domain" content="https://chayenu.org"><meta property="twitter:url" content="https://chayenu.org/testing?includeDraft=true"><meta name="twitter:title" content="test"><meta name="twitter:description" content="Chayenu is a weekly subscription-based publication focused on the daily study cycles of Chumash, Rambam, Tanya &amp; more, &amp; features fresh content from a variety of Torah sources"><meta name="twitter:image" content="https://chayenu.org/images/opengraph.png"><meta name="next-head-count" content="16"><link rel="stylesheet" href="/dropin.css" id="braintree-dropin-stylesheet"><link rel="shortcut icon" href="https://chayenu.org/logodarker.svg"><link rel="preload" href="https://chayenu.org/_next/static/css/fa5980d90978edf3.css" as="style"><link rel="stylesheet" href="https://chayenu.org/_next/static/css/fa5980d90978edf3.css" data-n-g=""><link rel="preload" href="https://chayenu.org/_next/static/css/11c102c6a47bc92f.css" as="style"><link rel="stylesheet" href="https://chayenu.org/_next/static/css/11c102c6a47bc92f.css" data-n-p=""><noscript data-n-css=""></noscript><style type="text/css">
@font-face {
  font-weight: 400;
  font-style:  normal;
  font-family: circular;

  src: url('chrome-extension://liecbddmkiiihnedobmlmillhodjkdmb/fonts/CircularXXWeb-Book.woff2') format('woff2');
}

@font-face {
  font-weight: 700;
  font-style:  normal;
  font-family: circular;

  src: url('chrome-extension://liecbddmkiiihnedobmlmillhodjkdmb/fonts/CircularXXWeb-Bold.woff2') format('woff2');
}</style> ${el.innerHTML}`, { html: true });
                }
            })
            .transform(response);
    } catch (error) {
        console.log(error);
        return new Response(`Error calling API: ${error}`, { status: 500 });
    }
}

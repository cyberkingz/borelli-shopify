import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} remixContext
 * @param {AppLoadContext} context
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  context,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    defaultSrc: [
      "'self'",
      "localhost:*",
      "https://cdn.shopify.com",
      "https://*.myshopify.dev",
      "https://*.o2.myshopify.dev",
      "data:",
    ],
    imgSrc: [
      "'self'",
      "https://cdn.shopify.com",
      "https://www.facebook.com" 
    ],
    connectSrc: [
      "'self'",
      "https://monorail-edge.shopifysvc.com",
      "localhost:*",
      "ws://localhost:*",
      "ws://127.0.0.1:*",
      "https://w6ynqi-53.myshopify.com",
      "https://*.myshopify.dev",
      "https://*.o2.myshopify.dev",
      "https://cdn.shopify.com",
    ],
    scriptSrc: [
      "'self'",
      "https://cdn.shopify.com",
      "https://w6ynqi-53.myshopify.com",
      "https://*.myshopify.dev",
      "https://*.o2.myshopify.dev",
      "https://connect.facebook.net",
      "'unsafe-inline'", // This is your valid nonce
      "'unsafe-eval'" // Keep this if needed for certain JavaScript features
    ],
    styleSrc: [
      "'self'",
      "https://cdn.shopify.com",
      "https://w6ynqi-53.myshopify.com",
      "https://*.myshopify.dev",
      "https://*.o2.myshopify.dev",
      "'unsafe-inline'",
    ],
    fontSrc: [
      "'self'",
      "https://cdn.shopify.com",
      "https://w6ynqi-53.myshopify.com",
      "data:",
      "https://*.myshopify.dev",
      "https://*.o2.myshopify.dev",
    ],
    mediaSrc: [
      "'self'",
      "https://cdn.shopify.com",
      "https://w6ynqi-53.myshopify.com",
      "https://*.myshopify.dev",
      "https://*.o2.myshopify.dev"
    ],
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set(
    'Content-Security-Policy',
    header.replaceAll(` 'nonce-${nonce}'`, ''),
  );

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/remix-oxygen').EntryContext} EntryContext */
/** @typedef {import('@shopify/remix-oxygen').AppLoadContext} AppLoadContext */

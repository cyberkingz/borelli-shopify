import {redirect} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';
import {countries} from '~/data/countries';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context}) {
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, but it does not match the current locale,
    // then the locale param is invalid, so send the user to the 404 page.
    throw new Response(null, {status: 404});
  }

  return null;
}

export const action = async ({request, context}) => {
  const {session} = context;
  const formData = await request.formData();

  // Ensure the form request is valid
  const languageCode = formData.get('language');
  invariant(languageCode, 'Missing language');

  const countryCode = formData.get('country');
  invariant(countryCode, 'Missing country');

  // Determine the path to redirect to relative to where the user navigated from
  const path = formData.get('path') || '/';  // Default to '/' if no path is provided

  const toLocale = countries[`${languageCode}-${countryCode}`.toLowerCase()] || countries.default;
  if (!toLocale) {
    throw new Error(`Locale not found for language: ${languageCode}, country: ${countryCode}`);
  }

  // Ensure the host is valid for the selected locale
  if (!toLocale.host) {
    throw new Error('Host is undefined for the selected locale');
  }

  const cartId = await session.get('cartId');

  // Update the cart buyer's country code if there is a cart ID
  if (cartId) {
    await updateCartBuyerIdentity(context, {
      cartId,
      buyerIdentity: {
        countryCode,
      },
    });
  }

  /// Check if the environment is local
  const isLocal = request.url.includes('localhost');

  // Construct the redirect URL
  const redirectUrl = new URL(
    `${toLocale.pathPrefix || ''}${path}`,
    isLocal ? `http://localhost:3000` : `https://${toLocale.host}` // Use `localhost` for local development
  );

  return redirect(redirectUrl, 302);
};

async function updateCartBuyerIdentity({ storefront, session }, { cartId, buyerIdentity }) {
  try {
    const data = await storefront.mutate(UPDATE_CART_BUYER_COUNTRY, {
      variables: {
        cartId,
        buyerIdentity,
      },
    });

    // Check if data is returned and contains cartBuyerIdentityUpdate
    if (!data || !data.cartBuyerIdentityUpdate) {
      throw new Error('No data returned or cartBuyerIdentityUpdate is undefined');
    }

    const cart = data.cartBuyerIdentityUpdate.cart;

    if (!cart) {
      throw new Error('Cart is undefined');
    }

    return cart;

  } catch (error) {
    console.error(error);

    // If error occurs, redirect to default domain
    const defaultHost = 'barkerlondon.com'; // Set default domain
    const defaultPath = '/'; // Optionally, set a default path
    const redirectUrl = new URL(defaultPath, `https://${defaultHost}`);

    // Redirect to the default domain
    return redirect(redirectUrl, 302);
  }
}

const UPDATE_CART_BUYER_COUNTRY = `#graphql
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
  ) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
      }
    }
  }
`;

/** 
 * @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs 
 * @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData 
 */

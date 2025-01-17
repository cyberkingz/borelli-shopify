import {redirect} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';
import {countries} from '~/data/countries';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context}) {
  const currentLocale = params.locale || '';
  const toLocale = countries[`${currentLocale}`.toLowerCase()] || countries.default;
  // Ensure the form request is valid
  const languageCode = toLocale.language;
  const countryCode = toLocale.country;
 
  invariant(languageCode, 'Missing language');
  invariant(countryCode, 'Missing country');

  const cartId = await context.cart.getCartId();
  // Update the cart buyer's country code if there is a cart ID
  if (cartId) {
    await updateCartBuyerIdentity(context, {
      cartId,
      buyerIdentity: {
        countryCode: countryCode,
      },
    });
  }

  return null;
}

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
    const defaultHost = import.meta.env.PUBLIC_STORE_DOMAIN; // Set default domain
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

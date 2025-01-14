import {useLoaderData} from '@remix-run/react';
import {Analytics, CartForm} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import {CartMain} from '~/components/CartMain';
import {getMarketVariables} from '~/lib/market';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: `Barker London | Cart`}];
};

/**
 * @param {ActionFunctionArgs}
 */
export async function action({request, context, params}) {
  const {cart} = context;
  const locale = params.locale;
  const {currency, country} = getMarketVariables(locale);

  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result;

  // Set cart buyer identity for the market
  const buyerIdentity = {
    countryCode: country,
  };

  // Set cart attributes for the market
  const cartAttributes = [
    {key: 'currency', value: currency},
    {key: 'countryCode', value: country},
  ];

  // Create cart input with market settings
  const cartInput = {
    buyerIdentity,
    attributes: cartAttributes,
  };

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines, cartInput);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines, cartInput);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds, cartInput);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = formDiscountCode ? [formDiscountCode] : [];

      // Combine discount codes already applied on the cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes, cartInput);
      break;
    }
    default:
      throw new Error(`${action} cart action not defined`);
  }

  const headers = cart.setCartId(result.cart.id);

  return json(result, {status, headers});
}

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context, params}) {
  const {cart} = context;
  const locale = params.locale;
  const {currency, country} = getMarketVariables(locale);

  // If there's no existing cart, create one with market-specific settings
  if (!cart.id) {
    const result = await cart.create({
      buyerIdentity: {
        countryCode: country,
      },
      attributes: [
        {key: 'currency', value: currency},
        {key: 'countryCode', value: country},
      ],
    });
    const headers = cart.setCartId(result.cart.id);
    return json({cart: result.cart}, {headers});
  }

  // Get cart with market-specific settings
  const cartResult = await cart.get();
  
  // Update cart with market settings if needed
  if (cartResult?.cart) {
    const currentCurrency = cartResult.cart.cost?.totalAmount?.currencyCode;
    if (currentCurrency !== currency) {
      const result = await cart.updateAttributes([
        {key: 'currency', value: currency},
        {key: 'countryCode', value: country},
      ], {
        buyerIdentity: {
          countryCode: country,
        },
      });
      const headers = cart.setCartId(result.cart.id);
      return json({cart: result.cart}, {headers});
    }
  }

  return json({cart: cartResult});
}

export default function Cart() {
  /** @type {LoaderReturnData} */
  const {cart} = useLoaderData();

  if (cart?.totalQuantity > 0) return <CartMain layout="page" cart={cart} />;

  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:px-8 md:py-8 lg:p-12">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <button
        onClick={() => window.history.back()}
        className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
      >
        Continue shopping
      </button>
    </div>
  );
}

function isLocalPath(path) {
  try {
    const url = new URL(path);
    return url.origin === 'null';
  } catch (e) {
    return true;
  }
}

/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/hydrogen').CartQueryDataReturn} CartQueryDataReturn */
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */

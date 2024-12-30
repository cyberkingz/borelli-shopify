import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {useEffect} from 'react';
import {useFacebookPixel} from '~/hooks/useFacebookPixel';

export async function loader({params, context, request}) {
  const {id} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const orderToken = url.searchParams.get('key');

  if (!orderToken) {
    throw new Response('Order token not found', {status: 400});
  }

  try {
    // Fetch order details using the Shopify Storefront API
    const {node: order} = await storefront.query(ORDER_QUERY, {
      variables: {
        id: `gid://shopify/Order/${id}?key=${orderToken}`,
      },
    });

    if (!order) {
      throw new Response('Order not found', {status: 404});
    }

    return json({
      order: {
        ...order,
        // Format the data for Facebook Pixel
        lineItems: {
          nodes: order.lineItems.nodes.map(item => ({
            ...item,
            variant: {
              ...item.variant,
              product: {
                ...item.variant.product,
                price: item.variant.price
              }
            }
          }))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Response('Error fetching order details', {status: 500});
  }
}

export default function OrderConfirmation() {
  const {order} = useLoaderData();
  const {trackPurchase} = useFacebookPixel();

  useEffect(() => {
    if (order) {
      const purchaseData = {
        id: order.id,
        name: order.name,
        email: order.email,
        totalPrice: order.totalPrice,
        subtotalPrice: order.subtotalPrice,
        totalTax: order.totalTax,
        lineItems: order.lineItems,
        shippingAddress: order.shippingAddress
      };

      trackPurchase(purchaseData);
    }
  }, [order, trackPurchase]);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Thank you for your order!</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-xl mb-4">Order #{order.name}</p>
        <p className="text-gray-600 mb-2">
          We'll send you shipping confirmation when your order ships.
        </p>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-4">
              {order.lineItems.nodes.map((item) => (
                <div key={item.variant.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.variant.product.title}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: item.variant.price.currencyCode,
                    }).format(item.variant.price.amount * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: order.totalPrice.currencyCode,
                  }).format(order.totalPrice.amount)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ORDER_QUERY = `#graphql
  query Order($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        name
        email
        totalPrice {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        shippingAddress {
          address1
          city
          country
          zip
        }
        lineItems(first: 100) {
          nodes {
            variant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                id
                title
                vendor
              }
            }
            quantity
          }
        }
      }
    }
  }
`;

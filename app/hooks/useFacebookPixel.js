import {useCallback} from 'react';

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * @property {{amount: string, currencyCode: string}} price
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {{amount: string, currencyCode: string}} totalPrice
 * @property {{nodes: Array<{variant: {product: Product}, quantity: number}>}} lineItems
 */

export function useFacebookPixel() {
  const trackEvent = useCallback((eventName, data = {}) => {
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, data);
      }
    } catch (error) {
      console.error('Facebook Pixel Error:', error);
    }
  }, []);

  const trackAddToCart = useCallback((product) => {
    if (!product) return;

    trackEvent('AddToCart', {
      content_type: 'product',
      content_name: product.title,
      content_ids: [product.id],
      value: parseFloat(product.price?.amount) || 0,
      currency: product.price?.currencyCode || 'EUR'
    });
  }, [trackEvent]);

  const trackPurchase = useCallback((order) => {
    if (!order) return;

    trackEvent('Purchase', {
      content_type: 'product_group',
      content_ids: order.lineItems.nodes.map(item => item.variant.product.id),
      value: parseFloat(order.totalPrice?.amount) || 0,
      currency: order.totalPrice?.currencyCode || 'EUR',
      num_items: order.lineItems.nodes.reduce((sum, item) => sum + item.quantity, 0)
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackAddToCart,
    trackPurchase,
  };
}

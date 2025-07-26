declare global {
  interface Window {
    AdyenCheckout: any; // Replace 'any' with proper Adyen types if available
  }
}

const checkoutConfiguration: Record<string, unknown> = {};
const checkout = new window.AdyenCheckout(checkoutConfiguration);

const dropinConfiguration: Record<string, unknown> = {};
const dropin = checkout.create('dropin', dropinConfiguration).mount('#dropin');
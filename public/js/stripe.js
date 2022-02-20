/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51JjqwXAWFY0OBXH9zCYdPJ45I1TMJt2RuqqDXOhJNOjfTNq0GDhwa45VYGPzMyLyuLuxjOiAoFKPU2EmaYG1bRcp000yq5Ex4T'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get the checkout session from API
    const session = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`,
    });

    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
    // 2) Create checkout form + charge credit card for us
  } catch (err) {
    showAlert('error', err);
  }
};

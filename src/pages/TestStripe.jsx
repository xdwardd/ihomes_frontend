import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#a0aec0",
      },
    },
    invalid: {
      color: "#e53e3e",
      iconColor: "#e53e3e",
    },
  },
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.post(
      "http://localhost:3000/create-payment-intent",
      { amount: 1000 },
    );

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        alert("Payment successful!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg"
      >
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Payment Details
        </h2>

        <div className="p-3 mb-5 border rounded-lg border-gray-300">
          <CardElement options={cardStyle} />
        </div>

        <button
          className="w-full py-3 text-white transition duration-300 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
          disabled={!stripe}
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;

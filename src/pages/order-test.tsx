import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../state/hooks';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '../services/paymentService';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Checkout form component that will handle the payment
const CheckoutForm = ({ formData, onSuccess }: { formData: any, onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(1000); // Default amount in cents ($10.00)

  useEffect(() => {
    // Create PaymentIntent as soon as the component mounts
    const createIntent = async () => {
      try {
        const data = await createPaymentIntent(amount / 100);
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment');
        console.error(err);
      }
    };

    createIntent();
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            address: {
              line1: formData.address,
              postal_code: formData.pincode,
              city: formData.city,
              state: formData.state,
            },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Card Details
        </label>
        <div style={{
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        {error && <div style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</div>}
        <button
          type="submit"
          disabled={!stripe || processing || !clientSecret}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            width: '100%',
            opacity: (!stripe || processing || !clientSecret) ? 0.7 : 1,
            pointerEvents: (!stripe || processing || !clientSecret) ? 'none' : 'auto',
          }}
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

const OrderTest = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pincode: '',
    state: '',
    city: '',
    deliveryMethod: 'standard',
    productType: ''
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentForm(true);
    // In a real app, you might want to save the order details to your backend here
  };

  const handlePaymentSuccess = () => {
    setOrderSubmitted(true);
    console.log('Order and payment successful:', formData);
    // Here you would typically send the order confirmation to your backend
  };

  if (!user) {
    navigate('/');
    return null;
  }

  if (orderSubmitted) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1>Order Confirmed! 🎉</h1>
        <p>Thank you for your order, {formData.name}!</p>
        <p>Your order has been placed successfully and will be delivered soon.</p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1>Place Your Order</h1>
      <form onSubmit={handleFormSubmit} style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div id="name-group">
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          />
        </div>

        <div id="address-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="address" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              resize: 'vertical',
              marginBottom: '1rem'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div id="pincode-group">
            <label htmlFor="pincode" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Pincode</label>
            <input
              id="pincode"
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}
            />
          </div>
          <div id="state-group">
            <label htmlFor="state" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>State</label>
            <input
              id="state"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}
            />
          </div>
        </div>

        <div id="city-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="city" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>City</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          />
        </div>

        <div id="delivery-method-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="deliveryMethod" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Method of Delivery</label>
          <select
            id="deliveryMethod"
            name="deliveryMethod"
            value={formData.deliveryMethod}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: 'white',
              marginBottom: '1rem'
            }}
          >
            <option value="standard">Standard Delivery (3-5 business days)</option>
            <option value="express">Express Delivery (1-2 business days)</option>
            <option value="overnight">Overnight Delivery</option>
          </select>
        </div>

        <fieldset style={{ marginBottom: '1.5rem', border: 'none', padding: 0 }}>
          <legend style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Type</legend>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
            {['Electronics', 'Clothing', 'Books', 'Home', 'Beauty', 'Other'].map(type => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  id={`product-type-${type.toLowerCase()}`}
                  type="radio"
                  name="productType"
                  value={type.toLowerCase()}
                  checked={formData.productType === type.toLowerCase()}
                  onChange={handleChange}
                  required
                />
                <label htmlFor={`product-type-${type.toLowerCase()}`}>{type}</label>
              </div>
            ))}
          </div>
        </fieldset>

        {!showPaymentForm ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                flex: 1
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                flex: 1
              }}
            >
              Proceed to Payment
            </button>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm formData={formData} onSuccess={handlePaymentSuccess} />
          </Elements>
        )}
      </form>
    </div>
  )
};

export default OrderTest;

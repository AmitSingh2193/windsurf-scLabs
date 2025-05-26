import axios, { AxiosError } from 'axios';

const API_URL = '/api';

type PaymentIntentResponse = {
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
};

type ConfirmPaymentResponse = {
  status: string;
  paymentIntent: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    [key: string]: any;
  };
};

type ApiError = {
  message: string;
  status?: number;
  details?: any;
};

export const createPaymentIntent = async (
  amount: number, 
  currency: string = 'usd'
): Promise<PaymentIntentResponse> => {
  try {
    const response = await axios.post<PaymentIntentResponse>(
      `${API_URL}/create-payment-intent`,
      { amount: Math.round(amount * 100), currency },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    const errorMessage = axiosError.response?.data?.error || 'Failed to create payment intent';
    console.error('Payment intent error:', errorMessage, error);
    
    throw new Error(errorMessage);
  }
};

export const confirmPayment = async (
  paymentIntentId: string
): Promise<ConfirmPaymentResponse> => {
  try {
    const response = await axios.post<ConfirmPaymentResponse>(
      `${API_URL}/confirm-payment`,
      { paymentIntentId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string }>;
    const errorMessage = axiosError.response?.data?.error || 'Failed to confirm payment';
    console.error('Payment confirmation error:', errorMessage, error);
    
    throw new Error(errorMessage);
  }
};

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import Button from './ui/Button';

function PaymentForm({ clientSecret, onSuccess, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else if (result.paymentIntent.status === 'succeeded') {
                onSuccess();
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const cardElementOptions = {
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
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-center mb-4">
                <FiCreditCard className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-lg font-semibold text-gray-900">Payment Information</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Details
                    </label>
                    <div className="relative">
                        <CardElement options={cardElementOptions} />
                        <div className="absolute right-3 top-3">
                            <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <Button
                        type="submit"
                        loading={loading}
                        disabled={!stripe || loading}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? 'Processing Payment...' : 'Complete Payment'}
                    </Button>
                    
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="outline"
                        className="w-full"
                    >
                        Cancel
                    </Button>
                </div>
            </form>

            <div className="text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                    <FiLock className="h-3 w-3 mr-1" />
                    Your payment information is secure and encrypted by Stripe
                </p>
            </div>

            {/* Test Card Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Test Card Information</h4>
                <div className="text-xs text-blue-800 space-y-1">
                    <p>Card Number: 4242 4242 4242 4242</p>
                    <p>Expiry: Any future date (e.g., 12/25)</p>
                    <p>CVC: Any 3 digits (e.g., 123)</p>
                </div>
            </div>
        </div>
    );
}

export default PaymentForm;

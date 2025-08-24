import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCreditCard, FiCheck } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PaymentForm from '../../components/PaymentForm';
import { paymentAPI } from '../../api/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Handle Stripe redirect results
  useEffect(() => {
    if (stripe) {
      const clientSecret = searchParams.get('payment_intent_client_secret');
      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');

      if (clientSecret) {
        setClientSecret(clientSecret);
        if (success === 'true') {
          handlePaymentSuccess();
        } else if (canceled === 'true') {
          handlePaymentCancel();
        }
      }
    }
  }, [stripe, searchParams]);

  // Get plan details and create payment intent
  useEffect(() => {
    const initializePayment = async () => {
      try {
        const planId = searchParams.get('plan');
        if (!planId) {
          setPaymentError('No plan selected');
          setLoading(false);
          return;
        }

        // Get plan details from URL params or fallback to hardcoded plans
        const planName = searchParams.get('planName');
        const planPrice = searchParams.get('planPrice');
        const planPeriod = searchParams.get('planPeriod');

        let selectedPlan;
        if (planName && planPrice) {
          // Use plan details from URL params
          selectedPlan = {
            id: planId,
            name: planName,
            price: parseInt(planPrice),
            period: planPeriod || 'month'
          };
        } else {
          // Fallback to hardcoded plans
          const plans = {
            basic: { id: 'basic', name: 'Basic', price: 29, period: 'month' },
            standard: { id: 'standard', name: 'Standard', price: 79, period: 'month' },
            pro: { id: 'pro', name: 'Pro', price: 199, period: 'month' }
          };
          selectedPlan = plans[planId];
        }

        if (!selectedPlan) {
          setPaymentError('Invalid plan selected');
          setLoading(false);
          return;
        }

        setPlan(selectedPlan);

        // Create payment intent
        const response = await paymentAPI.upgradePlan(planId);
        const { clientSecret } = response.data;

        if (clientSecret) {
          setClientSecret(clientSecret);
        } else {
          setPaymentError('Failed to initialize payment. Please try again.');
        }
      } catch (error) {
        console.error('Error initializing payment:', error);
        setPaymentError('Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [searchParams]);

  const handlePaymentSuccess = () => {
    setProcessing(false);
    // Redirect to dashboard with success message
    navigate('/dashboard?upgrade=success');
  };

  const handlePaymentCancel = () => {
    setProcessing(false);
    navigate('/dashboard/upgrade');
  };

  const handleBackToPlans = () => {
    navigate('/dashboard/upgrade');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <FiCreditCard className="h-16 w-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h2>
              <p className="text-gray-600 mb-6">{paymentError}</p>
              <div className="space-y-3">
                <Button onClick={handleBackToPlans} className="w-full">
                  <FiArrowLeft className="h-5 w-5 mr-2" />
                  Back to Plans
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={handleBackToPlans}
            variant="outline"
            className="mb-6"
          >
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Back to Plans
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Payment
          </h1>
          <p className="text-lg text-gray-600">
            Secure payment powered by Stripe
          </p>
        </motion.div>

        {/* Payment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Plan:</span>
                  <span className="font-semibold">{plan?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Price:</span>
                  <span className="font-semibold">${plan?.price}/{plan?.period}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Billing Cycle:</span>
                  <span className="font-semibold">Monthly</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">${plan?.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Form */}
          {clientSecret ? (
            <Card>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-full p-3 inline-block mb-4">
                    <FiCreditCard className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Enter Payment Details
                  </h3>
                  <p className="text-gray-600">
                    Your payment information is secure and encrypted
                  </p>
                </div>

                <PaymentForm
                  clientSecret={clientSecret}
                  plan={plan}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handlePaymentCancel}
                  onError={(error) => setPaymentError(error)}
                />

                <div className="mt-6 text-center">
                  <Button
                    onClick={handlePaymentCancel}
                    variant="outline"
                    className="w-full"
                    disabled={processing}
                  >
                    Cancel Payment
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-8 text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Preparing payment form...</p>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Security Notice */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center">
              <FiCheck className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 text-sm">
                Your payment is secured with bank-level encryption
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;

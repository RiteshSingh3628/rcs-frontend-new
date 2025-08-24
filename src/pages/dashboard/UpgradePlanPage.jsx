import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiStar, FiZap, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { paymentAPI } from '../../api/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useStripe } from '@stripe/react-stripe-js';
import { useSearchParams, useNavigate } from 'react-router-dom';

const UpgradePlanPage = () => {
  const { profile } = useApp();
  const stripe = useStripe();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Handle Stripe redirect results and payment success
  useEffect(() => {
    if (stripe) {
      const success = searchParams.get('success');
      const canceled = searchParams.get('canceled');

      if (success === 'true') {
        handlePaymentSuccess();
      } else if (canceled === 'true') {
        handlePaymentCancel();
      }
    }

    // Check for upgrade success from payment page
    const upgradeSuccess = searchParams.get('upgrade');
    if (upgradeSuccess === 'success') {
      // Show success message or redirect
      window.location.href = '/dashboard';
    }
  }, [stripe, searchParams]);


  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      period: 'month',
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 100 reviews/month',
        'Basic analytics',
        'Email support',
        'Standard branding'
      ],
      popular: false,
      icon: FiStar
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 79,
      period: 'month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 500 reviews/month',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'Review management tools'
      ],
      popular: true,
      icon: FiZap
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 199,
      period: 'month',
      description: 'For large businesses with advanced needs',
      features: [
        'Unlimited reviews',
        'Full analytics suite',
        '24/7 phone support',
        'White-label solution',
        'API access',
        'Custom integrations'
      ],
      popular: false,
      icon: FiCreditCard
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleUpgradePlan = async () => {
    if (!selectedPlan) {
      setPaymentError('Please select a plan first');
      return;
    }

    setLoading(true);
    setPaymentError(null);

    try {
      console.log('selectedPlan', selectedPlan);
      
      // First try to create a Checkout Session for redirect
      try {
        const checkoutResponse = await paymentAPI.createCheckoutSession(selectedPlan.id);
        const { sessionId } = checkoutResponse.data;
        
        if (sessionId && stripe) {
          setRedirecting(true);
          const { error } = await stripe.redirectToCheckout({
            sessionId: sessionId,
          });
          
          if (error) {
            console.error('Error redirecting to Stripe:', error);
            setRedirecting(false);
            throw new Error('Redirect failed');
          }
          // Don't set loading to false here as we're redirecting
          return; // Successfully redirected
        }
      } catch (checkoutError) {
        console.log('Checkout Session creation failed, falling back to payment page:', checkoutError);
      }
      
      // Fallback to payment page
      navigate(`/dashboard/payment?plan=${selectedPlan.id}&planName=${selectedPlan.name}&planPrice=${selectedPlan.price}&planPeriod=${selectedPlan.period}`);
    } catch (error) {
      console.error('Error upgrading plan:', error);
      setPaymentError('Failed to initiate plan upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Redirect to dashboard or show success message
    window.location.href = '/dashboard';
  };

  const handlePaymentCancel = () => {
    // User will be redirected back from payment page
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Plan
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Select the perfect plan for your business needs and unlock powerful features to grow your online reputation.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`relative h-full transition-all duration-300 ${
                selectedPlan?.id === plan.id 
                  ? 'ring-2 ring-blue-500 shadow-lg transform scale-105' 
                  : 'hover:shadow-lg hover:transform hover:scale-105'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center p-6">
                  <div className="flex justify-center mb-4">
                    <plan.icon className="h-12 w-12 text-blue-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <FiCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    variant={selectedPlan?.id === plan.id ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Upgrade Button */}
        {selectedPlan && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-md mx-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ready to upgrade to {selectedPlan.name}?
                </h3>
                <p className="text-gray-600 mb-6">
                  You'll be charged ${selectedPlan.price}/{selectedPlan.period} starting today.
                </p>
                
                <Button
                  onClick={handleUpgradePlan}
                  loading={loading || redirecting}
                  disabled={loading || redirecting}
                  className="w-full"
                  size="lg"
                >
                  <FiArrowRight className="h-5 w-5 mr-2" />
                  {redirecting ? 'Redirecting to Payment...' : `Upgrade to ${selectedPlan.name}`}
                </Button>
                
                {redirecting && (
                  <div className="mt-4 text-center">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <p className="text-blue-800">
                        Redirecting you to Stripe's secure payment page...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Error Message */}
        {paymentError && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto">
              <p className="text-red-800">{paymentError}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UpgradePlanPage;

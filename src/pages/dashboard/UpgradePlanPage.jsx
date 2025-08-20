import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiStar, FiZap, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { paymentAPI } from '../../api/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
// import StripePaymentForm from '../../components/ui/StripePaymentForm';
import PaymentForm from '../../components/PaymentForm';


const UpgradePlanPage = () => {
  const { profile } = useApp();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState(null);


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
      const response = await paymentAPI.upgradePlan(selectedPlan.id);
      const { client_secret } = response.data;
      
      setClientSecret(client_secret);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error upgrading plan:', error);
      setPaymentError('Failed to initiate plan upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setClientSecret(null);
    // Redirect to dashboard or show success message
    window.location.href = '/dashboard';
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setClientSecret(null);
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
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  <FiArrowRight className="h-5 w-5 mr-2" />
                  Upgrade to {selectedPlan.name}
                </Button>
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

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={handlePaymentCancel}
        title="Complete Your Payment"
        size="lg"
      >
        <div className="p-6">
          {clientSecret ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upgrade to {selectedPlan?.name}
                </h3>
                <p className="text-gray-600">
                  Complete your payment to unlock all features
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Plan:</span>
                  <span className="font-semibold">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Price:</span>
                  <span className="font-semibold">${selectedPlan?.price}/{selectedPlan?.period}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Billing Cycle:</span>
                  <span className="font-semibold">Monthly</span>
                </div>
              </div>

              {/* Stripe Payment Form */}
              {/* <StripePaymentForm
                clientSecret={clientSecret}
                plan={selectedPlan}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
                onError={(error) => setPaymentError(error)}
              /> */}

              

              <div className="text-center">
                <Button
                  onClick={handlePaymentCancel}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UpgradePlanPage;

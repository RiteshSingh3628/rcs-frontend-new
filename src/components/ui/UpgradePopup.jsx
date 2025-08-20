import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiZap, FiShield, FiX, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Button from './Button';

const UpgradePopup = ({ isOpen, onClose, paymentInfo }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

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
      icon: FiShield
    }
  ];

  const handleUpgrade = (planId) => {
    onClose();
    navigate('/dashboard/upgrade-plan');
  };

  const handleRepurchase = () => {
    onClose();
    // You can implement repurchase logic here or navigate to a repurchase page
    console.log('Repurchase clicked');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trial Period Ended</h2>
            <p className="text-gray-600 mt-1">
              Your trial has expired. Choose a plan to continue using our services.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Current Status */}
        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Current Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Plan:</span>
              <span className="ml-2 font-medium capitalize">{paymentInfo.plan}</span>
            </div>
            <div>
              <span className="text-gray-600">Reviews Used:</span>
              <span className="ml-2 font-medium">{paymentInfo.monthly_count}/{paymentInfo.limit}</span>
            </div>
            <div>
              <span className="text-gray-600">Remaining:</span>
              <span className="ml-2 font-medium">{paymentInfo.remaining}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-medium text-red-600">Expired</span>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Choose Your Plan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="relative">
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center p-4">
                  <div className="flex justify-center mb-3">
                    <plan.icon className="h-10 w-10 text-blue-600" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>

                  <ul className="space-y-2 mb-4 text-left text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    className="w-full"
                    size="sm"
                  >
                    Choose {plan.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleRepurchase}
              variant="outline"
              size="lg"
            >
              Repurchase Current Plan
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpgradePopup;

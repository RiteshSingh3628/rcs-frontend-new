import React, { createContext, useContext, useEffect, useState } from 'react';
import {reviewsAPI,userAPI} from '../api/api'
import {useAuth} from '../context/AuthContext'
const AppContext = createContext();

const initialState = {
  reviews: [],
  statistics: {
    totalReviews: 0,
    averageRating: 0,
    recommendationRate: 0,
  },
  profile: {
    name: '',
    businessName: '',
    url: '',
    email: '',
    phone: '',
  },
  billing: {
    currentPlan: '',
    paymentHistory: [],
    timeRemaining: '',
  },
  paymentInfo: {
    plan: '',
    monthly_count: 0,
    limit: 0,
    remaining: 0,
    limit_reached: false,
    plan_expired: false,
    trial: false,
    message: '',
  },
  loading: {
    reviews: false,
    statistics: false,
    profile: false,
    billing: false,
    paymentInfo: false,
  },
  errors: {},
  showUpgradePopup: false,
};

export const AppProvider = ({ children }) => {
  const [reviews, setReviews] = useState(initialState.reviews);
  const [statistics, setStatistics] = useState(initialState.statistics);
  const [profile, setProfile] = useState(initialState.profile);
  const [billing, setBilling] = useState(initialState.billing);
  const [paymentInfo, setPaymentInfo] = useState(initialState.paymentInfo);
  const [loading, setLoadingState] = useState(initialState.loading);
  const [errors, setErrors] = useState(initialState.errors);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);

  const {isAuthenticated} = useAuth()

  // Fetch payment info when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchPaymentInfo();
    }
  }, [isAuthenticated]);

  // Check if trial is finished and show upgrade popup
  useEffect(() => {
    if (paymentInfo.plan_expired && !paymentInfo.trial) {
      setShowUpgradePopup(true);
    }
  }, [paymentInfo]);

  const fetchPaymentInfo = async () => {
    setLoading('paymentInfo', true);
    try {
      const response = await userAPI.paymentInfo();
      setPaymentInfo(response.data);

      console.log("paymentInfo",response.data);
    } catch (error) {
      console.error('Error fetching payment info:', error);
      setError('paymentInfo', 'Failed to fetch payment information');
    } finally {
      setLoading('paymentInfo', false);
    }
  };

  const setLoading = (key, value) => {
    setLoadingState((prev) => ({ ...prev, [key]: value }));
  };

  const setError = (key, error) => {
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  const clearError = (key) => {
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const addReview = (review) => {
    setReviews((prev) => [review, ...prev]);
  };

  const updateReview = (updatedReview) => {
    setReviews((prev) =>
      prev.map((review) => (review.id === updatedReview.id ? updatedReview : review))
    );
  };

  const closeUpgradePopup = () => {
    setShowUpgradePopup(false);
  };

  const value = {
    reviews,
    statistics,
    profile,
    billing,
    paymentInfo,
    loading,
    errors,
    showUpgradePopup,
    setReviews,
    setStatistics,
    setProfile,
    setBilling,
    setPaymentInfo,
    setLoading,
    setError,
    clearError,
    addReview,
    updateReview,
    fetchPaymentInfo,
    closeUpgradePopup,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

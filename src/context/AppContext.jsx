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
  loading: {
    reviews: false,
    statistics: false,
    profile: false,
    billing: false,
  },
  errors: {},
};

export const AppProvider = ({ children }) => {
  const [reviews, setReviews] = useState(initialState.reviews);
  const [statistics, setStatistics] = useState(initialState.statistics);
  const [profile, setProfile] = useState(initialState.profile);
  const [billing, setBilling] = useState(initialState.billing);
  const [loading, setLoadingState] = useState(initialState.loading);
  const [errors, setErrors] = useState(initialState.errors);

  const {isAuthenticated} = useAuth()

  // useEffect(()=>{
  //   if(isAuthenticated){
  //     userProfile()
  //   }
  // },[isAuthenticated])

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

  // const userProfile = async()=>{
  //     const res = await userAPI.getProfile();
  //     console.log(res.data);
  // }



  const value = {
    reviews,
    statistics,
    profile,
    billing,
    loading,
    errors,
    setReviews,
    setStatistics,
    setProfile,
    setBilling,
    setLoading,
    setError,
    clearError,
    addReview,
    updateReview,
    
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

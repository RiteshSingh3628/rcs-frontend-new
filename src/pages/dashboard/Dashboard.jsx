import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiTrendingUp, FiUsers, FiMessageCircle, FiUpload } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { reviewsAPI,ordersAPI } from '../../api/api';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';


const Dashboard = () => {
  const { 
    reviews, 
    statistics, 
    loading, 
    setReviews, 
    setStatistics, 
    setLoading 
  } = useApp();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading('reviews', true);
    setLoading('statistics', true);
    
    try {
      const reviewsResponse = await reviewsAPI.getUserReviews();
      const reviewsData = reviewsResponse.data.reviews || [];
      console.log("the coming data for reviews",reviewsData)
      
      setReviews(reviewsData);
      
      // Calculate statistics from reviews
      const totalReviews = reviewsData.length;
      const averageRating = totalReviews > 0 
        ? reviewsData.reduce((sum, review) => sum + (review.main_rating), 0) / totalReviews 
        : 0;
      const recommendationRate = totalReviews > 0
        ? (reviewsData.filter(review => review.recommend === 'yes').length / totalReviews) * 100
        : 0;
      
      setStatistics({
        totalReviews,
        averageRating: averageRating.toFixed(1),
        recommendationRate: Math.round(recommendationRate),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading('reviews', false);
      setLoading('statistics', false);
    }
  };

  const statCards = [
    {
      title: 'Total Reviews',
      value: statistics.totalReviews,
      icon: FiMessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Average Rating',
      value: `${statistics.averageRating}/5`,
      icon: FiStar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Recommendation Rate',
      value: `${statistics.recommendationRate}%`,
      icon: FiTrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'This Month',
      value: reviews.filter(review => {
        const reviewDate = new Date(review.created_at);
        const currentMonth = new Date().getMonth();
        return reviewDate.getMonth() === currentMonth;
      }).length,
      icon: FiUsers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];


  const calculateOverallRating = (review) => {
    const ratings = [
      review.main_rating,
      review.logistics_rating,
      review.communication_rating,
      review.website_usability_rating
    ].filter(rating => rating !== undefined);
    
    return ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
  };

  const recentReviews = reviews.slice(0, 5);

  

  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    // Check if it's a CSV file
    if (!file.name.endsWith('.csv')) {
      throw new Error('Only CSV files are allowed');
    }

    // Check file size (100MB = 100 * 1024 * 1024 bytes)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size must be less than 100MB');
    }

    return true;
  };

  const handleFile = async (file) => {
    try {
      setUploadError("");
      validateFile(file);
      
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      console.log("uploading file formdata",formData)

      const response = await ordersAPI.uploadCSV(file);
      console.log("response for uploaded file",response);
      
      // await fetchDashboardData();
      
    } catch (error) {
      setUploadError(error.message || 'Error uploading file');
      console.error('Upload error:', error);
    } finally {
      setUploadLoading(false);
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  if (loading.statistics) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card hover>
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

    
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reviews</h2>
            <a
              href="/reviews"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View all
            </a>
          </div>
          
          {loading.reviews ? (
            <LoadingSpinner />
          ) : recentReviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Id
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overall Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recommends
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentReviews.map((review, index) => {
                    const overallRating = calculateOverallRating(review);
                    
                    return (
                      <motion.tr
                        key={review.order_id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {review.order_id || 'Anonymous'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(overallRating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-gray-600">
                              ({overallRating.toFixed(1)})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              review.recommend === 'yes'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {review.recommend === 'yes' ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(review.created_at).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiMessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500">
                Start collecting reviews by setting up your widget.
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/widget-settings"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-2">Setup Widget</h3>
              <p className="text-sm text-gray-600">Configure your review collection widget</p>
            </a>
            <a
              href="/statistics"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-2">View Analytics</h3>
              <p className="text-sm text-gray-600">Analyze your review performance</p>
            </a>
            <a
              href="/qr-code"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-2">Generate QR Code</h3>
              <p className="text-sm text-gray-600">Create QR codes for easy review collection</p>
            </a>
          </div>
        </Card>
      </motion.div>

      {/* CSV Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Orders</h2>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileInput}
            />

            {uploadLoading ? (
              <div className="flex flex-col items-center justify-center">
                <LoadingSpinner size="md" />
                <p className="mt-2 text-sm text-gray-600">Uploading file...</p>
              </div>
            ) : (
              <>
                <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag and drop your CSV file here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse (max 100MB)
                </p>
                <Button onClick={handleButtonClick} variant="outline">
                  Select File
                </Button>
                {uploadError && (
                  <p className="mt-4 text-sm text-red-600">{uploadError}</p>
                )}
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
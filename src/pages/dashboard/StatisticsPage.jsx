import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiStar, FiUsers, FiCalendar } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { FaStar, FaChartBar, FaChartPie, FaChartLine } from "react-icons/fa";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const StatisticsPage = () => {
  const { reviews, loading, statistics } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30");

  const tabs = [
    { id: "overview", label: "Overview", icon: FiTrendingUp },
    { id: "ratings", label: "Ratings", icon: FiStar },
    { id: "trends", label: "Trends", icon: FiCalendar },
    { id: "customers", label: "Customers", icon: FiUsers },
  ];


  
  // Calculate statistics
  const getFilteredReviews = () => {
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return reviews.filter(
      (review) => new Date(review.created_at) >= cutoffDate
    );
  };

  const filteredReviews = getFilteredReviews();

  const ratingDist = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: filteredReviews.filter(
      (review) => Math.floor(review.main_rating || 0) === rating
    ).length,
    percentage:
      filteredReviews.length > 0
        ? Math.round(
            (filteredReviews.filter(
              (review) => Math.floor(review.main_rating || 0) === rating
            ).length /
              filteredReviews.length) *
              100
          )
        : 0,
  }));

  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    name: `${rating} Star`,
    value: filteredReviews.filter(
      (review) => Math.floor(review.main_rating || 0) === rating
    ).length,
  }));

  // const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
  //   name: `${rating} Star`,
  //   value: reviews.filter((r) => r.main_rating === rating).length,
  // }));

  const monthlyData = () => {
    const months = {};
    filteredReviews.forEach((review) => {
      const month = new Date(review.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Reviews",
            value: statistics.totalReviews,
            icon: FiUsers,
            color: "blue",
          },
          {
            title: "Average Rating",
            value: `${statistics.averageRating}/5`,
            icon: FiStar,
            color: "yellow",
          },
          {
            title: "Recommendation Rate",
            value: `${statistics.recommendationRate}%`,
            icon: FiTrendingUp,
            color: "green",
          },
          // { title: 'Response Rate', value: `${statistics.responseRate}%`, icon: FiCalendar, color: 'purple' },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${metric.color}-50`}>
                  <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Distribution
          </h3>
          <div className="h-64">
            {" "}
            {/* Fixed height container */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratingDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {ratingDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    value,
                    `${name} (${((props.payload.percent || 0) * 100).toFixed(
                      1
                    )}%)`,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Distribution
          </h3>
          <div className="space-y-3">
            {ratingDist
              .reverse()
              .map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <FiStar className="h-4 w-4 text-yellow-400 ml-1" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm text-gray-600">
                      {count} ({percentage}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRatings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detailed Rating Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Logistics Rating", key: "logistics_rating" },
            { title: "Communication Rating", key: "communication_rating" },
            { title: "Website Usability", key: "website_usability_rating" },
            { title: "Main Rating", key: "main_rating" },
          ].map((category) => {
            const average =
              filteredReviews.length > 0
                ? (
                    filteredReviews.reduce(
                      (sum, review) => sum + (review[category.key] || 0),
                      0
                    ) / filteredReviews.length
                  ).toFixed(1)
                : 0;

            return (
              <div key={category.key} className="text-center">
                <h4 className="font-medium text-gray-900 mb-2">
                  {category.title}
                </h4>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {average}/5
                </div>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(average)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  const renderTrends = () => {
    // Enhanced monthly data processing
    const getMonthlyTrendData = () => {
      const monthData = {};
      
      filteredReviews.forEach((review) => {
        const date = new Date(review.created_at);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        if (!monthData[monthYear]) {
          monthData[monthYear] = {
            month: monthYear,
            reviews: 0,
            totalRating: 0,
            recommendations: 0
          };
        }
        
        monthData[monthYear].reviews++;
        monthData[monthYear].totalRating += review.main_rating;
        if (review.recommend === "yes") {
          monthData[monthYear].recommendations++;
        }
      });
  
      // Convert to array and calculate derived values
      return Object.values(monthData)
        .map(data => ({
          ...data,
          avgRating: (data.totalRating / data.reviews).toFixed(1),
          recommendationRate: Math.round((data.recommendations / data.reviews) * 100)
        }))
        .sort((a, b) => {
          // Sort chronologically
          const dateA = new Date(a.month);
          const dateB = new Date(b.month);
          return dateA - dateB;
        });
    };
  
    const monthlyTrendData = getMonthlyTrendData();
  
    return (
      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Review Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'Average Rating') return [`${value}/5`, name];
                    if (name === 'Recommendation Rate') return [`${value}%`, name];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="reviews"
                  name="Review Count"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgRating"
                  name="Average Rating"
                  stroke="#82ca9d"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="recommendationRate"
                  name="Recommendation Rate"
                  stroke="#ff7300"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
  
        {/* Data table for reference */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Data Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommend %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyTrendData.map((data) => (
                  <tr key={data.month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.reviews}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.avgRating}/5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.recommendationRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderCustomers = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Customer Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Top Reviewers</h4>
            <div className="space-y-2">
              {filteredReviews
                .filter((review) => review.customer_name)
                .slice(0, 5)
                .map((review, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{review.customer_name}</span>
                    <div className="flex items-center">
                      <FiStar className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Review Sources</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Direct Widget</span>
                <span className="font-medium">{filteredReviews.length}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>QR Code</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "ratings":
        return renderRatings();
      case "trends":
        return renderTrends();
      case "customers":
        return renderCustomers();
      default:
        return renderOverview();
    }
  };

  if (loading.reviews) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default StatisticsPage;

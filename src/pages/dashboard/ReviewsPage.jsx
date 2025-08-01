import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiMessageCircle,
  FiCalendar,
} from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { reviewsAPI } from "../../api/api";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
// import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ReviewsPage = () => {
  const { reviews, loading, setReviews, setLoading, updateReview } = useApp();
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyModal, setReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  useEffect(() => {
    // fetchReviews();
    if (reviews.length <= 0) {
      fetchReviews();
    }
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      applyFilters();
    }
  }, [reviews, filters]);

  const fetchReviews = async () => {
    setLoading("reviews", true);
    try {
      const response = await reviewsAPI.getUserReviews();
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading("reviews", false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reviews];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (review) =>
          review.customer_name
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          review.comment?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (review) => review.recommend === filters.status
      );
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (review) => new Date(review.created_at) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (review) => new Date(review.created_at) <= new Date(filters.dateTo)
      );
    }

    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReplySubmit = async () => {
    if (!selectedReview || !replyText.trim()) return;

    try {
      const response = await reviewsAPI.replyToNegativeReview(
        selectedReview.id,
        replyText
      );
      updateReview(response.data);
      setReplyModal(false);
      setReplyText("");
      setSelectedReview(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  // const reviewColumns = [
  //   {
  //     key: "customer_name",
  //     title: "Customer",
  //     render: (value) => value || "Anonymous",
  //   },
  //   {
  //     key: "rating",
  //     title: "Rating",
  //     render: (value, row) => (
  //       <div className="flex items-center">
  //         {[...Array(5)].map((_, i) => (
  //           <FiStar
  //             key={i}
  //             className={`h-4 w-4 ${
  //               i < (value || 0)
  //                 ? "text-yellow-400 fill-current"
  //                 : "text-gray-300"
  //             }`}
  //           />
  //         ))}
  //         <span className="ml-2 text-sm text-gray-600">
  //           (
  //           {row.logistics_rating +
  //             row.communication_rating +
  //             row.website_usability_rating}
  //           /15)
  //         </span>
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "recommend",
  //     title: "Recommends",
  //     render: (value) => (
  //       <span
  //         className={`px-2 py-1 rounded-full text-xs font-medium ${
  //           value === "yes"
  //             ? "bg-green-100 text-green-800"
  //             : "bg-red-100 text-red-800"
  //         }`}
  //       >
  //         {value === "yes" ? "Yes" : "No"}
  //       </span>
  //     ),
  //   },
  //   {
  //     key: "comment",
  //     title: "Comment",
  //     render: (value) => (
  //       <div className="max-w-xs truncate" title={value}>
  //         {value || "No comment"}
  //       </div>
  //     ),
  //   },
  //   {
  //     key: "created_at",
  //     title: "Date",
  //     render: (value) => new Date(value).toLocaleDateString(),
  //   },
  //   {
  //     key: "actions",
  //     title: "Actions",
  //     render: (_, row) => (
  //       <div className="flex space-x-2">
  //         <Button
  //           size="sm"
  //           variant="outline"
  //           onClick={() => setSelectedReview(row)}
  //         >
  //           View
  //         </Button>
  //         {row.recommend === "no" && !row.reply && (
  //           <Button
  //             size="sm"
  //             onClick={() => {
  //               setSelectedReview(row);
  //               setReplyModal(true);
  //             }}
  //           >
  //             Reply
  //           </Button>
  //         )}
  //       </div>
  //     ),
  //   },
  // ];

  // console.log("filtered reviews = ",reviews)
  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  if (loading.reviews) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const calculateOverallRating = (review) => {
    const ratings = [
      review.main_rating,
      review.logistics_rating,
      review.communication_rating,
      review.website_usability_rating,
    ].filter((rating) => rating !== undefined);

    return ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <div className="text-sm text-gray-500">
          {filteredReviews.length} of {reviews.length} reviews
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search reviews..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Reviews</option>
            <option value="yes">Positive</option>
            <option value="no">Negative</option>
          </select>

          <Input
            type="date"
            placeholder="From date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          />

          <Input
            type="date"
            placeholder="To date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          />
        </div>
      </Card>

      {/* Reviews Table */}
      <Card className="overflow-x-scroll">
        {/* <Table
          columns={reviewColumns}
          data={currentReviews}
          loading={loading.reviews}
        /> */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Overall Rating
              </th>
              <th className="px-6 py-3 max-w-sm text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
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
            {currentReviews.map((review, index) => {
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
                    <button
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   e.stopPropagation();
                      //   e.nativeEvent.stopImmediatePropagation(); // Add this line
                      //   console.log(
                      //     "Setting selected review:",
                      //     review.order_id
                      //   ); // Debug log
                      //   setSelectedReview(review);
                      //   setReplyModal(false);
                      // }}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                      type="button"
                    >
                      {review.order_id || "Anonymous"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(overallRating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-gray-600">
                        ({overallRating.toFixed(1)})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {review.comment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.recommend === "yes"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {review.recommend === "yes" ? "Yes" : "No"}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstReview + 1} to{" "}
              {Math.min(indexOfLastReview, filteredReviews.length)} of{" "}
              {filteredReviews.length} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Review Detail Modal */}
      <Modal
        isOpen={!!selectedReview && !replyModal}
        onClose={() => {
          setSelectedReview(false);
          setReplyModal(false);
        }}
        title="Review Details"
        size="lg"
      >
        {selectedReview && (
          <div className="space-y-6">
            {/* Order ID and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order ID
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedReview.order_id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedReview.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Ratings */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Main Rating
                </label>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < (selectedReview.main_rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({selectedReview.main_rating}/5)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logistics
                  </label>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedReview.logistics_rating}
                    </span>
                    <span className="text-sm text-gray-600">/5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Communication
                  </label>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedReview.communication_rating}
                    </span>
                    <span className="text-sm text-gray-600">/5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website Usability
                  </label>
                  <div className="flex items-center mt-1">
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedReview.website_usability_rating}
                    </span>
                    <span className="text-sm text-gray-600">/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recommends
              </label>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedReview.recommend === "yes"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedReview.recommend === "yes" ? "Yes" : "No"}
              </span>
            </div>

            {/* Comment */}
            {selectedReview.comment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Comment
                </label>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-900">
                  {selectedReview.comment}
                </div>
              </div>
            )}

            {/* Reply */}
            {selectedReview.reply ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply
                </label>
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-900">
                  {selectedReview.reply}
                </div>
              </div>
            ) : (
              selectedReview.recommend === "no" && (
                <Button
                  onClick={() => {
                    setReplyModal(true);
                  }}
                  className="w-full"
                >
                  Reply to Review
                </Button>
              )
            )}

            {/* Published Status */}
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-gray-600">Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedReview.is_published
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {selectedReview.is_published ? "Published" : "Unpublished"}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={replyModal}
        onClose={() => {
          setReplyModal(false);
          setReplyText("");
        }}
        title="Reply to Review"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Reply
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your professional response..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setReplyModal(false);
                setReplyText("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleReplySubmit} disabled={!replyText.trim()}>
              Send Reply
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReviewsPage;

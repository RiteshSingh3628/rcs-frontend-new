import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCreditCard, FiSave, FiPlus } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { userAPI } from '../../api/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {useNavigate} from 'react-router-dom'

const ProfilePage = () => {
  const { profile, billing, paymentInfo, loading, setProfile, setBilling, setLoading } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: '',
    businessName: '',
    url: '',
    email: '',
    phone: '',
  });


  const [upgradeModal, setUpgradeModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const tabs = [
    { id: 'profile', label: 'Profile Details', icon: FiUser },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
  ];

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Fetch payment info when component mounts
  useEffect(() => {
    if (profile) {
      // Payment info is already fetched in AppContext when user is authenticated
      // This ensures it's available when the profile page loads
    }
  }, [profile]);

  useEffect(() => {

    // setProfileForm(profile);
    if(profile){
      setProfileForm({
        name: `${profile.first_name} ${profile.last_name}`,
        businessName: profile.business_name || '',
        url: profile.website_url || '',
        email: profile.email || '',
        phone: profile.contact_number || '',
      });

      // console.log(profileForm)
    }
  }, [profile]);

  const fetchProfileData = async () => {
    setLoading('profile', true);
    setLoading('billing', true);

    try {

      const res = await userAPI.getProfile();
      setProfile(res.data)
      // console.log("profile data",res.data)
      
      // Use real payment info for billing display
      const billingData = {
        currentPlan: paymentInfo.plan || 'Trial',
        nextBilling: paymentInfo.trial ? 'Trial Period' : 'Monthly',
        timeRemaining: paymentInfo.trial ? 'Active' : paymentInfo.plan_expired ? 'Expired' : 'Active',
        paymentHistory: [
          // You can add real payment history here when available
        ],
      };
      setBilling(billingData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading('profile', false);
      setLoading('billing', false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(profileForm);
      // console.log(profileForm)
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  
  
  

  const renderProfileTab = () => (
    <Card>
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Input
            label="Full Name"
            name="name"
            value={profileForm.name}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Business Name"
            name="businessName"
            value={profileForm.businessName}
            onChange={handleInputChange}
            required
          />
        </div>

        <Input
          label="Website URL"
          name="url"
          type="url"
          value={profileForm.url}
          onChange={handleInputChange}
          placeholder="https://your-website.com"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={profileForm.email}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={profileForm.phone}
            onChange={handleInputChange}
          />
        </div>

        {/* <div className="flex justify-end">
          <Button
            type="submit"
            loading={saving}
            disabled={saving}
          >
            <FiSave className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div> */}
      </form>
    </Card>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
          <div className="flex gap-2">
            <Button
              onClick={fetchProfileData}
              variant="outline"
              size="sm"
              loading={loading.billing}
              disabled={loading.billing}
            >
              Refresh
            </Button>
            <Button
              onClick={() => navigate('/upgrade-plan')}
              className="flex items-center"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Plan</h4>
            <p className="text-2xl font-bold text-blue-600 capitalize">{paymentInfo.plan || 'Trial'}</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Reviews Used</h4>
            <p className="text-lg font-medium text-green-600">{paymentInfo.monthly_count}/{paymentInfo.limit}</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">Remaining</h4>
            <p className="text-lg font-medium text-orange-600">{paymentInfo.remaining}</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            paymentInfo.trial 
              ? 'bg-yellow-100 text-yellow-800' 
              : paymentInfo.plan_expired 
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
          }`}>
            {paymentInfo.trial 
              ? 'Trial Active' 
              : paymentInfo.plan_expired 
                ? 'Plan Expired'
                : 'Plan Active'
            }
          </div>
          <p className="text-sm text-gray-600 mt-2">{paymentInfo.message}</p>
        </div>
      </Card>

      {/* Payment History */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment History</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billing.paymentHistory?.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  if (loading.profile || loading.billing || loading.paymentInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
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
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        {activeTab === 'profile' ? renderProfileTab() : renderBillingTab()}
      </motion.div>

      {/* Upgrade Modal */}
      
    </div>
  );
};

export default ProfilePage;
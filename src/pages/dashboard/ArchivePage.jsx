import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArchive, FiSearch, FiFilter, FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';

const ArchivePage = () => {
  const [archivedItems, setArchivedItems] = useState([
    {
      id: 1,
      type: 'review',
      customer_name: 'John Smith',
      content: 'Great service, very satisfied!',
      archived_date: '2025-01-10',
      original_date: '2024-12-15',
      reason: 'Customer request',
    },
    {
      id: 2,
      type: 'review',
      customer_name: 'Sarah Johnson',
      content: 'Could be better, had some issues.',
      archived_date: '2025-01-08',
      original_date: '2024-12-10',
      reason: 'Inappropriate content',
    },
    {
      id: 3,
      type: 'widget',
      name: 'Holiday Widget 2024',
      content: 'Special holiday-themed review widget',
      archived_date: '2025-01-05',
      original_date: '2024-11-20',
      reason: 'Seasonal campaign ended',
    },
  ]);

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [restoreModal, setRestoreModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredItems = archivedItems.filter(item => {
    const matchesSearch = !filters.search || 
      item.customer_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.content?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = filters.type === 'all' || item.type === filters.type;
    
    const matchesDateFrom = !filters.dateFrom || 
      new Date(item.archived_date) >= new Date(filters.dateFrom);
    
    const matchesDateTo = !filters.dateTo || 
      new Date(item.archived_date) <= new Date(filters.dateTo);
    
    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
  });

  const handleRestore = (item) => {
    setSelectedItem(item);
    setRestoreModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  const confirmRestore = () => {
    if (selectedItem) {
      setArchivedItems(prev => prev.filter(item => item.id !== selectedItem.id));
      setRestoreModal(false);
      setSelectedItem(null);
      // In a real app, you would make an API call to restore the item
    }
  };

  const confirmDelete = () => {
    if (selectedItem) {
      setArchivedItems(prev => prev.filter(item => item.id !== selectedItem.id));
      setDeleteModal(false);
      setSelectedItem(null);
      // In a real app, you would make an API call to permanently delete the item
    }
  };

  const columns = [
    {
      key: 'type',
      title: 'Type',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'review' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-purple-100 text-purple-800'
        }`}>
          {value === 'review' ? 'Review' : 'Widget'}
        </span>
      ),
    },
    {
      key: 'customer_name',
      title: 'Name/Title',
      render: (value, row) => row.customer_name || row.name || 'N/A',
    },
    {
      key: 'content',
      title: 'Content',
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: 'original_date',
      title: 'Original Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'archived_date',
      title: 'Archived Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'reason',
      title: 'Reason',
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRestore(row)}
            className="text-green-600 hover:text-green-700"
          >
            <FiRotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-700"
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Archive</h1>
        <div className="text-sm text-gray-500">
          {filteredItems.length} archived items
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search archived items..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="review">Reviews</option>
            <option value="widget">Widgets</option>
          </select>

          <Input
            type="date"
            placeholder="From date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />

          <Input
            type="date"
            placeholder="To date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </div>
      </Card>

      {/* Archive Table */}
      <Card>
        {filteredItems.length > 0 ? (
          <Table
            columns={columns}
            data={filteredItems}
          />
        ) : (
          <div className="text-center py-12">
            <FiArchive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No archived items</h3>
            <p className="text-gray-500">
              {filters.search || filters.type !== 'all' || filters.dateFrom || filters.dateTo
                ? 'No items match your current filters.'
                : 'Items you archive will appear here.'}
            </p>
          </div>
        )}
      </Card>

      {/* Archive Info */}
      <Card>
        <div className="flex items-start space-x-3">
          <FiArchive className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About Archive</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                The archive contains items that have been removed from your active data but are kept for reference.
              </p>
              <p>
                <strong>Restore:</strong> Move items back to their original location.
              </p>
              <p>
                <strong>Delete:</strong> Permanently remove items from the archive (this action cannot be undone).
              </p>
              <p className="text-amber-600">
                <strong>Note:</strong> Archived items are automatically deleted after 90 days.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Restore Modal */}
      <Modal
        isOpen={restoreModal}
        onClose={() => setRestoreModal(false)}
        title="Restore Item"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to restore this item? It will be moved back to its original location.
          </p>
          
          {selectedItem && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">
                {selectedItem.customer_name || selectedItem.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedItem.content}
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setRestoreModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRestore}
              className="bg-green-600 hover:bg-green-700"
            >
              <FiRotateCcw className="h-4 w-4 mr-2" />
              Restore
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Item Permanently"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to permanently delete this item? This action cannot be undone.
          </p>
          
          {selectedItem && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="font-medium text-gray-900">
                {selectedItem.customer_name || selectedItem.name}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedItem.content}
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="danger"
            >
              <FiTrash2 className="h-4 w-4 mr-2" />
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ArchivePage;
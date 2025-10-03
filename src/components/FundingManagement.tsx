import React, { useState } from 'react';
import { Edit3, Trash2, Search, Filter, MoreVertical, FileText, Download } from 'lucide-react';
import { Funding } from '../types/expense';
import { formatCurrency, formatDate } from '../utils/dateUtils';

interface FundingManagementProps {
  funding: Funding[];
  onEditFunding: (funding: Funding) => void;
  onDeleteFunding: (fundingId: string) => void;
}

const FundingManagement: React.FC<FundingManagementProps> = ({
  funding,
  onEditFunding,
  onDeleteFunding
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredFunding = funding
    .filter(fund => 
      fund.funderName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === '' || 
        (filterType === 'repayable' && fund.isRepayable) ||
        (filterType === 'non-repayable' && !fund.isRepayable))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'funder':
          return a.funderName.localeCompare(b.funderName);
        default:
          return 0;
      }
    });

  const handleDeleteClick = (funding: Funding) => {
    if (window.confirm(`Are you sure you want to delete funding from "${funding.funderName}"? This action cannot be undone.`)) {
      onDeleteFunding(funding.id);
    }
  };

  const downloadAttachment = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding Management</h2>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search funding..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="">All Types</option>
              <option value="repayable">Repayable</option>
              <option value="non-repayable">Non-Repayable</option>
            </select>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="funder">Sort by Funder</option>
          </select>
        </div>

        {/* Funding Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Funder</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Documents</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFunding.map((fund) => (
                <tr key={fund.id} className="border-b border-gray-100 hover:bg-pink-25 transition-colors">
                  <td className="py-4 px-4 text-gray-900">{formatDate(fund.receivedDate)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{fund.funderName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900">{formatCurrency(fund.amount)}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      fund.isRepayable 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {fund.isRepayable ? 'Repayable' : 'Grant'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {fund.isRepayable ? (
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          fund.isPaid 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {fund.isPaid ? 'Repaid' : 'Pending'}
                        </span>
                        {fund.repaymentDate && (
                          <p className="text-xs text-gray-500 mt-1">Due: {formatDate(fund.repaymentDate)}</p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {fund.attachments && fund.attachments.length > 0 ? (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{fund.attachments.length} file(s)</span>
                        <div className="flex space-x-1">
                          {fund.attachments.map((attachment) => (
                            <button
                              key={attachment.id}
                              onClick={() => downloadAttachment(attachment)}
                              className="p-1 text-gray-400 hover:text-[#FE4066] transition-colors"
                              title={`Download ${attachment.name}`}
                            >
                              <Download className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No documents</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditFunding(fund)}
                        className="p-2 text-gray-400 hover:text-[#FE4066] hover:bg-pink-50 rounded-lg transition-all"
                        title="Edit funding"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(fund)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete funding"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredFunding.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MoreVertical className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No funding records found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-pink-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Funding</p>
              <p className="text-xl font-bold text-gray-900">{filteredFunding.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(filteredFunding.reduce((sum, fund) => sum + fund.amount, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Repayments</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(filteredFunding.filter(f => f.isRepayable && !f.isPaid).reduce((sum, fund) => sum + fund.amount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingManagement;
import React, { useState, useRef } from 'react';
import { Search, Plus, FileText, Calendar, CheckCircle, XCircle, Printer, Filter, Download, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';

const PermitSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [permits, setPermits] = useState([
    {
      id: 'SP-2024-001',
      businessName: 'Tibiao Bakery',
      ownerName: 'Juan Dela Cruz',
      businessType: 'Food Establishment',
      address: 'Barangay Poblacion, Tibiao',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'Active',
      contactNumber: '09123456789',
      lastInspection: '2024-01-10'
    },
    {
      id: 'SP-2024-002',
      businessName: 'Sari-Sari Store Ni Aling Rosa',
      ownerName: 'Rosa Santos',
      businessType: 'Non-Food Establishment',
      address: 'Barangay Tina, Tibiao',
      issueDate: '2024-02-20',
      expiryDate: '2025-02-20',
      status: 'Active',
      contactNumber: '09187654321',
      lastInspection: '2024-02-15'
    },
    {
      id: 'SP-2023-045',
      businessName: 'Carinderia Tibiao',
      ownerName: 'Maria Garcia',
      businessType: 'Food Establishment',
      address: 'Barangay Malacañang, Tibiao',
      issueDate: '2023-12-10',
      expiryDate: '2024-12-10',
      status: 'Expiring Soon',
      contactNumber: '09198765432',
      lastInspection: '2023-12-05'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showNewPermitModal, setShowNewPermitModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const printRef = useRef();

  const [newPermit, setNewPermit] = useState({
    businessName: '',
    ownerName: '',
    businessType: 'Food Establishment',
    address: '',
    contactNumber: '',
    inspectionDate: ''
  });

  const filteredPermits = permits.filter(permit => {
    const matchesSearch = permit.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || permit.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: permits.length,
    active: permits.filter(p => p.status === 'Active').length,
    expiring: permits.filter(p => p.status === 'Expiring Soon').length,
    expired: permits.filter(p => p.status === 'Expired').length
  };

  const handleNewPermit = () => {
    const today = new Date();
    const expiry = new Date(today);
    expiry.setFullYear(expiry.getFullYear() + 1);

    const newId = `SP-${today.getFullYear()}-${String(permits.length + 1).padStart(3, '0')}`;

    const permit = {
      id: newId,
      ...newPermit,
      issueDate: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      status: 'Active',
      lastInspection: newPermit.inspectionDate
    };

    setPermits([...permits, permit]);
    setShowNewPermitModal(false);
    setNewPermit({
      businessName: '',
      ownerName: '',
      businessType: 'Food Establishment',
      address: '',
      contactNumber: '',
      inspectionDate: ''
    });
  };

  const handleRenewal = (permit) => {
    setSelectedPermit(permit);
    setShowRenewalModal(true);
  };

  const confirmRenewal = () => {
    const today = new Date();
    const expiry = new Date(today);
    expiry.setFullYear(expiry.getFullYear() + 1);

    const updatedPermits = permits.map(p =>
      p.id === selectedPermit.id
        ? {
            ...p,
            issueDate: today.toISOString().split('T')[0],
            expiryDate: expiry.toISOString().split('T')[0],
            status: 'Active',
            lastInspection: today.toISOString().split('T')[0]
          }
        : p
    );

    setPermits(updatedPermits);
    setShowRenewalModal(false);
    setSelectedPermit(null);
  };

  const handlePrint = (permit) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Sanitary Permit - ${permit.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #1e40af;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1e40af;
              margin: 10px 0;
              font-size: 24px;
            }
            .header h2 {
              color: #2563eb;
              margin: 5px 0;
              font-size: 18px;
            }
            .permit-id {
              font-size: 20px;
              font-weight: bold;
              color: #1e40af;
              text-align: center;
              margin: 20px 0;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 20px 0;
            }
            .info-item {
              padding: 10px;
              border-left: 3px solid #3b82f6;
              background: #eff6ff;
            }
            .info-label {
              font-weight: bold;
              color: #1e40af;
              font-size: 12px;
              margin-bottom: 5px;
            }
            .info-value {
              color: #1f2937;
              font-size: 14px;
            }
            .footer {
              margin-top: 40px;
              border-top: 2px solid #1e40af;
              padding-top: 20px;
              text-align: center;
            }
            .signature-section {
              display: flex;
              justify-content: space-around;
              margin-top: 60px;
            }
            .signature-box {
              text-align: center;
              width: 200px;
            }
            .signature-line {
              border-bottom: 2px solid #000;
              margin-bottom: 5px;
              height: 40px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Republic of the Philippines</h2>
            <h1>RURAL HEALTH UNIT</h1>
            <h2>Municipality of Tibiao, Antique</h2>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <h2 style="color: #1e40af;">SANITARY PERMIT</h2>
          </div>

          <div class="permit-id">Permit No: ${permit.id}</div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">BUSINESS NAME</div>
              <div class="info-value">${permit.businessName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">OWNER NAME</div>
              <div class="info-value">${permit.ownerName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">BUSINESS TYPE</div>
              <div class="info-value">${permit.businessType}</div>
            </div>
            <div class="info-item">
              <div class="info-label">CONTACT NUMBER</div>
              <div class="info-value">${permit.contactNumber}</div>
            </div>
            <div class="info-item" style="grid-column: 1 / -1;">
              <div class="info-label">BUSINESS ADDRESS</div>
              <div class="info-value">${permit.address}</div>
            </div>
            <div class="info-item">
              <div class="info-label">DATE ISSUED</div>
              <div class="info-value">${new Date(permit.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="info-item">
              <div class="info-label">VALID UNTIL</div>
              <div class="info-value">${new Date(permit.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div style="margin: 30px 0; padding: 15px; background: #eff6ff; border-left: 4px solid #2563eb;">
            <p style="margin: 0; color: #1f2937; font-size: 14px;">
              This is to certify that the above-mentioned establishment has been inspected and found to be in
              compliance with the minimum sanitation requirements as prescribed by the Philippine Sanitation Code
              (Presidential Decree No. 856) and Local Ordinances of the Municipality of Tibiao.
            </p>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div style="font-weight: bold;">Sanitary Inspector</div>
              <div style="font-size: 12px; color: #6b7280;">Rural Health Unit</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div style="font-weight: bold;">Municipal Health Officer</div>
              <div style="font-size: 12px; color: #6b7280;">Tibiao, Antique</div>
            </div>
          </div>

          <div class="footer">
            <p style="font-size: 12px; color: #6b7280; margin: 5px 0;">
              This permit must be posted in a conspicuous place within the establishment.
            </p>
            <p style="font-size: 12px; color: #6b7280; margin: 5px 0;">
              Last Inspection: ${new Date(permit.lastInspection).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">RHU Smart Sanitary Permit System</h1>
              <p className="text-blue-100 mt-1">Municipality of Tibiao, Antique</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Rural Health Sanitary Inspector</p>
                <p className="font-semibold">Admin User</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {['dashboard', 'permits', 'reports'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Permits</p>
                    <p className="text-3xl font-bold text-blue-700 mt-2">{stats.total}</p>
                  </div>
                  <FileText className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Permits</p>
                    <p className="text-3xl font-bold text-green-700 mt-2">{stats.active}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Expiring Soon</p>
                    <p className="text-3xl font-bold text-yellow-700 mt-2">{stats.expiring}</p>
                  </div>
                  <Calendar className="w-12 h-12 text-yellow-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Expired</p>
                    <p className="text-3xl font-bold text-red-700 mt-2">{stats.expired}</p>
                  </div>
                  <XCircle className="w-12 h-12 text-red-600 opacity-20" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowNewPermitModal(true)}
                  className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-semibold">Issue New Permit</p>
                    <p className="text-sm text-blue-100">Create new sanitary permit</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('permits')}
                  className="flex items-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <RefreshCw className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-semibold">Renew Permits</p>
                    <p className="text-sm text-green-100">Process permit renewals</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Permits */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Permits</h2>
              <div className="space-y-3">
                {permits.slice(0, 5).map(permit => (
                  <div key={permit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{permit.businessName}</p>
                      <p className="text-sm text-gray-600">{permit.id} • {permit.ownerName}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-600">Expires: {permit.expiryDate}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        permit.status === 'Active' ? 'bg-green-100 text-green-700' :
                        permit.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {permit.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePrint(permit)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Permits View */}
        {activeTab === 'permits' && (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by business name, owner, or permit ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>Expiring Soon</option>
                    <option>Expired</option>
                  </select>

                  <button
                    onClick={() => setShowNewPermitModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    New Permit
                  </button>
                </div>
              </div>
            </div>

            {/* Permits Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Permit ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Business Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Owner</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Expiry Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPermits.map(permit => (
                      <tr key={permit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-700">{permit.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{permit.businessName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{permit.ownerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{permit.businessType}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{permit.expiryDate}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            permit.status === 'Active' ? 'bg-green-100 text-green-700' :
                            permit.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {permit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePrint(permit)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Print"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRenewal(permit)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              title="Renew"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports View */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics & Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4">Business Type Distribution</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Food Establishments</span>
                      <span className="font-medium text-blue-700">67%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '67%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Non-Food Establishments</span>
                      <span className="font-medium text-blue-700">33%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '33%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-4">Compliance Rate</h3>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-700">92%</div>
                    <p className="text-sm text-gray-600 mt-2">Active & Compliant</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Export Full Report (PDF)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Permit Modal */}
      {showNewPermitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-blue-700 text-white rounded-t-lg">
              <h2 className="text-2xl font-bold">Issue New Sanitary Permit</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                <input
                  type="text"
                  value={newPermit.businessName}
                  onChange={(e) => setNewPermit({...newPermit, businessName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
                <input
                  type="text"
                  value={newPermit.ownerName}
                  onChange={(e) => setNewPermit({...newPermit, ownerName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter owner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                <select
                  value={newPermit.businessType}
                  onChange={(e) => setNewPermit({...newPermit, businessType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Food Establishment</option>
                  <option>Non-Food Establishment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={newPermit.address}
                  onChange={(e) => setNewPermit({...newPermit, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2

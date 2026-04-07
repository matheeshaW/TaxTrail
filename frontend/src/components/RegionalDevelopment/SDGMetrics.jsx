import  { useState } from 'react';

const SDGMetrics = ({ regions = [], sdgMetrics, loading, onFetchMetrics }) => {
  const [selectedRegion, setSelectedRegion] = useState('');

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    if (regionId) {
      onFetchMetrics(regionId);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Local SDG 10 Status</h2>
          <p className="text-sm text-gray-500 mt-1">Select a province to view specific inequality metrics.</p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 font-medium text-gray-700"
          >
            <option value="">-- Choose a Region --</option>
            {regions.map((r) => (
              <option key={r._id} value={r._id}>{r.regionName}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && !selectedRegion && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-12 text-center">
          <p className="text-blue-800 font-medium">Please select a region above to view its SDG metrics.</p>
        </div>
      )}

      
      {!loading && selectedRegion && sdgMetrics && (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* Analysis Banner (From your Backend Logic) */}
          {sdgMetrics.analysis && (
             <div className={`p-3 rounded-md text-sm font-semibold border ${
               sdgMetrics.analysis.status === 'EXCELLENT' 
               ? 'bg-green-100 border-green-200 text-green-800' 
               : 'bg-red-100 border-red-200 text-red-800'
             }`}>
               {sdgMetrics.analysis.status}: {sdgMetrics.analysis.recommendation}
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Poverty Rate */}
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <p className="text-sm font-medium text-red-600 mb-1">Poverty Rate</p>
              <h3 className="text-2xl font-bold text-red-900">{sdgMetrics.povertyRate}%</h3>
              <p className="text-xs text-red-500 mt-2">Target: &lt; 5%</p>
            </div>

            {/* Unemployment */}
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-600 mb-1">Unemployment</p>
              <h3 className="text-2xl font-bold text-orange-900">{sdgMetrics.unemploymentRate}%</h3>
              <p className="text-xs text-orange-500 mt-2">Target: &lt; 4%</p>
            </div>

            {/* Average Income */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <p className="text-sm font-medium text-emerald-600 mb-1">Avg. Monthly Income</p>
              <h3 className="text-2xl font-bold text-emerald-900">
                Rs. {sdgMetrics.averageIncome?.toLocaleString()}
              </h3>
              <p className="text-xs text-emerald-500 mt-2">Per household</p>
            </div>

            {/* Services Index */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-600 mb-1">Services Index</p>
              <h3 className="text-2xl font-bold text-blue-900">{sdgMetrics.accessToServicesIndex}/100</h3>
              <p className="text-xs text-blue-500 mt-2">Healthcare & Education</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SDGMetrics;
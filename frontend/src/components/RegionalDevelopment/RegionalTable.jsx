import React from 'react';

const RegionalTable = ({ data, onEdit, onDelete, userRole }) => {
  //  Role-Based UI
  const isAdmin = userRole === 'Admin'; 

  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">No regional data available yet.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-200">
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Region</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Income (LKR)</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unemployment</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Poverty Rate</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Services Index</th>
            
            {/* Only show the Actions column header if the user is an Admin */}
            {isAdmin && <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-4 text-sm text-gray-900 font-medium">{row.region?.regionName || 'Unknown'}</td>
              <td className="px-5 py-4 text-sm text-gray-600">{row.year}</td>
              <td className="px-5 py-4 text-sm text-gray-600">Rs. {row.averageIncome?.toLocaleString()}</td>
              <td className="px-5 py-4 text-sm text-gray-600">{row.unemploymentRate}%</td>
              <td className="px-5 py-4 text-sm text-gray-600">{row.povertyRate}%</td>
              <td className="px-5 py-4 text-sm">
                {/* Dynamic styling based on the score! */}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.accessToServicesIndex >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {row.accessToServicesIndex}
                </span>
              </td>
              
              {/* Only show the Edit/Delete buttons if the user is an Admin */}
              {isAdmin && (
                <td className="px-5 py-4 text-sm font-medium">
                  <button 
                    onClick={() => onEdit(row)} 
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(row._id)} 
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegionalTable;
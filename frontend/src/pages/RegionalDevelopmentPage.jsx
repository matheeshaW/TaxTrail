import React, { useState, useEffect, useCallback } from 'react';
import useRegionalDevelopment from '../hooks/useRegionalDevelopment';
import api from '../services/api'; // Import the shared axios instance

// UI Components
import RegionalFilters from '../components/RegionalDevelopment/RegionalFilters';
import RegionalTable from '../components/RegionalDevelopment/RegionalTable';
import RegionalForm from '../components/RegionalDevelopment/RegionalForm';
import InequalityIndex from '../components/RegionalDevelopment/InequalityIndex';
import SDGMetrics from '../components/RegionalDevelopment/SDGMetrics';

const RegionalDevelopmentPage = () => {
  const userRole = 'Admin'; 

  const {
    data,
    inequalityData,
    sdgMetrics,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    fetchInequalityIndex,
    fetchSDGMetrics
  } = useRegionalDevelopment();

 
  const [regions, setRegions] = useState([]);
  const [filters, setFilters] = useState({ region: '', year: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);


  const fetchRegions = useCallback(async () => {
    try {
      const response = await api.get('/v1/regions');
      setRegions(response.data.data || response.data); 
    } catch (err) {
      console.error("Could not load regions from database", err);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
    fetchAll(filters);
    fetchInequalityIndex();
  }, [fetchRegions, fetchAll, fetchInequalityIndex, filters]);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await remove(id);
      fetchAll(filters); 
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingRecord) {
        await update(editingRecord._id, formData);
      } else {
        await create(formData);
      }
      setShowForm(false);
      setEditingRecord(null);
      fetchAll(filters);
      fetchInequalityIndex();
    } catch (err) {
      console.error("Form submission failed", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Regional Development</h1>
          <p className="text-gray-500 mt-1">Track SDG 10 progress and regional economic health.</p>
        </div>
        {userRole === 'Admin' && !showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            + Add New Record
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {showForm ? (
        <div className="max-w-3xl mx-auto">
          <RegionalForm 
            initialData={editingRecord}
            regions={regions} 
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingRecord(null);
            }}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InequalityIndex data={inequalityData} loading={loading} />
            <SDGMetrics 
              regions={regions} 
              sdgMetrics={sdgMetrics} 
              loading={loading} 
              onFetchMetrics={fetchSDGMetrics} 
            />
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Provincial Data Records</h2>
            <RegionalFilters 
              filters={filters} 
              onFilterChange={setFilters} 
              regions={regions} 
            />
            {loading && data.length === 0 ? (
               <div className="text-center py-10 text-gray-500">Loading data...</div>
            ) : (
              <RegionalTable 
                data={data} 
                userRole={userRole} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RegionalDevelopmentPage;
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';

const InequalityIndex = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Fallback if the data hasn't loaded or is empty
  if (!data || !data.regionalData || data.regionalData.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex justify-center items-center h-96">
        <p className="text-gray-500 font-medium">No inequality data available to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">SDG 10: Inequality Index Analysis</h2>
        <p className="text-sm text-gray-500 mt-1">
          Comparing local provincial poverty rates against the World Bank Global Benchmark 
          <span className="font-semibold text-red-500 ml-1">({data.globalBenchmark}%)</span>.
        </p>
      </div>

      {/* Recharts Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.regionalData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="regionName" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {/* The Local Data Bars */}
            <Bar 
              name="Local Poverty Rate (%)" 
              dataKey="localPovertyRate" 
              fill="#4f46e5" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
            />
            
            <ReferenceLine 
              y={data.globalBenchmark} 
              stroke="#ef4444" 
              strokeDasharray="4 4" 
              strokeWidth={2}
              label={{ position: 'top', value: 'Global Poverty Standard', fill: '#ef4444', fontSize: 12, fontWeight: 600 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InequalityIndex;
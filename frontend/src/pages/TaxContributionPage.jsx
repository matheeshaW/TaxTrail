import { useEffect } from "react";
import useTaxContribution from "../hooks/useTaxContribution";
import LoadingSpinner from "../components/Common/LoadingSpinner";

export default function TaxContributionPage() {
  const {
    data,
    loading,
    error,
    fetchAll,
  } = useTaxContribution();

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tax Contributions
      </h1>

      <div className="bg-white p-4 rounded shadow">
        {data.length === 0 ? (
          <p>No data found</p>
        ) : (
          <ul>
            {data.map((item) => (
              <li key={item._id} className="border-b py-2">
                {item.taxType} - {item.amount} ({item.year})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
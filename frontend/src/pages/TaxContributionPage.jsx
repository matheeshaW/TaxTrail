import { useEffect } from "react";
import useTaxContribution from "../hooks/useTaxContribution";

import TaxFilters from "../components/TaxContribution/TaxFilters";
import TaxTable from "../components/TaxContribution/TaxTable";
import Pagination from "../components/Common/Pagination";
import LoadingSpinner from "../components/Common/LoadingSpinner";

export default function TaxContributionPage() {
  const {
    data,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    fetchAll,
  } = useTaxContribution();

  useEffect(() => {
    fetchAll();
  }, [pagination.page]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Tax Contributions
      </h1>

      <TaxFilters
        filters={filters}
        setFilters={setFilters}
        onApply={fetchAll}
      />

      <TaxTable data={data} />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={(page) =>
          setPagination({ ...pagination, page })
        }
      />
    </div>
  );
}
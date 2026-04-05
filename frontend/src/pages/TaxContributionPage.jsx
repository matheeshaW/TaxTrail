import { useEffect } from "react";
import { useState } from "react";
import useTaxContribution from "../hooks/useTaxContribution";

import TaxFilters from "../components/TaxContribution/TaxFilters";
import TaxTable from "../components/TaxContribution/TaxTable";
import Pagination from "../components/Common/Pagination";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import TaxSummaryChart from "../components/TaxContribution/TaxSummaryChart";

import TaxForm from "../components/TaxContribution/TaxForm";
import useAuth from "../hooks/useAuth";

export default function TaxContributionPage() {
    const {
        data,
        summary,
        summaryError,
        loading,
        error,
        filters,
        setFilters,
        pagination,
        setPagination,
        fetchAll,
        fetchSummary,
        create,
        update,
        remove,
    } = useTaxContribution();

    const [selected, setSelected] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        fetchAll();
    }, [pagination.page]);

    useEffect(() => {
        fetchSummary().catch(() => {});
    }, [fetchSummary]);

    const refreshSummarySafely = async () => {
        try {
            await fetchSummary();
        } catch {
            // summaryError state is already set by the hook
        }
    };

    const handleApplyFilters = async () => {
        if (pagination.page !== 1) {
            setPagination((prev) => ({ ...prev, page: 1 }));
            return;
        }

        await fetchAll();
    };

    const handleCreate = async (data) => {
        await create(data);
        await refreshSummarySafely();
        setShowForm(false);
    };

    const handleUpdate = async (data) => {
        await update(selected._id, data);
        await refreshSummarySafely();
        setSelected(null);
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            await remove(id);
            await refreshSummarySafely();
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>

            <h1 className="text-2xl font-bold mb-4">
                Tax Contributions
            </h1>

            <TaxFilters
                filters={filters}
                setFilters={setFilters}
                onApply={handleApplyFilters}
            />

            {user?.role === "Admin" && (
                <button
                    onClick={() => {
                        setSelected(null);
                        setShowForm(true);
                    }}
                    className="mb-4 rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
                >
                    Add Tax
                </button>
            )}

            {showForm && (
                <TaxForm
                    onSubmit={selected ? handleUpdate : handleCreate}
                    initialData={selected || {}}
                    onClose={() => {
                        setShowForm(false);
                        setSelected(null);
                    }}
                />
            )}

            <TaxTable
                data={data}
                onEdit={(item) => {
                    setSelected(item);
                    setShowForm(true);
                }}
                onDelete={handleDelete}
            />

            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) =>
                    setPagination({ ...pagination, page })
                }
            />

            {summaryError && (
                <div className="mt-4 rounded border border-amber-300 bg-amber-50 p-3 text-amber-800">
                    <p>{summaryError}</p>
                    <button
                        type="button"
                        onClick={refreshSummarySafely}
                        className="mt-2 rounded bg-amber-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-amber-700"
                    >
                        Retry Summary
                    </button>
                </div>
            )}

            <TaxSummaryChart data={summary} />
        </div>
    );
}
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
        fetchSummary();
    }, [fetchSummary]);

    const handleApplyFilters = async () => {
        if (pagination.page !== 1) {
            setPagination((prev) => ({ ...prev, page: 1 }));
            return;
        }

        await fetchAll();
    };

    const handleCreate = async (data) => {
        await create(data);
        await fetchSummary();
        setShowForm(false);
    };

    const handleUpdate = async (data) => {
        await update(selected._id, data);
        await fetchSummary();
        setSelected(null);
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            await remove(id);
            await fetchSummary();
        }
    };

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
            <TaxSummaryChart data={summary} />
        </div>
    );
}
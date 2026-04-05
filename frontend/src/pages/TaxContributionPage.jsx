import { useEffect } from "react";
import { useState } from "react";
import useTaxContribution from "../hooks/useTaxContribution";

import TaxFilters from "../components/TaxContribution/TaxFilters";
import TaxTable from "../components/TaxContribution/TaxTable";
import Pagination from "../components/Common/Pagination";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import TaxSummaryChart from "../components/TaxContribution/TaxSummaryChart";
import ConfirmModal from "../components/Common/ConfirmModal";
import ErrorAlert from "../components/Common/ErrorAlert";

import TaxForm from "../components/TaxContribution/TaxForm";
import useAuth from "../hooks/useAuth";

export default function TaxContributionPage() {
    const {
        data,
        summary,
        summaryError,
        loading,
        error,
        clearError,
        clearSummaryError,
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
    const [deleteId, setDeleteId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            await remove(deleteId);
            await refreshSummarySafely();
            setShowConfirm(false);
            setDeleteId(null);
        } catch {
            // error is already handled in the hook
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>

            <h1 className="text-2xl font-bold mb-4">
                Tax Contributions
            </h1>

            <ErrorAlert
                message={error}
                onDismiss={clearError}
                className="mb-4"
            />

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

            <ErrorAlert
                message={summaryError}
                onDismiss={clearSummaryError}
                className="mt-4"
            />

            {summaryError && (
                <button
                    type="button"
                    onClick={refreshSummarySafely}
                    className="mt-2 rounded bg-amber-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-amber-700"
                >
                    Retry Summary
                </button>
            )}

            <TaxSummaryChart data={summary} />

            <ConfirmModal
                isOpen={showConfirm}
                title="Delete Tax Record"
                message="Are you sure you want to delete this tax record? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDangerous={true}
                isLoading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => {
                    if (!isDeleting) {
                        setShowConfirm(false);
                        setDeleteId(null);
                    }
                }}
            />
        </div>
    );
}
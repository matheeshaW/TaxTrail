import { useCallback, useEffect, useState } from "react";
import useTaxContribution from "../hooks/useTaxContribution";

import TaxFilters from "../components/TaxContribution/TaxFilters";
import TaxTable from "../components/TaxContribution/TaxTable";
import Pagination from "../components/Common/Pagination";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import TaxSummaryChart from "../components/TaxContribution/TaxSummaryChart";
import ConfirmModal from "../components/Common/ConfirmModal";
import ErrorAlert from "../components/Common/ErrorAlert";
import TaxContributionDetails from "../components/TaxContribution/TaxContributionDetails";

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
        fetchOne,
        create,
        update,
        remove,
    } = useTaxContribution();

    const [selected, setSelected] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeView, setActiveView] = useState("records");
    const [summaryRefreshing, setSummaryRefreshing] = useState(false);
    const [hasLoadedSummary, setHasLoadedSummary] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailRecord, setDetailRecord] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        fetchAll();
    }, [pagination.page]);

    const refreshSummarySafely = useCallback(async () => {
        setSummaryRefreshing(true);
        try {
            await fetchSummary();
        } catch {
            // summaryError state is already set by the hook
        } finally {
            setSummaryRefreshing(false);
        }
    }, [fetchSummary]);

    useEffect(() => {
        if (activeView === "summary" && !hasLoadedSummary) {
            refreshSummarySafely();
            setHasLoadedSummary(true);
        }
    }, [activeView, hasLoadedSummary, refreshSummarySafely]);

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

    const handleView = async (id) => {
        setDetailOpen(true);
        setDetailLoading(true);
        setDetailRecord(null);

        try {
            const record = await fetchOne(id);
            setDetailRecord(record);
        } catch {
            setDetailOpen(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetails = () => {
        if (detailLoading) return;
        setDetailOpen(false);
        setDetailRecord(null);
    };

    const editFromDetails = (record) => {
        setSelected(record);
        setShowForm(true);
        setDetailOpen(false);
        setDetailRecord(null);
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
        <div className="space-y-5">

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Tax Contributions
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage contribution records and analyze regional revenue trends.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                        {user?.role === "Admin" && activeView === "records" && (
                            <button
                                onClick={() => {
                                    setSelected(null);
                                    setShowForm(true);
                                }}
                                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                            >
                                Add Tax Record
                            </button>
                        )}
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                            Records: {pagination.total}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                            Page {pagination.page} of {pagination.pages}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex gap-2 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setActiveView("records")}
                        className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${
                            activeView === "records"
                                ? "border-b-2 border-blue-600 bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        Records
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveView("summary")}
                        className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition ${
                            activeView === "summary"
                                ? "border-b-2 border-blue-600 bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        Revenue Summary
                    </button>
                </div>
            </section>

            <ErrorAlert
                message={error}
                onDismiss={clearError}
            />

            {activeView === "records" && (
                <>
                    <TaxFilters
                        filters={filters}
                        setFilters={setFilters}
                        onApply={handleApplyFilters}
                    />

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
                        onView={handleView}
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
                </>
            )}

            {activeView === "summary" && (
                <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-base font-semibold text-gray-900">Revenue by Region</h2>
                        <button
                            type="button"
                            onClick={refreshSummarySafely}
                            disabled={summaryRefreshing}
                            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {summaryRefreshing ? "Refreshing..." : "Refresh Summary"}
                        </button>
                    </div>

                    <ErrorAlert
                        message={summaryError}
                        onDismiss={clearSummaryError}
                        className="mb-3"
                    />

                    <TaxSummaryChart data={summary} />
                </section>
            )}

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

            <TaxContributionDetails
                isOpen={detailOpen}
                loading={detailLoading}
                record={detailRecord}
                onClose={closeDetails}
                onEdit={editFromDetails}
            />
        </div>
    );
}
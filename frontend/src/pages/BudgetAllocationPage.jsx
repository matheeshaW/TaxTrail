import { useEffect, useState } from "react";
import useBudgetAllocation from "../hooks/useBudgetAllocation";
import BudgetTable from "../components/BudgetAllocation/BudgetTable";
import BudgetFilters from "../components/BudgetAllocation/BudgetFilters";
import BudgetForm from "../components/BudgetAllocation/BudgetForm";
import BudgetDetails from "../components/BudgetAllocation/BudgetDetails";
import BudgetSummaryChart from "../components/BudgetAllocation/BudgetSummaryChart";
import InflationAdjustedView from "../components/BudgetAllocation/InflationAdjustedView";
import ConfirmModal from "../components/Common/ConfirmModal";
import ErrorAlert from "../components/Common/ErrorAlert";
import { useAuth } from "../hooks/useAuth";

export default function BudgetAllocationPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const {
    data,
    selectedRecord,
    summary,
    adjustedData,
    currentPage,
    totalPages,
    filters,
    loading,
    summaryLoading,
    adjustedLoading,
    error,
    clearError,
    fetchAll,
    fetchOne,
    fetchSummary,
    fetchAdjusted,
    updateFilters,
    resetFilters,
    create,
    update,
    remove,
    setCurrentPage,
  } = useBudgetAllocation();

  // UI state
  const [view, setView] = useState("table");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // fetch on mount and when filters/page change
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // fetch summary when view changes
  useEffect(() => {
    if (view === "summary") {
      fetchSummary();
    }
  }, [view, fetchSummary]);

  // handle create
  const handleCreate = () => {
    setFormMode("create");
    setFormOpen(true);
  };

  // handle edit
  const handleEdit = async (record) => {
    const recordId = record?._id || record?.id;
    if (!recordId) {
      console.error("Edit error: missing record id", record);
      return;
    }
    try {
      await fetchOne(recordId);
      setFormMode("edit");
      setFormOpen(true);
    } catch (err) {
      console.error("Edit load error:", err);
    }
  };

  // handle view details
  const handleViewDetails = async (id) => {
    const record = await fetchOne(id);
    if (record) {
      setDetailsOpen(true);
    }
  };

  // handle delete confirm
  const handleDeleteConfirm = (record) => {
    const recordId = record?._id || record?.id;
    if (!recordId) {
      console.error("Delete error: missing record id", record);
      return;
    }
    setRecordToDelete(recordId);
    setDeleteConfirmOpen(true);
  };

  // handle actual delete
  const handleDeleteExecute = async () => {
    try {
      await remove(recordToDelete);
      setDeleteConfirmOpen(false);
      setRecordToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === "create") {
        await create(formData);
      } else {
        if (!selectedRecord?._id) {
          throw new Error("No selected record available for update.");
        }
        await update(selectedRecord._id, formData);
      }
      setFormOpen(false);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Budget Allocations
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and analyze budget allocations across sectors and regions
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <ErrorAlert message={error} onDismiss={clearError} className="mb-6" />
        )}

        {/* View tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 font-medium transition ${
              view === "table"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Allocations
          </button>
          <button
            onClick={() => setView("summary")}
            className={`px-4 py-2 font-medium transition ${
              view === "summary"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Summary by Sector
          </button>
          <button
            onClick={() => setView("adjusted")}
            className={`px-4 py-2 font-medium transition ${
              view === "adjusted"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-700"
            }`}
          >
            Inflation View
          </button>
        </div>

        {/* Content */}
        {view === "table" && (
          <>
            {/* Filters & Create button */}
            <div className="mb-6 flex justify-between items-end gap-4">
              <div className="flex-1">
                <BudgetFilters
                  filters={filters}
                  onFilterChange={updateFilters}
                  onReset={resetFilters}
                />
              </div>
              {isAdmin && (
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 h-fit bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
                >
                  + New Allocation
                </button>
              )}
            </div>

            {/* Table */}
            <BudgetTable
              data={data}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onView={handleViewDetails}
              onDelete={handleDeleteConfirm}
            />
          </>
        )}

        {view === "summary" && (
          <BudgetSummaryChart data={summary} loading={summaryLoading} />
        )}

        {view === "adjusted" && (
          <InflationAdjustedView
            data={adjustedData}
            loading={adjustedLoading}
            onFetch={fetchAdjusted}
          />
        )}
      </div>

      {/* Form modal */}
      <BudgetForm
        isOpen={formOpen}
        mode={formMode}
        initialData={formMode === "edit" ? selectedRecord : null}
        loading={loading}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* Details modal */}
      <BudgetDetails
        isOpen={detailsOpen}
        record={selectedRecord}
        loading={loading}
        onClose={() => setDetailsOpen(false)}
        onEdit={() => {
          setDetailsOpen(false);
          handleEdit(selectedRecord);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        message="Are you sure you want to delete this budget allocation? This action cannot be undone."
        onConfirm={handleDeleteExecute}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setRecordToDelete(null);
        }}
      />
    </div>
  );
}

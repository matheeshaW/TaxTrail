import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import useSocialProgram from "../hooks/useSocialProgram";
import ProgramTable from "../components/SocialProgram/ProgramTable";
import ProgramFilters from "../components/SocialProgram/ProgramFilters";
import ProgramForm from "../components/SocialProgram/ProgramForm";
import ProgramDetails from "../components/SocialProgram/ProgramDetails";
import InequalityAnalysis from "../components/SocialProgram/InequalityAnalysis";
import ConfirmModal from "../components/Common/ConfirmModal";
import ErrorAlert from "../components/Common/ErrorAlert";
import { PAGINATION_LIMITS } from "../utils/constants";

export default function SocialProgramPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const {
    data,
    allPrograms,
    filteredTotal,
    selectedRecord,
    inequalityData,
    inequalityLoading,
    currentPage,
    totalPages,
    filters,
    loading,
    error,
    clearError,
    fetchAll,
    fetchOne,
    fetchInequalityAnalysis,
    updateFilters,
    resetFilters,
    create,
    update,
    remove,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = useSocialProgram();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [inequalityCountry, setInequalityCountry] = useState("LKA");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreate = () => {
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = async (record) => {
    const recordId = record?._id || record?.id;
    if (!recordId) return;
    try {
      await fetchOne(recordId);
      setFormMode("edit");
      setFormOpen(true);
    } catch {
      /* error set in hook */
    }
  };

  const handleViewDetails = async (id) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    try {
      await fetchOne(id);
    } catch {
      /* error set in hook */
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDeleteConfirm = (record) => {
    const recordId = record?._id || record?.id;
    if (!recordId) return;
    setRecordToDelete(recordId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteExecute = async () => {
    try {
      await remove(recordToDelete);
      setDeleteConfirmOpen(false);
      setRecordToDelete(null);
    } catch {
      /* error surfaced via ErrorAlert */
    }
  };

  const handleFormSubmit = async (formPayload) => {
    if (formMode === "create") {
      await create(formPayload);
    } else {
      if (!selectedRecord?._id) {
        throw new Error("No record selected for update.");
      }
      await update(selectedRecord._id, formPayload);
    }
    setFormOpen(false);
  };

  const handleAnalyze = async (code) => {
    clearError();
    try {
      await fetchInequalityAnalysis(code);
    } catch {
      /* hook sets error */
    }
  };

  const handleRefresh = async () => {
    clearError();
    await fetchAll();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Social programs</h1>
          <p className="mt-2 text-gray-600">
            Welfare programs, beneficiaries, and inequality context 
          </p>
        </div>

        {error && (
          <ErrorAlert message={error} onDismiss={clearError} className="mb-6" />
        )}

        <div className="mb-8">
          <InequalityAnalysis
            countryCode={inequalityCountry}
            onCountryChange={setInequalityCountry}
            onAnalyze={handleAnalyze}
            data={inequalityData}
            loading={inequalityLoading}
          />
        </div>

        <div className="mb-6 flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <ProgramFilters
              filters={filters}
              onFilterChange={updateFilters}
              onReset={resetFilters}
            />
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="h-fit rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Refresh
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={handleCreate}
                className="h-fit rounded-md bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
              >
                + New program
              </button>
            )}
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-end gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <span className="whitespace-nowrap">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              disabled={loading}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
            >
              {PAGINATION_LIMITS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filteredTotal > 0 && (
          <p className="mb-3 text-sm text-gray-600">
            Showing {data.length} of {filteredTotal} program
            {filteredTotal !== 1 ? "s" : ""}
            {allPrograms.length !== filteredTotal
              ? ` (filtered from ${allPrograms.length} loaded)`
              : ""}
          </p>
        )}

        <ProgramTable
          data={data}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onView={handleViewDetails}
          onDelete={handleDeleteConfirm}
          filteredTotal={filteredTotal}
          totalLoaded={allPrograms.length}
        />
      </div>

      <ProgramForm
        isOpen={formOpen}
        mode={formMode}
        initialData={formMode === "edit" ? selectedRecord : null}
        loading={loading}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ProgramDetails
        isOpen={detailsOpen}
        record={selectedRecord}
        loading={detailsLoading}
        isAdmin={isAdmin}
        onClose={() => setDetailsOpen(false)}
        onEdit={(rec) => {
          setDetailsOpen(false);
          handleEdit(rec);
        }}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete program"
        message="Are you sure you want to delete this social program? This cannot be undone."
        confirmText="Delete"
        isLoading={loading}
        onConfirm={handleDeleteExecute}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setRecordToDelete(null);
        }}
      />
    </div>
  );
}

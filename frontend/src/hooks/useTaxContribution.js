import { useState, useCallback } from "react";
import * as taxService from "../services/taxContributionService";

export default function useTaxContribution() {
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState([]);
    const [summaryError, setSummaryError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        total: 0,
        pages: 1,
    });

    const [filters, setFilters] = useState({
        region: "",
        year: "",
        incomeBracket: "",
        currency: "",
    });

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearSummaryError = useCallback(() => {
        setSummaryError(null);
    }, []);

    // FETCH ALL
    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await taxService.getAllTax({
                ...filters,
                page: pagination.page,
                limit: pagination.limit,
            });

            setData(res.data.data);
            setPagination((prev) => ({
                ...prev,
                total: res.data.total,
                pages: res.data.pages,
            }));
        } catch (err) {
            setError("Failed to fetch tax data");
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.page, pagination.limit]);

    // FETCH SUMMARY
    const fetchSummary = useCallback(async () => {
        setSummaryError(null);

        try {
            const res = await taxService.getTaxSummary();
            setSummary(res.data.data);
            return res.data.data;
        } catch (err) {
            setSummaryError("Failed to fetch tax summary");
            throw err;
        }
    }, []);


    const create = async (data) => {
        setError(null);
        try {
            await taxService.createTax(data);
            await fetchAll();
        } catch (err) {
            setError("Failed to create tax data");
            throw err;
        }
    };

    const update = async (id, data) => {
        setError(null);
        try {
            await taxService.updateTax(id, data);
            await fetchAll();
        } catch (err) {
            setError("Failed to update tax data");
            throw err;
        }
    };

    const remove = async (id) => {
        setError(null);
        try {
            await taxService.deleteTax(id);
            await fetchAll();
        } catch (err) {
            setError("Failed to delete tax data");
            throw err;
        }
    };

    const fetchOne = async (id) => {
        setError(null);
        try {
            const res = await taxService.getTaxById(id);
            return res.data.data;
        } catch (err) {
            setError("Failed to fetch tax record details");
            throw err;
        }
    };

    return {
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
        remove
    };
}
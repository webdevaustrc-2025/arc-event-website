"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { adminFetch } from "../utils/adminFetch";
import type { PaginationParams, TableState, ActionState } from "../types/admin";

interface UseAdminDataOptions<T> {
  endpoint: string;
  initialData?: T[];
  pageSize?: number;
  autoFetch?: boolean;
}

interface UseAdminDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  tableState: TableState;
  actionState: ActionState;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setPage: (page: number) => void;
  search: (query: string) => void;
  sort: (field: string, order: "asc" | "desc") => void;
  refetch: () => Promise<void>;
  createItem: <U>(item: U) => Promise<any>;
  updateItem: <U>(id: number | string, item: U) => Promise<any>;
  deleteItem: (id: number | string) => Promise<void>;
}

export function useAdminData<T = any>(
  options: UseAdminDataOptions<T>
): UseAdminDataReturn<T> {
  const {
    endpoint,
    initialData = [],
    pageSize = 10,
    autoFetch = true,
  } = options;

  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState>({
    loading: false,
    error: null,
    success: false,
  });
  const [tableState, setTableState] = useState<TableState>({
    page: 1,
    limit: pageSize,
    search: undefined,
    sortBy: undefined,
    sortOrder: "asc",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: tableState.page.toString(),
        limit: tableState.limit.toString(),
      });

      if (tableState.search) {
        params.append("search", tableState.search);
      }
      if (tableState.sortBy) {
        params.append("sortBy", tableState.sortBy);
        params.append("sortOrder", tableState.sortOrder || "asc");
      }

      const url = `${endpoint}?${params.toString()}`;
      const result = await adminFetch<any>(url, { showToast: false });

      if (Array.isArray(result)) {
        setData(result);
      } else if (result.items) {
        setData(result.items);
        setPagination({
          page: result.page || tableState.page,
          limit: result.limit || tableState.limit,
          total: result.total || 0,
          totalPages: result.totalPages || 0,
        });
      } else {
        setData([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch data";
      setError(message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, tableState]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [tableState, autoFetch, fetchData]);

  const setPage = useCallback((newPage: number) => {
    setTableState((prev) => ({ ...prev, page: newPage }));
  }, []);

  const search = useCallback((query: string) => {
    setTableState((prev) => ({ ...prev, search: query, page: 1 }));
  }, []);

  const sort = useCallback(
    (field: string, order: "asc" | "desc") => {
      setTableState((prev) => ({
        ...prev,
        sortBy: field,
        sortOrder: order,
        page: 1,
      }));
    },
    []
  );

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const createItem = useCallback(
    async <U,>(item: U) => {
      setActionState({ loading: true, error: null, success: false });
      try {
        const result = await adminFetch<any>(endpoint, {
          method: "POST",
          body: JSON.stringify(item),
          showToast: true,
          successMessage: "Item created successfully",
        });
        await fetchData();
        setActionState({ loading: false, error: null, success: true });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Create failed";
        setActionState({ loading: false, error: message, success: false });
        throw err;
      }
    },
    [endpoint, fetchData]
  );

  const updateItem = useCallback(
    async <U,>(id: number | string, item: U) => {
      setActionState({ loading: true, error: null, success: false });
      try {
        const result = await adminFetch<any>(`${endpoint}/${id}`, {
          method: "PUT",
          body: JSON.stringify(item),
          showToast: true,
          successMessage: "Item updated successfully",
        });
        await fetchData();
        setActionState({ loading: false, error: null, success: true });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Update failed";
        setActionState({ loading: false, error: message, success: false });
        throw err;
      }
    },
    [endpoint, fetchData]
  );

  const deleteItem = useCallback(
    async (id: number | string) => {
      setActionState({ loading: true, error: null, success: false });
      try {
        await adminFetch(`${endpoint}/${id}`, {
          method: "DELETE",
          showToast: true,
          successMessage: "Item deleted successfully",
        });
        await fetchData();
        setActionState({ loading: false, error: null, success: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Delete failed";
        setActionState({ loading: false, error: message, success: false });
        throw err;
      }
    },
    [endpoint, fetchData]
  );

  return {
    data,
    loading,
    error,
    tableState,
    actionState,
    pagination,
    setPage,
    search,
    sort,
    refetch,
    createItem,
    updateItem,
    deleteItem,
  };
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface ServerFilterOption {
  key: string;
  label: string;
  options: Array<{ label: string; value: string }>;
}

export interface ServerSortOption {
  label: string;
  value: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface ServerBulkAction {
  label: string;
  action: string;
  variant?: "default" | "destructive" | "outline";
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ServerDataTableProps<T extends { id?: number | string }> {
  title: string;
  description?: string;
  fetchUrl: string;
  defaultFilters?: Record<string, any>;
  filterOptions?: ServerFilterOption[];
  sortOptions?: ServerSortOption[];
  defaultSort?: string;
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  renderItem: (
    item: T,
    index: number,
    isSelected: boolean,
    onToggleSelect: () => void
  ) => React.ReactNode;
  renderEmptyState?: () => React.ReactNode;
  onAddNew?: () => void;
  addNewLabel?: string;
  bulkActions?: ServerBulkAction[];
  onBulkAction?: (selectedIds: (string | number)[], action: string) => Promise<void>;
  refreshTrigger?: any;
  viewMode?: "grid" | "table" | "list";
  extraActions?: React.ReactNode;
  transformResponse?: (data: any) => { items: T[]; pagination: PaginationInfo };
}

export function ServerDataTable<T extends { id?: number | string }>({
  title,
  description,
  fetchUrl,
  defaultFilters = {},
  filterOptions = [],
  sortOptions = [],
  defaultSort = "",
  searchPlaceholder = "Search live database records...",
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 25,
  renderItem,
  renderEmptyState,
  onAddNew,
  addNewLabel = "Add New",
  bulkActions = [],
  onBulkAction,
  refreshTrigger,
  viewMode = "grid",
  extraActions,
  transformResponse,
}: ServerDataTableProps<T>) {
  // State
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Query states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(defaultFilters);
  const [currentSort, setCurrentSort] = useState<string>(
    defaultSort || (sortOptions[0]?.value ?? "")
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultPageSize);

  // Pagination metadata from server
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: defaultPageSize,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [isBulkExecuting, setIsBulkExecuting] = useState(false);

  // Abort controller ref for search race-condition prevention
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1); // Reset to first page on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page on filter change
  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (!value || value === "all") {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
    setPage(1);
  };

  // Clear single filter
  const clearFilter = (key: string) => {
    handleFilterChange(key, "");
  };

  // Clear all filters & search
  const clearAll = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setActiveFilters(defaultFilters);
    setPage(1);
  };

  // Data fetching with AbortController
  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      // Find sort config
      const selectedSortOpt = sortOptions.find((s) => s.value === currentSort);
      const sortBy = selectedSortOpt?.sortBy || (currentSort ? currentSort.split("_")[0] : "");
      const sortOrder = selectedSortOpt?.sortOrder || (currentSort?.endsWith("_desc") ? "desc" : "asc");

      // Build query params
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("paginate", "true");

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      }
      if (sortBy) {
        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
      }

      // Append facet filters
      Object.entries(activeFilters).forEach(([k, v]) => {
        if (v && v !== "all") {
          params.set(k, v);
        }
      });

      const separator = fetchUrl.includes("?") ? "&" : "?";
      const fullUrl = `${fetchUrl}${separator}${params.toString()}`;

      // Attach token if present
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("ezy1_token") || localStorage.getItem("token")
          : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(fullUrl, {
        method: "GET",
        headers,
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();

      if (transformResponse) {
        const transformed = transformResponse(json);
        setItems(transformed.items);
        setPagination(transformed.pagination);
      } else if (json && json.items && json.pagination) {
        setItems(json.items);
        setPagination(json.pagination);
      } else if (Array.isArray(json)) {
        // Enveloped array with attached .pagination
        const pag = (json as any).pagination || {
          page: 1,
          limit: json.length,
          total: json.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        };
        setItems(json);
        setPagination(pag);
      } else {
        setItems([]);
        setPagination({
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        });
      }

      // Clear selection on page fetch
      setSelectedIds(new Set());
    } catch (err: any) {
      if (err.name === "AbortError") {
        // Fetch aborted by newer request, ignore
        return;
      }
      console.error("ServerDataTable fetch error:", err);
      setError(err.message || "Failed to load database records.");
    } finally {
      setLoading(false);
    }
  }, [
    fetchUrl,
    page,
    limit,
    debouncedSearch,
    activeFilters,
    currentSort,
    sortOptions,
    transformResponse,
  ]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, refreshTrigger]);

  // Bulk Selection Handlers
  const toggleSelect = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isAllSelected = items.length > 0 && items.every((item) => item.id !== undefined && selectedIds.has(item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      const next = new Set<string | number>();
      items.forEach((item) => {
        if (item.id !== undefined) next.add(item.id);
      });
      setSelectedIds(next);
    }
  };

  // Bulk Action Execution
  const handleRunBulkAction = async (action: string) => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one item.");
      return;
    }

    if (onBulkAction) {
      setIsBulkExecuting(true);
      try {
        await onBulkAction(Array.from(selectedIds), action);
        setSelectedIds(new Set());
        fetchData();
      } catch (err: any) {
        toast.error(`Bulk operation failed: ${err.message}`);
      } finally {
        setIsBulkExecuting(false);
      }
    }
  };

  const hasActiveFilters =
    debouncedSearch !== "" ||
    Object.keys(activeFilters).some(
      (k) => activeFilters[k] && activeFilters[k] !== defaultFilters[k]
    );

  const startRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-4">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/60 border border-border/70 p-5 rounded-3xl backdrop-blur-sm shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-display font-bold text-foreground">{title}</h2>
            <Badge variant="secondary" className="font-mono text-xs font-semibold px-2 py-0.5">
              {pagination.total} records
            </Badge>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData()}
            disabled={loading}
            className="rounded-xl border-border/80 text-xs gap-1.5 h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {extraActions}

          {onAddNew && (
            <Button
              size="sm"
              onClick={onAddNew}
              className="rounded-xl font-medium gap-1.5 h-9 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 text-xs"
            >
              <Plus className="w-4 h-4" />
              {addNewLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Search, Filter and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card/40 p-4 border border-border/60 rounded-2xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 pr-8 h-10 rounded-xl bg-background/80 border-border/70 text-sm focus-visible:ring-primary/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters & Sorting */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((fo) => (
            <div key={fo.key} className="min-w-[140px]">
              <Select
                value={activeFilters[fo.key] || "all"}
                onValueChange={(val) => handleFilterChange(fo.key, val)}
              >
                <SelectTrigger className="h-10 rounded-xl bg-background/80 border-border/70 text-xs">
                  <SelectValue placeholder={fo.label} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="all">All {fo.label}</SelectItem>
                  {fo.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          {sortOptions.length > 0 && (
            <div className="min-w-[160px]">
              <Select value={currentSort} onValueChange={setCurrentSort}>
                <SelectTrigger className="h-10 rounded-xl bg-background/80 border-border/70 text-xs gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="rounded-xl h-10 text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar (Visible when items selected) */}
      {bulkActions.length > 0 && selectedIds.size > 0 && (
        <div className="flex items-center justify-between gap-3 bg-primary/10 border border-primary/20 p-3.5 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground font-mono">
              {selectedIds.size} Selected
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Choose an administrative action to apply in bulk:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {bulkActions.map((action) => (
              <Button
                key={action.action}
                size="sm"
                variant={action.variant || "default"}
                disabled={isBulkExecuting}
                onClick={() => handleRunBulkAction(action.action)}
                className="rounded-xl text-xs h-8 font-medium gap-1"
              >
                {isBulkExecuting && <Loader2 className="w-3 h-3 animate-spin" />}
                {action.label}
              </Button>
            ))}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
              className="rounded-xl text-xs h-8 text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Selection Summary Line */}
      {bulkActions.length > 0 && items.length > 0 && (
        <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={toggleSelectAll}
              className="rounded-md border-border/80"
            />
            <span>Select all {items.length} records on this page</span>
          </label>
          <span>
            Server Page {pagination.page} of {pagination.totalPages}
          </span>
        </div>
      )}

      {/* Content Rendering */}
      {loading && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-3xl border border-dashed border-border bg-card/30 min-h-[300px]">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm font-medium text-foreground">Querying live database...</p>
          <p className="text-xs text-muted-foreground mt-1">Applying server-side pagination & indexing</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-destructive/30 bg-destructive/5 text-center min-h-[250px]">
          <AlertCircle className="w-8 h-8 text-destructive mb-2" />
          <p className="text-sm font-semibold text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData()}
            className="mt-4 rounded-xl text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Query
          </Button>
        </div>
      ) : items.length === 0 ? (
        renderEmptyState ? (
          renderEmptyState()
        ) : (
          <div className="flex flex-col items-center justify-center p-16 rounded-3xl border border-dashed border-border bg-card/20 text-center min-h-[250px]">
            <Search className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm font-semibold text-foreground">No records matched your search</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Try adjusting your query, clear active filters, or add a new record to the database.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="mt-4 rounded-xl text-xs"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {items.map((item, index) => {
            const isSelected = item.id !== undefined && selectedIds.has(item.id);
            return (
              <div key={item.id ?? index} className="relative group min-w-0 overflow-hidden">
                {renderItem(item, index, isSelected, () => {
                  if (item.id !== undefined) toggleSelect(item.id);
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Server Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/40 border border-border/70 p-4 rounded-2xl text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-foreground">{startRecord}</strong> to{" "}
            <strong className="text-foreground">{endRecord}</strong> of{" "}
            <strong className="text-foreground">{pagination.total}</strong> records
          </span>

          <div className="flex items-center gap-1.5 ml-2 border-l border-border pl-3">
            <span className="hidden sm:inline">Per page:</span>
            <Select
              value={String(limit)}
              onValueChange={(val) => {
                setLimit(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-7 w-16 rounded-lg text-xs border-border/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pagination Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page <= 1 || loading}
            className="h-8 w-8 rounded-lg border-border/70"
            title="First Page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev || loading}
            className="h-8 w-8 rounded-lg border-border/70"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>

          <span className="px-3 py-1 bg-background border border-border/80 rounded-lg font-mono text-foreground font-medium">
            Page {pagination.page} of {Math.max(1, pagination.totalPages)}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNext || loading}
            className="h-8 w-8 rounded-lg border-border/70"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(pagination.totalPages)}
            disabled={page >= pagination.totalPages || loading}
            className="h-8 w-8 rounded-lg border-border/70"
            title="Last Page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

interface FilterOption {
  key: string;
  label: string;
  options: Array<{ label: string; value: string }>;
}

interface SortOption {
  label: string;
  value: string;
}

interface DataTableProps<T> {
  title: string;
  description?: string;
  data: T[];
  searchPlaceholder?: string;
  searchFilter: (item: T, query: string) => boolean;
  filterOptions?: FilterOption[];
  sortOptions?: SortOption[];
  defaultSort?: string;
  onSort?: (items: T[], sortValue: string) => T[];
  onAddNew?: () => void;
  addNewLabel?: string;
  pageSize?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderEmptyState?: () => React.ReactNode;
  customActions?: React.ReactNode;
  extraFilters?: React.ReactNode;
  viewMode?: "grid" | "table" | "list";
}

export function DataTable<T extends { id?: number | string }>({
  title,
  description,
  data,
  searchPlaceholder = "Search records...",
  searchFilter,
  filterOptions = [],
  sortOptions = [],
  defaultSort = "",
  onSort,
  onAddNew,
  addNewLabel = "Add New",
  pageSize = 8,
  renderItem,
  renderEmptyState,
  customActions,
  extraFilters,
  viewMode = "grid",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const [currentSort, setCurrentSort] = useState<string>(
    defaultSort || (sortOptions[0]?.value ?? ""),
  );
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Search Filter
  let filtered = data.filter((item) => {
    if (!searchQuery.trim()) return true;
    return searchFilter(item, searchQuery.toLowerCase().trim());
  });

  // 2. Facet Filters
  Object.entries(activeFilters).forEach(([key, val]) => {
    if (!val || val === "all") return;
    filtered = filtered.filter((item) => {
      const itemVal = (item as Record<string, any>)[key];
      if (typeof itemVal === "boolean") {
        return val === "true" ? itemVal === true : itemVal === false;
      }
      return String(itemVal).toLowerCase() === val.toLowerCase();
    });
  });

  // 3. Sorting
  if (onSort && currentSort) {
    filtered = onSort(filtered, currentSort);
  }

  // 4. Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveFilters({});
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    Object.values(activeFilters).some((v) => v && v !== "all");

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground tracking-tight">
              {title}
            </h1>
            <Badge
              variant="secondary"
              className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
            >
              {totalItems} total
            </Badge>
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {customActions}
          {onAddNew && (
            <Button
              onClick={onAddNew}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-semibold text-xs sm:text-sm h-9 sm:h-10 px-4 rounded-xl"
            >
              <Plus className="w-4 h-4" /> {addNewLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-8 h-9 text-xs sm:text-sm rounded-xl border-border bg-background/80 focus:bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Selects */}
          {filterOptions.map((filter) => (
            <div key={filter.key} className="w-full md:w-44">
              <Select
                value={activeFilters[filter.key] || "all"}
                onValueChange={(val) => handleFilterChange(filter.key, val)}
              >
                <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background/80">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          {/* Sort Select */}
          {sortOptions.length > 0 && (
            <div className="w-full md:w-48">
              <Select
                value={currentSort}
                onValueChange={(val) => setCurrentSort(val)}
              >
                <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background/80">
                  <div className="flex items-center gap-1.5 truncate">
                    <ArrowUpDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <SelectValue placeholder="Sort By" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
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
              onClick={clearFilters}
              className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </Button>
          )}
        </div>

        {extraFilters && (
          <div className="pt-2 border-t border-border/60">{extraFilters}</div>
        )}
      </div>

      {/* Content Rendering */}
      {paginatedItems.length === 0 ? (
        renderEmptyState ? (
          renderEmptyState()
        ) : (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/50">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No records found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {hasActiveFilters
                ? "Try adjusting your search query or filters to find what you are looking for."
                : "Get started by adding your first item to this section."}
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-4 text-xs rounded-xl"
              >
                Reset Filters
              </Button>
            ) : onAddNew ? (
              <Button
                size="sm"
                onClick={onAddNew}
                className="mt-4 gap-1.5 text-xs rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" /> {addNewLabel}
              </Button>
            ) : null}
          </div>
        )
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedItems.map((item, index) => (
            <div key={index} className="min-w-0 overflow-hidden">
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedItems.map((item, index) => (
            <div key={index} className="min-w-0 overflow-hidden">
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(startIndex + pageSize, totalItems)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{totalItems}</span>{" "}
            entries
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={validPage === 1}
              className="h-8 px-2.5 text-xs rounded-lg gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </Button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && validPage > 3) {
                  pageNum = validPage - 3 + i + 1;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                  <Button
                    key={pageNum}
                    variant={validPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 p-0 text-xs rounded-lg ${
                      validPage === pageNum
                        ? "font-bold shadow-xs"
                        : "text-muted-foreground"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={validPage === totalPages}
              className="h-8 px-2.5 text-xs rounded-lg gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

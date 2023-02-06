import * as React from "react";

export interface IPaginationFilters {
  objectCurrentPage: number;
  logCurrentPage: number;
}

export const pagination = {
  objectCurrentPage: 1,
  logCurrentPage: 1,
} as IPaginationFilters;

export const PaginationFiltersContext = React.createContext<[IPaginationFilters, (data: IPaginationFilters) => void]>([
  pagination,
  () => null,
]);

export const FiltersProvider = PaginationFiltersContext.Provider;

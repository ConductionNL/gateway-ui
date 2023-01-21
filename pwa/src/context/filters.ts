import * as React from "react";

export interface IFilters {
  objectCurrentPage: number;
}

export const filters = {
  objectCurrentPage: 1,
} as IFilters;

export const FiltersContext = React.createContext<[IFilters, (data: IFilters) => void]>([filters, () => null]);

export const FiltersProvider = FiltersContext.Provider;

import * as React from "react";
import { GlobalContext } from "./global";

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

export type TPerPageOptions = 5 | 10 | 20 | 50 | 100 | 500 | 1000 | 2000 | 5000 | 10000;

type TPaginationData = {
  currentPage: number;
  perPage: TPerPageOptions;
};

export interface IPaginationContext {
  [key: string]: TPaginationData;
}

export const defaultPaginationContext: IPaginationContext = {};

export const usePaginationContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const getPagination = (key: string): TPaginationData => {
    if (!globalContext.pagination[key]) {
      setPagination({ currentPage: DEFAULT_CURRENT_PAGE, perPage: DEFAULT_PER_PAGE }, key);
    }

    return globalContext.pagination[key];
  };

  const setPagination = (pagination: TPaginationData, key: string) => {
    setGlobalContext((context) => ({ ...context, pagination: { ...globalContext.pagination, [key]: pagination } }));
  };

  const setCurrentPage = (newCurrentPage: number, key: string) => {
    setGlobalContext((context) => ({
      ...context,
      pagination: {
        ...globalContext.pagination,
        [key]: { ...globalContext.pagination[key], currentPage: newCurrentPage },
      },
    }));
  };

  const setPerPage = (newPerPage: TPerPageOptions, key: string) => {
    setGlobalContext((context) => ({
      ...context,
      pagination: {
        ...globalContext.pagination,
        [key]: { currentPage: 1, perPage: newPerPage }, // also reset currentPage to 1 when modifying perPage
      },
    }));
  };

  const getCurrentPage = (key: string): number => {
    return globalContext.pagination[key]?.currentPage ?? DEFAULT_CURRENT_PAGE;
  };

  const getPerPage = (key: string): number => {
    return globalContext.pagination[key]?.perPage ?? DEFAULT_PER_PAGE;
  };

  return { setCurrentPage, setPerPage, getPagination, getCurrentPage, getPerPage };
};

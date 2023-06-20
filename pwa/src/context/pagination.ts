import * as React from "react";
import { GlobalContext } from "./global";

type TPaginationData = {
  currentPage: number;
};

export interface IPaginationContext {
  [key: string]: TPaginationData;
}

export const defaultPaginationContext: IPaginationContext = {};

export const usePaginationContext = () => {
  const [globalContext, setGlobalContext] = React.useContext(GlobalContext);

  const getPagination = (key: string): TPaginationData => {
    if (!globalContext.pagination[key]) {
      setPagination({ currentPage: 1 }, key);
    }

    return globalContext.pagination[key];
  };

  const setPagination = (pagination: TPaginationData, key: string) => {
    setGlobalContext((context) => ({ ...context, pagination: { ...globalContext.pagination, [key]: pagination } }));
  };

  const getCurrentPage = (key: string): number => {
    return globalContext.pagination[key]?.currentPage ?? 1;
  };

  return { setPagination, getPagination, getCurrentPage };
};

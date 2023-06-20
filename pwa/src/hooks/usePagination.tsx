import * as React from "react";
import { Paginate } from "../components/paginate/Paginate";
import { PaginationLocationIndicatorComponent } from "../components/paginationLocationIndicatorComponent/PaginationLocationIndicatorComponent";
import { usePaginationContext } from "../context/pagination";

export interface PaginationDataProps {
  count: number;
  offset: number;
  pages: number;
  total: number;
}

interface PaginationProps {
  layoutClassName?: string;
}

interface PaginationLocationIndicator {
  layoutClassName?: string;
}

export const usePagination = (data: PaginationDataProps, key: string) => {
  const { getPagination, setPagination } = usePaginationContext();

  const pagination = getPagination(key);

  const setCurrentPage = (newPage: number) => {
    setPagination({ currentPage: newPage }, key);
  };

  const Pagination: React.FC<PaginationProps> = ({ layoutClassName }) => (
    <Paginate totalPages={data.pages} currentPage={pagination.currentPage} {...{ setCurrentPage, layoutClassName }} />
  );

  const PaginationLocationIndicator: React.FC<PaginationLocationIndicator> = ({ layoutClassName }) => (
    <PaginationLocationIndicatorComponent
      total={data.total}
      offset={data.offset}
      count={data.count}
      {...{ layoutClassName }}
    />
  );

  return { Pagination, PaginationLocationIndicator };
};

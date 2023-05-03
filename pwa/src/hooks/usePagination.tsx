import * as React from "react";
import { UseQueryResult } from "react-query";
import { Paginate } from "../components/paginate/Paginate";
import { PaginationLocationIndicatorComponent } from "../components/paginationLocationIndicatorComponent/PaginationLocationIndicatorComponent";

export interface PaginationDataProps {
  data: {
    count: number;
    limit: number;
    offset: number;
    page: number;
    pages: number;
    total: number;
  };
}

interface PaginationProps {
  layoutClassName?: string;
}

interface PaginationLocationIndicator {
  layoutClassName?: string;
}

export const usePagination = (
  data: UseQueryResult<any, Error> | PaginationDataProps,
  currentPage: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
) => {
  const Pagination: React.FC<PaginationProps> = ({ layoutClassName }) => (
    <Paginate
      totalPages={data.data.pages}
      currentPage={currentPage ?? data.data.page}
      {...{ setCurrentPage, layoutClassName }}
    />
  );

  const PaginationLocationIndicator: React.FC<PaginationLocationIndicator> = ({ layoutClassName }) => (
    <PaginationLocationIndicatorComponent
      total={data.data.total}
      offset={data.data.offset}
      count={data.data.count}
      {...{ layoutClassName }}
    />
  );

  return { Pagination, PaginationLocationIndicator };
};

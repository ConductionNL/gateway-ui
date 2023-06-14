import * as React from "react";
import { Paginate } from "../components/paginate/Paginate";
import { PaginationLocationIndicatorComponent } from "../components/paginationLocationIndicatorComponent/PaginationLocationIndicatorComponent";
import { PaginationLimitSelectComponent } from "../components/paginationLimitSelect/PaginationLimitSelectComponent";

export interface PaginationDataProps {
  count: number;
  offset: number;
  pages: number;
  total: number;
}

export const queryLimitDefault = 10;

interface PaginationProps {
  layoutClassName?: string;
}

interface PaginationLocationIndicator {
  layoutClassName?: string;
}

interface PaginationLimitSelect {
  queryLimit: number;
  setQueryLimit: React.Dispatch<React.SetStateAction<number>>;
  layoutClassName?: string;
}

interface ReactHookFormProps {
  errors: { [x: string]: any };
}

export const usePagination = (
  data: PaginationDataProps,
  currentPage: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
) => {
  const Pagination: React.FC<PaginationProps> = ({ layoutClassName }) => (
    <Paginate totalPages={data.pages} {...{ currentPage, setCurrentPage, layoutClassName }} />
  );

  const PaginationLocationIndicator: React.FC<PaginationLocationIndicator> = ({ layoutClassName }) => (
    <PaginationLocationIndicatorComponent
      total={data.total}
      offset={data.offset}
      count={data.count}
      {...{ layoutClassName }}
    />
  );

  const PaginationLimitSelect: React.FC<PaginationLimitSelect> = ({ queryLimit, setQueryLimit, layoutClassName }) => (
    <PaginationLimitSelectComponent {...{ layoutClassName, queryLimit, setQueryLimit }} />
  );

  return { Pagination, PaginationLocationIndicator, PaginationLimitSelect };
};

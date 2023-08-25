import * as React from "react";
import { Paginate } from "../components/paginate/Paginate";
import { PaginationLocationIndicatorComponent } from "../components/paginationLocationIndicatorComponent/PaginationLocationIndicatorComponent";
import { TPerPageOptions, usePaginationContext } from "../context/pagination";
import { useForm } from "react-hook-form";
import { SelectSingle } from "@conduction/components";

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
  const { getPagination, setCurrentPage, setPerPage, getPerPage } = usePaginationContext();

  const pagination = getPagination(key);

  const Pagination: React.FC<PaginationProps> = ({ layoutClassName }) => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Paginate
        totalPages={data.pages}
        currentPage={pagination.currentPage}
        setCurrentPage={(newPage) => setCurrentPage(newPage, key)}
        {...{ layoutClassName }}
      />

      <PaginationLimitSelect />
    </div>
  );

  const PaginationLocationIndicator: React.FC<PaginationLocationIndicator> = ({ layoutClassName }) => (
    <PaginationLocationIndicatorComponent
      total={data.total}
      offset={data.offset}
      count={data.count}
      {...{ layoutClassName }}
    />
  );

  const PaginationLimitSelect: React.FC = () => {
    const {
      watch,
      register,
      control,
      formState: { errors },
    } = useForm();

    const watchLimit = watch("limit");

    React.useEffect(() => {
      if (!watchLimit || watchLimit.value === getPerPage(key).toString()) return;

      setPerPage(parseInt(watchLimit.value) as TPerPageOptions, key);
    }, [watchLimit]);

    return (
      <div>
        <SelectSingle
          {...{ register, errors, control }}
          name="limit"
          options={limitSelectOptions}
          menuPlacement="auto"
          defaultValue={limitSelectOptions.find((option) => option.value === getPerPage(key).toString())}
        />
      </div>
    );
  };

  const limitSelectOptions = [
    { label: "5 per page", value: "5" },
    { label: "10 per page", value: "10" },
    { label: "20 per page", value: "20" },
    { label: "50 per page", value: "50" },
    { label: "100 per page", value: "100" },
    { label: "500 per page", value: "500" },
    { label: "1.000 per page", value: "1000" },
    { label: "2.000 per page", value: "2000" },
    { label: "5.000 per page", value: "5000" },
    { label: "10.000 per page", value: "10000" },
  ];

  return { Pagination, PaginationLocationIndicator };
};

import * as React from "react";
import * as styles from "./PaginationLimitSelectComponent.module.css";

import { useForm } from "react-hook-form";
import { SelectSingle } from "@conduction/components";

interface PaginationLimitSelectProps {
  queryLimit: number;
  setQueryLimit: React.Dispatch<React.SetStateAction<number>>;
  layoutClassName?: string;
}

export const PaginationLimitSelectComponent: React.FC<PaginationLimitSelectProps> = ({ queryLimit, setQueryLimit }) => {
  const {
    watch,
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const watchLimit = watch("limit");

  React.useEffect(() => {
    if (!watchLimit) return;

    const selectedLimit = limitSelectOptions.find((LimitOption) => LimitOption.value === watchLimit.value);

    selectedLimit !== undefined && setQueryLimit(parseInt(selectedLimit.value));
  }, [watchLimit]);

  React.useEffect(() => {
    setValue(
      "limit",
      limitSelectOptions.find((LimitOption) => LimitOption.value === queryLimit.toString()),
    );
  }, [queryLimit]);

  return (
    <div className={styles.container}>
      <span>Results per page:</span>
      <SelectSingle {...{ register, errors, control }} name="limit" options={limitSelectOptions} />
    </div>
  );
};

const limitSelectOptions = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
  { label: "500", value: "500" },
  { label: "1000", value: "1000" },
  { label: "2000", value: "2000" },
  { label: "5000", value: "5000" },
  { label: "10000", value: "10000" },
];

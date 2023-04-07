import * as React from "react";
import * as styles from "./DisplayFilters.module.css";
import _ from "lodash";
import clsx from "clsx";

import { useForm } from "react-hook-form";
import { Button } from "../../../components/button/Button";
import { faClose, faFilter } from "@fortawesome/free-solid-svg-icons";
import { SelectSingle } from "@conduction/components";

interface DisplayFiltersProps {
  sortOrder: string;
  toggleSortOrder: (order: "asc" | "desc") => void;

  tableColumns: any;
  setTableColumns: (column: { [key: string]: boolean }) => void;
}

export const DisplayFilters: React.FC<DisplayFiltersProps> = ({
  sortOrder,
  toggleSortOrder,
  tableColumns,
  setTableColumns,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const order = watch("order");

  React.useEffect(() => {
    if (!order) return;

    toggleSortOrder(order.value);
  }, [order]);

  const orderOptions = [
    { label: "Newest first", value: "desc" },
    { label: "Oldest first", value: "asc" },
  ];

  return (
    <div className={styles.container}>
      <Button
        label={isOpen ? "Close filters" : "Display filters"}
        icon={isOpen ? faClose : faFilter}
        variant="secondary"
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      />

      <div className={clsx(styles.popUp, isOpen && styles.isOpen)}>
        <div className={styles.sortingContainer}>
          <span className={styles.title}>Sort results</span>

          <SelectSingle
            name="order"
            options={orderOptions}
            defaultValue={orderOptions.find((option) => option.value === sortOrder ?? "desc")}
            {...{ register, errors, control }}
          />
        </div>

        <hr />

        <div>
          <span className={styles.title}>Toggle columns</span>

          <div className={styles.columns}>
            {Object.entries(tableColumns).map(([key, value]) => (
              <div {...{ key }} className={styles.column}>
                <input
                  id={key}
                  name={key}
                  checked={value as boolean}
                  type="checkbox"
                  onChange={() => setTableColumns({ [key]: !value })}
                />
                <label htmlFor={key}>{_.upperFirst(key)}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

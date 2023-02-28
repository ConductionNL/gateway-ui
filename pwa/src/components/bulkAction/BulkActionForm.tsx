import * as React from "react";
import * as styles from "./BulkActionForm.module.css";

import { SelectSingle, ToolTip } from "@conduction/components";
import { useForm } from "react-hook-form";
import { Button } from "../button/Button";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

type TBulkAction = {
  label: "Delete" | "Download";
  onSubmit: () => any;
};

interface BulkActionFormProps {
  actions: TBulkAction[];
  selectedItemsCount: number;
}

export const BulkActionForm: React.FC<BulkActionFormProps> = ({ actions, selectedItemsCount }) => {
  const [disabled, setDisabled] = React.useState<boolean>(!selectedItemsCount);
  const [actionOptions, setActionOptions] = React.useState<{ label: string; value: string }[]>([]);

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const selectedAction = watch("action");

  const onSubmit = (data: any) => {
    const action = actions.find((action) => action.label === data.action.value);

    action?.onSubmit(); // execute the passed submit function
  };

  React.useEffect(() => {
    setActionOptions([defaultOption, ...actions.map((action) => ({ label: action.label, value: action.label }))]);
  }, [actions]);

  React.useEffect(() => {
    setDisabled(!selectedItemsCount || selectedAction?.value === "");
  }, [selectedItemsCount, selectedAction]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <SelectSingle
          options={actionOptions}
          name="action"
          {...{ register, control, errors }}
          validation={{ required: true }}
          defaultValue={defaultOption}
        />

        <ToolTip layoutClassName={styles.toolTip} tooltip={disabled ? "Select an action and item(s)" : ""}>
          <Button
            type="submit"
            label={
              <>
                Apply{" "}
                <span className={clsx(styles.amountIndicator, disabled && styles.disabled)}>
                  {Math.min(selectedItemsCount, 99)}
                </span>
              </>
            }
            variant="primary"
            icon={faArrowRight}
            layoutClassName={styles.button}
            {...{ disabled }}
          />
        </ToolTip>
      </form>
    </div>
  );
};

const defaultOption = { label: "Select bulk action...", value: "" };

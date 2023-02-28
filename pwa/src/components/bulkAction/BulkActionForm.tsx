import * as React from "react";
import * as styles from "./BulkActionForm.module.css";
import { SelectSingle } from "@conduction/components";
import { useForm } from "react-hook-form";

type TBulkAction = {
  label: string;
  action: () => any;
};

interface BulkActionFormProps {
  actions: TBulkAction[];
}

export const BulkActionForm: React.FC<BulkActionFormProps> = ({ actions }) => {
  const [actionOptions, setActionOptions] = React.useState<{ label: string; value: string }[]>([]);

  const {
    register,
    control,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    setActionOptions([
      { label: "Bulk actions", value: "" },
      ...actions.map((action) => ({ label: action.label, value: action.label })),
    ]);
  }, [actions]);

  return (
    <div className={styles.container}>
      <SelectSingle options={actionOptions} name="action" {...{ register, control, errors }} />
    </div>
  );
};

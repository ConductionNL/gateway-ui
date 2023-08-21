import * as React from "react";
import * as styles from "./FormStepFinalizeImport.module.css";
import { UseMutationResult } from "react-query";
import Skeleton from "react-loading-skeleton";
import { Alert } from "@gemeente-denhaag/components-react";
import { ToolTip } from "@conduction/components";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { BulkActionButton } from "../../../../../components/bulkActionButton/BulkActionButton";
import { StatusTag } from "../../../../../components/statusTag/StatusTag";
import { useBulkSelect } from "../../../../../hooks/useBulkSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useObject } from "../../../../../hooks/object";

interface FormStepFinalizeImportProps {
  uploadQuery: UseMutationResult<any, Error, FormData, unknown>;
}

export const FormStepFinalizeImport: React.FC<FormStepFinalizeImportProps> = ({ uploadQuery }) => {
  const createObject = useObject().createOrEdit();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, toggleItem } = useBulkSelect(
    uploadQuery.data?.results,
  );

  const onSubmit = () => {
    selectedItems.forEach((selectedItem) =>
      createObject.mutate({ payload: uploadQuery.data?.results[selectedItem].object }),
    );
  };

  if (uploadQuery.isLoading) return <Skeleton height="200px" />;
  if (uploadQuery.isError)
    return (
      <Alert
        text="There was an issue uploading your selected file(s)"
        title="Oops, something went wrong"
        variant="error"
      />
    );

  return (
    <div className={styles.container}>
      <Alert variant="info" title="" text="Select the object action(s) you want to import." />

      <BulkActionButton actions={[{ type: "import", onSubmit: onSubmit }]} selectedItemsCount={selectedItems.length} />

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>
              <CheckboxBulkSelectAll />
            </TableHeader>
            <TableHeader>Object</TableHeader>
            <TableHeader>Action</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {uploadQuery.data?.results.map((object: any, idx: any) => (
            <TableRow key={idx} onClick={() => toggleItem(idx.toString())}>
              <TableCell>{<CheckboxBulkSelectOne id={idx.toString()} />}</TableCell>

              <TableCell>
                <ToolTip tooltip={JSON.stringify(object.object)}>
                  View object <FontAwesomeIcon icon={faInfoCircle} />
                </ToolTip>
              </TableCell>

              <TableCell>
                <StatusTag label={object.action} type="success" />
              </TableCell>

              <TableCell>
                {!object.validations && (
                  <ToolTip tooltip="Ready to be executed">
                    <StatusTag label="Ready" type="success" />
                  </ToolTip>
                )}

                {object.validations && (
                  <ToolTip tooltip={JSON.stringify(object.validations)}>
                    <StatusTag label="Not ready" type="critical" />
                  </ToolTip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {uploadQuery.data?.results.length > 15 && (
        <BulkActionButton
          actions={[{ type: "import", onSubmit: () => alert(`Sending to gateway: ${selectedItems.toString()}`) }]}
          selectedItemsCount={selectedItems.length}
        />
      )}
    </div>
  );
};

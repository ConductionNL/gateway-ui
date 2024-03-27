import * as React from "react";
import * as styles from "./FormStepFinalizeImport.module.css";
import { UseMutationResult } from "react-query";
import Skeleton from "react-loading-skeleton";
import { Alert, Link } from "@gemeente-denhaag/components-react";
import { ToolTip } from "@conduction/components";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { BulkActionButton } from "../../../../../components/bulkActionButton/BulkActionButton";
import { StatusTag } from "../../../../../components/statusTag/StatusTag";
import { useBulkSelect } from "../../../../../hooks/useBulkSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useObject } from "../../../../../hooks/object";
import { navigate } from "gatsby";

interface FormStepFinalizeImportProps {
  uploadQuery: UseMutationResult<any, Error, FormData, unknown>;
  executedActions: any[];
  setExecutedActions: React.Dispatch<React.SetStateAction<any[]>>;
}

export const FormStepFinalizeImport: React.FC<FormStepFinalizeImportProps> = ({
  uploadQuery,
  executedActions,
  setExecutedActions,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const createOrEdit = useObject().importCreateOrEdit();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, toggleItem } = useBulkSelect(
    uploadQuery.data?.results,
  );

  const onSubmit = async () => {
    setIsLoading(true);

    const mutationPromises = selectedItems.map((selectedItem) => {
      return createOrEdit.mutateAsync({
        payload: { ...uploadQuery.data?.results[selectedItem].object, id: uploadQuery.data?.results[selectedItem].id },
      });
    });

    Promise.all(mutationPromises).then((responses) => {
      setIsLoading(false);
      setExecutedActions(responses);
    });
  };

  if (uploadQuery.isLoading || isLoading) return <Skeleton height="200px" />;
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
      {executedActions.length === 0 && (
        <>
          <Alert variant="info" title="" text="Select the object action(s) you want to execute." />

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <CheckboxBulkSelectAll
                    disabled={uploadQuery.data?.results.some((object: any) => object.validations !== null)}
                  />
                </TableHeader>
                <TableHeader>Object</TableHeader>
                <TableHeader>Action (method)</TableHeader>
                <TableHeader>Validations succesful</TableHeader>
              </TableRow>
            </TableHead>

            <TableBody>
              {uploadQuery.data?.results.map((object: any, idx: any) => (
                <TableRow key={idx} onClick={() => !object.validations && toggleItem(idx.toString())}>
                  <TableCell>{<CheckboxBulkSelectOne disabled={object.validations} id={idx.toString()} />}</TableCell>

                  <TableCell>
                    <ToolTip tooltip={JSON.stringify(object.object)}>
                      <div>
                        View object {idx + 1} <FontAwesomeIcon icon={faInfoCircle} />
                      </div>
                    </ToolTip>
                  </TableCell>

                  <TableCell>
                    <StatusTag label={object.action} type="info" />
                  </TableCell>

                  <TableCell>
                    {!object.validations && <StatusTag label="Yes" type="success" />}

                    {object.validations && (
                      <ToolTip tooltip={JSON.stringify(object.validations)}>
                        <StatusTag label="No" type="critical" />
                      </ToolTip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <BulkActionButton actions={[{ type: "execute", onSubmit }]} selectedItemsCount={selectedItems.length} />
        </>
      )}

      {executedActions.length > 0 && (
        <>
          <Alert
            variant="success"
            text="All actions have been executed, with the results outlined in the table below."
            title="Actions executed"
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>

            <TableBody>
              {executedActions.map((object, idx) => (
                <TableRow key={idx}>
                  <TableCell>{object._self.name}</TableCell>
                  <TableCell onClick={() => navigate(`/objects/${object._self.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

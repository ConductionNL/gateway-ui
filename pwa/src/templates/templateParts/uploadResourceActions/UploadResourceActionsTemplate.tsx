import * as React from "react";
import * as styles from "./UploadResourceActionsTemplate.module.css";
import _ from "lodash";
import clsx from "clsx";

import { FileRejection, useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../../components/button/Button";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { useBulkSelect } from "../../../hooks/useBulkSelect";
import { BulkActionButton } from "../../../components/bulkActionButton/BulkActionButton";
import { Alert } from "@gemeente-denhaag/components-react";
import { toast } from "react-hot-toast";
import { StatusTag } from "../../../components/statusTag/StatusTag";
import { TOOLTIP_ID } from "../../../layout/Layout";

export const UploadResourceActionsTemplate: React.FC = () => {
  const [acceptedFiles, setAcceptedFiles] = React.useState<any[]>([]);
  const [rejectedFiles, setRejectedFiles] = React.useState<any[]>([]);

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, toggleItem } = useBulkSelect(acceptedFiles);

  const onDrop = React.useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setAcceptedFiles((oldFiles) => _.uniqBy([...oldFiles, ...acceptedFiles], "name"));
    setRejectedFiles((oldFiles) => _.uniqBy([...oldFiles, ...rejectedFiles], "file.name"));

    if (rejectedFiles.length) toast.error("Oops, one or more selected files could not be processed.");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "application/xml": [".xml"],
      "application/json": [".json"],
      "text/yaml": [".yaml"],
    },
  });

  return (
    <div className={styles.container}>
      {!acceptedFiles.length && !rejectedFiles.length && (
        <Alert title="" variant="info" text="Start by uploading file(s)" />
      )}

      <div className={styles.dropzoneContainer}>
        <div className={clsx(styles.dropzone, isDragActive && styles.active)} {...getRootProps()}>
          <input {...getInputProps()} />

          <FontAwesomeIcon className={styles.icon} icon={faFileImport} />

          <span>Drag your files (.xml, .yaml or .json) here to start uploading.</span>

          <span className={styles.otherOptionIndicator}>— or —</span>

          <Button variant="primary" label="Browse files" icon={faFileImport} />
        </div>
      </div>

      {!!acceptedFiles.length && (
        <section>
          <BulkActionButton
            actions={[{ type: "execute", onSubmit: () => alert(`Sending to gateway: ${selectedItems.toString()}`) }]}
            selectedItemsCount={selectedItems.length}
          />

          <Alert variant="info" title="" text="Select the file(s) you want to execute." />

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <CheckboxBulkSelectAll />
                </TableHeader>
                <TableHeader>Title</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>

            <TableBody>
              {acceptedFiles.map((file, idx) => (
                <TableRow key={idx} onClick={() => toggleItem(idx.toString())}>
                  <TableCell>{<CheckboxBulkSelectOne id={idx.toString()} />}</TableCell>

                  <TableCell>{file.name}</TableCell>

                  <TableCell>
                    <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content="Ready to be executed">
                      <StatusTag label="Ready" type="success" />
                    </span>
                  </TableCell>
                </TableRow>
              ))}

              {rejectedFiles.map(({ file, errors }) => (
                <TableRow>
                  <TableCell>
                    <input type="checkbox" disabled />
                  </TableCell>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                    <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content={errors[0].message}>
                      <StatusTag label="Critical error" type="critical" />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  );
};

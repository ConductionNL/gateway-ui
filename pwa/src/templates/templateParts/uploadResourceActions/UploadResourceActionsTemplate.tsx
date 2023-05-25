import * as React from "react";
import * as styles from "./UploadResourceActionsTemplate.module.css";
import _ from "lodash";
import clsx from "clsx";

import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../../components/button/Button";
import { StatusTag } from "../../../components/statusTag/StatusTag";
import { Heading3 } from "@gemeente-denhaag/components-react";

export const UploadResourceActionsTemplate: React.FC = () => {
  const [acceptedFiles, setAcceptedFiles] = React.useState<any[]>([]);

  const onDrop = React.useCallback((acceptedFiles, rejectedFiles) => {
    setAcceptedFiles(acceptedFiles);
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
      <div className={styles.dropzoneContainer}>
        <div className={clsx(styles.dropzone, isDragActive && styles.active)} {...getRootProps()}>
          <input {...getInputProps()} />

          <FontAwesomeIcon className={styles.icon} icon={faFileImport} />

          <span>Drag your files (.xml, .yaml or .json) here to start uploading.</span>

          <span className={styles.otherOptionIndicator}>— or —</span>

          <Button variant="primary" label="Browse files" icon={faFileImport} />
        </div>
      </div>

      {acceptedFiles.length > 0 && (
        <div className={styles.filesContainer}>
          <Heading3>Processing the following files, please wait...</Heading3>

          <div className={styles.files}>
            {acceptedFiles.map((file, idx) => (
              <StatusTag key={idx} label={`${idx + 1}. ${file.name}`} type="success" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import * as React from "react";
import * as styles from "./FormStepFileSelect.module.css";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { FileRejection, useDropzone } from "react-dropzone";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../../../../../components/button/Button";

interface FormStepFileSelect {
  setValue: UseFormSetValue<FieldValues>;
  registerFileName: string;
}

export const FormStepFileSelect: React.FC<FormStepFileSelect> = ({ setValue, registerFileName }) => {
  const onDrop = React.useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length) {
      toast.error("Oops, one or more selected files could not be processed.");

      return;
    }

    setValue(registerFileName, acceptedFiles[0]);
    toast.success(`File selected: ${acceptedFiles[0].name}`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/xlsx": [".xlsx"],
      "application/xls": [".xls"],
      "application/ods": [".ods"],
    },
  });

  return (
    <div className={styles.dropzoneContainer}>
      <div className={clsx(styles.dropzone, isDragActive && styles.active)} {...getRootProps()}>
        <input {...getInputProps()} />

        <FontAwesomeIcon className={styles.icon} icon={faFileImport} />

        <span>Drag your file (.xlsx, .xls, or .ods) here to start uploading.</span>

        <span className={styles.otherOptionIndicator}>— or —</span>

        <Button variant="primary" label="Browse files" icon={faFileImport} />
      </div>
    </div>
  );
};

import * as React from "react";
import * as styles from "./ImportResourceActionsTemplate.module.css";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/button/Button";
import { faCheckCircle, faChevronRight, faRefresh, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FormStepFileSelect } from "./formSteps/fileSelect/FormStepFileSelect";
import { FormStepOptionsSelect } from "./formSteps/optionsSelect/FormStepOptionsSelect";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUpload } from "../../../hooks/upload";
import { FormStepFinalizeImport } from "./formSteps/finalizeImport/FormStepFinalizeImport";

export const ImportResourceActionsTemplate: React.FC = () => {
  const [uploadSent, setUploadSent] = React.useState<boolean>(false);
  const [executedActions, setExecutedActions] = React.useState<any[]>([]);

  const REGISTER_FILE_NAME = "file"; // used to register the file field in React Hook Form
  const [fileAvailable, setFileAvailable] = React.useState<boolean>(false);

  const upload = useUpload().upload();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const onResetForm = () => {
    setValue("file", "");
    setValue("schema", "");
    setValue("mapping", "");
    setUploadSent(false);
    setFileAvailable(false);
    setExecutedActions([]);
  };

  const watchFile = watch("file");
  const watchSchema = watch("schema");

  React.useEffect(() => {
    setFileAvailable(!!watchFile);
  }, [watchFile]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    formData.append("upload", data.file);
    formData.append("schema", data.schema?.value);
    formData.append("mapping", data.mapping?.value);
    formData.append("headers", data.headers);
    // formData.append("delimiter", data.delimiter); required when adding .csv functionality

    upload.mutate(formData);

    setUploadSent(true);
  };

  return (
    <div>
      {fileAvailable && (
        <div className={styles.restartFormContainer}>
          <Button variant="secondary" label="Restart form" icon={faRefresh} onClick={onResetForm} />
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Collapsible
          contentInnerClassName={styles.collapsibleContent}
          openedClassName={styles.collapsibleIsOpen}
          triggerDisabled={uploadSent}
          trigger={
            <CollapsibleTrigger
              label={
                <span>
                  {!fileAvailable && (
                    <>
                      <strong>Step one: </strong> select your file
                    </>
                  )}
                  {fileAvailable && (
                    <>
                      <strong>File selected: </strong> {watchFile.name}
                    </>
                  )}
                </span>
              }
              isCompleted={fileAvailable}
            />
          }
          open={!fileAvailable && !uploadSent}
          transitionTime={200}
        >
          <FormStepFileSelect registerFileName={REGISTER_FILE_NAME} {...{ setValue }} />
        </Collapsible>

        <Collapsible
          contentInnerClassName={styles.collapsibleContent}
          openedClassName={styles.collapsibleIsOpen}
          triggerDisabled={uploadSent}
          trigger={
            <CollapsibleTrigger
              label={
                <span>
                  {!uploadSent && (
                    <>
                      <strong>Step two:</strong> select configuration
                    </>
                  )}
                  {uploadSent && (
                    <>
                      <strong>Configuration completed</strong>
                    </>
                  )}
                </span>
              }
              isCompleted={uploadSent}
            />
          }
          open={fileAvailable && !uploadSent}
          transitionTime={200}
        >
          <FormStepOptionsSelect {...{ register, errors, control }} />
        </Collapsible>

        {!uploadSent && (
          <div className={styles.submitContainer}>
            <Button
              label="Upload file and configuration"
              variant="primary"
              type="submit"
              icon={faUpload}
              disabled={!fileAvailable || !watchSchema}
            />
          </div>
        )}

        <hr />

        <Collapsible
          contentInnerClassName={styles.collapsibleContent}
          openedClassName={styles.collapsibleIsOpen}
          trigger={<CollapsibleTrigger label={<strong>Select and exectute actions</strong>} />}
          triggerDisabled={!uploadSent}
          open={uploadSent}
          transitionTime={200}
        >
          <FormStepFinalizeImport
            uploadQuery={upload}
            handleResetForm={onResetForm}
            {...{ executedActions, setExecutedActions }}
          />
        </Collapsible>
      </form>
    </div>
  );
};

interface CollapsibleTriggerProps {
  label: JSX.Element;
  isCompleted?: boolean;
}

const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({ label, isCompleted }) => {
  return (
    <div className={styles.triggerContainer}>
      {label} <FontAwesomeIcon className={styles.triggerIcon} icon={!isCompleted ? faChevronRight : faCheckCircle} />
    </div>
  );
};

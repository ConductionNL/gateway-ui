import * as React from "react";
import * as styles from "./ImportResourceActionsTemplate.module.css";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/button/Button";
import { faCheckCircle, faChevronRight, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FormStepFileSelect } from "./formSteps/fileSelect/FormStepFileSelect";
import { FormStepOptionsSelect } from "./formSteps/optionsSelect/FormStepOptionsSelect";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ImportResourceActionsTemplate: React.FC = () => {
  const [uploadSent, setUploadSent] = React.useState<boolean>(false);

  const REGISTER_FILE_NAME = "file"; // used to register the file field in React Hook Form
  const [fileAvailable, setFileAvailable] = React.useState<boolean>(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const watchFile = watch("file");
  const watchSchema = watch("schema");

  React.useEffect(() => {
    setFileAvailable(!!watchFile);
  }, [watchFile]);

  const onSubmit = (data: any) => {
    console.log({ data });

    setUploadSent(true);
  };

  return (
    <div className={styles.container}>
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
                  <strong>Step two:</strong> select configuration
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

import * as React from "react";
import * as styles from "./ObjectFormTemplate.module.css";
import { useForm } from "react-hook-form";
import { Alert, Button, Divider, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useObject } from "../../../hooks/object";
import { SchemaFormTemplate } from "../schemaForm/SchemaFormTemplate";

interface EditObjectFormTemplateProps {
  object: any;
  objectId: string;
}

export const EditObjectFormTemplate: React.FC<EditObjectFormTemplateProps> = ({ object, objectId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useObjects = useObject(queryClient);
  const createOrEditObject = _useObjects.createOrEdit(objectId);
  const deleteObject = _useObjects.remove();

  const getSchema = _useObjects.getSchema(objectId);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditObject.mutate({ payload: data, id: objectId });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Edit Object")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />

              {t("Save")}
            </Button>
            <Button className={clsx(styles.buttonIcon, styles.deleteButton)}>
              <FontAwesomeIcon icon={faTrash} />
              {t("Delete")}
            </Button>
          </div>
        </section>

        {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}

        <Divider />

        {getSchema.isSuccess && getSchema.data && (
          <SchemaFormTemplate {...{ register, errors, control }} schema={getSchema.data} disabled={loading} />
        )}
      </form>
    </div>
  );
};

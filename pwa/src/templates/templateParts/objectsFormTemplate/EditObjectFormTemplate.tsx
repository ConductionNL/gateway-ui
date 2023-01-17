import * as React from "react";
import * as styles from "./ObjectFormTemplate.module.css";
import { useForm } from "react-hook-form";
import { Button, Divider, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useObject } from "../../../hooks/object";
import { SchemaFormTemplate } from "../schemaForm/SchemaFormTemplate";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { navigate } from "gatsby";
import { mapSelectInputFormData } from "../../../services/mapSelectInputFormData";
import { FormFromSchema } from "../../../formGeneration/FormFromSchema";

interface EditObjectFormTemplateProps {
  object: any;
  getSchema: any;
  objectId: string;
}

export const EditObjectFormTemplate: React.FC<EditObjectFormTemplateProps> = ({ object, getSchema, objectId }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();

  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const _useObjects = useObject(queryClient);
  const createOrEditObject = _useObjects.createOrEdit(objectId);
  const deleteObject = _useObjects.remove();

  const dashboardCard = getDashboardCard(object.id);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (createOrEditObject.isLoading || deleteObject.isLoading || getSchema.isLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);
  }, [createOrEditObject.isLoading, deleteObject.isLoading, getSchema.isLoading]);

  const onSubmit = (data: any): void => {
    const payload = data;

    delete payload.schema;

    createOrEditObject.mutate({ payload: mapSelectInputFormData(payload), entityId: null, objectId });
  };

  const handleDeleteObject = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this object?");

    if (confirmDeletion) {
      deleteObject.mutate({ id: objectId });
      navigate("/objects");
    }
  };

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(object.id, "Data layer", "ObjectEntity", objectId, dashboardCard?.id);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{`Edit ${object.name}`}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>

            <Button className={styles.buttonIcon} onClick={addOrRemoveFromDashboard}>
              <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
              {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
            </Button>

            <Button
              onClick={handleDeleteObject}
              className={clsx(styles.buttonIcon, styles.deleteButton)}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTrash} />
              {t("Delete")}
            </Button>
          </div>
        </section>

        <Divider />

        {getSchema.isSuccess && getSchema.data && (
          <>
            <SchemaFormTemplate {...{ register, errors, control }} schema={getSchema.data} disabled={loading} />
            <FormFromSchema {...{ register, errors, control }} schema={getSchema.data} disabled={loading} />
          </>
        )}
      </form>
    </div>
  );
};

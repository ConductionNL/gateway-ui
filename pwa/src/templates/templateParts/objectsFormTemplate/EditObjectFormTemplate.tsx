import * as React from "react";
import * as styles from "./ObjectFormTemplate.module.css";
import { useForm } from "react-hook-form";
import { Button, Divider, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useObject } from "../../../hooks/object";
import { SchemaFormTemplate } from "../schemaForm/SchemaFormTemplate";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { navigate } from "gatsby";
import { mapSelectInputFormData } from "../../../services/mapSelectInputFormData";
import Skeleton from "react-loading-skeleton";
import { FormSaveButton, TAfterSuccessfulFormSubmit } from "../formSaveButton/FormSaveButton";

interface EditObjectFormTemplateProps {
  object: any;
  getSchema: any;
  objectId: string;
}

export const EditObjectFormTemplate: React.FC<EditObjectFormTemplateProps> = ({ object, getSchema, objectId }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();
  const [afterSuccessfulFormSubmit, setAfterSuccessfulFormSubmit] = React.useState<TAfterSuccessfulFormSubmit>("save");

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
    delete data.schema;
    createOrEditObject.mutate(
      { payload: mapSelectInputFormData(data), entityId: null, objectId },
      {
        onSuccess: () => {
          switch (afterSuccessfulFormSubmit) {
            case "saveAndClose":
              navigate("/objects/");
              break;

            case "saveAndCreateNew":
              navigate("/objects/new");
              break;
          }
        },
      },
    );
  };

  const handleDeleteObject = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this object?");

    if (confirmDeletion) {
      deleteObject.mutate({ id: objectId });
      navigate("/objects");
    }
  };

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(object.id, "object", "ObjectEntity", objectId, dashboardCard?.id);
  };

  return (
    <>
      {!getSchema.data && <Skeleton height="200px" />}

      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.section}>
            <Heading1>{`Edit ${object._self.name}`}</Heading1>

            <div className={styles.buttons}>
              <FormSaveButton disabled={loading} {...{ setAfterSuccessfulFormSubmit }} />

              <Button
                className={clsx(styles.buttonIcon, styles.button)}
                onClick={addOrRemoveFromDashboard}
                disabled={loading}
              >
                <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
                {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
              </Button>

              <Button
                onClick={handleDeleteObject}
                className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </div>
          </section>

          <Divider />

          {getSchema.data && (
            <SchemaFormTemplate {...{ register, errors, control }} schema={getSchema.data} disabled={loading} />
          )}
        </form>
      </div>
    </>
  );
};

import * as React from "react";
import * as styles from "./ObjectFormTemplate.module.css";
import { useForm } from "react-hook-form";
import { Divider, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useObject } from "../../../hooks/object";
import { SchemaFormTemplate } from "../schemaForm/SchemaFormTemplate";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { navigate } from "gatsby";
import { mapSelectInputFormData } from "../../../services/mapSelectInputFormData";
import Skeleton from "react-loading-skeleton";
import { FormSaveButton, TAfterSuccessfulFormSubmit } from "../formSaveButton/FormSaveButton";
import { Button } from "../../../components/button/Button";

interface EditObjectFormTemplateProps {
  object: any;
  getSchema: any;
  objectId: string;
}

export const EditObjectFormTemplate: React.FC<EditObjectFormTemplateProps> = ({ object, getSchema, objectId }) => {
  const { t } = useTranslation();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();
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
    setLoading(createOrEditObject.isLoading || deleteObject.isLoading || getSchema.isLoading || dashboardLoading);
  }, [createOrEditObject.isLoading, deleteObject.isLoading, getSchema.isLoading, dashboardLoading]);

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

  const toggleFromDashboard = () => {
    toggleDashboardCard(object.id, "object", "ObjectEntity", objectId, dashboardCard?.id);
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
                label={dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
                variant="primary"
                icon={dashboardCard ? faMinus : faPlus}
                onClick={toggleFromDashboard}
                disabled={loading}
              />

              <Button
                label={t("Delete")}
                variant="danger"
                icon={faTrash}
                onClick={handleDeleteObject}
                disabled={loading}
              />
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

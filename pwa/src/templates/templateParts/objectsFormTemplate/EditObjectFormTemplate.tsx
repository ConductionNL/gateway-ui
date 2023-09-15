import * as React from "react";
import * as styles from "./ObjectFormTemplate.module.css";
import { useForm } from "react-hook-form";
import { Alert } from "@gemeente-denhaag/components-react";
import { faCopy, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useObject } from "../../../hooks/object";
import { SchemaFormTemplate } from "../schemaForm/SchemaFormTemplate";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { navigate } from "gatsby";
import { mapSelectInputFormData } from "../../../services/mapSelectInputFormData";
import { FormSaveButton, TAfterSuccessfulFormSubmit } from "../formSaveButton/FormSaveButton";
import { useObjectsStateContext } from "../../../context/objects";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";
import { ActionButton } from "../../../components/actionButton/ActionButton";
import { useTranslation } from "react-i18next";

interface EditObjectFormTemplateProps {
  object: any;
  schema: any; // data from useObject.getSchema
  objectId: string;
}

export const EditObjectFormTemplate: React.FC<EditObjectFormTemplateProps> = ({ object, schema, objectId }) => {
  const { t } = useTranslation();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();
  const [afterSuccessfulFormSubmit, setAfterSuccessfulFormSubmit] = React.useState<TAfterSuccessfulFormSubmit>("save");

  const {
    objectsState: { inDuplicatingMode },
    setObjectsState,
  } = useObjectsStateContext();

  const [loading, setLoading] = React.useState<boolean>(false);

  const _useObjects = useObject();
  const createOrEditObject = _useObjects.createOrEdit(!inDuplicatingMode ? objectId : undefined);
  const deleteObject = _useObjects.remove();
  const downloadObject = useObject().downloadPDF();

  const dashboardCard = getDashboardCard(object._id);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    setLoading(createOrEditObject.isLoading || deleteObject.isLoading || dashboardLoading);
  }, [createOrEditObject.isLoading, deleteObject.isLoading, dashboardLoading]);

  const onSubmit = (data: any): void => {
    delete data.schema;

    createOrEditObject.mutate(
      {
        payload: mapSelectInputFormData(data),
        entityId: !inDuplicatingMode ? undefined : object?._self?.schema?.id,
        objectId: !inDuplicatingMode ? objectId : undefined,
      },
      {
        onSuccess: (res) => {
          switch (afterSuccessfulFormSubmit) {
            case "save":
              if (inDuplicatingMode) {
                navigate(`/objects/${res.id}`);
              }
              break;
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
    toggleDashboardCard(object._id, "object", "ObjectEntity", objectId, dashboardCard?.id);
  };
  return (
    <>
      <div className={styles.container}>
        {inDuplicatingMode && (
          <Alert
            title="Duplicating mode active"
            text="In this mode, you're creating new objects instead of editing existing ones. To exit duplicating mode, click 'Exit duplicating mode'."
            variant="info"
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormHeaderTemplate
            title={`Edit ${object._self.name}`}
            disabled={loading}
            showTitleTooltip
            customElements={
              <>
                <FormSaveButton disabled={loading} {...{ setAfterSuccessfulFormSubmit }} />

                <ActionButton
                  actions={[
                    {
                      type: "duplicate",
                      onSubmit: () => setObjectsState({ inDuplicatingMode: !inDuplicatingMode }),
                      label: !!inDuplicatingMode ? "Exit duplicating mode" : "Duplicating mode",
                      icon: faCopy,
                      disabled: loading,
                    },
                    {
                      type: "add",
                      onSubmit: toggleFromDashboard,
                      label: !!dashboardCard ? t("Remove from dashboard") : t("Add to dashboard"),
                      icon: !!dashboardCard ? faMinus : faPlus,
                      disabled: loading,
                    },
                    {
                      type: "download",
                      onSubmit: () => downloadObject.mutate({ id: objectId, name: object.name }),
                    },
                    { type: "delete", onSubmit: () => handleDeleteObject },
                  ]}
                  variant="secondary"
                />
              </>
            }
          />

          <SchemaFormTemplate {...{ register, errors, control, schema }} disabled={loading} />
        </form>
      </div>
    </>
  );
};

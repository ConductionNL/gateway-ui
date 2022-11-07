import * as React from "react";
import * as styles from "./CollectionFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useCollection } from "../../../hooks/collection";
import { useDashboardCard } from "../../../hooks/useDashboardCard";

interface EditCollectionFormTemplateProps {
  collection: any;
  collectionId: string;
}

export const EditCollectionFormTemplate: React.FC<EditCollectionFormTemplateProps> = ({ collection, collectionId }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();

  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useCollection = useCollection(queryClient);
  const createOrEditCollection = _useCollection.createOrEdit(collectionId);
  const deleteCollection = _useCollection.remove();

  const dashboardCard = getDashboardCard(collection.name);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditCollection.mutate({ payload: data, id: collectionId });
  };

  const handleDelete = (id: string): void => {
    deleteCollection.mutateAsync({ id: id });
  };

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(collection.name, "Collection", "CollectionEntity", collectionId, dashboardCard?.id);
  };

  const handleSetFormValues = (collection: any): void => {
    const basicFields: string[] = ["name"];
    basicFields.forEach((field) => setValue(field, collection[field]));
  };

  React.useEffect(() => {
    handleSetFormValues(collection);
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Edit Collection")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>

            <Button className={styles.buttonIcon} onClick={addOrRemoveFromDashboard}>
              <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
              {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
            </Button>

            <Button className={clsx(styles.buttonIcon, styles.deleteButton)}>
              <FontAwesomeIcon icon={faTrash} />
              {t("Delete")}
            </Button>
          </div>
        </section>
        {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
        <div className={styles.container}>
          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Name")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="name" validation={{ required: true }} disabled={loading} />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

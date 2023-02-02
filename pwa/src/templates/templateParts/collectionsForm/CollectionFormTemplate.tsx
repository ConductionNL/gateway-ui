import * as React from "react";
import * as styles from "./CollectionFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText } from "@conduction/components";
import { useQueryClient } from "react-query";
import { useCollection } from "../../../hooks/collection";
import { IsLoadingContext } from "../../../context/isLoading";

interface CollectionFormTemplateProps {
  collection?: any;
}

export const formId: string = "collection-form";

export const CollectionFormTemplate: React.FC<CollectionFormTemplateProps> = ({ collection }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const queryClient = useQueryClient();
  const _useCollection = useCollection(queryClient);
  const createOrEditCollection = _useCollection.createOrEdit(collection?.id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditCollection.mutate({ payload: data, id: collection?.id });
  };

  const handleSetFormValues = (): void => {
    const basicFields: string[] = ["name"];
    basicFields.forEach((field) => setValue(field, collection[field]));
  };

  React.useEffect(() => {
    collection && handleSetFormValues();
  }, [collection]);

  React.useEffect(() => {
    setIsLoading({ ...isLoading, collectionForm: createOrEditCollection.isLoading });
  }, [createOrEditCollection.isLoading]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>

              <InputText
                {...{ register, errors }}
                name="name"
                validation={{ required: true }}
                disabled={isLoading.collectionForm}
              />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

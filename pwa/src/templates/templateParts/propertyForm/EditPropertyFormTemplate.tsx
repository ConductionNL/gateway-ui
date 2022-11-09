import * as React from "react";
import * as styles from "./PropertyFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputCheckbox, InputNumber, InputText, SelectSingle } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useAttribute } from "../../../hooks/attribute";

interface EditPropertyFormTemplateProps {
  property: any;
  propertyId: string;
  schemaId: string;
}

export const EditPropertyFormTemplate: React.FC<EditPropertyFormTemplateProps> = ({
  property,
  propertyId,
  schemaId,
}) => {
  const { t } = useTranslation();

  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useAttribute = useAttribute(queryClient);
  const createOrEditProperty = _useAttribute.createOrEdit(schemaId, propertyId);
  const deleteProperty = _useAttribute.remove(schemaId);

  const typeSelectOptions = [
    { label: "String", value: "string" },
    { label: "Integer", value: "integer" },
    { label: "Boolean", value: "boolean" },
    { label: "Float", value: "float" },
    { label: "Number", value: "number" },
    { label: "Datetime", value: "datetime" },
    { label: "Date", value: "date" },
    { label: "File", value: "file" },
    { label: "Object", value: "object" },
    { label: "Array", value: "array" },
  ];

  const formatSelectOptions = [
    { label: "CountryCode", value: "countryCode" },
    { label: "Bsn", value: "bsn" },
    { label: "Url", value: "url" },
    { label: "Uri", value: "uri" },
    { label: "Uuid", value: "uuid" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Json", value: "json" },
    { label: "Dutch_pc4", value: "dutch_pc4" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    if (parseInt(data.minLength) > parseInt(data.maxLength)) return setFormError("minLength is bigger than maxLEngth");

    const payload = {
      ...data,
      type: data.type && data.type.value,
      format: data.format && data.format.value,
      minLength: parseInt(data.minLength),
      maxLength: parseInt(data.maxLength),
    };

    createOrEditProperty.mutate({ payload, id: propertyId });
  };

  const handleDeleteProperty = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deleteProperty.mutate({ id: propertyId });
    }
  };

  const handleSetFormValues = (cronjob: any): void => {
    const basicFields: string[] = ["name", "extend", "include", "minLength", "maxLength"];
    basicFields.forEach((field) => setValue(field, cronjob[field]));

    setValue(
      "type",
      typeSelectOptions.find((option) => property.type === option.value),
    );

    setValue(
      "format",
      formatSelectOptions.find((option) => property.format === option.value),
    );
  };

  React.useEffect(() => {
    handleSetFormValues(property);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.section}>
            <Heading1>{t("Edit Property")}</Heading1>

            <div className={styles.buttons}>
              <Button className={styles.buttonIcon} type="submit" disabled={loading}>
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>

              <Button onClick={handleDeleteProperty} className={clsx(styles.buttonIcon, styles.deleteButton)}>
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </div>
          </section>
          {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
          <div className={styles.gridContainer}>
            <div className={styles.grid}>
              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Name")}</FormFieldLabel>
                  <InputText {...{ register, errors }} name="name" validation={{ required: true }} disabled={loading} />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Type")}</FormFieldLabel>
                  {/* @ts-ignore */}
                  <SelectSingle
                    {...{ register, errors, control }}
                    name="type"
                    options={typeSelectOptions}
                    disabled={loading}
                  />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("extend")}</FormFieldLabel>
                  <InputCheckbox {...{ register, errors }} label="on" name="extend" />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("include")}</FormFieldLabel>
                  <InputCheckbox {...{ register, errors }} label="on" name="include" />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("minLength")}</FormFieldLabel>
                  <InputNumber {...{ register, errors }} name="minLength" disabled={loading} />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("maxLength")}</FormFieldLabel>
                  <InputNumber {...{ register, errors }} name="maxLength" disabled={loading} />
                </FormFieldInput>
              </FormField>

              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Format")}</FormFieldLabel>
                  {/* @ts-ignore */}
                  <SelectSingle
                    {...{ register, errors, control }}
                    name="format"
                    options={formatSelectOptions}
                    disabled={loading}
                  />
                </FormFieldInput>
              </FormField>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

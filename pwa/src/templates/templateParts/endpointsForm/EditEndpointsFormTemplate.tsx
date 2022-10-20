import * as React from "react";
import * as styles from "./EndpointsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useEndpoint } from "../../../hooks/endpoints";

interface EditEndpointFormTemplateProps {
  endpoint: any;
  endpointId?: string;
}

export const EditEndpointFormTemplate: React.FC<EditEndpointFormTemplateProps> = ({ endpoint, endpointId }) => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const createOrEditEndpoint = _useEndpoints.createOrEdit(endpointId);
  const deleteEndpoint = _useEndpoints.remove();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditEndpoint.mutate({ payload: data, id: endpointId });
  };

  const handleDelete = (id: string): void => {
    deleteEndpoint.mutateAsync({ id: id });
  };

  const handleSetFormValues = (endpoint: any): void => {
    const basicFields: string[] = ["name"];
    basicFields.forEach((field) => setValue(field, endpoint[field]));
  };

  React.useEffect(() => {
    handleSetFormValues(endpoint);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className={styles.section}>
        <Heading1>{t("Edit Endpoint")}</Heading1>

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
  );
};

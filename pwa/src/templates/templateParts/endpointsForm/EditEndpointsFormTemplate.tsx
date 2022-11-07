import * as React from "react";
import * as styles from "./EndpointsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText, SelectSingle, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useEndpoint } from "../../../hooks/endpoint";
import { useDashboardCard } from "../../../hooks/useDashboardCard";

interface EditEndpointFormTemplateProps {
  endpoint: any;
  endpointId: string;
}

export const EditEndpointFormTemplate: React.FC<EditEndpointFormTemplateProps> = ({ endpoint, endpointId }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();

  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const createOrEditEndpoint = _useEndpoints.createOrEdit(endpointId);
  const deleteEndpoint = _useEndpoints.remove();

  const dashboardCard = getDashboardCard(endpoint.name);

  const methodSelectOptions = [
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "UPDATE", value: "UPDATE" },
    { label: "DELETE", value: "DELETE" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    data = { ...data, method: data.method.value };

    createOrEditEndpoint.mutate({ payload: data, id: endpointId });
  };

  const handleDelete = (id: string): void => {
    deleteEndpoint.mutateAsync({ id: id });
  };

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(endpoint.name, "Endpoint", "Endpoint", endpointId, dashboardCard?.id);
  };

  const handleSetFormValues = (endpoint: any): void => {
    const basicFields: string[] = ["name", "description", "pathRegex", "tag"];
    basicFields.forEach((field) => setValue(field, endpoint[field]));

    setValue(
      "method",
      methodSelectOptions.find((option) => endpoint.method === option.value),
    );
  };

  React.useEffect(() => {
    handleSetFormValues(endpoint);
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Edit Endpoint")}</Heading1>

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
                <FormFieldLabel>{t("Description")}</FormFieldLabel>
                <Textarea
                  {...{ register, errors }}
                  name="description"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Path Regex")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="pathRegex"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Method")}</FormFieldLabel>
                {/* @ts-ignore */}
                <SelectSingle
                  name="method"
                  options={methodSelectOptions}
                  {...{ control, errors }}
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Tag")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="tag" validation={{ required: true }} disabled={loading} />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

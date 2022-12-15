import * as React from "react";
import * as styles from "./EndpointsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, {
  FormFieldGroup,
  FormFieldGroupLabel,
  FormFieldInput,
  FormFieldLabel,
} from "@gemeente-denhaag/form-field";
import { Alert, Button, Checkbox, FormControlLabel, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText, SelectMultiple, SelectSingle, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useEndpoint } from "../../../hooks/endpoint";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { useSource } from "../../../hooks/source";
import { useSchema } from "../../../hooks/schema";
import Skeleton from "react-loading-skeleton";
import { CreateKeyValue } from "@conduction/components/lib/components/formFields";

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
  const [methods, setMethods] = React.useState<any[]>([]);
  const [pathParts, setPathParts] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const createOrEditEndpoint = _useEndpoints.createOrEdit(endpointId);
  const deleteEndpoint = _useEndpoints.remove();

  const dashboardCard = getDashboardCard(endpoint.name);

  const _useSource = useSource(queryClient);
  const getSources = _useSource.getAll();
  const getSource = _useSource.getOne(endpoint?.proxy?.id);

  const _useSchema = useSchema(queryClient);
  const getSchemas = _useSchema.getAll();

  const methodSelectOptions = [
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "UPDATE", value: "UPDATE" },
    { label: "DELETE", value: "DELETE" },
  ];

  const operationTypeSelectOptions = [
    { label: "Item", value: "item" },
    { label: "Collection", value: "collection" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      method: data.method && data.method.value,
      path: data.path.split(","),
      throws: data.throws ? data.throws.split(",") : null,
      proxy: data.source && `/admin/gateways/${data.source.value}`,
      entities: data.schemas.map((schema: any) => `/admin/entities/${schema.value}`),
      methods: methods,
      operationType: data.operationType.value,
    };

    createOrEditEndpoint.mutate({ payload, id: endpointId });
    queryClient.setQueryData(["endpoint", endpointId], data);
  };

  const addToArray = (value: string) => {
    !methods.includes(value) ? methods.push(value) : removeMethod(methods, value);

    function removeMethod<T>(newMethodArray: Array<T>, value: T): Array<T> {
      const index = newMethodArray.indexOf(value);
      if (index > -1) {
        newMethodArray.splice(index, 1);
        setMethods(newMethodArray);
      }
      return newMethodArray;
    }
  };

  const handleDelete = () => {
    deleteEndpoint.mutate({ id: endpointId });
  };

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(endpoint.name, "Endpoint", "Endpoint", endpointId, dashboardCard?.id);
  };

  const handleSetFormValues = (endpoint: any): void => {
    const basicFields: string[] = ["name", "description", "pathRegex", "tag"];
    basicFields.forEach((field) => setValue(field, endpoint[field]));

    setValue("path", endpoint.path.toString());
    setValue("throws", endpoint.throws && endpoint.throws.toString());

    setValue(
      "method",
      methodSelectOptions.find((option) => endpoint.method === option.value),
    );

    setValue(
      "operationType",
      operationTypeSelectOptions.find((option) => endpoint.operationType === option.value),
    );

    setValue(
      "schemas",
      endpoint.entities?.map((schema: any) => ({ label: schema.name, value: schema.id })),
    );

    setMethods(endpoint.methods);

    if (Array.isArray(endpoint.pathArray) || endpoint.pathArray === undefined) {
      setPathParts(endpoint.pathArray);
    } else {
      const newPathParts = Object.entries(endpoint.pathArray).map(([key, value]) => ({ key, value: value }));
      setPathParts(newPathParts);
    }
  };

  const handleSetSelectFormValues = (endpoint: any): void => {
    getSource.isSuccess && setValue("source", { label: getSource.data.name, value: getSource.data.id });
  };

  React.useEffect(() => {
    handleSetSelectFormValues(endpoint);
  }, [getSource.isSuccess]);

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

            <Button className={clsx(styles.buttonIcon, styles.deleteButton)} onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
              {t("Delete")}
            </Button>
          </div>
        </section>
        {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="name" validation={{ required: true }} disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Operation Type")}</FormFieldLabel>
              {/* @ts-ignore */}
              <SelectSingle
                name="operationType"
                options={operationTypeSelectOptions}
                {...{ control, errors }}
                validation={{ required: true }}
                disabled={loading}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Path")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="path" validation={{ required: true }} disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Path Regex")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="pathRegex" disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Throws")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="throws" disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Tag")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="tag" disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Select a source")}</FormFieldLabel>

              {getSources.isLoading && getSource.isLoading && <Skeleton height="50px" />}
              {getSources.isSuccess && getSource.isSuccess && (
                // @ts-ignore
                <SelectSingle
                  options={getSources.data.map((source: any) => ({ label: source.name, value: source.id }))}
                  name="source"
                  validation={{ required: true }}
                  {...{ register, errors, control }}
                />
              )}
            </FormFieldInput>
          </FormField>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Select a schema")}</FormFieldLabel>

              {getSchemas.isLoading && <Skeleton height="50px" />}
              {getSchemas.isSuccess && (
                // @ts-ignore
                <SelectMultiple
                  options={getSchemas.data.map((schema: any) => ({ label: schema.name, value: schema.id }))}
                  name="schemas"
                  {...{ register, errors, control }}
                />
              )}
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Method")}</FormFieldLabel>
              {/* @ts-ignore */}
              <SelectSingle name="method" options={methodSelectOptions} {...{ control, errors }} disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormFieldGroup>
            <FormFieldGroupLabel>Methods</FormFieldGroupLabel>
            <FormFieldInput className={styles.grid}>
              <FormControlLabel
                input={
                  <Checkbox
                    name="checkbox"
                    checked={endpoint.methods && endpoint.methods.includes("GET")}
                    onChange={() => addToArray("GET")}
                  />
                }
                label="GET"
              />
              <FormControlLabel
                input={
                  <Checkbox
                    name="checkbox"
                    checked={endpoint.methods && endpoint.methods.includes("POST")}
                    onChange={() => addToArray("POST")}
                  />
                }
                label="POST"
              />
              <FormControlLabel
                input={
                  <Checkbox
                    name="checkbox"
                    checked={endpoint.methods && endpoint.methods.includes("PUT")}
                    onChange={() => addToArray("PUT")}
                  />
                }
                label="PUT"
              />
              <FormControlLabel
                input={
                  <Checkbox
                    name="checkbox"
                    checked={endpoint.methods && endpoint.methods.includes("PATCH")}
                    onChange={() => addToArray("PATCH")}
                  />
                }
                label="PATCH"
              />
              <FormControlLabel
                input={
                  <Checkbox
                    name="checkbox"
                    checked={endpoint.methods && endpoint.methods.includes("DELETE")}
                    onChange={() => addToArray("DELETE")}
                  />
                }
                label="DELETE"
              />
            </FormFieldInput>
          </FormFieldGroup>
        </div>

        <section className={styles.section}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>
              <Textarea {...{ register, errors }} name="description" disabled={loading} />
            </FormFieldInput>
          </FormField>
        </section>

        <section className={styles.section}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Path Parts")}</FormFieldLabel>
              {/* @ts-ignore */}
              <CreateKeyValue name="pathArray" defaultValue={pathParts} {...{ register, errors, control }} />{" "}
            </FormFieldInput>
          </FormField>
        </section>
      </form>
    </div>
  );
};

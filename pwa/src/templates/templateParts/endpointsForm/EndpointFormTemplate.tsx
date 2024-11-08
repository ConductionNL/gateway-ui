import * as React from "react";
import * as styles from "./EndpointsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, {
  FormFieldGroup,
  FormFieldGroupLabel,
  FormFieldInput,
  FormFieldLabel,
} from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText, SelectMultiple, SelectSingle, Textarea } from "@conduction/components";
import { useQueryClient } from "react-query";
import { useEndpoint } from "../../../hooks/endpoint";
import { CreateKeyValue, InputCheckbox } from "@conduction/components/lib/components/formFields";
import { useSource } from "../../../hooks/source";
import Skeleton from "react-loading-skeleton";
import { useSchema } from "../../../hooks/schema";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import { predefinedSubscriberEvents } from "../../../data/predefinedSubscriberEvents";
import { useIsLoadingContext } from "../../../context/isLoading";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

interface EndpointFormTemplateProps {
  endpoint?: any;
}

export const formId: string = "endpoint-form";

export const EndpointFormTemplate: React.FC<EndpointFormTemplateProps> = ({ endpoint }) => {
  const methods: string[] = ["GET", "PUT", "DELETE", "POST", "PATCH"];

  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const [pathParts, setPathParts] = React.useState<any[]>([]);
  const [throws, setThrows] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const createOrEditEndpoint = _useEndpoints.createOrEdit(endpoint?.id);

  const _useSource = useSource(queryClient);
  const getSources = _useSource.getAll();
  const getSource = _useSource.getOne(endpoint?.proxy?.id);

  const _useSchema = useSchema(queryClient);
  const getSchemas = _useSchema.getAll();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      path: data.path.split("/"),
      throws: data.throws?.map((_throw: any) => _throw.value),
      proxy: data.source && `/admin/gateways/${data.source.value}`,
      methods: methods.filter((method) => data.methods[method]),
      entities: data.schemas && data.schemas.map((schema: any) => `/admin/entities/${schema.value}`),
    };

    createOrEditEndpoint.mutate({ payload, id: endpoint?.id });
  };

  const handleSetFormValues = (): void => {
    const basicFields: string[] = ["reference", "version", "name", "description", "pathRegex", "tag"];
    basicFields.forEach((field) => setValue(field, endpoint[field]));

    setValue("path", endpoint.path && endpoint.path.join("/"));
    setValue(
      "throws",
      endpoint["throws"]?.map((_throw: any) => ({ label: _throw, value: _throw })),
    );

    setValue(
      "schemas",
      endpoint.entities?.map((schema: any) => ({ label: schema.name, value: schema.id })),
    );

    if (Array.isArray(endpoint.pathArray) || endpoint.pathArray === undefined) {
      setPathParts(endpoint.pathArray);
    } else {
      const newPathParts = Object.entries(endpoint.pathArray).map(([key, value]) => ({ key, value: value }));
      setPathParts(newPathParts);
    }
  };

  const handleSetSelectFormValues = (): void => {
    getSource.isSuccess && setValue("source", { label: getSource.data.name, value: getSource.data.id });
  };

  React.useEffect(() => {
    setIsLoading({ endpointForm: createOrEditEndpoint.isLoading });
  }, [createOrEditEndpoint.isLoading]);

  React.useEffect(() => {
    setThrows([...predefinedSubscriberEvents]);
  }, []);

  React.useEffect(() => {
    if (!endpoint) return;

    handleSetFormValues();
    handleSetSelectFormValues();
  }, [endpoint]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Reference")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="reference"
                disabled={isLoading.endpointForm}
                ariaLabel={t("Enter reference")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Version")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="version"
                disabled={isLoading.endpointForm}
                defaultValue={endpoint?.version ?? "0.0.0"}
                ariaLabel={t("Enter version")}
              />
            </FormFieldInput>
          </FormField>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="name"
                validation={enrichValidation({ required: true })}
                disabled={isLoading.endpointForm}
                ariaLabel={t("Enter name")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Path")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="path"
                validation={enrichValidation({ required: true })}
                disabled={isLoading.endpointForm}
                ariaLabel={t("Enter path")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Path Regex")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="pathRegex"
                disabled={isLoading.endpointForm}
                ariaLabel={t("Enter path regex")}
              />
            </FormFieldInput>
          </FormField>

          <FormFieldGroup className={styles.methods}>
            <FormFieldGroupLabel>Methods</FormFieldGroupLabel>
            {methods.map((method, idx) => (
              <InputCheckbox
                key={idx}
                name={`methods.${method}`}
                label={method}
                disabled={isLoading.endpointForm}
                defaultChecked={endpoint?.methods.includes(method)}
                {...{ register, errors }}
              />
            ))}
          </FormFieldGroup>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Throws")}</FormFieldLabel>
              {throws.length > 0 && (
                <SelectCreate
                  options={throws}
                  name="throws"
                  {...{ register, errors, control }}
                  disabled={isLoading.endpointForm}
                  ariaLabel={t("Select or create a throw")}
                />
              )}
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Tag")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="tag"
                disabled={isLoading.endpointForm}
                ariaLabel={t("Enter tag")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Select a source")}</FormFieldLabel>

              {getSources.isLoading && <Skeleton height="50px" />}
              {getSources.isSuccess && (
                <SelectSingle
                  isClearable
                  options={getSources.data.map((source: any) => ({ label: source.name, value: source.id }))}
                  name="source"
                  {...{ register, errors, control }}
                  disabled={isLoading.endpointForm}
                  ariaLabel={t("Select a source")}
                />
              )}
            </FormFieldInput>
          </FormField>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Select a schema")}</FormFieldLabel>

              {getSchemas.isLoading && <Skeleton height="50px" />}
              {getSchemas.isSuccess && (
                <SelectMultiple
                  options={getSchemas.data.map((schema: any) => ({ label: schema.name, value: schema.id }))}
                  name="schemas"
                  {...{ register, errors, control }}
                  disabled={isLoading.endpointForm}
                  ariaLabel={t("Select one or more schemas")}
                />
              )}
            </FormFieldInput>
          </FormField>
        </div>
      </div>

      <section className={styles.descriptionSection}>
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("Description")}</FormFieldLabel>
            <Textarea
              {...{ register, errors }}
              name="description"
              disabled={isLoading.endpointForm}
              ariaLabel={t("Enter description")}
            />
          </FormFieldInput>
        </FormField>
      </section>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("Path Parts")}</FormFieldLabel>
          <CreateKeyValue
            name="pathArray"
            {...{ register, errors, control }}
            defaultValue={pathParts}
            disabled={isLoading.endpointForm}
          />
        </FormFieldInput>
      </FormField>
    </form>
  );
};

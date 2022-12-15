import * as React from "react";
import * as styles from "./EndpointsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, {
  FormFieldDescription,
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
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useEndpoint } from "../../../hooks/endpoint";
import { CreateKeyValue } from "@conduction/components/lib/components/formFields";
import { useSource } from "../../../hooks/source";
import Skeleton from "react-loading-skeleton";
import { useSchema } from "../../../hooks/schema";

interface CreateEndpointFormTemplateProps {
  endpointId?: string;
}

export const CreateEndpointFormTemplate: React.FC<CreateEndpointFormTemplateProps> = ({ endpointId }) => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");
  const [pathParts, setPathParts] = React.useState<any[]>([]);
  const [methods, setMethods] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const createOrEditEndpoint = _useEndpoints.createOrEdit(endpointId);

  const _useSource = useSource(queryClient);
  const getSources = _useSource.getAll();

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
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      method: data.method && data.method.value,
      path: data.path.split(","),
      throws: data.throws ? data.throws.split(",") : null,
      proxy: data.source && `/admin/gateways/${data.source.value}`,
      methods: methods,
      operationType: data.operationType.value,
      entities: data.schemas.map((schema: any) => `/admin/entities/${schema.value}`),
    };
    createOrEditEndpoint.mutate({ payload, id: endpointId });
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

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Endpoint")}</Heading1>
          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
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

              {getSources.isLoading && <Skeleton height="50px" />}
              {getSources.isSuccess && (
                // @ts-ignore
                <SelectSingle
                  options={getSources.data.map((source: any) => ({ label: source.name, value: source.id }))}
                  name="source"
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
                //@ts-ignore
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
              <FormControlLabel input={<Checkbox name="checkbox" onChange={() => addToArray("GET")} />} label="GET" />
              <FormControlLabel input={<Checkbox name="checkbox" onChange={() => addToArray("POST")} />} label="POST" />
              <FormControlLabel input={<Checkbox name="checkbox" onChange={() => addToArray("PUT")} />} label="PUT" />
              <FormControlLabel
                input={<Checkbox name="checkbox" onChange={() => addToArray("PATCH")} />}
                label="PATCH"
              />
              <FormControlLabel
                input={<Checkbox name="checkbox" onChange={() => addToArray("DELETE")} />}
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

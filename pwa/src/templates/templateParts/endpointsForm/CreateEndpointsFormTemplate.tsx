import * as React from "react";
import * as styles from "./EndpointsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, {
  FormFieldGroup,
  FormFieldGroupLabel,
  FormFieldInput,
  FormFieldLabel,
} from "@gemeente-denhaag/form-field";
import { Button, Checkbox, FormControlLabel, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, SelectMultiple, SelectSingle, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useEndpoint } from "../../../hooks/endpoint";
import { CreateKeyValue } from "@conduction/components/lib/components/formFields";
import { useSource } from "../../../hooks/source";
import Skeleton from "react-loading-skeleton";
import { useSchema } from "../../../hooks/schema";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import { predefinedSubscriberEvents } from "../../../data/predefinedSubscriberEvents";

interface CreateEndpointFormTemplateProps {
  endpointId?: string;
}

export const CreateEndpointFormTemplate: React.FC<CreateEndpointFormTemplateProps> = ({ endpointId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [methods, setMethods] = React.useState<any[]>([]);
  const [throws, setThrows] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const createOrEditEndpoint = _useEndpoints.createOrEdit(endpointId);

  const _useSource = useSource(queryClient);
  const getSources = _useSource.getAll();

  const _useSchema = useSchema(queryClient);
  const getSchemas = _useSchema.getAll();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      path: data.path.split("/"),
      throws: data.throws?.map((_throw: any) => _throw.value),
      proxy: data.source && `/admin/gateways/${data.source.value}`,
      methods: methods,
      entities: data.schemas && data.schemas.map((schema: any) => `/admin/entities/${schema.value}`),
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

  React.useEffect(() => {
    setLoading(createOrEditEndpoint.isLoading);
  }, [createOrEditEndpoint.isLoading]);

  React.useEffect(() => {
    setThrows([...predefinedSubscriberEvents]);
  }, []);

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

            <FormFieldGroup>
              <FormFieldGroupLabel>Methods</FormFieldGroupLabel>
              <FormFieldInput className={styles.grid}>
                <FormControlLabel
                  input={<Checkbox name="checkbox" onChange={() => addToArray("GET")} disabled={loading} />}
                  label="GET"
                />
                <FormControlLabel
                  input={<Checkbox name="checkbox" onChange={() => addToArray("POST")} disabled={loading} />}
                  label="POST"
                />
                <FormControlLabel
                  input={<Checkbox name="checkbox" onChange={() => addToArray("PUT")} disabled={loading} />}
                  label="PUT"
                />
                <FormControlLabel
                  input={<Checkbox name="checkbox" onChange={() => addToArray("PATCH")} disabled={loading} />}
                  label="PATCH"
                />
                <FormControlLabel
                  input={<Checkbox name="checkbox" onChange={() => addToArray("DELETE")} disabled={loading} />}
                  label="DELETE"
                />
              </FormFieldInput>
            </FormFieldGroup>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Throws")}</FormFieldLabel>
                {throws.length > 0 && (
                  <SelectCreate options={throws} name="throws" {...{ register, errors, control }} disabled={loading} />
                )}
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
                  <SelectSingle
                    isClearable
                    options={getSources.data.map((source: any) => ({ label: source.name, value: source.id }))}
                    name="source"
                    {...{ register, errors, control }}
                    disabled={loading}
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
                    disabled={loading}
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
              <Textarea {...{ register, errors }} name="description" disabled={loading} />
            </FormFieldInput>
          </FormField>
        </section>

        <section className={styles.section}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Path Parts")}</FormFieldLabel>
              <CreateKeyValue name="pathArray" {...{ register, errors, control }} disabled={loading} />
            </FormFieldInput>
          </FormField>
        </section>
      </form>
    </div>
  );
};

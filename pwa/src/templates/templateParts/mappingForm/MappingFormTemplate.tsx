import * as React from "react";
import * as styles from "./MappingFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText } from "@conduction/components";
import { useQueryClient } from "react-query";
import { IsLoadingContext } from "../../../context/isLoading";
import { useMapping } from "../../../hooks/mapping";
import { CreateKeyValue, InputCheckbox, Textarea } from "@conduction/components/lib/components/formFields";

interface MappingFormTemplateProps {
  mapping?: any;
}

export const formId: string = "mapping-form";

export const MappingFormTemplate: React.FC<MappingFormTemplateProps> = ({ mapping }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const [_mapping, setMapping] = React.useState<any[]>([]);
  const [unset, setUnset] = React.useState<any[]>([]);
  const [cast, setCast] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const createOrEditMapping = useMapping(queryClient).createOrEdit(mapping?.id);

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
      mapping: Object.assign({}, ...data.mapping.map(({ key, value }: any) => ({ [key]: value }))),
      unset: Object.assign({}, ...data.unset.map(({ key, value }: any) => ({ [key]: value }))),
      cast: Object.assign({}, ...data.cast.map(({ key, value }: any) => ({ [key]: value }))),
    };

    createOrEditMapping.mutate({ payload, id: mapping?.id });
  };

  const handleSetFormValues = (): void => {
    const basicFields: string[] = ["name", "reference", "version", "description", "passTrough"];
    basicFields.forEach((field) => setValue(field, mapping[field]));

    const newMapping = Object.entries(mapping.mapping).map(([key, value]) => ({ key, value }));
    setMapping(newMapping);

    const newUnset = Object.entries(mapping.unset).map(([key, value]) => ({ key, value }));
    setUnset(newUnset);

    const newCast = Object.entries(mapping.cast).map(([key, value]) => ({ key, value }));
    setCast(newCast);
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, mappingForm: createOrEditMapping.isLoading });
  }, [createOrEditMapping.isLoading]);

  React.useEffect(() => {
    if (!mapping) return;

    handleSetFormValues();
  }, [mapping]);

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
                disabled={isLoading.mappingForm}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Reference")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="reference" disabled={isLoading.mappingForm} />
            </FormFieldInput>
          </FormField>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Version")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="version" disabled={isLoading.mappingForm} />
            </FormFieldInput>
          </FormField>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Pass Through")}</FormFieldLabel>
              <InputCheckbox {...{ register, errors }} label="on" name="passTrough" disabled={isLoading.mappingForm} />
            </FormFieldInput>
          </FormField>
        </div>
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("Description")}</FormFieldLabel>
            <Textarea {...{ register, errors }} name="description" disabled={isLoading.mappingForm} />
          </FormFieldInput>
        </FormField>
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("Mapping")}</FormFieldLabel>
            <CreateKeyValue
              name="mapping"
              {...{ register, errors, control }}
              defaultValue={_mapping}
              disabled={isLoading.endpointForm}
              validation={{ required: true }}
            />
          </FormFieldInput>
        </FormField>
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("Unset")}</FormFieldLabel>
            <CreateKeyValue
              name="unset"
              {...{ register, errors, control }}
              defaultValue={unset}
              disabled={isLoading.endpointForm}
            />
          </FormFieldInput>
        </FormField>
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("Cast")}</FormFieldLabel>
            <CreateKeyValue
              name="cast"
              {...{ register, errors, control }}
              defaultValue={cast}
              disabled={isLoading.endpointForm}
            />
          </FormFieldInput>
        </FormField>
      </div>
    </form>
  );
};

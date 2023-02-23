import * as React from "react";
import * as styles from "./PropertyFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputNumber, InputText, SelectSingle, InputDate, Textarea } from "@conduction/components";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useAttribute } from "../../../hooks/attribute";
import { CreateKeyValue, IKeyValue } from "@conduction/components/lib/components/formFields";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import { useSchema } from "../../../hooks/schema";
import Skeleton from "react-loading-skeleton";
import { Button } from "../../../components/button/Button";

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

  const [loading, setLoading] = React.useState<boolean>(false);
  const [isImmutable, setIsImmutable] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const [requiredIf, setRequiredIf] = React.useState<IKeyValue[]>([]);
  const [forbiddenIf, setForbiddenIf] = React.useState<IKeyValue[]>([]);
  const [enumArray, setEnumArray] = React.useState<IKeyValue[]>([]);
  const [allOf, setAllOf] = React.useState<IKeyValue[]>([]);
  const [anyOf, setAnyOf] = React.useState<IKeyValue[]>([]);
  const [oneOf, setOneOf] = React.useState<IKeyValue[]>([]);
  const [objectConfig, setObjectConfig] = React.useState<IKeyValue[]>([]);

  const [selectedType, setSelectedType] = React.useState<any>(null);
  const [fileTypes, setFileTypes] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const _useAttribute = useAttribute(queryClient);
  const createOrEditProperty = _useAttribute.createOrEdit(schemaId, propertyId);
  const deleteProperty = _useAttribute.remove(schemaId);
  const getProperties = _useAttribute.getAll();

  const _useSchema = useSchema(queryClient);
  const getSchemas = _useSchema.getAll();

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
    { label: "Text", value: "text" },
  ];

  const functionSelectOptions = [
    { label: "No Function", value: "noFunction" },
    { label: "Id", value: "id" },
    { label: "self", value: "self" },
    { label: "Uri", value: "uri" },
    { label: "External Id", value: "externalId" },
    { label: "Date Created", value: "dateCreated" },
    { label: "Date Modified", value: "dateModified" },
    { label: "User Name", value: "userName" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const watchType = watch("type");

  React.useEffect(() => {
    setLoading(createOrEditProperty.isLoading || deleteProperty.isLoading);
  }, [createOrEditProperty.isLoading, deleteProperty.isLoading]);

  React.useEffect(() => {
    if (!getSchemas.isSuccess) return;

    setValue("object", () => {
      const schema = getSchemas.data?.find((schema) => schema.id === property.object.id);

      return { label: schema.name, value: `/admin/entities/${schema.id}` };
    });
  }, [getSchemas.isSuccess]);

  React.useEffect(() => {
    if (!getProperties.isSuccess) return;

    setValue("inversedBy", () => {
      const inversedBy = getProperties.data?.find((inversedBy) => inversedBy.id === property.inversedBy?.id);

      if (!inversedBy) return "";

      return { label: inversedBy.name, value: inversedBy.id };
    });
  }, [getProperties.isSuccess]);

  React.useEffect(() => {
    if (!watchType) return;

    const selectedType = typeSelectOptions.find((typeOption) => typeOption.value === watchType.value);

    setSelectedType(selectedType?.value);
  }, [watchType]);

  const onSubmit = (data: any): void => {
    if (data.minLength > data.maxLength) return setFormError(t("The minLength is bigger than the maxLength"));
    if (data.minItems > data.maxItems) return setFormError(t("The minItems is bigger than the maxItems"));
    if (data.minProperties > data.maxProperties)
      return setFormError(t("The minProperties is bigger than the maxProperties"));
    if (data.minDate > data.maxDate) return setFormError(t("The minDate is bigger than the maxDate"));
    if (data.minFileSize > data.maxFileSize) return setFormError(t("The minFileSize is bigger than the maxFileSize"));

    const payload = {
      ...data,
      type: data.type && data.type.value,
      format: data.format && data.format.value,
      function: data.function && data.function.value,
      fileTypes: data.fileTypes?.map((fileType: any) => fileType.value),
      object: data?.object?.value,
      inversedBy: data.inversedBy && `/admin/attributes/${data.inversedBy.value}`,
    };

    createOrEditProperty.mutate({ payload, id: propertyId });
    queryClient.setQueryData(["attributes", propertyId], payload);
  };

  const handleDeleteProperty = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deleteProperty.mutate({ id: propertyId });
    }
  };

  const handleSetFormValues = (property: any): void => {
    const basicFields: string[] = [
      "name",
      "extend",
      "include",
      "minLength",
      "maxLength",
      "multiple",
      "multipleOf",
      "maximum",
      "exclusiveMaximum",
      "minimum",
      "exclusiveMinimum",
      "maxItems",
      "minItems",
      "uniqueItems",
      "maxProperties",
      "minProperties",
      "required",
      "description",
      "defaultValue",
      "nullable",
      "mustBeUnique",
      "caseSensitive",
      "readOnly",
      "writeOnly",
      "example",
      "pattern",
      "deprecated",
      "maxFileSize",
      "minFileSize",
      "persistToGateway",
      "searchable",
      "sortable",
      "triggerParentEvents",
      "cascadeDelete",
      "cascade",
      "immutable",
      "unsetable",
      "mayBeOrphaned",
      "schema",
    ];
    basicFields.forEach((field) => setValue(field, property[field]));

    property.minDate && setValue("minDate", new Date(property.minDate));

    property.maxDate && setValue("maxDate", new Date(property.maxDate));

    setValue(
      "type",
      typeSelectOptions.find((option) => property.type === option.value),
    );

    setValue(
      "format",
      formatSelectOptions.find((option) => property.format === option.value),
    );

    setValue(
      "function",
      functionSelectOptions.find((option) => property.function === option.value),
    );

    setValue(
      "fileTypes",
      property.fileTypes?.map((fileType: any) => ({ label: fileType, value: fileType })),
    );

    if (Array.isArray(property.fileTypes)) {
      setFileTypes(property.fileTypes?.map((fileType: any) => ({ label: fileType, value: fileType })));
    } else {
      if (property.fileTypes === (undefined || null)) {
        setFileTypes([]);
      } else {
        const newFileTypes = Object.entries(property.fileTypes).map(([key, value]) => ({ key, value: value }));
        setFileTypes(newFileTypes);
      }
    }

    if (Array.isArray(property.requiredIf) || property.requiredIf === undefined) {
      setRequiredIf(property.requiredIf);
    } else {
      const newRequiredIf = Object.entries(property.requiredIf).map(([key, value]) => ({
        key,
        value: value as string,
      }));
      setRequiredIf(newRequiredIf);
    }

    if (Array.isArray(property.forbiddenIf) || property.forbiddenIf === undefined) {
      setForbiddenIf(property.forbiddenIf);
    } else {
      const newForbiddenIf = Object.entries(property.forbiddenIf).map(([key, value]) => ({
        key,
        value: value as string,
      }));
      setForbiddenIf(newForbiddenIf);
    }

    if (Array.isArray(property.enum) || property.enum === undefined) {
      setEnumArray(property.enum);
    } else {
      const newEnumArray = Object.entries(property.enum).map(([key, value]) => ({ key, value: value as string }));
      setEnumArray(newEnumArray);
    }

    if (Array.isArray(property.allOf) || property.allOf === undefined) {
      setAllOf(property.allOf);
    } else {
      const newAllOf = Object.entries(property.allOf).map(([key, value]) => ({ key, value: value as string }));
      setAllOf(newAllOf);
    }

    if (Array.isArray(property.anyOf) || property.anyOf === undefined) {
      setAnyOf(property.anyOf);
    } else {
      const newAnyOf = Object.entries(property.anyOf).map(([key, value]) => ({ key, value: value as string }));
      setAnyOf(newAnyOf);
    }

    if (Array.isArray(property.oneOf) || property.oneOf === undefined) {
      setOneOf(property.oneOf);
    } else {
      const newOneOf = Object.entries(property.oneOf).map(([key, value]) => ({ key, value: value as string }));
      setOneOf(newOneOf);
    }

    if (Array.isArray(property.objectConfig) || property.objectConfig === undefined) {
      setObjectConfig(property.objectConfig);
    } else {
      const newObjectConfig = Object.entries(property.objectConfig).map(([key, value]) => ({
        key,
        value: value as string,
      }));
      setObjectConfig(newObjectConfig);
    }
  };

  React.useEffect(() => {
    property.immutable && setIsImmutable(true);
    handleSetFormValues(property);
  }, []);

  return (
    <div className={styles.container}>
      {formError && (
        <Alert
          text={formError}
          title={t("Oops, something went wrong")}
          variant="error"
          close={() => setFormError("")}
        />
      )}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.section}>
            <Heading1>{`Edit ${property.name}`}</Heading1>

            <div className={styles.buttons}>
              <Button
                variant="primary"
                label={t("Save")}
                icon={faSave}
                type="submit"
                disabled={loading || isImmutable}
              />

              <Button
                label={t("Delete")}
                variant="danger"
                icon={faTrash}
                onClick={handleDeleteProperty}
                disabled={loading}
              />
            </div>
          </section>

          <TabContext value={currentTab.toString()}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue: number) => {
                setCurrentTab(newValue);
              }}
              variant="scrollable"
            >
              <Tab className={styles.tab} label={t("General")} value={0} />
              <Tab className={styles.tab} label={t("Advanced")} value={1} />
            </Tabs>
            <TabPanel className={styles.tabPanel} value="0">
              <div className={styles.gridContainer}>
                <div className={styles.grid}>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("Name")}</FormFieldLabel>
                      <InputText
                        {...{ register, errors }}
                        name="name"
                        validation={{ required: true }}
                        disabled={loading || isImmutable}
                      />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("Type")}</FormFieldLabel>
                      <SelectSingle
                        {...{ register, errors, control }}
                        name="type"
                        options={typeSelectOptions}
                        disabled={loading || isImmutable}
                      />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("extend")}</FormFieldLabel>
                      <InputCheckbox
                        {...{ register, errors }}
                        label="on"
                        name="extend"
                        disabled={loading || isImmutable}
                      />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("include")}</FormFieldLabel>
                      <InputCheckbox
                        {...{ register, errors }}
                        label="on"
                        name="include"
                        disabled={loading || isImmutable}
                      />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("minLength")}</FormFieldLabel>
                      <InputNumber {...{ register, errors }} name="minLength" disabled={loading || isImmutable} />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("maxLength")}</FormFieldLabel>
                      <InputNumber {...{ register, errors }} name="maxLength" disabled={loading || isImmutable} />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("Format")}</FormFieldLabel>
                      <SelectSingle
                        {...{ register, errors, control }}
                        name="format"
                        options={formatSelectOptions}
                        disabled={loading || isImmutable}
                      />
                    </FormFieldInput>
                  </FormField>

                  {selectedType === "object" && getSchemas.isLoading && <Skeleton height="50px" />}

                  {selectedType === "object" && getSchemas.isSuccess && (
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Schema")}</FormFieldLabel>
                        <SelectSingle
                          {...{ register, errors, control }}
                          name="object"
                          options={getSchemas.data.map((schema: any) => ({
                            label: schema.name,
                            value: `/admin/entities/${schema.id}`,
                          }))}
                          disabled={loading}
                          validation={{ required: true }}
                        />
                      </FormFieldInput>
                    </FormField>
                  )}
                </div>
              </div>
            </TabPanel>
            <TabPanel className={styles.tabPanel} value="1">
              <div className={styles.advancedFormContainer}>
                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("Description")}</FormFieldLabel>
                    <Textarea {...{ register, errors }} name="description" disabled={loading || isImmutable} />
                  </FormFieldInput>
                </FormField>

                <div className={styles.gridContainer}>
                  <div className={styles.grid}>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("required")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="required"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Multiple")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="multiple"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Function")}</FormFieldLabel>
                        <SelectSingle
                          {...{ register, errors, control }}
                          name="function"
                          options={functionSelectOptions}
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    {selectedType === "integer" && (
                      <>
                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("multipleOf")}</FormFieldLabel>
                            <InputNumber
                              {...{ register, errors }}
                              name="multipleOf"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("minimum")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="minimum" disabled={loading || isImmutable} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("maximum")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="maximum" disabled={loading || isImmutable} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("exclusiveMinimum")}</FormFieldLabel>
                            <InputCheckbox
                              {...{ register, errors }}
                              label="on"
                              name="exclusiveMinimum"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("exclusiveMaximum")}</FormFieldLabel>
                            <InputCheckbox
                              {...{ register, errors }}
                              label="on"
                              name="exclusiveMaximum"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>
                      </>
                    )}

                    {selectedType === "file" && (
                      <>
                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("fileTypes")}</FormFieldLabel>
                            <SelectCreate
                              options={fileTypes}
                              name="fileTypes"
                              {...{ register, errors, control }}
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>
                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("minFileSize")}</FormFieldLabel>
                            <InputNumber
                              {...{ register, errors }}
                              name="minFileSize"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("maxFileSize")}</FormFieldLabel>
                            <InputNumber
                              {...{ register, errors }}
                              name="maxFileSize"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>
                      </>
                    )}

                    {selectedType === "object" && (
                      <>
                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("triggerParentEvents")}</FormFieldLabel>
                            <InputCheckbox
                              {...{ register, errors }}
                              label="on"
                              name="triggerParentEvents"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("cascadeDelete")}</FormFieldLabel>
                            <InputCheckbox
                              {...{ register, errors }}
                              label="on"
                              name="cascadeDelete"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("cascade")}</FormFieldLabel>
                            <InputCheckbox
                              {...{ register, errors }}
                              label="on"
                              name="cascade"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("minProperties")}</FormFieldLabel>
                            <InputNumber
                              {...{ register, errors }}
                              name="minProperties"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("maxProperties")}</FormFieldLabel>
                            <InputNumber
                              {...{ register, errors }}
                              name="maxProperties"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>
                      </>
                    )}

                    {selectedType === "array" && (
                      <>
                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("uniqueItems")}</FormFieldLabel>
                            <InputCheckbox
                              {...{ register, errors }}
                              label="on"
                              name="uniqueItems"
                              disabled={loading || isImmutable}
                            />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("minItems")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="minItems" disabled={loading || isImmutable} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("maxItems")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="maxItems" disabled={loading || isImmutable} />
                          </FormFieldInput>
                        </FormField>
                      </>
                    )}
                  </div>
                </div>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("inversedBy")}</FormFieldLabel>
                    {getProperties.isLoading && <Skeleton height="50px" />}
                    {getProperties.isSuccess && (
                      <SelectSingle
                        {...{ register, errors, control }}
                        name="inversedBy"
                        options={getProperties.data.map((schema: any) => ({ label: schema.name, value: schema.id }))}
                        disabled={loading || isImmutable}
                      />
                    )}
                  </FormFieldInput>
                </FormField>

                <div className={styles.gridContainer}>
                  <div className={styles.grid}>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("defaultValue")}</FormFieldLabel>
                        <InputText {...{ register, errors }} name="defaultValue" disabled={loading || isImmutable} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("schema")}</FormFieldLabel>
                        <InputText {...{ register, errors }} name="schema" disabled={loading || isImmutable} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("nullable")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="nullable"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("mustBeUnique")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="mustBeUnique"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    {/* readOnly and writeOnly must be dependend on eachother */}
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("readOnly")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="readOnly"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("writeOnly")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="writeOnly"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("caseSensitive")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="caseSensitive"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("deprecated")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="deprecated"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("example")}</FormFieldLabel>
                        <InputText {...{ register, errors }} name="example" disabled={loading || isImmutable} />
                      </FormFieldInput>
                    </FormField>

                    {/* Needs to be checked if its in line with (Ecma-262 Edition 5.1 regular expression dialect) */}
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("pattern")}</FormFieldLabel>
                        <InputText {...{ register, errors }} name="pattern" disabled={loading || isImmutable} />
                      </FormFieldInput>
                    </FormField>
                  </div>
                </div>
                <div className={styles.gridContainer}>
                  <div className={styles.grid}>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("minDate")}</FormFieldLabel>
                        <InputDate
                          {...{ register, errors, control }}
                          name="minDate"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("maxDate")}</FormFieldLabel>
                        <InputDate
                          {...{ register, errors, control }}
                          name="maxDate"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    {/* maxFileSize and minFileSize can only be used in combination with type file* The type of the file  */}

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("persistToGateway")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="persistToGateway"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("searchable")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="searchable"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("sortable")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="sortable"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("immutable")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="immutable"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("unsetable")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="unsetable"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("mayBeOrphaned")}</FormFieldLabel>
                        <InputCheckbox
                          {...{ register, errors }}
                          label="on"
                          name="mayBeOrphaned"
                          disabled={loading || isImmutable}
                        />
                      </FormFieldInput>
                    </FormField>
                  </div>
                </div>
                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("requiredIf")}</FormFieldLabel>
                    <CreateKeyValue
                      name="requiredIf"
                      defaultValue={requiredIf}
                      {...{ register, control, errors }}
                      disabled={loading || isImmutable}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("forbiddenIf")}</FormFieldLabel>
                    <CreateKeyValue
                      name="forbiddenIf"
                      defaultValue={forbiddenIf}
                      {...{ register, control, errors }}
                      disabled={loading || isImmutable}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("enum")}</FormFieldLabel>
                    <CreateKeyValue
                      name="enum"
                      defaultValue={enumArray}
                      {...{ register, control, errors }}
                      disabled={loading || isImmutable}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("allOf")}</FormFieldLabel>
                    <CreateKeyValue
                      name="allOf"
                      defaultValue={allOf}
                      {...{ register, control, errors }}
                      disabled={loading || isImmutable}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("anyOf")}</FormFieldLabel>
                    <CreateKeyValue
                      name="anyOf"
                      defaultValue={anyOf}
                      {...{ register, control, errors }}
                      disabled={loading || isImmutable}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("oneOf")}</FormFieldLabel>

                    <CreateKeyValue
                      name="oneOf"
                      defaultValue={oneOf}
                      {...{ register, control, errors }}
                      disabled={loading || isImmutable}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("objectConfig")}</FormFieldLabel>
                    <CreateKeyValue
                      name="objectConfig"
                      defaultValue={objectConfig}
                      {...{ register, control, errors }}
                      disabled={loading || isImmutable}
                    />
                  </FormFieldInput>
                </FormField>
              </div>
            </TabPanel>
          </TabContext>
        </form>
      </div>
    </div>
  );
};

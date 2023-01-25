import * as React from "react";
import * as styles from "./PropertyFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1, Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputCheckbox, InputNumber, InputText, SelectSingle, Textarea, InputDate } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useAttribute } from "../../../hooks/attribute";
import { navigate } from "gatsby";
import { ArrowLeftIcon } from "@gemeente-denhaag/icons";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import { CreateKeyValue } from "@conduction/components/lib/components/formFields";
import { useSchema } from "../../../hooks/schema";
import Skeleton from "react-loading-skeleton";

interface CreatePropertyFormTemplateProps {
  schemaId: string;
  propertyId?: string;
}

export const CreatePropertyFormTemplate: React.FC<CreatePropertyFormTemplateProps> = ({ schemaId, propertyId }) => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [selectedType, setSelectedType] = React.useState<any>(null);

  const queryClient = useQueryClient();
  const _useAttribute = useAttribute(queryClient);
  const createOrEditAttribute = _useAttribute.createOrEdit(schemaId, propertyId);
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
    watch,
  } = useForm();

  const watchType = watch("type");

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
      entity: `/admin/entities/${schemaId}`,
      fileTypes: data.fileTypes?.map((fileType: any) => fileType.value),
      object: data?.object?.value,
      inversedBy: data.inversedBy && `/admin/attributes/${data.inversedBy.value}`,
    };

    createOrEditAttribute.mutate({ payload, id: propertyId });
  };

  return (
    <div className={styles.container}>
      <div onClick={() => navigate(`/schemas/${schemaId}`)}>
        <Link icon={<ArrowLeftIcon />} iconAlign="start">
          {t("Back to schema")}
        </Link>
      </div>

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
            <Heading1>{t("Create Property")}</Heading1>

            <div className={styles.buttons}>
              <Button className={styles.buttonIcon} type="submit" disabled={loading}>
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>
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
                        disabled={loading}
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
                        disabled={loading}
                      />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("extend")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="extend" disabled={loading} />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("include")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="include" disabled={loading} />
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
                      <SelectSingle
                        {...{ register, errors, control }}
                        name="format"
                        options={formatSelectOptions}
                        disabled={loading}
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
                    <Textarea {...{ register, errors }} name="description" disabled={loading} />
                  </FormFieldInput>
                </FormField>

                <div className={styles.gridContainer}>
                  <div className={styles.grid}>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("required")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="required" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Multiple")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="multiple" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Function")}</FormFieldLabel>
                        <SelectSingle
                          {...{ register, errors, control }}
                          name="function"
                          options={functionSelectOptions}
                          disabled={loading}
                        />
                      </FormFieldInput>
                    </FormField>

                    {selectedType === "integer" && (
                      <>
                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("multipleOf")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="multipleOf" disabled={loading} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("minimum")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="minimum" disabled={loading} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("maximum")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="maximum" disabled={loading} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("exclusiveMinimum")}</FormFieldLabel>
                            <InputCheckbox
                              {...{ register, errors }}
                              label="on"
                              name="exclusiveMinimum"
                              disabled={loading}
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
                              disabled={loading}
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
                              options={[]}
                              name="fileTypes"
                              {...{ register, errors, control }}
                              disabled={loading}
                            />
                          </FormFieldInput>
                        </FormField>
                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("minFileSize")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="minFileSize" disabled={loading} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("maxFileSize")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="maxFileSize" disabled={loading} />
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
                              disabled={loading}
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
                              disabled={loading}
                            />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("cascade")}</FormFieldLabel>
                            <InputCheckbox {...{ register, errors }} label="on" name="cascade" disabled={loading} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("minProperties")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="minProperties" disabled={loading} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("maxProperties")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="maxProperties" disabled={loading} />
                          </FormFieldInput>
                        </FormField>
                      </>
                    )}

                    {selectedType === "array" && (
                      <>
                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("uniqueItems")}</FormFieldLabel>
                            <InputCheckbox {...{ register, errors }} label="on" name="uniqueItems" disabled={loading} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("minItems")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="minItems" disabled={loading} />
                          </FormFieldInput>
                        </FormField>

                        <FormField>
                          <FormFieldInput>
                            <FormFieldLabel>{t("maxItems")}</FormFieldLabel>
                            <InputNumber {...{ register, errors }} name="maxItems" disabled={loading} />
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
                        disabled={loading}
                      />
                    )}
                  </FormFieldInput>
                </FormField>

                <div className={styles.gridContainer}>
                  <div className={styles.grid}>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("defaultValue")}</FormFieldLabel>
                        <InputText {...{ register, errors }} name="defaultValue" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("schema")}</FormFieldLabel>
                        <InputText {...{ register, errors }} name="schema" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("nullable")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="nullable" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("mustBeUnique")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="mustBeUnique" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    {/* readOnly and writeOnly must be dependend on eachother */}
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("readOnly")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="readOnly" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("writeOnly")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="writeOnly" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("caseSensitive")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="caseSensitive" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("deprecated")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="deprecated" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("example")}</FormFieldLabel>
                        <InputText {...{ register, errors }} name="example" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    {/* Needs to be checked if its in line with (Ecma-262 Edition 5.1 regular expression dialect) */}
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("pattern")}</FormFieldLabel>
                        <InputText {...{ register, errors }} name="pattern" disabled={loading} />
                      </FormFieldInput>
                    </FormField>
                  </div>
                </div>
                <div className={styles.gridContainer}>
                  <div className={styles.grid}>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("minDate")}</FormFieldLabel>
                        <InputDate {...{ register, errors }} name="minDate" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("maxDate")}</FormFieldLabel>
                        <InputDate {...{ register, errors }} name="maxDate" disabled={loading} />
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
                          disabled={loading}
                        />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("searchable")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="searchable" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("sortable")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="sortable" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("immutable")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="immutable" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("unsetable")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="unsetable" disabled={loading} />
                      </FormFieldInput>
                    </FormField>

                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("mayBeOrphaned")}</FormFieldLabel>
                        <InputCheckbox {...{ register, errors }} label="on" name="mayBeOrphaned" disabled={loading} />
                      </FormFieldInput>
                    </FormField>
                  </div>
                </div>
                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("requiredIf")}</FormFieldLabel>
                    <CreateKeyValue name="requiredIf" {...{ register, control, errors }} disabled={loading} />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("forbiddenIf")}</FormFieldLabel>
                    <CreateKeyValue name="forbiddenIf" {...{ register, control, errors }} disabled={loading} />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("enum")}</FormFieldLabel>
                    <CreateKeyValue name="enum" {...{ register, control, errors }} disabled={loading} />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("allOf")}</FormFieldLabel>
                    <CreateKeyValue name="allOf" {...{ register, control, errors }} disabled={loading} />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("anyOf")}</FormFieldLabel>
                    <CreateKeyValue name="anyOf" {...{ register, control, errors }} disabled={loading} />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("oneOf")}</FormFieldLabel>
                    <CreateKeyValue name="oneOf" {...{ register, control, errors }} disabled={loading} />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("objectConfig")}</FormFieldLabel>
                    <CreateKeyValue name="objectConfig" {...{ register, control, errors }} disabled={loading} />
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

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
import { CreateKeyValue } from "@conduction/components/lib/components/formFields";
import RequiredStar from "../../../components/requiredStar/RequiredStar";

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

  const queryClient = useQueryClient();
  const _useAttribute = useAttribute(queryClient);
  const createOrEditAttribute = _useAttribute.createOrEdit(schemaId, propertyId);

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
  } = useForm();

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
                      <FormFieldLabel>
                        {t("Name")} <RequiredStar />
                      </FormFieldLabel>
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
            </TabPanel>
            <TabPanel className={styles.tabPanel} value="1">
              <div className={styles.gridContainer}>
                <div className={styles.grid}>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("Function")}</FormFieldLabel>
                      {/* @ts-ignore */}
                      <SelectSingle
                        {...{ register, errors, control }}
                        name="function"
                        options={functionSelectOptions}
                        disabled={loading}
                      />
                    </FormFieldInput>
                  </FormField>
                </div>
              </div>
              <div className={styles.gridContainer}>
                <div className={styles.grid}>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("Multiple")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="multiple" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("multipleOf")}</FormFieldLabel>
                      <InputNumber {...{ register, errors }} name="multipleOf" disabled={loading} />
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
                      <FormFieldLabel>{t("exclusiveMaximum")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="exclusiveMaximum" />
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
                      <FormFieldLabel>{t("exclusiveMinimum")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="exclusiveMinimum" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("maxItems")}</FormFieldLabel>
                      <InputNumber {...{ register, errors }} name="maxItems" disabled={loading} />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("minItems")}</FormFieldLabel>
                      <InputNumber {...{ register, errors }} name="minItems" disabled={loading} />
                    </FormFieldInput>
                  </FormField>
                </div>
              </div>
              <div className={styles.gridContainer}>
                <div className={styles.grid}>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("uniqueItems")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="uniqueItems" />
                    </FormFieldInput>
                  </FormField>
                </div>
              </div>
              <div className={styles.gridContainer}>
                <div className={styles.grid}>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("maxProperties")}</FormFieldLabel>
                      <InputNumber {...{ register, errors }} name="maxProperties" disabled={loading} />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("minProperties")}</FormFieldLabel>
                      <InputNumber {...{ register, errors }} name="minProperties" disabled={loading} />
                    </FormFieldInput>
                  </FormField>

                  {/* <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("inversedBy")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="inversedBy" />
                    </FormFieldInput>
                  </FormField> */}

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("required")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="required" />
                    </FormFieldInput>
                  </FormField>

                  {/* Keyvalue Inputs need to be correctly implemented */}
                  {/* <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("requiredIf")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="requiredIf" />
                    </FormFieldInput>
                  </FormField>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("requiredIf")}</FormFieldLabel>
                      <CreateKeyValue name="requiredIf" data={getValues("requiredIf")} {...{ control, errors }} />
                    </FormFieldInput>
                  </FormField> */}

                  {/* <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("forbiddenIf")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="requiredIf" />
                    </FormFieldInput>
                  </FormField>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("forbiddenIf")}</FormFieldLabel>
                      <CreateKeyValue name="forbiddenIf" data={getValues("forbiddenIf")} {...{ control, errors }} />
                    </FormFieldInput>
                  </FormField> */}

                  {/* <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("Enum")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="enum" />
                    </FormFieldInput>
                  </FormField>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("enum")}</FormFieldLabel>
                      <CreateKeyValue name="enum" data={getValues("enum")} {...{ control, errors }} />
                    </FormFieldInput>
                  </FormField> */}

                  {/* <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("allOf")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="allOf" />
                    </FormFieldInput>
                  </FormField>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("allOf")}</FormFieldLabel>
                      <CreateKeyValue name="allOf" data={getValues("allOf")} {...{ control, errors }} />
                    </FormFieldInput>
                  </FormField> */}

                  {/* <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("anyOf")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="anyOf" />
                    </FormFieldInput>
                  </FormField>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("anyOf")}</FormFieldLabel>
                      <CreateKeyValue name="anyOf" data={getValues("anyOf")} {...{ control, errors }} />
                    </FormFieldInput>
                  </FormField> */}

                  {/* <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("oneOf")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="oneOf" />
                    </FormFieldInput>
                  </FormField>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("oneOf")}</FormFieldLabel>
                      <CreateKeyValue name="oneOf" data={getValues("oneOf")} {...{ control, errors }} />
                    </FormFieldInput>
                  </FormField> */}
                </div>
              </div>

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
                      <FormFieldLabel>{t("defaultValue")}</FormFieldLabel>
                      <InputText {...{ register, errors }} name="defaultValue" disabled={loading} />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("nullable")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="nullable" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("mustBeUnique")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="mustBeUnique" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("caseSentitive")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="caseSentitive" />
                    </FormFieldInput>
                  </FormField>

                  {/* readOnly and writeOnly must be dependend on eachother */}
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("readOnly")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="readOnly" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("writeOnly")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="writeOnly" />
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

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("deprecated")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="deprecated" />
                    </FormFieldInput>
                  </FormField>
                </div>
              </div>
              <div className={styles.gridContainer}>
                <div className={styles.grid}>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("minDate")}</FormFieldLabel>
                      <InputDate {...{ register, errors }} name="minDate" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("maxDate")}</FormFieldLabel>
                      <InputDate {...{ register, errors }} name="maxDate" />
                    </FormFieldInput>
                  </FormField>

                  {/* maxFileSize and minFileSize can only be used in combination with type file* The type of the file  */}
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("maxFileSize")}</FormFieldLabel>
                      <InputNumber {...{ register, errors }} name="maxFileSize" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("minFileSize")}</FormFieldLabel>
                      <InputNumber {...{ register, errors }} name="minFileSize" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("persistToGateway")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="persistToGateway" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("searchable")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="searchable" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("sortable")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="sortable" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("triggerParentEvents")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="triggerParentEvents" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("cascadeDelete")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="cascadeDelete" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("cascade")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="cascade" />
                    </FormFieldInput>
                  </FormField>

                  {/* Keyvalue Inputs need to be correctly implemented */}
                  {/* <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("objectConfig")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="objectConfig" />
                    </FormFieldInput>
                  </FormField>
                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("objectConfig")}</FormFieldLabel>

                      <CreateKeyValue name="objectConfig" {...{ control, errors }} />
                    </FormFieldInput>
                  </FormField> */}

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("immutable")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="immutable" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("unsetable")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="unsetable" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("mayBeOrphaned")}</FormFieldLabel>
                      <InputCheckbox {...{ register, errors }} label="on" name="mayBeOrphaned" />
                    </FormFieldInput>
                  </FormField>

                  <FormField>
                    <FormFieldInput>
                      <FormFieldLabel>{t("schema")}</FormFieldLabel>
                      <InputText {...{ register, errors }} name="schema" />
                    </FormFieldInput>
                  </FormField>
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </form>
      </div>
    </div>
  );
};

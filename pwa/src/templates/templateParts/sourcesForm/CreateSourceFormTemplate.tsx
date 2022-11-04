import * as React from "react";
import * as styles from "./SourcesFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputCheckbox, InputText, SelectSingle, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useSource } from "../../../hooks/source";
import { useQueryClient } from "react-query";
import { InputFloat, InputNumber } from "@conduction/components/lib/components/formFields/input";
import { CreateKeyValue } from "@conduction/components/lib/components/formFields";
import { ReactTooltip } from "@conduction/components/lib/components/toolTip/ToolTip";

interface CreateSourceFormTemplateProps {
  sourceId?: string;
}

export const CreateSourceFormTemplate: React.FC<CreateSourceFormTemplateProps> = ({ sourceId }) => {
  const { t } = useTranslation();
  const API: APIService = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = useQueryClient();
  const _useSources = useSource(queryClient);
  const createOrEditSource = _useSources.createOrEdit(sourceId);

  const typeSelectOptions = [
    { label: "JSON", value: "json" },
    { label: "SML", value: "xml" },
    { label: "SOAP", value: "soap" },
    { label: "FTP", value: "ftp" },
    { label: "SFTP", value: "sftp" },
  ];

  const authSelectOptions = [
    { label: "API Key", value: "apikey" },
    { label: "JWT", value: "jwt" },
    { label: "Username and Password", value: "username-password" },
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    data.type = data.type && data.type.value;
    data.auth = data.auth && data.auth.value;

    createOrEditSource.mutate({ payload: data, id: sourceId });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Source")}</Heading1>

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
            <Tab className={styles.tab} label={t("Query")} value={1} />
            <Tab className={styles.tab} label={t("Header")} value={2} />
            <Tab className={styles.tab} label={t("Advanced")} value={3} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
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
              </div>
              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Description")}</FormFieldLabel>
                  <Textarea {...{ register, errors }} name="description" disabled={loading} />
                </FormFieldInput>
              </FormField>

              <div className={styles.grid}>
                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("Location")}</FormFieldLabel>
                    <InputText
                      {...{ register, errors }}
                      name="location"
                      validation={{ required: true }}
                      disabled={loading}
                    />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <FormFieldLabel>{t("authType")}</FormFieldLabel>
                    {/* @ts-ignore */}
                    <SelectSingle
                      {...{ register, errors, control }}
                      name="auth"
                      options={authSelectOptions}
                      validation={{ required: true }}
                      disabled={loading}
                    />
                  </FormFieldInput>
                </FormField>
              </div>
            </div>
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            {/* @ts-ignore */}
            <CreateKeyValue {...{ register, errors, control }} />
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="2">
            {/* @ts-ignore */}
            <CreateKeyValue {...{ register, errors, control }} />
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="3">
            {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
            <div className={styles.gridContainer}>
              <div className={styles.grid}>
                <FormField>
                  <FormFieldInput>
                    <div className={styles.formFieldHeader}>
                      <FormFieldLabel>{t("Connect timeout")}</FormFieldLabel>
                      <a
                        data-tip={
                          "Float describing the number of seconds to wait while trying to connect to a server. Use 0 to wait indefinitely (the default behavior)."
                        }
                      >
                        <FontAwesomeIcon
                          data-tip={
                            "Float describing the number of seconds to wait while trying to connect to a server. Use 0 to wait indefinitely (the default behavior)."
                          }
                          icon={faInfoCircle}
                        />
                      </a>
                    </div>
                    <InputFloat {...{ register, errors }} name="connect_timeout" disabled={loading} />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Debug")}</FormFieldLabel>
                    <a
                      data-tip={
                        "Set to true or set to a PHP stream returned by fopen() to enable debug output with the handler used to send a request. For example, when using cURL to transfer requests, cURL's verbose of CURLOPT_VERBOSE will be emitted. When using the PHP stream wrapper, stream wrapper notifications will be emitted. If set to true, the output is written to PHP's STDOUT. If a PHP stream is provided, output is written to the stream."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Set to true or set to a PHP stream returned by fopen() to enable debug output with the handler used to send a request. For example, when using cURL to transfer requests, cURL's verbose of CURLOPT_VERBOSE will be emitted. When using the PHP stream wrapper, stream wrapper notifications will be emitted. If set to true, the output is written to PHP's STDOUT. If a PHP stream is provided, output is written to the stream."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <InputCheckbox name="debug" label="True" {...{ register, errors }} />
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Decode content")}</FormFieldLabel>
                    <a
                      data-tip={
                        "Specify whether or not Content-Encoding responses (gzip, deflate, etc.) are automatically decoded."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Specify whether or not Content-Encoding responses (gzip, deflate, etc.) are automatically decoded."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <div className={styles.expectFormField}>
                    <InputCheckbox name="decode_content" label="True" {...{ register, errors }} />
                    <InputNumber name="expect" {...{ register, errors }} />
                  </div>
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Delay")}</FormFieldLabel>
                    <a data-tip={"The number of milliseconds to delay before sending the request."}>
                      <FontAwesomeIcon
                        data-tip={"The number of milliseconds to delay before sending the request."}
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <div className={styles.expectFormField}>
                    <InputNumber name="delay" {...{ register, errors }} />
                    <InputFloat name="delay" {...{ register, errors }} />
                  </div>
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Expect")}</FormFieldLabel>
                    <a data-tip={'Controls the behavior of the "Expect: 100-Continue" header.'}>
                      <FontAwesomeIcon
                        data-tip={'Controls the behavior of the "Expect: 100-Continue" header.'}
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <div className={styles.expectFormField}>
                    <InputCheckbox name="expect" label="True" {...{ register, errors }} />
                    <InputNumber name="expect" {...{ register, errors }} />
                  </div>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <div className={styles.formFieldHeader}>
                      <FormFieldLabel>{t("Force ip resolve")}</FormFieldLabel>
                      <a
                        data-tip={`Set to "v4" if you want the HTTP handlers to use only ipv4 protocol or "v6" for ipv6 protocol.`}
                      >
                        <FontAwesomeIcon
                          data-tip={`Set to "v4" if you want the HTTP handlers to use only ipv4 protocol or "v6" for ipv6 protocol.`}
                          icon={faInfoCircle}
                        />
                      </a>
                    </div>
                    <InputText {...{ register, errors }} name="force_ip_resolve" />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Verify")}</FormFieldLabel>
                    <a
                      data-tip={
                        "Describes the SSL certificate verification behavior of a request. \n Set to true to enable SSL certificate verification and use the default CA bundle provided by operating system.\nSet to false to disable certificate verification (this is insecure!). \n Set to a string to provide the path to a CA bundle to enable verification using a custom certificate."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Describes the SSL certificate verification behavior of a request. \n Set to true to enable SSL certificate verification and use the default CA bundle provided by operating system.\nSet to false to disable certificate verification (this is insecure!). \n Set to a string to provide the path to a CA bundle to enable verification using a custom certificate."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <div className={styles.expectFormField}>
                    <InputCheckbox name="verify" label="True" {...{ register, errors }} />
                    <InputText name="verify" {...{ register, errors }} />
                  </div>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <div className={styles.formFieldHeader}>
                      <FormFieldLabel>{t("Version")}</FormFieldLabel>
                      <a data-tip={"Protocol version to use with the request."}>
                        <FontAwesomeIcon data-tip={"Protocol version to use with the request."} icon={faInfoCircle} />
                      </a>
                    </div>
                    <InputText {...{ register, errors }} name="version" />
                  </FormFieldInput>
                </FormField>

                <FormField>
                  <FormFieldInput>
                    <div className={styles.formFieldHeader}>
                      <FormFieldLabel>{t("Read timeout")}</FormFieldLabel>
                      <a data-tip={"Float describing the timeout to use when reading a streamed body"}>
                        <FontAwesomeIcon
                          data-tip={"Float describing the timeout to use when reading a streamed body"}
                          icon={faInfoCircle}
                        />
                      </a>
                    </div>
                    <InputFloat {...{ register, errors }} name="read_timeout" />
                  </FormFieldInput>
                </FormField>
              </div>

              <FormField>
                <FormFieldInput>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Proxy")}</FormFieldLabel>
                    <a
                      data-tip={
                        "Pass a string to specify an HTTP proxy, or an array to specify different proxies for different protocols."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Pass a string to specify an HTTP proxy, or an array to specify different proxies for different protocols."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <Textarea {...{ register, errors }} name="proxy" />
                </FormFieldInput>
              </FormField>

              <div className={styles.grid}>
                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Idn conversion")}</FormFieldLabel>
                    <a
                      data-tip={
                        "Internationalized Domain Name (IDN) support (enabled by default if intl extension is available)."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Internationalized Domain Name (IDN) support (enabled by default if intl extension is available)."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <div className={styles.expectFormField}>
                    <InputCheckbox name="idn_conversion" label="True" {...{ register, errors }} />
                    <InputNumber name="idn_conversion" {...{ register, errors }} />
                  </div>
                </FormField>

                <FormField>
                  <div className={styles.formFieldHeader}>
                    <FormFieldLabel>{t("Http errors")}</FormFieldLabel>
                    <a
                      data-tip={
                        "Set to false to disable throwing exceptions on an HTTP protocol errors (i.e., 4xx and 5xx responses). Exceptions are thrown by default when HTTP protocol errors are encountered."
                      }
                    >
                      <FontAwesomeIcon
                        data-tip={
                          "Set to false to disable throwing exceptions on an HTTP protocol errors (i.e., 4xx and 5xx responses). Exceptions are thrown by default when HTTP protocol errors are encountered."
                        }
                        icon={faInfoCircle}
                      />
                    </a>
                  </div>
                  <InputCheckbox name="https_errors" label="True" {...{ register, errors }} />
                </FormField>
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </form>

      <ReactTooltip className={styles.tooltip} />
    </div>
  );
};

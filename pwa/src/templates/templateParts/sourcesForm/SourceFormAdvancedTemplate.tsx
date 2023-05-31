import * as React from "react";
import * as styles from "./SourcesFormTemplate.module.css";
import { FieldValues, UseFormRegister } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputText, Textarea, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { InputFloat, InputNumber } from "@conduction/components/lib/components/formFields/input";
import ToggleButton from "../../../components/toggleButton/ToggleButton";
import { IAdvancedSwitch, IAdvancedSwitchSetters } from "../../../hooks/useAdvancedSwitch";

interface ReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any };
}

interface SourceTemplateProps {
  set: IAdvancedSwitchSetters;
  advancedSwitchState: IAdvancedSwitch;
  isLoading: any;
}

export const SourceFormAdvancedTemplate: React.FC<SourceTemplateProps & ReactHookFormProps> = ({
  isLoading,
  register,
  errors,
  advancedSwitchState,
  set,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Debug")}</FormFieldLabel>
            <ToolTip tooltip="Set to true or set to a PHP stream returned by fopen() to enable debug output with the handler used to send a request. For example, when using cURL to transfer requests, cURL's verbose of CURLOPT_VERBOSE will be emitted. When using the PHP stream wrapper, stream wrapper notifications will be emitted. If set to true, the output is written to PHP's STDOUT. If a PHP stream is provided, output is written to the stream.">
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#debug");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
              </a>
            </ToolTip>
          </div>
          <InputCheckbox name="debug" disabled={isLoading} label="True" {...{ register, errors }} />
        </FormField>

        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Http errors")}</FormFieldLabel>
            <ToolTip tooltip="Set to false to disable throwing exceptions on an HTTP protocol errors (i.e., 4xx and 5xx responses). Exceptions are thrown by default when HTTP protocol errors are encountered.">
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#http-errors");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </ToolTip>
          </div>
          <InputCheckbox disabled={isLoading} name="https_errors" label="True" {...{ register, errors }} />
        </FormField>

        <FormField>
          <FormFieldInput>
            <div className={styles.formFieldHeader}>
              <FormFieldLabel>{t("Connect timeout")}</FormFieldLabel>
              <ToolTip tooltip="Float describing the number of seconds to wait while trying to connect to a server. Use 0 to wait indefinitely (the default behavior).">
                <a
                  className={styles.infoButton}
                  onClick={() => {
                    open("https://docs.guzzlephp.org/en/stable/request-options.html#connect-timeout");
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                </a>
              </ToolTip>
            </div>
            <InputFloat disabled={isLoading} {...{ register, errors }} name="connect_timeout" />
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <div className={styles.formFieldHeader}>
              <FormFieldLabel>{t("Force ip resolve")}</FormFieldLabel>
              <ToolTip tooltip='Set to "v4" if you want the HTTP handlers to use only ipv4 protocol or "v6" for ipv6 protocol.'>
                <a
                  className={styles.infoButton}
                  onClick={() => {
                    open("https://docs.guzzlephp.org/en/stable/request-options.html#force-ip-resolve");
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                </a>
              </ToolTip>
            </div>
            <InputText disabled={isLoading} {...{ register, errors }} name="force_ip_resolve" />
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <div className={styles.formFieldHeader}>
              <FormFieldLabel>{t("Version")}</FormFieldLabel>
              <ToolTip tooltip="Protocol version to use with the request.">
                <a
                  className={styles.infoButton}
                  onClick={() => {
                    open("https://docs.guzzlephp.org/en/stable/request-options.html#version");
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                </a>
              </ToolTip>
            </div>
            <InputText disabled={isLoading} {...{ register, errors }} name="version" />
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <div className={styles.formFieldHeader}>
              <FormFieldLabel>{t("Read timeout")}</FormFieldLabel>
              <ToolTip tooltip="Float describing the timeout to use when reading a streamed body">
                <a
                  className={styles.infoButton}
                  onClick={() => {
                    open("https://docs.guzzlephp.org/en/stable/request-options.html#read-timeout");
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                </a>
              </ToolTip>
            </div>
            <InputFloat disabled={isLoading} {...{ register, errors }} name="read_timeout" />
          </FormFieldInput>
        </FormField>

        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Idn conversion")}</FormFieldLabel>
            <ToolTip tooltip="Internationalized Domain Name (IDN) support (enabled by default if intl extension is available).">
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#idn-conversion");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </ToolTip>
          </div>
          <ToggleButton
            defaultState={advancedSwitchState.idnConversion !== "int"}
            disabled={isLoading}
            layoutClassName={styles.toggleButton}
            startLabel="Integer"
            endLabel="Boolean"
            onChange={() => set.idnConversion(advancedSwitchState.idnConversion === "int" ? "boolean" : "int")}
          />
          <div className={styles.expectFormField}>
            {advancedSwitchState.idnConversion === "boolean" && (
              <span className={styles.checkboxInput}>
                <InputCheckbox disabled={isLoading} name="idn_conversion_bool" label="True" {...{ register, errors }} />
              </span>
            )}
            {advancedSwitchState.idnConversion === "int" && (
              <InputNumber disabled={isLoading} name="idn_conversion_int" {...{ register, errors }} />
            )}
          </div>
        </FormField>

        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Delay")}</FormFieldLabel>
            <ToolTip tooltip="The number of milliseconds to delay before sending the request.">
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#delay");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </ToolTip>
          </div>
          <ToggleButton
            defaultState={advancedSwitchState.delay !== "int"}
            disabled={isLoading}
            layoutClassName={styles.toggleButton}
            startLabel="Integer"
            endLabel="Float"
            onChange={() => set.delay(advancedSwitchState.delay === "int" ? "float" : "int")}
          />
          <div className={styles.expectFormField}>
            {advancedSwitchState.delay === "int" && (
              <InputNumber disabled={isLoading} name="delay" {...{ register, errors }} />
            )}
            {advancedSwitchState.delay === "float" && (
              <InputFloat disabled={isLoading} name="delay" {...{ register, errors }} />
            )}
          </div>
        </FormField>

        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Expect")}</FormFieldLabel>
            <ToolTip tooltip='Controls the behavior of the "Expect: 100-Continue" header."'>
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#expect");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </ToolTip>
          </div>
          <ToggleButton
            defaultState={advancedSwitchState.expect !== "int"}
            disabled={isLoading}
            layoutClassName={styles.toggleButton}
            startLabel="Integer"
            endLabel="Boolean"
            onChange={() => set.expect(advancedSwitchState.expect === "int" ? "boolean" : "int")}
          />
          <div className={styles.expectFormField}>
            {advancedSwitchState.expect === "boolean" && (
              <span className={styles.checkboxInput}>
                <InputCheckbox disabled={isLoading} name="expect_bool" label="True" {...{ register, errors }} />
              </span>
            )}
            {advancedSwitchState.expect === "int" && (
              <InputNumber disabled={isLoading} name="expect_int" {...{ register, errors }} />
            )}
          </div>
        </FormField>

        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Verify")}</FormFieldLabel>
            <ToolTip tooltip="Describes the SSL certificate verification behavior of a request. \n Set to true to enable SSL certificate verification and use the default CA bundle provided by operating system.\nSet to false to disable certificate verification (this is insecure!). \n Set to a string to provide the path to a CA bundle to enable verification using a custom certificate.">
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#verify");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </ToolTip>
          </div>
          <ToggleButton
            defaultState={advancedSwitchState.verify !== "string"}
            disabled={isLoading}
            layoutClassName={styles.toggleButton}
            startLabel="String"
            endLabel="Boolean"
            onChange={() => set.verify(advancedSwitchState.verify === "string" ? "boolean" : "string")}
          />
          <div className={styles.expectFormField}>
            {advancedSwitchState.verify === "boolean" && (
              <span className={styles.checkboxInput}>
                <InputCheckbox disabled={isLoading} name="verify_bool" label="True" {...{ register, errors }} />
              </span>
            )}
            {advancedSwitchState.verify === "string" && (
              <InputText disabled={isLoading} name="verify_str" {...{ register, errors }} />
            )}
          </div>
        </FormField>
      </div>

      <FormField>
        <div className={styles.formFieldHeader}>
          <FormFieldLabel>{t("Decode content")}</FormFieldLabel>
          <ToolTip tooltip="Specify whether or not Content-Encoding responses (gzip, deflate, etc.) are automatically decoded.">
            <a
              className={styles.infoButton}
              onClick={() => {
                open("https://docs.guzzlephp.org/en/stable/request-options.html#decode-content");
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </a>
          </ToolTip>
        </div>
        <ToggleButton
          defaultState={advancedSwitchState.decodeContent !== "string"}
          disabled={isLoading}
          layoutClassName={styles.toggleButton}
          startLabel="String"
          endLabel="Boolean"
          onChange={() => set.decodeContent(advancedSwitchState.decodeContent === "string" ? "boolean" : "string")}
        />
        <div className={styles.expectFormField}>
          {advancedSwitchState.decodeContent === "string" && (
            <Textarea disabled={isLoading} name="decode_content_str" {...{ register, errors }} />
          )}

          {advancedSwitchState.decodeContent === "boolean" && (
            <span className={styles.checkboxInput}>
              <InputCheckbox disabled={isLoading} name="decode_content_bool" label="True" {...{ register, errors }} />
            </span>
          )}
        </div>
      </FormField>

      <FormField>
        <FormFieldInput>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Proxy")}</FormFieldLabel>
            <ToolTip tooltip="Pass a string to specify an HTTP proxy, or an array to specify different proxies for different protocols.">
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#proxy");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </ToolTip>
          </div>
          <Textarea disabled={isLoading} {...{ register, errors }} name="proxy" />
        </FormFieldInput>
      </FormField>
    </div>
  );
};

export const advancedFormKeysToRemove: string[] = [
  "headers",
  "query",
  "debug",
  "https_errors",
  "connect_timeout",
  "force_ip_resolve",
  "version",
  "read_timeout",
  "idn_conversion",
  "idn_conversion_bool",
  "idn_conversion_int",
  "decode_content",
  "decode_content_str",
  "decode_content_bool",
  "delay",
  "expect",
  "expect_bool",
  "expect_int",
  "verify",
  "verify_bool",
  "verify_str",
  "proxy",
];

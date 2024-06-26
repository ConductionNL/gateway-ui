import * as React from "react";
import * as styles from "./SourcesFormTemplate.module.css";
import { FieldValues, UseFormRegister } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { InputFloat, InputNumber } from "@conduction/components/lib/components/formFields/input";
import ToggleButton from "../../../components/toggleButton/ToggleButton";
import { IAdvancedSwitch, IAdvancedSwitchSetters } from "../../../hooks/useAdvancedSwitch";
import { TOOLTIP_ID } from "../../../layout/Layout";

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
            <span
              data-tooltip-id={TOOLTIP_ID}
              data-tooltip-content="Set to true or set to a PHP stream returned by fopen() to enable debug output with the handler used to send a request. For example, when using cURL to transfer requests, cURL's verbose of CURLOPT_VERBOSE will be emitted. When using the PHP stream wrapper, stream wrapper notifications will be emitted. If set to true, the output is written to PHP's STDOUT. If a PHP stream is provided, output is written to the stream."
            >
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#debug");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
              </a>
            </span>
          </div>
          <InputCheckbox name="debug" disabled={isLoading} label="True" {...{ register, errors }} />
        </FormField>

        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Http errors")}</FormFieldLabel>
            <span
              data-tooltip-id={TOOLTIP_ID}
              data-tooltip-content="Set to false to disable throwing exceptions on an HTTP protocol errors (i.e., 4xx and 5xx responses). Exceptions are thrown by default when HTTP protocol errors are encountered."
            >
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#http-errors");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </span>
          </div>
          <InputCheckbox disabled={isLoading} name="https_errors" label="True" {...{ register, errors }} />
        </FormField>

        <FormField>
          <FormFieldInput>
            <div className={styles.formFieldHeader}>
              <FormFieldLabel>{t("Connect timeout")}</FormFieldLabel>
              <span
                data-tooltip-id={TOOLTIP_ID}
                data-tooltip-content="Float describing the number of seconds to wait while trying to connect to a server. Use 0 to wait indefinitely (the default behavior)."
              >
                <a
                  className={styles.infoButton}
                  onClick={() => {
                    open("https://docs.guzzlephp.org/en/stable/request-options.html#connect-timeout");
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                </a>
              </span>
            </div>
            <InputFloat
              disabled={isLoading}
              {...{ register, errors }}
              name="connect_timeout"
              ariaLabel={t("Enter Connect timeout")}
            />
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <div className={styles.formFieldHeader}>
              <FormFieldLabel>{t("Force ip resolve")}</FormFieldLabel>
              <span
                data-tooltip-id={TOOLTIP_ID}
                data-tooltip-content='Set to "v4" if you want the HTTP handlers to use only ipv4 protocol or "v6" for ipv6 protocol.'
              >
                <a
                  className={styles.infoButton}
                  onClick={() => {
                    open("https://docs.guzzlephp.org/en/stable/request-options.html#force-ip-resolve");
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                </a>
              </span>
            </div>
            <InputText
              disabled={isLoading}
              {...{ register, errors }}
              name="force_ip_resolve"
              ariaLabel={t("Enter force ip resolve")}
            />
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <div className={styles.formFieldHeader}>
              <FormFieldLabel>{t("Version")}</FormFieldLabel>
              <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content="Protocol version to use with the request.">
                <a
                  className={styles.infoButton}
                  onClick={() => {
                    open("https://docs.guzzlephp.org/en/stable/request-options.html#version");
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                </a>
              </span>
            </div>
            <InputText disabled={isLoading} {...{ register, errors }} name="version" ariaLabel={t("Enter version")} />
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <div className={styles.formFieldHeader}>
              <FormFieldLabel>{t("Read timeout")}</FormFieldLabel>
              <span
                data-tooltip-id={TOOLTIP_ID}
                data-tooltip-content="Float describing the timeout to use when reading a streamed body"
              >
                <a
                  className={styles.infoButton}
                  onClick={() => {
                    open("https://docs.guzzlephp.org/en/stable/request-options.html#read-timeout");
                  }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                </a>
              </span>
            </div>
            <InputFloat
              disabled={isLoading}
              {...{ register, errors }}
              name="read_timeout"
              ariaLabel={t("Enter read timeout")}
            />
          </FormFieldInput>
        </FormField>

        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Idn conversion")}</FormFieldLabel>
            <span
              data-tooltip-id={TOOLTIP_ID}
              data-tooltip-content="Internationalized Domain Name (IDN) support (enabled by default if intl extension is available)."
            >
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#idn-conversion");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </span>
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
              <InputNumber
                disabled={isLoading}
                name="idn_conversion_int"
                {...{ register, errors }}
                ariaLabel={t("Enter idn conversion")}
              />
            )}
          </div>
        </FormField>

        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Delay")}</FormFieldLabel>
            <span
              data-tooltip-id={TOOLTIP_ID}
              data-tooltip-content="The number of milliseconds to delay before sending the request."
            >
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#delay");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </span>
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
              <InputNumber
                disabled={isLoading}
                name="delay_int"
                {...{ register, errors }}
                ariaLabel={t("Enter delay")}
              />
            )}
            {advancedSwitchState.delay === "float" && (
              <InputFloat
                disabled={isLoading}
                name="delay_float"
                {...{ register, errors }}
                ariaLabel={t("Enter delay")}
              />
            )}
          </div>
        </FormField>

        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Expect")}</FormFieldLabel>
            <span
              data-tooltip-id={TOOLTIP_ID}
              data-tooltip-content='Controls the behavior of the "Expect: 100-Continue" header."'
            >
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#expect");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </span>
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
              <InputNumber
                disabled={isLoading}
                name="expect_int"
                {...{ register, errors }}
                ariaLabel={t("Enter expect")}
              />
            )}
          </div>
        </FormField>

        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Verify")}</FormFieldLabel>
            <span
              data-tooltip-id={TOOLTIP_ID}
              data-tooltip-content="Describes the SSL certificate verification behavior of a request. \n Set to true to enable SSL certificate verification and use the default CA bundle provided by operating system.\nSet to false to disable certificate verification (this is insecure!). \n Set to a string to provide the path to a CA bundle to enable verification using a custom certificate."
            >
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#verify");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </span>
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
              <InputText
                disabled={isLoading}
                name="verify_str"
                {...{ register, errors }}
                ariaLabel={t("Enter verify")}
              />
            )}
          </div>
        </FormField>
      </div>

      <FormField>
        <div className={styles.formFieldHeader}>
          <FormFieldLabel>{t("Decode content")}</FormFieldLabel>
          <span
            data-tooltip-id={TOOLTIP_ID}
            data-tooltip-content="Specify whether or not Content-Encoding responses (gzip, deflate, etc.) are automatically decoded."
          >
            <a
              className={styles.infoButton}
              onClick={() => {
                open("https://docs.guzzlephp.org/en/stable/request-options.html#decode-content");
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </a>
          </span>
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
            <Textarea
              disabled={isLoading}
              name="decode_content_str"
              {...{ register, errors }}
              ariaLabel={t("Enter decode content")}
            />
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
            <span
              data-tooltip-id={TOOLTIP_ID}
              data-tooltip-content="Pass a string to specify an HTTP proxy, or an array to specify different proxies for different protocols."
            >
              <a
                className={styles.infoButton}
                onClick={() => {
                  open("https://docs.guzzlephp.org/en/stable/request-options.html#proxy");
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </a>
            </span>
          </div>
          <Textarea disabled={isLoading} {...{ register, errors }} name="proxy" ariaLabel={t("Enter proxy")} />
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
  "delay_int",
  "delay_float",
  "expect",
  "expect_bool",
  "expect_int",
  "verify",
  "verify_bool",
  "verify_str",
  "proxy",
];

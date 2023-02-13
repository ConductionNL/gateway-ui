import * as React from "react";
import * as styles from "./MappingFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText } from "@conduction/components";
import { useQueryClient } from "react-query";
import { useIsLoadingContext } from "../../../context/isLoading";
import { useMapping } from "../../../hooks/mapping";
import { CreateKeyValue, InputCheckbox, Textarea } from "@conduction/components/lib/components/formFields";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { faArrowDown, faArrowUp, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface MappingFormTemplateProps {
  mapping?: any;
}

export const formId: string = "mapping-form";

export const MappingFormTemplate: React.FC<MappingFormTemplateProps> = ({ mapping }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const [_mapping, setMapping] = React.useState<any[]>([]);
  const [unset, setUnset] = React.useState<any[]>([]);
  const [cast, setCast] = React.useState<any[]>([]);
  const [isOpenMapping, setIsOpenMapping] = React.useState<boolean>(true);
  const [isOpenUnset, setIsOpenUnset] = React.useState<boolean>(true);
  const [isOpenCast, setIsOpenCast] = React.useState<boolean>(true);

  const queryClient = useQueryClient();
  const createOrEditMapping = useMapping(queryClient).createOrEdit(mapping?.id);

  const mappingRefTop: any = React.useRef();
  const mappingRefBottom: any = React.useRef();
  const unsetRefTop: any = React.useRef();
  const unsetRefBottom: any = React.useRef();
  const castRefTop: any = React.useRef();
  const castRefBottom: any = React.useRef();

  const viewMappingTop = () =>
    mappingRefTop.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  const viewMappingBottom = () =>
    mappingRefBottom.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  const viewUnsetTop = () =>
    unsetRefTop.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  const viewUnsetBottom = () =>
    unsetRefBottom.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  const viewCastTop = () =>
    castRefTop.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  const viewCastBottom = () =>
    castRefBottom.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
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

  const watchMapping = watch("mapping");
  const watchUnset = watch("unset");
  const watchCast = watch("cast");

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
            <div ref={mappingRefTop} />
            <Collapsible
              className={styles.collapsible}
              openedClassName={styles.collapsible}
              trigger={
                <div className={styles.trigger}>
                  <span className={styles.collapsibleTitle}>
                    {t("Mapping")} <span className={styles.collapsibleCountIndicator}>({watchMapping?.length})</span>
                  </span>
                  <FontAwesomeIcon
                    className={clsx(styles.toggleIcon, isOpenMapping && styles.isOpen)}
                    icon={faChevronRight}
                  />
                </div>
              }
              open={isOpenMapping}
              transitionTime={100}
              onOpening={() => setIsOpenMapping(true)}
              onClosing={() => setIsOpenMapping(false)}
            >
              <span className={styles.toCollapsibleEnd} onClick={viewMappingBottom}>
                <FontAwesomeIcon icon={faArrowDown} /> Go to Bottom
              </span>

              <CreateKeyValue
                name="mapping"
                {...{ register, errors, control }}
                defaultValue={_mapping}
                disabled={isLoading.endpointForm}
                validation={{ required: true }}
              />

              <span className={styles.toCollapsibleStart} onClick={viewMappingTop}>
                <FontAwesomeIcon icon={faArrowUp} /> Go to Top
              </span>
            </Collapsible>
            <div ref={mappingRefBottom} />
          </FormFieldInput>
        </FormField>
        <FormField>
          <FormFieldInput>
            <div ref={unsetRefTop} />

            <Collapsible
              className={styles.collapsible}
              openedClassName={styles.collapsible}
              trigger={
                <div className={styles.trigger}>
                  <span className={styles.collapsibleTitle}>
                    {t("Unset")} <span className={styles.collapsibleCountIndicator}>({watchUnset?.length})</span>
                  </span>
                  <FontAwesomeIcon
                    className={clsx(styles.toggleIcon, isOpenUnset && styles.isOpen)}
                    icon={faChevronRight}
                  />
                </div>
              }
              open={isOpenUnset}
              transitionTime={100}
              onOpening={() => setIsOpenUnset(true)}
              onClosing={() => setIsOpenUnset(false)}
            >
              <span className={clsx(styles.toCollapsibleEnd, styles.toCollapsibleIcon)} onClick={viewUnsetBottom}>
                <FontAwesomeIcon icon={faArrowDown} /> Go to Bottom
              </span>

              <CreateKeyValue
                name="unset"
                {...{ register, errors, control }}
                defaultValue={unset}
                disabled={isLoading.endpointForm}
              />

              <span className={styles.toCollapsibleStart} onClick={viewUnsetTop}>
                <FontAwesomeIcon icon={faArrowUp} /> Go to Top
              </span>
            </Collapsible>

            <div ref={unsetRefBottom} />
          </FormFieldInput>
        </FormField>
        <FormField>
          <FormFieldInput>
            <div ref={castRefTop} />

            <Collapsible
              className={styles.collapsible}
              openedClassName={styles.collapsible}
              trigger={
                <div className={styles.trigger}>
                  <span className={styles.collapsibleTitle}>
                    {t("Cast")} <span className={styles.collapsibleCountIndicator}>({watchCast?.length})</span>
                  </span>
                  <FontAwesomeIcon
                    className={clsx(styles.toggleIcon, isOpenCast && styles.isOpen)}
                    icon={faChevronRight}
                  />
                </div>
              }
              open={isOpenCast}
              transitionTime={100}
              onOpening={() => setIsOpenCast(true)}
              onClosing={() => setIsOpenCast(false)}
            >
              <span className={styles.toCollapsibleEnd} onClick={viewCastBottom}>
                <FontAwesomeIcon icon={faArrowDown} /> Go to Bottom
              </span>
              <CreateKeyValue
                name="cast"
                {...{ register, errors, control }}
                defaultValue={cast}
                disabled={isLoading.endpointForm}
              />

              <span className={styles.toCollapsibleStart} onClick={viewCastTop}>
                <FontAwesomeIcon icon={faArrowUp} /> Go to Top
              </span>
            </Collapsible>

            <div ref={castRefBottom} />
          </FormFieldInput>
        </FormField>
      </div>
    </form>
  );
};

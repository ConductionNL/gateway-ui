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
import { faArrowDown, faChevronRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@gemeente-denhaag/components-react";
import toast from "react-hot-toast";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";
import { CodeEditor } from "../../../components/codeEditor/CodeEditor";
import _ from "lodash";

interface MappingFormTemplateProps {
  mapping?: any;
}

export const formId: string = "mapping-form";

export const MappingFormTemplate: React.FC<MappingFormTemplateProps> = ({ mapping }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const [mappingKeyValue, setMappingKeyValue] = React.useState<any[]>([]);
  const [mappingCodeEditor, setMappingCodeEditor] = React.useState<string>("");
  const [editMappingInEditor, setEditMappingInEditor] = React.useState<boolean>(false);

  const [unsetKeyValue, setUnsetKeyValue] = React.useState<any[]>([]);
  const [unsetCodeEditor, setUnsetCodeEditor] = React.useState<string>("");
  const [editUnsetInEditor, setEditUnsetInEditor] = React.useState<boolean>(false);

  const [castKeyValue, setCastKeyValue] = React.useState<any[]>([]);
  const [castCodeEditor, setCastCodeEditor] = React.useState<string>("");
  const [editCastInEditor, setEditCastInEditor] = React.useState<boolean>(false);

  const [isOpenMapping, setIsOpenMapping] = React.useState<boolean>(!mapping);
  const [isOpenUnset, setIsOpenUnset] = React.useState<boolean>(!mapping);
  const [isOpenCast, setIsOpenCast] = React.useState<boolean>(!mapping);

  const queryClient = useQueryClient();
  const createOrEditMapping = useMapping(queryClient).createOrEdit(mapping?.id);

  const mappingRefBottom = React.useRef<HTMLDivElement>(null);
  const unsetRefBottom = React.useRef<HTMLDivElement>(null);
  const castRefBottom = React.useRef<HTMLDivElement>(null);

  const handleScrollToCreate = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ref: React.RefObject<HTMLDivElement>,
  ) => {
    if (!ref.current) return;

    e.stopPropagation();

    ref.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const handleSwitchEditor = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, name: "mapping" | "unset" | "cast") => {
    e.stopPropagation();

    switch (name) {
      case "mapping":
        setEditMappingInEditor(!editMappingInEditor);
      case "unset":
        setEditUnsetInEditor(!editUnsetInEditor);
      case "cast":
        setEditCastInEditor(!editCastInEditor);
    }
  };

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
    setMappingKeyValue(newMapping);
    setMappingCodeEditor(JSON.stringify(mapping.mapping.length ? mapping.mapping : {}, null, 2));

    const newUnset = Object.entries(mapping.unset).map(([key, value]) => ({ key, value }));
    setUnsetKeyValue(newUnset);
    setUnsetCodeEditor(JSON.stringify(mapping.unset.length ? mapping.unset : {}, null, 2));

    const newCast = Object.entries(mapping.cast).map(([key, value]) => ({ key, value }));
    setCastKeyValue(newCast);
    setCastCodeEditor(JSON.stringify(mapping.cast.length ? mapping.cast : {}, null, 2));
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, mappingForm: createOrEditMapping.isLoading });
  }, [createOrEditMapping.isLoading]);

  //Mappings
  React.useEffect(() => {
    if (mappingCodeEditor === "") return;

    try {
      JSON.parse(mappingCodeEditor);
    } catch (e) {
      return;
    }

    const jsonMapping = mappingCodeEditor && JSON.parse(mappingCodeEditor);

    const newMapping = Object.entries(jsonMapping).map(([key, value]) => ({ key, value }));

    if (!_.isEqual(mappingKeyValue, newMapping)) setMappingKeyValue(newMapping);
  }, [mappingCodeEditor]);

  React.useEffect(() => {
    if (!watchMapping?.length) return;

    const test = Object.assign({}, ...watchMapping.map(({ key, value }: any) => ({ [key]: value })));

    setMappingCodeEditor(JSON.stringify(test, null, 2));
  }, [watchMapping]);

  //Unset
  React.useEffect(() => {
    if (unsetCodeEditor === "") return;

    try {
      JSON.parse(unsetCodeEditor);
    } catch (e) {
      return;
    }

    const jsonUnset = unsetCodeEditor && JSON.parse(unsetCodeEditor);

    const newUnset = Object.entries(jsonUnset).map(([key, value]) => ({ key, value }));

    if (!_.isEqual(unsetKeyValue, newUnset)) setUnsetKeyValue(newUnset);
  }, [unsetCodeEditor]);

  React.useEffect(() => {
    if (!watchUnset?.length) return;

    const test = Object.assign({}, ...watchUnset.map(({ key, value }: any) => ({ [key]: value })));

    setUnsetCodeEditor(JSON.stringify(test, null, 2));
  }, [watchUnset]);

  //Cast
  React.useEffect(() => {
    if (castCodeEditor === "") return;

    try {
      JSON.parse(castCodeEditor);
    } catch (e) {
      return;
    }

    const jsonCast = castCodeEditor && JSON.parse(castCodeEditor);

    const newCast = Object.entries(jsonCast).map(([key, value]) => ({ key, value }));

    if (!_.isEqual(castKeyValue, newCast)) setCastKeyValue(newCast);
  }, [castCodeEditor]);

  React.useEffect(() => {
    if (!watchCast?.length) return;

    const test = Object.assign({}, ...watchCast.map(({ key, value }: any) => ({ [key]: value })));

    setCastCodeEditor(JSON.stringify(test, null, 2));
  }, [watchCast]);

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
                validation={enrichValidation({ required: true })}
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
            <Collapsible
              className={styles.collapsible}
              openedClassName={styles.collapsible}
              trigger={
                <div className={clsx(styles.triggerContainer, isOpenMapping && styles.triggerContainerBorder)}>
                  <div className={styles.triggerButton}>
                    <span className={styles.collapsibleTitle}>
                      {t("Mapping")} <span className={styles.collapsibleCountIndicator}>({watchMapping?.length})</span>
                    </span>
                    <FontAwesomeIcon
                      className={clsx(styles.toggleIcon, isOpenMapping && styles.isOpen)}
                      icon={faChevronRight}
                    />
                  </div>

                  {isOpenMapping && (
                    <>
                      <div onClick={(e) => handleSwitchEditor(e, "mapping")}>
                        <Link icon={<FontAwesomeIcon icon={faEdit} />} iconAlign="start">
                          {t(!editMappingInEditor ? "Edit as JSON" : "Edit as Key-Value")}
                        </Link>
                      </div>
                      <div className={styles.triggerButton} onClick={(e) => handleScrollToCreate(e, mappingRefBottom)}>
                        <Link icon={<FontAwesomeIcon icon={faArrowDown} />} iconAlign="start">
                          {t("Scroll to create")}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              }
              open={isOpenMapping}
              transitionTime={200}
              onOpening={() => setIsOpenMapping(true)}
              onClosing={() => setIsOpenMapping(false)}
            >
              <div className={styles.keyValueContainer}>
                {!editMappingInEditor && (
                  <CreateKeyValue
                    name="mapping"
                    {...{ register, errors, control }}
                    defaultValue={mappingKeyValue}
                    disabled={isLoading.endpointForm}
                    validation={enrichValidation({ required: true })}
                    copyValue={{ canCopy: true, onCopied: () => toast.success("Copied to clipboard!") }}
                  />
                )}
                {editMappingInEditor && (
                  <CodeEditor language="json" code={mappingCodeEditor} setCode={setMappingCodeEditor} />
                )}
              </div>
            </Collapsible>
            <div ref={mappingRefBottom} />
          </FormFieldInput>
        </FormField>
        <FormField>
          <FormFieldInput>
            <Collapsible
              className={styles.collapsible}
              openedClassName={styles.collapsible}
              trigger={
                <div className={clsx(styles.triggerContainer, isOpenUnset && styles.triggerContainerBorder)}>
                  <div className={styles.triggerButton}>
                    <span className={styles.collapsibleTitle}>
                      {t("Unset")} <span className={styles.collapsibleCountIndicator}>({watchUnset?.length})</span>
                    </span>
                    <FontAwesomeIcon
                      className={clsx(styles.toggleIcon, isOpenUnset && styles.isOpen)}
                      icon={faChevronRight}
                    />
                  </div>

                  {isOpenUnset && (
                    <>
                      <div onClick={(e) => handleSwitchEditor(e, "unset")}>
                        <Link icon={<FontAwesomeIcon icon={faEdit} />} iconAlign="start">
                          {t(!editMappingInEditor ? "Edit as JSON" : "Edit as Key-Value")}
                        </Link>
                      </div>
                      <div className={styles.triggerButton} onClick={(e) => handleScrollToCreate(e, unsetRefBottom)}>
                        <Link icon={<FontAwesomeIcon icon={faArrowDown} />} iconAlign="start">
                          {t("Scroll to create")}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              }
              open={isOpenUnset}
              transitionTime={200}
              onOpening={() => setIsOpenUnset(true)}
              onClosing={() => setIsOpenUnset(false)}
            >
              <div className={styles.keyValueContainer}>
                {!editUnsetInEditor && (
                  <CreateKeyValue
                    name="unset"
                    {...{ register, errors, control }}
                    defaultValue={unsetKeyValue}
                    disabled={isLoading.endpointForm}
                    copyValue={{ canCopy: true, onCopied: () => toast.success("Copied to clipboard!") }}
                  />
                )}
                {editUnsetInEditor && (
                  <CodeEditor language="json" code={unsetCodeEditor} setCode={setUnsetCodeEditor} />
                )}
              </div>
            </Collapsible>

            <div ref={unsetRefBottom} />
          </FormFieldInput>
        </FormField>
        <FormField>
          <FormFieldInput>
            <Collapsible
              className={styles.collapsible}
              openedClassName={styles.collapsible}
              trigger={
                <div className={styles.triggerContainer}>
                  <div className={styles.triggerButton}>
                    <span className={styles.collapsibleTitle}>
                      {t("Cast")} <span className={styles.collapsibleCountIndicator}>({watchCast?.length})</span>
                    </span>
                    <FontAwesomeIcon
                      className={clsx(styles.toggleIcon, isOpenCast && styles.isOpen)}
                      icon={faChevronRight}
                    />
                  </div>

                  {isOpenCast && (
                    <>
                      <div onClick={(e) => handleSwitchEditor(e, "unset")}>
                        <Link icon={<FontAwesomeIcon icon={faEdit} />} iconAlign="start">
                          {t(!editMappingInEditor ? "Edit as JSON" : "Edit as Key-Value")}
                        </Link>
                      </div>
                      <div className={styles.triggerButton} onClick={(e) => handleScrollToCreate(e, castRefBottom)}>
                        <Link icon={<FontAwesomeIcon icon={faArrowDown} />} iconAlign="start">
                          {t("Scroll to create")}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              }
              open={isOpenCast}
              transitionTime={200}
              onOpening={() => setIsOpenCast(true)}
              onClosing={() => setIsOpenCast(false)}
            >
              <div className={styles.keyValueContainer}>
                {!editCastInEditor && (
                  <CreateKeyValue
                    name="cast"
                    {...{ register, errors, control }}
                    defaultValue={castKeyValue}
                    disabled={isLoading.endpointForm}
                    copyValue={{ canCopy: true, onCopied: () => toast.success("Copied to clipboard!") }}
                  />
                )}
                {editCastInEditor && <CodeEditor language="json" code={castCodeEditor} setCode={setCastCodeEditor} />}
              </div>
            </Collapsible>

            <div ref={castRefBottom} />
          </FormFieldInput>
        </FormField>
      </div>
    </form>
  );
};

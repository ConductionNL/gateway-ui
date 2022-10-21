import * as React from "react";
import * as styles from "./PluginFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";

interface EditPluginFormTemplateProps {
  plugin: any;
  pluginId?: string;
}

export const EditPluginFormTemplate: React.FC<EditPluginFormTemplateProps> = ({ plugin, pluginId }) => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _usePlugin = usePlugin(queryClient);
  const createOrEditPlugin = _usePlugin.createOrEdit(pluginId);
  const deletePlugin = _usePlugin.remove();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditPlugin.mutate({ payload: data, id: pluginId });
  };

  const handleDelete = (id: string): void => {
    deletePlugin.mutateAsync({ id: id });
  };

  const handleSetFormValues = (plugin: any): void => {
    const basicFields: string[] = ["name"];
    basicFields.forEach((field) => setValue(field, plugin[field]));
  };

  React.useEffect(() => {
    handleSetFormValues(plugin);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className={styles.section}>
        <Heading1>{t("Edit Plugin")}</Heading1>

        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} type="submit" disabled={loading}>
            <FontAwesomeIcon icon={faFloppyDisk} />

            {t("Save")}
          </Button>
          <Button className={clsx(styles.buttonIcon, styles.deleteButton)}>
            <FontAwesomeIcon icon={faTrash} />
            {t("Delete")}
          </Button>
        </div>
      </section>
      {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
      <div className={styles.container}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="name" validation={{ required: true }} disabled={loading} />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

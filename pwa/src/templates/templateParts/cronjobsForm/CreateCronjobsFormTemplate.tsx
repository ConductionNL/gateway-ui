import * as React from "react";
import * as styles from "./CronjobsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useCronjob } from "../../../hooks/cronjob";

interface CreateCronjobFormTemplateProps {
  cronjobId?: string;
}

export const CreateCronjobFormTemplate: React.FC<CreateCronjobFormTemplateProps> = ({ cronjobId }) => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useCronjobs = useCronjob(queryClient);
  const createOrEditCronjob = _useCronjobs.createOrEdit(cronjobId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditCronjob.mutate({ payload: data, id: cronjobId });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Cronjob")}</Heading1>

          <div className={styles.buttonss}>
            <Button className={styles.buttonIcon} size="large" type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />

              {t("Save")}
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
    </>
  );
};

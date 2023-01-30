import * as React from "react";
import * as styles from "./SchemasFormTemplate.module.css";

import clsx from "clsx";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { SchemaFormTemplate, formId } from "./SchemaFormTemplate";
import { IsLoadingContext } from "../../../context/isLoading";

export const CreateSchemaTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Create Schema")}</Heading1>

        <div className={styles.buttons}>
          <Button
            className={clsx(styles.buttonIcon, styles.button)}
            type="submit"
            form={formId}
            disabled={isLoading.schemaForm}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <SchemaFormTemplate />
    </div>
  );
};

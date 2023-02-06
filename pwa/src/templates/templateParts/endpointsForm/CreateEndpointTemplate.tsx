import * as React from "react";
import * as styles from "./CreateEndpointTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { EndpointFormTemplate, formId } from "./EndpointFormTemplate";
import { IsLoadingContext } from "../../../context/isLoading";

export const CreateEndpointTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Create Endpoint")}</Heading1>
        <div className={styles.buttons}>
          <Button
            type="submit"
            form={formId}
            disabled={isLoading.endpointForm}
            className={clsx(styles.buttonIcon, styles.button)}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <EndpointFormTemplate />
    </div>
  );
};

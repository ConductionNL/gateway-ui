import * as React from "react";
import * as styles from "./CreateSecurityGroupTemplate.module.css";
import clsx from "clsx";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { SecurityGroupFormTemplate, formId } from "./SecurityGroupFormTemplate";
import { IsLoadingContext } from "../../../context/isLoading";

export const CreateSecurityGroupTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Create Security Group")}</Heading1>

        <div className={styles.buttons}>
          <Button
            type="submit"
            form={formId}
            disabled={isLoading.securityGroupForm}
            className={clsx(styles.buttonIcon, styles.button)}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <SecurityGroupFormTemplate />
    </div>
  );
};

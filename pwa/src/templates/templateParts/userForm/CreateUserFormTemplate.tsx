import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import { UserFormTemplate } from "./UserFormTemplate";
import { QueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";
import { Heading1 } from "@gemeente-denhaag/typography";
import Button from "@gemeente-denhaag/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export const CreateUserFormTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const getOrganization = _useOrganizations.getAll();

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>Create User</Heading1>

        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} type="submit" form="UserForm" disabled={loading}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <UserFormTemplate {...{ getOrganization }} />
    </div>
  );
};

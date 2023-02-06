import * as React from "react";
import * as styles from "./CreateUserTemplate.module.css";
import { formId, UserFormTemplate } from "./UserFormTemplate";
import { Heading1 } from "@gemeente-denhaag/typography";
import Button from "@gemeente-denhaag/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import clsx from "clsx";
import { IsLoadingContext } from "../../../context/isLoading";

export const CreateUserTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>Create User</Heading1>

        <div className={styles.buttons}>
          <Button
            type="submit"
            form={formId}
            disabled={isLoading.userForm}
            className={clsx(styles.buttonIcon, styles.button)}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <UserFormTemplate />
    </Container>
  );
};

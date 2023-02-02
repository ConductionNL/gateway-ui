import * as React from "react";
import * as styles from "./CreateCollectionTemplate.module.css";
import clsx from "clsx";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { IsLoadingContext } from "../../../context/isLoading";
import { CollectionFormTemplate, formId } from "./CollectionFormTemplate";

export const CreateCollectionTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Create Collection")}</Heading1>

        <div className={styles.buttons}>
          <Button
            type="submit"
            form={formId}
            disabled={isLoading.collectionForm}
            className={clsx(styles.buttonIcon, styles.button)}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <CollectionFormTemplate />
    </div>
  );
};

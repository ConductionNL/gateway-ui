import * as React from "react";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";

export const ActionsDetailTemplate: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Heading1>{t("Action detail page")}</Heading1>
    </div>
  );
};

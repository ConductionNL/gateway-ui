import * as React from "react";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";

export const HomeTemplate: React.FC = () => {
  const { t } = useTranslation();

  return <Heading1>{t("Home")}</Heading1>;
};

import * as React from "react";
import { navigate, PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { ObjectDetailTemplate } from "../../../templates/objectDetailTemplate/ObjectDetailTemplate";
import { CreateObjectFormTemplate } from "../../../templates/templateParts/objectsFormTemplate/CreateObjectFormTemplate";
import { ArrowLeftIcon } from "@gemeente-denhaag/icons";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";

const ObjectDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const { t } = useTranslation();

  const params = new Proxy(new URLSearchParams(props.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  }) as any;

  return (
    <DashboardTemplate>
      {props.params.objectId === "new" && (
        <>
          <div onClick={() => navigate(`/schemas/${params.schema}`)}>
            <Link icon={<ArrowLeftIcon />} iconAlign="start">
              {t("Back to schema")}
            </Link>
          </div>
          <CreateObjectFormTemplate predefinedSchema={params.schema} />
        </>
      )}
      {props.params.objectId !== "new" && <ObjectDetailTemplate objectId={props.params.objectId} />}
    </DashboardTemplate>
  );
};

export default ObjectDetailPage;

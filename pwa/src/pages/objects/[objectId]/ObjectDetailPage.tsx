import * as React from "react";
import { navigate, PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { ObjectDetailTemplate } from "../../../templates/objectDetailTemplate/ObjectDetailTemplate";
import { CreateObjectFormTemplate } from "../../../templates/templateParts/objectsFormTemplate/CreateObjectFormTemplate";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ObjectDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const { t } = useTranslation();

  const params = new Proxy(new URLSearchParams(props.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  }) as any;

  return (
    <DashboardTemplate>
      {props.params.objectId === "new" && (
        <>
          {params.schema && (
            <div onClick={() => navigate(`/schemas/${params.schema}`)}>
              <Link icon={<FontAwesomeIcon icon={faArrowLeft} />} iconAlign="start">
                {t("Back to schema")}
              </Link>
            </div>
          )}

          <CreateObjectFormTemplate predefinedSchema={params.schema} />
        </>
      )}

      {props.params.objectId !== "new" && (
        <>
          {params.schema && (
            <div onClick={() => navigate(`/schemas/${params.schema}`)}>
              <Link icon={<FontAwesomeIcon icon={faArrowLeft} />} iconAlign="start">
                {t("Back to schema")}
              </Link>
            </div>
          )}
          <ObjectDetailTemplate objectId={props.params.objectId} />
        </>
      )}
    </DashboardTemplate>
  );
};

export default ObjectDetailPage;

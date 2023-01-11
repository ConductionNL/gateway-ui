import * as React from "react";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { PageProps } from "gatsby";
import { PropertyDetailTemplate } from "../../../../templates/propertyDetailTemplate/PropertyDetailTemplate";
import { CreatePropertyFormTemplate } from "../../../../templates/templateParts/propertyForm/CreatePropertyFormTemplate";

const PropertyDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.propertyId === "new" && <CreatePropertyFormTemplate schemaId={props.params.schemaId} />}
    {props.params.propertyId !== "new" && (
      <PropertyDetailTemplate propertyId={props.params.propertyId} schemaId={props.params.schemaId} />
    )}
  </DashboardTemplate>
);

export default PropertyDetailPage;

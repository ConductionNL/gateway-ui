import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { CollectionsDetailTemplate } from "../../../templates/collectionDetailsTemplate/CollectionsDetailsTemplate";
import { CreateCollectionFormTemplate } from "../../../templates/templateParts/collectionsForm/CreateCollectionFormTemplate";

const CollectionDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.collectionId === "new" && <CreateCollectionFormTemplate />}
    {props.params.collectionId !== "new" && <CollectionsDetailTemplate collectionId={props.params.collectionId} />}
  </DashboardTemplate>
);

export default CollectionDetailPage;

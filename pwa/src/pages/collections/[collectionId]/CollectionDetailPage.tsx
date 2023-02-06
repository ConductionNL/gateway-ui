import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { CollectionsDetailTemplate } from "../../../templates/collectionDetailsTemplate/CollectionsDetailsTemplate";
import { CreateCollectionTemplate } from "../../../templates/templateParts/collectionsForm/CreateCollectionTemplate";

const CollectionDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const collectionId = props.params.collectionId === "new" ? null : props.params.collectionId;

  return (
    <DashboardTemplate>
      {!collectionId && <CreateCollectionTemplate />}
      {collectionId && <CollectionsDetailTemplate {...{ collectionId }} />}
    </DashboardTemplate>
  );
};

export default CollectionDetailPage;

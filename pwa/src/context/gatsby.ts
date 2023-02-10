import * as React from "react";

export type TScreenSize = "mobile" | "tablet" | "desktop";

export interface IGatsbyContext {
  pageContext: any;
  location: any;
  screenSize: TScreenSize;
}

export const defaultGatsbyContext: IGatsbyContext = {
  pageContext: null,
  location: null,
  screenSize: "mobile",
};

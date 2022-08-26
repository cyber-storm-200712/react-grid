import React from "react";
// import { Layout } from "react-grid-layout";

import { ReactGridLayout } from "./ReactGridLayout";

const App = () => {
  let savedLayouts = {};
  if (typeof window !== "undefined") {
    const hasSavedLayouts =
      window.localStorage && window.localStorage.getItem("gridLayoutConfig");
    savedLayouts = hasSavedLayouts ? JSON.parse(hasSavedLayouts) : {};
  }

  return (
    <ReactGridLayout
      savedLayouts={savedLayouts}
      rowHeight={30}
      cols={{ lg: 24, md: 12, sm: 6, xs: 3, xxs: 1 }}
      isBounded={true}
      useCSSTransforms={false}
      defaultPanelHeight={2}
      defaultPanelWidth={6}
    />
  );
};

export default App;

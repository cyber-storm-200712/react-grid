import React, { useState } from "react";
import { WidthProvider, Responsive, Layout, Layouts } from "react-grid-layout";

/**
 * Panel
 */

const Panel = React.forwardRef(
  (props, ref) => {
    const { style, ...otherProps } = props;

    const styles = {
      ...style,
      border: "1px solid black"
    };

    return (
      <div ref={ref} style={styles} {...otherProps}>
        {props.children}
      </div>
    );
  }
);

/**
 * GRID
 */

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// type ReactGridLayoutProps = {
//   cols: { [breakpoint: string]: number };
//   rowHeight: number;

//   classname?: string;
//   useCSSTransforms?: boolean;
//   isBounded?: boolean;

//   savedLayouts?: { [breakpoint: string]: Layout[] };
//   defaultPanelHeight?: number;
//   defaultPanelWidth?: number;
// };

const ReactGridLayout = ({
  savedLayouts,
  defaultPanelHeight,
  defaultPanelWidth,
  ...props
}) => {
  // type GridStateProps = {
  //   currentBreakpoint: string;
  //   currentCols: number;
  //   layouts: { [breakpoint: string]: Layout[] };
  //   currentLayout: Layout[];
  // };

  const initialState = {
    currentBreakpoint: "lg",
    currentCols: props.cols.lg,
    layouts: savedLayouts || {},

    // @todo merge hacky way
    currentLayout: savedLayouts
      ? savedLayouts["lg"] ||
        savedLayouts["md"] ||
        savedLayouts["sm"] ||
        savedLayouts["xs"] ||
        savedLayouts["xss"] ||
        []
      : []
  };

  const [state, setState] = useState(initialState);

  const handleLayoutChange = (
    newLayout,
    newLayoutWithBreakpoint
  ) => {
    setState({
      ...state,
      layouts: newLayoutWithBreakpoint
    });
  };

  const findClosestToTopLeftSpaceAvailable = () => {
    // @todo

    return {
      x: 0,
      y: Infinity
    };
  };

  const addItemHandler = () => {
    const newPanelPositionXY = findClosestToTopLeftSpaceAvailable();

    const newPanel = {
      i: state.currentLayout.length.toString(),
      x: newPanelPositionXY.x,
      y: newPanelPositionXY.y,
      w: defaultPanelWidth || 6,
      h: defaultPanelHeight || 2,
      minW: 1,
      minH: 1,
      maxW: undefined,
      maxH: undefined,
      isDraggable: true,
      isResizable: true,
      isBounded: false,
      resizeHandles: ["se"],
      static: false
    };

    const newLayout = [...state.currentLayout, newPanel];

    setState({
      ...state,
      layouts: { [state.currentBreakpoint]: newLayout },
      currentLayout: newLayout
    });
  };

  const breakpointChangeHandler = (newBreakpoint, newCols) => {
    // @todo merge hacky way
    const oldLayout =
      state.layouts[state.currentBreakpoint] ||
      state.layouts["lg"] ||
      state.layouts["md"] ||
      state.layouts["sm"] ||
      state.layouts["xs"] ||
      state.layouts["xxs"] ||
      [];

    setState({
      ...state,
      currentBreakpoint: newBreakpoint,
      currentCols: newCols,
      currentLayout: state.layouts[newBreakpoint] || oldLayout
    });
  };

  /*
   * THIS HANDLER ISN'T IMPORTANT FOR PROD
   * IT PROVIDES A WAY TO UPDATE PANELS TO DEBUG
   *
   * USEFUL TO HANDLE RESIZE & DRAG EVENTS
   */
  const updateLayout = (newLayout) => {
    setState({
      ...state,
      layouts: {
        ...state.layouts,
        [state.currentBreakpoint]: [...newLayout]
      },
      currentLayout: [...newLayout]
    });
  };

  const saveConfig = () => {
    if (window.localStorage) {
      console.log("saving layouts", state.layouts);
      window.localStorage.setItem(
        "gridLayoutConfig",
        JSON.stringify(state.layouts)
      );
    }
  };

  const deleteConfig = () => {
    if (window.localStorage) {
      console.log("deleting layouts");
      window.localStorage.removeItem("gridLayoutConfig");
    }
  };

  return (
    <div>
      <div>
        <p>
          <strong>setup</strong> Add a few items & export config & reload window
          <br />
          <strong>bug</strong> Open console & try to resize item
          <br />
          It only bugs only items saved & reload, if you add more items they are
          fine
        </p>
        <button onClick={addItemHandler}>add item</button>
        <button onClick={saveConfig}>export config</button>
        <button onClick={deleteConfig}>delete config</button>
      </div>
      <ResponsiveReactGridLayout
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={breakpointChangeHandler}
        layouts={state.layouts}
        onResizeStop={updateLayout}
        onDragStop={updateLayout}
        {...props}
      >
        {state.currentLayout &&
          state.currentLayout.map((panel) => (
            <Panel key={panel.i}>
              <p>
                {panel.i} - ({panel.x}, {panel.y}) - ({panel.w}, {panel.h})
              </p>
            </Panel>
          ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export { ReactGridLayout };

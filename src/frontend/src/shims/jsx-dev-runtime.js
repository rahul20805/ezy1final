import * as React from "react";

export const Fragment = React.Fragment;
export const jsx = (type, props, key) => React.createElement(type, { ...props, key });
export const jsxs = (type, props, key) => React.createElement(type, { ...props, key });
export const jsxDEV = (type, props, key, isStatic, source, self) => React.createElement(type, { ...props, key });

export default { Fragment, jsx, jsxs, jsxDEV };

import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import App from "./App";
test(`renders learn react link`, () => {
    render(_jsx(App, {}, void 0));
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});

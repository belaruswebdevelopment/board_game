import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", (): void => {
    render(<App />);
    const linkElement: HTMLElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});

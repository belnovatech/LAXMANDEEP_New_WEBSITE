import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect } from "vitest";
import Navbar from "./navbar";

describe("Navbar", () => {
  test("renders all navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Clients")).toBeInTheDocument();
    expect(screen.getByText("Client Hub")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  test("opens hamburger menu", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const hamburger =
      document.querySelector(".hamburger");

    await user.click(hamburger!);

    expect(hamburger).toHaveClass("active");
  });

  test("clicks Home link", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    await user.click(screen.getByText("Home"));

    expect(screen.getByText("Home"))
      .toBeInTheDocument();
  });

  test("clicks About link", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    await user.click(screen.getByText("About"));

    expect(screen.getByText("About"))
      .toBeInTheDocument();
  });
});
test("clicks Services link", async () => {
  const user = userEvent.setup();

  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  await user.click(screen.getByText("Services"));

  expect(screen.getByText("Services"))
    .toBeInTheDocument();
});

test("closes menu when Home link is clicked", async () => {
  const user = userEvent.setup();

  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  const hamburger = document.querySelector(".hamburger");

  await user.click(hamburger!);

  expect(hamburger).toHaveClass("active");

  await user.click(screen.getByText("Home"));

  expect(hamburger).not.toHaveClass("active");
});
test("clicks Clients link", async () => {
  const user = userEvent.setup();

  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  await user.click(screen.getByText("Clients"));

  expect(screen.getByText("Clients")).toBeInTheDocument();
});

test("clicks Contact link", async () => {
  const user = userEvent.setup();

  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  await user.click(screen.getByText("Contact"));

  expect(screen.getByText("Contact")).toBeInTheDocument();
});
test("toggles hamburger open and close", async () => {
  const user = userEvent.setup();

  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  const hamburger = document.querySelector(".hamburger");

  await user.click(hamburger!);
  expect(hamburger).toHaveClass("active");

  await user.click(hamburger!);
  expect(hamburger).not.toHaveClass("active");
});
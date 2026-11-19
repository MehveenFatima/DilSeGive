import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDocumentTitle } from "./use-document-title";

describe("useDocumentTitle", () => {
  it("adds the app name after the page title", () => {
    renderHook(() => useDocumentTitle("Campaigns"));
    expect(document.title).toBe("Campaigns | DilSeGive");
  });

  it("uses just the app name when no title is given", () => {
    renderHook(() => useDocumentTitle());
    expect(document.title).toBe("DilSeGive");
  });

  it("updates when the title changes", () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: "Donate" },
    });
    rerender({ title: "Payment Successful" });
    expect(document.title).toBe("Payment Successful | DilSeGive");
  });
});

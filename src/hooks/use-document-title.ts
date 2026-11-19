import { useEffect } from "react";

const APP_NAME = "DilSeGive";

/** Sets the browser tab title, e.g. "Campaigns | DilSeGive". */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
  }, [title]);
}

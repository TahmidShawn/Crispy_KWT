import { useEffect } from "react";
import { useLocation } from "react-router";

import { getDefaultPageTitle } from "@/utils/getPageTitle";

/** Site name appended to every page title. */
const SITE_NAME = "CrispyKWT";

/**
 * Sets the browser tab title for the current route.
 *
 * Default title is derived from the route:
 *   "<Page> | CrispyKWT"  (e.g. "Home | CrispyKWT", "Chocolate Cake | CrispyKWT")
 *
 * Pass an explicit `pageTitle` to override the route-derived default.
 */
export function usePageTitle(pageTitle) {
  const { pathname } = useLocation();
  const title = pageTitle ?? getDefaultPageTitle(pathname);

  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  }, [title, pathname]);

  return title;
}

export default usePageTitle;

import { Helmet } from "react-helmet-async";

/** Site name appended to the `<title>` tag of every page. */
const SITE_NAME = "CrispyKWT";

/**
 * Renders the document `<title>` and meta tags for a page.
 *
 * The browser tab title becomes: "{title} | {SITE_NAME}".
 *
 * @param {string} [title]   Page title (without the site suffix). Renders the
 *                            canonical `<title>` + `og:title`.
 * @param {string} [description] Page description. Renders `meta name="description"`
 *                            + `og:description`.
 *
 * Only the `<title>` of the *innermost* rendered `<Helmet>` wins, so a page can
 * nest its own `<PageHead>` to override the layout's default title.
 */
export function PageHead({ title, description }) {
  return (
    <Helmet>
      {title && <title>{title} | {SITE_NAME}</title>}
      {description && <meta name="description" content={description} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  );
}

export default PageHead;

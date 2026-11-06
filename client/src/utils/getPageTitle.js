/**
 * Derives a human-friendly page title from the current route pathname.
 *
 * Used as the default title so that every page gets a dynamic title in the
 * format "<Page> | CrispyKWT" (e.g. "Home | CrispyKWT", "Chocolate Cake | CrispyKWT").
 *
 * Route-specific overrides (like slugs) are decoded so titles stay readable.
 * Pages can still override this with an explicit title if needed.
 */
export function getDefaultPageTitle(pathname) {
  const path =
    pathname === "/"
      ? "/"
      : String(pathname || "").split("?")[0];

  switch (path) {
    case "/":
      return "Home";
    case "/cart":
      return "Cart";
    case "/checkout":
      return "Checkout";
    case "/order-tracking":
      return "Track Your Order";
    case "/privacy":
      return "Privacy Policy";
    case "/terms":
      return "Terms & Conditions";
    case "/auth/login":
      return "Login";
    case "/auth/register":
      return "Register";
    case "/auth/verify-email":
      return "Verify Email";
    case "/payment/success":
      return "Payment Successful";
    case "/payment/failed":
      return "Payment Failed";
    default:
      break;
  }

  // Dynamic routes
  const category = path.match(/^\/category\/(.+)$/);
  if (category) return decodeURIComponent(category[1]);

  const cake = path.match(/^\/cake\/(.+)$/);
  if (cake) return decodeURIComponent(cake[1]);

  if (path === "/search") return "Search Results";

  // Dashboard routes
  if (path.startsWith("/dashboard")) {
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/orders":
        return "My Orders";
      case "/dashboard/settings":
        return "Settings";
      default:
        if (path.startsWith("/dashboard/orders/")) return "Order Details";
        return "Dashboard";
    }
  }

  // Admin routes
  if (path.startsWith("/admin")) {
    switch (path) {
      case "/admin":
        return "Dashboard";
      case "/admin/orders":
      case "/admin/orders/pending":
      case "/admin/orders/confirmed":
      case "/admin/orders/out-for-delivery":
      case "/admin/orders/delivered":
      case "/admin/orders/cancelled":
        return "Orders";
      case "/admin/customers":
        return "Customers";
      default:
        if (path.startsWith("/admin/orders/")) return "Order Details";
        if (path.startsWith("/admin/categories/")) return "Categories";
        if (path.startsWith("/admin/cakes/")) return "Cakes";
        if (path.startsWith("/admin/add-ons/")) return "Add-ons";
        return "Dashboard";
    }
  }

  return "Page Not Found";
}

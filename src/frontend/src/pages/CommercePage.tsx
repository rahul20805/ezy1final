import { Navigate } from "@tanstack/react-router";

/**
 * Legacy Commerce Page
 * Redirects seamlessly to consumer grocery catalog (/category/grocery)
 * to remove the standalone dashboard section.
 */
export default function CommercePage() {
  return <Navigate to={"/category/grocery" as any} replace />;
}

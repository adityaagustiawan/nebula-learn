import { useEffect } from "react";
import { seedCatalogIfEmpty } from "@/lib/learning/catalog-sync";

/** Seeds Supabase catalog once when tables exist. */
export function PlatformBootstrap() {
  useEffect(() => {
    seedCatalogIfEmpty().catch(() => {});
  }, []);
  return null;
}

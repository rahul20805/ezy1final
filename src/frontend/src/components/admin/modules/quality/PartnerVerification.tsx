import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  FileCheck,
  FileText,
  HelpCircle,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useStoreData } from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function PartnerVerification() {
  const store = useStoreData();

  const handleVerify = (shopId: number) => {
    store.updateShop(shopId, { verified: true });
    toast.success(`Merchant KYC license verified and badge granted!`);
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="Partner KYC & Compliance Verification Hub"
        description="Verify FSSAI food certificates, GST certificates, doctor medical council registrations, and commercial vehicle RC documents."
        data={store.shops}
        searchPlaceholder="Search store name, owner, city..."
        searchFilter={(item, query) =>
          item.businessName.toLowerCase().includes(query) ||
          item.ownerName.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query)
        }
        filterOptions={[]}
        sortOptions={[{ label: "Store Name (A-Z)", value: "name_asc" }]}
        defaultSort="name_asc"
        onSort={(items) =>
          [...items].sort((a, b) =>
            a.businessName.localeCompare(b.businessName),
          )
        }
        pageSize={6}
        renderItem={(shop) => (
          <Card
            key={shop.id}
            className="rounded-3xl border-border bg-card p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-foreground">
                    {shop.businessName}
                  </h3>
                  {shop.verified ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-300 text-[10px] font-bold">
                      Pending Audit
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Owner: {shop.ownerName} • {shop.city} ({shop.category})
                </p>
              </div>

              <span className="font-mono text-xs text-muted-foreground">
                ID: #{shop.id}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                📄 GSTIN Verified: 29AAAAA0000A1Z5
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                📄 Trade License: TRD-2026-908
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-2 border-t border-border/60 gap-2">
              <span className="text-[11px] text-muted-foreground">
                Status: Operational
              </span>
              {!shop.verified ? (
                <Button
                  size="sm"
                  onClick={() => handleVerify(shop.id)}
                  className="h-8 px-3 text-xs rounded-xl bg-primary text-primary-foreground font-semibold gap-1 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve Verification
                </Button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600">
                  ✓ Compliance Cleared
                </span>
              )}
            </div>
          </Card>
        )}
      />
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Download,
  History,
  Lock,
  RefreshCw,
  Shield,
  User,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { type StoredAuditLog, useStoreData } from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function AuditLogsManager() {
  const store = useStoreData();

  return (
    <div className="space-y-6">
      <DataTable<StoredAuditLog>
        title="Immutable Platform Audit Trail"
        description="Comprehensive compliance logs tracking every administrative action, price change, partner approval and payout disbursement."
        data={store.auditLogs}
        searchPlaceholder="Search admin, action, entity, details..."
        searchFilter={(item, query) =>
          item.adminName.toLowerCase().includes(query) ||
          item.action.toLowerCase().includes(query) ||
          item.entityType.toLowerCase().includes(query) ||
          item.details.toLowerCase().includes(query)
        }
        filterOptions={[]}
        sortOptions={[{ label: "Log Timestamp (Newest)", value: "id_desc" }]}
        defaultSort="id_desc"
        onSort={(items) => [...items].sort((a, b) => b.id - a.id)}
        pageSize={8}
        renderItem={(log) => (
          <Card key={log.id} className="rounded-3xl border-border bg-card p-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-foreground uppercase">{log.action}</span>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {log.entityType} #{log.entityId}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground mt-1 font-medium">{log.details}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Operator: <span className="font-semibold text-foreground">{log.adminName}</span> ({log.adminRole}) • IP: {log.ipAddress}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-muted-foreground font-mono flex-shrink-0">{log.timestamp}</span>
            </div>
          </Card>
        )}
      />
    </div>
  );
}

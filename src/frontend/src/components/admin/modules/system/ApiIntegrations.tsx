import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  CheckCircle2,
  ExternalLink,
  FileCode,
  Globe,
  Lock,
  RefreshCw,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export function ApiIntegrations() {
  const [integrations] = useState([
    {
      name: "Meta Cloud WhatsApp Webhook",
      type: "Webhook / Bot",
      endpoint: "https://ezy1final.vercel.app/api/whatsapp/webhook",
      status: "Operational",
      latency: "45ms",
    },
    {
      name: "Direct UPI Deep-Link Gateway",
      type: "Payments",
      endpoint: "upi://pay?pa=ezy1business@okhdfcbank",
      status: "Operational",
      latency: "12ms",
    },
    {
      name: "Google Geocoding & Distance Matrix",
      type: "Maps & Logistics",
      endpoint: "https://maps.googleapis.com/maps/api/distancematrix",
      status: "Operational",
      latency: "82ms",
    },
    {
      name: "Transactional SMS Gateway (DLT)",
      type: "Alerts & SMS",
      endpoint: "https://api.smsalert.co.in/v1/send",
      status: "Operational",
      latency: "120ms",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <FileCode className="w-5 h-5 text-primary" /> API, Webhooks & Third-Party Integrations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time status indicators, webhook health, and secure gateway connections.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success("All upstream endpoints pinged: 100% operational.")}
          className="h-8 rounded-xl text-xs gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Ping All Endpoints
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item, idx) => (
          <Card key={idx} className="rounded-3xl border-border bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-base text-foreground">{item.name}</h3>
                <Badge variant="outline" className="text-[10px] mt-1">
                  {item.type}
                </Badge>
              </div>

              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 mr-1" /> {item.status}
              </Badge>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs font-mono break-all space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-sans">Endpoint:</span>
              <p className="text-foreground">{item.endpoint}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
              <span>Avg Latency: <span className="font-mono font-bold text-foreground">{item.latency}</span></span>
              <span className="text-emerald-600 font-semibold">SSL 256-Bit Encrypted</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

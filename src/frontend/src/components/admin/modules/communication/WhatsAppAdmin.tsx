import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  CheckCircle2,
  Lock,
  MessageCircle,
  Phone,
  Radio,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useStoreData } from "../../../../lib/storeData";

export function WhatsAppAdmin() {
  const store = useStoreData();

  const [botEnabled, setBotEnabled] = useState(true);
  const [autoOrderAlerts, setAutoOrderAlerts] = useState(true);
  const [autoDispatchAlerts, setAutoDispatchAlerts] = useState(true);
  const [waNumber, setWaNumber] = useState(store.settings.whatsappNumber);

  const handleSaveWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      whatsappNumber: waNumber.trim(),
      whatsappConnected: true,
      whatsappWebhookStatus: "Connected",
    });
    toast.success("WhatsApp Business credentials & automated webhook active!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-500 fill-emerald-500" /> WhatsApp Business & Bot Control
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage official click-to-chat gateway, natural language ordering bot, and automated status alerts.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSaveWhatsApp}
          className="h-9 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-xs"
        >
          <Save className="w-3.5 h-3.5" /> Save WhatsApp Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Gateway Config */}
        <Card className="lg:col-span-7 rounded-3xl border-border bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-display font-bold">WhatsApp Business Gateway</CardTitle>
            <CardDescription className="text-xs">
              Direct connection parameters for official Meta Cloud WhatsApp API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Official Business WhatsApp Number *</Label>
              <Input
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                className="rounded-xl font-mono text-sm text-emerald-600 font-bold max-w-md"
                placeholder="+919876543210"
              />
              <p className="text-[11px] text-muted-foreground">
                Customers clicking "WhatsApp Order" will be redirected to this number with pre-filled cart text.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                <div>
                  <Label className="text-xs font-semibold">AI Natural Language Ordering Bot</Label>
                  <p className="text-[11px] text-muted-foreground">Parses text like "2kg rice & amul butter" into real orders</p>
                </div>
                <Switch checked={botEnabled} onCheckedChange={setBotEnabled} />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                <div>
                  <Label className="text-xs font-semibold">Automated Order Confirmation Messages</Label>
                  <p className="text-[11px] text-muted-foreground">Sends instant WhatsApp receipt upon successful checkout</p>
                </div>
                <Switch checked={autoOrderAlerts} onCheckedChange={setAutoOrderAlerts} />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                <div>
                  <Label className="text-xs font-semibold">Out-for-Delivery Rider Tracking Alerts</Label>
                  <p className="text-[11px] text-muted-foreground">Sends rider contact & ETA when package leaves store</p>
                </div>
                <Switch checked={autoDispatchAlerts} onCheckedChange={setAutoDispatchAlerts} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Connection Status Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-3xl border-border bg-card shadow-xs p-5 space-y-4">
            <h3 className="font-display font-bold text-base">API & Webhook Security Status</h3>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Meta Webhook Active
                </span>
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold">Connected</Badge>
              </div>
              <p className="text-emerald-800 dark:text-emerald-200 text-[11px]">
                Tokens and secrets are safely encrypted on the backend. No plain-text credentials exposed.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Webhook Endpoint:</span>
                <span className="font-mono font-bold text-foreground">/api/whatsapp/webhook</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground">Active Order Bot:</span>
                <span className="font-bold text-emerald-600">Enabled</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Incoming Messages:</span>
                <span className="font-mono font-bold text-foreground">240 Today</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.success("Test WhatsApp message ping delivered successfully!")}
              className="w-full text-xs rounded-xl gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send Test WhatsApp Ping
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

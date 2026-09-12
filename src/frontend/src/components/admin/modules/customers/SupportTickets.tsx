import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  LifeBuoy,
  MessageSquare,
  Phone,
  Send,
  ShieldAlert,
  User,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type StoredSupportTicket,
  useStoreData,
} from "../../../../lib/storeData";
import { DataTable } from "../../../owner/DataTable";

export function SupportTickets() {
  const store = useStoreData();

  const [selectedTicket, setSelectedTicket] =
    useState<StoredSupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isThreadOpen, setIsThreadOpen] = useState(false);

  const openTicketThread = (ticket: StoredSupportTicket) => {
    setSelectedTicket(ticket);
    setReplyText("");
    setIsThreadOpen(true);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    store.replyToSupportTicket(selectedTicket.id, replyText.trim());
    toast.success("Admin reply sent to customer!");
    setReplyText("");
    setSelectedTicket(
      store.supportTickets.find((t) => t.id === selectedTicket.id) || null,
    );
  };

  const handleStatusChange = (
    ticketId: number,
    status: StoredSupportTicket["status"],
  ) => {
    store.updateSupportTicketStatus(ticketId, status);
    toast.success(`Ticket marked as: ${status}`);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(
        store.supportTickets.find((t) => t.id === ticketId) || null,
      );
    }
  };

  const getPriorityColor = (priority: StoredSupportTicket["priority"]) => {
    switch (priority) {
      case "URGENT":
        return "bg-rose-500/10 text-rose-600 border-rose-500/30";
      case "HIGH":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <DataTable<StoredSupportTicket>
        title="Customer Support Tickets & Complaints"
        description="Help desk ticketing queue, category routing, admin assignments, and live customer resolution threads."
        data={store.supportTickets}
        searchPlaceholder="Search ticket ID, customer name, subject..."
        searchFilter={(item, query) =>
          item.ticketNumber.toLowerCase().includes(query) ||
          item.customerName.toLowerCase().includes(query) ||
          item.subject.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        }
        filterOptions={[
          {
            key: "priority",
            label: "Priority Level",
            options: [
              { label: "Urgent", value: "URGENT" },
              { label: "High", value: "HIGH" },
              { label: "Medium", value: "MEDIUM" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Open", value: "OPEN" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Resolved", value: "RESOLVED" },
            ],
          },
        ]}
        sortOptions={[
          { label: "Ticket Number", value: "id_desc" },
          { label: "Priority", value: "priority_desc" },
        ]}
        defaultSort="id_desc"
        onSort={(items, sortVal) => {
          const list = [...items];
          return list.sort((a, b) => b.id - a.id);
        }}
        pageSize={6}
        renderItem={(ticket) => (
          <Card
            key={ticket.id}
            className={`rounded-3xl border transition-all hover:shadow-md ${
              ticket.status === "OPEN"
                ? "border-amber-500/40 bg-amber-500/5"
                : ticket.status === "RESOLVED"
                  ? "border-border/60 bg-card opacity-80"
                  : "border-border/80 bg-card"
            }`}
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-foreground">
                      {ticket.ticketNumber}
                    </span>
                    <Badge
                      className={`text-[9px] uppercase font-bold ${getPriorityColor(ticket.priority)}`}
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                  <h4 className="font-display font-bold text-sm text-foreground mt-1">
                    {ticket.subject}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {ticket.customerName} ({ticket.customerPhone}) •{" "}
                    {ticket.createdAt}
                  </p>
                </div>

                <Badge
                  className={`text-[10px] uppercase font-bold ${
                    ticket.status === "RESOLVED"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : ticket.status === "IN_PROGRESS"
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {ticket.status.replace(/_/g, " ")}
                </Badge>
              </div>

              {/* Latest message preview */}
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                  Latest Message:
                </span>
                <p className="text-foreground italic line-clamp-2">
                  "
                  {ticket.messages[ticket.messages.length - 1]?.text ||
                    "No messages"}
                  "
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Assigned:</span>
                  <span className="font-bold text-foreground">
                    {ticket.assignedAdmin || "Support Queue"}
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => openTicketThread(ticket)}
                  className="h-8 px-3 text-xs rounded-xl bg-primary text-primary-foreground font-semibold gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> View & Reply (
                  {ticket.messages.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      />

      {/* Ticket Thread Dialog */}
      <Dialog open={isThreadOpen} onOpenChange={setIsThreadOpen}>
        <DialogContent className="max-w-lg bg-card border-border shadow-2xl rounded-3xl p-6">
          {selectedTicket && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-display font-bold">
                    {selectedTicket.ticketNumber} — {selectedTicket.subject}
                  </DialogTitle>
                  <Badge
                    className={`text-[10px] uppercase font-bold ${getPriorityColor(selectedTicket.priority)}`}
                  >
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <DialogDescription className="text-xs">
                  Customer: {selectedTicket.customerName} (
                  {selectedTicket.customerPhone})
                </DialogDescription>
              </DialogHeader>

              {/* Message Thread Scroll */}
              <div className="max-h-60 overflow-y-auto space-y-2 p-3 bg-muted/30 border border-border rounded-2xl text-xs">
                {selectedTicket.messages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-2xl max-w-[85%] ${
                      m.sender === "admin"
                        ? "ml-auto bg-primary text-primary-foreground font-medium"
                        : "mr-auto bg-card border border-border text-foreground"
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className="text-[9px] opacity-75 block text-right mt-1 font-mono">
                      {m.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-2">
                <Textarea
                  rows={2}
                  placeholder="Type your resolution or response to customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="rounded-xl text-xs"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">
                      Status:
                    </span>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedTicket.id,
                          e.target.value as any,
                        )
                      }
                      className="h-8 rounded-xl border border-border bg-background px-2 text-xs font-semibold"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-xl text-xs gap-1.5 font-semibold"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Reply
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

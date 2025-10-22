import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Building, Calendar, DollarSign, Clock, User, FileText } from "lucide-react";

interface Inquiry {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  company_size?: string | null;
  project_type: string;
  budget_range?: string | null;
  timeline?: string | null;
  description: string;
  current_solution?: string | null;
  status: string;
  notes?: string | null;
  admin_notes?: string | null;
}

const projectTypeLabels: Record<string, string> = {
  crm: "CRM Sistema",
  logistics: "Logistikos Sprendimas",
  automation: "Automatizacija",
  analytics: "Analitika",
  scheduling: "Grafikų Planavimas",
  accounting: "Buhalterija",
  other: "Kita",
};

const budgetLabels: Record<string, string> = {
  under_5k: "Iki €5,000",
  "5k_12k": "€5,000 - €12,000",
  "12k_25k": "€12,000 - €25,000",
  over_25k: "Virš €25,000",
  not_sure: "Dar nežinau",
};

const timelineLabels: Record<string, string> = {
  urgent: "Skubu",
  "1_2_months": "1-2 mėnesiai",
  "2_3_months": "2-3 mėnesiai",
  flexible: "Lanksčiai",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: "Nauja", color: "bg-blue-500" },
  contacted: { label: "Susisiekta", color: "bg-yellow-500" },
  in_discussion: { label: "Diskusijoje", color: "bg-purple-500" },
  quoted: { label: "Pasiūlymas išsiųstas", color: "bg-orange-500" },
  accepted: { label: "Priimta", color: "bg-green-500" },
  rejected: { label: "Atmesta", color: "bg-red-500" },
  completed: { label: "Užbaigta", color: "bg-gray-500" },
};

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  const fetchInquiries = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("custom_tool_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const normalizedInquiries: Inquiry[] = (data ?? []).map(
        (inquiry: Record<string, unknown>) => ({
          id: String(inquiry.id ?? ""),
          created_at: String(inquiry.created_at ?? ""),
          full_name: String(inquiry.full_name ?? ""),
          email: String(inquiry.email ?? ""),
          phone: (inquiry.phone as string | null | undefined) ?? null,
          company_name: (inquiry.company_name as string | null | undefined) ?? null,
          company_size: (inquiry.company_size as string | null | undefined) ?? null,
          project_type: String(inquiry.project_type ?? "other"),
          budget_range: (inquiry.budget_range as string | null | undefined) ?? null,
          timeline: (inquiry.timeline as string | null | undefined) ?? null,
          description: String(inquiry.description ?? ""),
          current_solution: (inquiry.current_solution as string | null | undefined) ?? null,
          status: String(inquiry.status ?? "new"),
          notes: (inquiry.notes as string | null | undefined) ?? null,
          admin_notes: (inquiry.admin_notes as string | null | undefined) ?? null,
        })
      );

      setInquiries(normalizedInquiries);
    } catch {
      toast({
        title: "Klaida",
        description: "Nepavyko gauti užklausų",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const updateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("custom_tool_inquiries")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status: newStatus } : inq)));

      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => (prev ? { ...prev, status: newStatus } : null));
      }

      toast({
        title: "Sėkmingai atnaujinta",
        description: "Užklausos statusas pakeistas",
      });
    } catch {
      toast({
        title: "Klaida",
        description: "Nepavyko atnaujinti statuso",
        variant: "destructive",
      });
    }
  };

  const updateAdminNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from("custom_tool_inquiries")
        .update({ admin_notes: notes })
        .eq("id", id);

      if (error) throw error;

      setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, admin_notes: notes } : inq)));

      toast({
        title: "Sėkmingai išsaugota",
        description: "Admin pastabos atnaujintos",
      });
    } catch {
      toast({
        title: "Klaida",
        description: "Nepavyko išsaugoti pastabų",
        variant: "destructive",
      });
    }
  };

  const filteredInquiries =
    filterStatus === "all" ? inquiries : inquiries.filter(inq => inq.status === filterStatus);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-foreground">Kraunama...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Verslo Sprendimų Užklausos</h1>
        <p className="text-foreground/70">
          Peržiūrėkite ir tvarkykite gautą užklausą custom įrankių kūrimui
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-4 items-center">
        <span className="text-sm text-foreground/70">Filtruoti pagal statusą:</span>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Visi ({inquiries.length})</SelectItem>
            {Object.entries(statusLabels).map(([key, { label }]) => {
              const count = inquiries.filter(inq => inq.status === key).length;
              return (
                <SelectItem key={key} value={key}>
                  {label} ({count})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredInquiries.length === 0 ? (
            <div className="dark-card text-center py-8">
              <p className="text-foreground/60">Užklausų nerasta</p>
            </div>
          ) : (
            filteredInquiries.map(inquiry => (
              <div
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`dark-card cursor-pointer transition-all ${
                  selectedInquiry?.id === inquiry.id
                    ? "border-2 border-primary"
                    : "hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-foreground text-left">{inquiry.full_name}</h3>
                  <Badge className={statusLabels[inquiry.status]?.color || "bg-gray-500"}>
                    {statusLabels[inquiry.status]?.label || inquiry.status}
                  </Badge>
                </div>
                <p className="text-sm text-foreground/70 mb-2 text-left">
                  {projectTypeLabels[inquiry.project_type]}
                </p>
                <p className="text-xs text-foreground/50 text-left">
                  {new Date(inquiry.created_at).toLocaleDateString("lt-LT", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Inquiry Details */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <div className="dark-card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1 text-left">
                    {selectedInquiry.full_name}
                  </h2>
                  <p className="text-foreground/70 text-left">
                    {projectTypeLabels[selectedInquiry.project_type]}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={statusLabels[selectedInquiry.status]?.color || "bg-gray-500"}>
                    {statusLabels[selectedInquiry.status]?.label || selectedInquiry.status}
                  </Badge>
                  <Select
                    value={selectedInquiry.status}
                    onValueChange={value => updateInquiryStatus(selectedInquiry.id, value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="border-t border-border pt-4">
                  <h3 className="font-bold text-foreground mb-3 text-left">
                    Kontaktinė informacija
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-primary hover:underline"
                      >
                        {selectedInquiry.email}
                      </a>
                    </div>
                    {selectedInquiry.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <a
                          href={`tel:${selectedInquiry.phone}`}
                          className="text-primary hover:underline"
                        >
                          {selectedInquiry.phone}
                        </a>
                      </div>
                    )}
                    {selectedInquiry.company_name && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-foreground/60" />
                        <span className="text-foreground/80">{selectedInquiry.company_name}</span>
                      </div>
                    )}
                    {selectedInquiry.company_size && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-foreground/60" />
                        <span className="text-foreground/80 capitalize">
                          {selectedInquiry.company_size}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="border-t border-border pt-4">
                  <h3 className="font-bold text-foreground mb-3 text-left">Projekto informacija</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedInquiry.budget_range && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-foreground/60" />
                        <span className="text-foreground/80">
                          {budgetLabels[selectedInquiry.budget_range]}
                        </span>
                      </div>
                    )}
                    {selectedInquiry.timeline && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-foreground/60" />
                        <span className="text-foreground/80">
                          {timelineLabels[selectedInquiry.timeline]}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 md:col-span-2">
                      <Calendar className="w-4 h-4 text-foreground/60" />
                      <span className="text-foreground/80">
                        Gauta:{" "}
                        {new Date(selectedInquiry.created_at).toLocaleDateString("lt-LT", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t border-border pt-4">
                  <h3 className="font-bold text-foreground mb-3 text-left flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Projekto aprašymas
                  </h3>
                  <p className="text-foreground/80 whitespace-pre-wrap text-left leading-relaxed">
                    {selectedInquiry.description}
                  </p>
                </div>

                {/* Current Solution */}
                {selectedInquiry.current_solution && (
                  <div className="border-t border-border pt-4">
                    <h3 className="font-bold text-foreground mb-3 text-left">
                      Dabartinis sprendimas
                    </h3>
                    <p className="text-foreground/80 whitespace-pre-wrap text-left">
                      {selectedInquiry.current_solution}
                    </p>
                  </div>
                )}

                {/* Admin Notes */}
                <div className="border-t border-border pt-4">
                  <h3 className="font-bold text-foreground mb-3 text-left">Admin pastabos</h3>
                  <Textarea
                    value={selectedInquiry.admin_notes || ""}
                    onChange={e => {
                      setSelectedInquiry(prev =>
                        prev ? { ...prev, admin_notes: e.target.value } : null
                      );
                    }}
                    placeholder="Įrašykite pastabas apie šią užklausą..."
                    rows={4}
                    className="mb-2"
                  />
                  <Button
                    onClick={() => {
                      const notesToSave = selectedInquiry.admin_notes ?? "";
                      updateAdminNotes(selectedInquiry.id, notesToSave);
                    }}
                    className="button-primary"
                  >
                    Išsaugoti pastabas
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="border-t border-border pt-4 flex gap-3">
                  <Button
                    onClick={() => window.open(`mailto:${selectedInquiry.email}`, "_blank")}
                    className="button-primary"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Atsakyti el. paštu
                  </Button>
                  {selectedInquiry.phone && (
                    <Button
                      onClick={() => window.open(`tel:${selectedInquiry.phone}`, "_blank")}
                      className="button-outline"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Skambinti
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="dark-card text-center py-16">
              <p className="text-foreground/60">Pasirinkite užklausą iš sąrašo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiriesPage;

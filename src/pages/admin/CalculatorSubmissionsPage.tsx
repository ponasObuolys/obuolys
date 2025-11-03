/**
 * Admin - Calculator Submissions Management Page
 * Verslo užklausos iš projekto skaičiuoklės
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calculator,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { getAllSubmissions, updateSubmissionStatus } from '@/services/calculator.service';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { lt } from 'date-fns/locale';
import { secureLogger } from '@/utils/browserLogger';

interface Submission {
  id: string;
  email: string;
  company_name: string | null;
  project_type: string;
  features: string[];
  tech_stack_frontend: string;
  tech_stack_backend: string;
  tech_stack_testing: boolean;
  tech_stack_premium_design: boolean;
  estimated_min_cost: number;
  estimated_max_cost: number;
  estimated_min_weeks: number;
  estimated_max_weeks: number;
  recommended_package: string;
  created_at: string;
  email_sent: boolean;
  email_sent_at: string | null;
  lead_status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes: string | null;
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  mvp: 'MVP / Prototipas',
  crm: 'CRM Sistema',
  ecommerce: 'E-commerce',
  logistics: 'Logistika',
  analytics: 'Analitika',
  custom: 'Individualus',
};

const FEATURE_LABELS: Record<string, string> = {
  auth: 'Autentifikacija',
  realtime: 'Real-time',
  fileUpload: 'Failų įkėlimas',
  payments: 'Mokėjimai',
  reports: 'Ataskaitos',
  mobileApp: 'Mobili app',
  apiIntegrations: 'API integracijos',
  customWorkflows: 'Custom workflows',
};

const LEAD_STATUS_LABELS: Record<string, string> = {
  new: 'Nauja',
  contacted: 'Susisiekta',
  qualified: 'Kvalifikuota',
  converted: 'Konvertuota',
  lost: 'Prarasta',
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-green-500',
  converted: 'bg-purple-500',
  lost: 'bg-gray-500',
};

export default function CalculatorSubmissionsPage() {
  const { isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Submission['lead_status']>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const filters: { leadStatus?: Submission['lead_status'] } = {};
      if (filter !== 'all') {
        filters.leadStatus = filter;
      }
      const data = await getAllSubmissions(filters);
      setSubmissions(data);
    } catch (error) {
      secureLogger.error('Error loading submissions', error);
      toast.error('Klaida įkeliant užklausas');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!isAdmin) return;
    void loadSubmissions();
  }, [isAdmin, loadSubmissions]);

  const handleStatusChange = async (
    submissionId: string,
    newStatus: Submission['lead_status']
  ) => {
    try {
      await updateSubmissionStatus(submissionId, {
        leadStatus: newStatus,
      });
      toast.success('Statusas atnaujintas');
      void loadSubmissions();
    } catch (error) {
      secureLogger.error('Error updating status', error);
      toast.error('Klaida atnaujinant statusą');
    }
  };

  const handleSaveNotes = async (submissionId: string) => {
    try {
      await updateSubmissionStatus(submissionId, {
        notes: editingNotes[submissionId] || '',
      });
      toast.success('Pastabos išsaugotos');
      setEditingNotes((prev) => {
        const updated = { ...prev };
        delete updated[submissionId];
        return updated;
      });
      void loadSubmissions();
    } catch (error) {
      secureLogger.error('Error saving notes', error);
      toast.error('Klaida išsaugant pastabas');
    }
  };

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString('lt-LT')}`;
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Prieiga negalima</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Calculator className="w-8 h-8" />
          Verslo Užklausos
        </h1>
        <p className="text-foreground/70">Projekto skaičiuoklės užklausos</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as 'all' | Submission['lead_status'])}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Visos užklausos</SelectItem>
            <SelectItem value="new">Naujos</SelectItem>
            <SelectItem value="contacted">Susisiekta</SelectItem>
            <SelectItem value="qualified">Kvalifikuotos</SelectItem>
            <SelectItem value="converted">Konvertuotos</SelectItem>
            <SelectItem value="lost">Prarast os</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={loadSubmissions} variant="outline">
          Atnaujinti
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-foreground/70 mb-1">Viso užklausų</div>
          <div className="text-2xl font-bold">{submissions.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-foreground/70 mb-1">Naujos</div>
          <div className="text-2xl font-bold text-blue-500">
            {submissions.filter((s) => s.lead_status === 'new').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-foreground/70 mb-1">Kvalifikuotos</div>
          <div className="text-2xl font-bold text-green-500">
            {submissions.filter((s) => s.lead_status === 'qualified').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-foreground/70 mb-1">Konvertuotos</div>
          <div className="text-2xl font-bold text-purple-500">
            {submissions.filter((s) => s.lead_status === 'converted').length}
          </div>
        </Card>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-foreground/70">Kraunama...</p>
        </div>
      ) : submissions.length === 0 ? (
        <Card className="p-8 text-center">
          <Calculator className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
          <p className="text-foreground/70">Dar nėra užklausų</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const isExpanded = expandedId === submission.id;
            const isEditingNotes = submission.id in editingNotes;

            return (
              <Card key={submission.id} className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {PROJECT_TYPE_LABELS[submission.project_type]}
                      </h3>
                      <Badge className={LEAD_STATUS_COLORS[submission.lead_status]}>
                        {LEAD_STATUS_LABELS[submission.lead_status]}
                      </Badge>
                      {submission.email_sent ? (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          El. paštas išsiųstas
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-yellow-600">
                          <AlertCircle className="w-3 h-3" />
                          El. paštas neišsiųstas
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Mail className="w-4 h-4" />
                        {submission.email}
                      </div>
                      {submission.company_name && (
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Building2 className="w-4 h-4" />
                          {submission.company_name}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-foreground/70">
                        <Calendar className="w-4 h-4" />
                        {formatDistanceToNow(new Date(submission.created_at), {
                          addSuffix: true,
                          locale: lt,
                        })}
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => toggleExpand(submission.id)} variant="ghost" size="sm">
                    {isExpanded ? 'Suskleisti' : 'Plačiau'}
                  </Button>
                </div>

                {/* Price Summary */}
                <div className="flex items-center gap-6 p-4 rounded-lg bg-muted/30 mb-4">
                  <div>
                    <div className="text-sm text-foreground/70 mb-1">Kaina</div>
                    <div className="text-xl font-bold text-foreground">
                      {formatCurrency(submission.estimated_min_cost)} -{' '}
                      {formatCurrency(submission.estimated_max_cost)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-foreground/70 mb-1">Trukmė</div>
                    <div className="text-xl font-bold text-foreground">
                      {submission.estimated_min_weeks}-{submission.estimated_max_weeks} sav.
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-foreground/70 mb-1">Paketas</div>
                    <div className="text-lg font-semibold text-primary">
                      {submission.recommended_package}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border pt-4 space-y-4">
                    {/* Features */}
                    {submission.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Funkcijos:</h4>
                        <div className="flex flex-wrap gap-2">
                          {submission.features.map((feature) => (
                            <Badge key={feature} variant="secondary">
                              {FEATURE_LABELS[feature] || feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Technologijos:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-foreground/70">Frontend:</span>{' '}
                          {submission.tech_stack_frontend === 'react-typescript'
                            ? 'React + TypeScript'
                            : 'Next.js + TypeScript'}
                        </div>
                        <div>
                          <span className="text-foreground/70">Backend:</span>{' '}
                          {submission.tech_stack_backend === 'supabase'
                            ? 'Supabase'
                            : 'Node.js'}
                        </div>
                        <div>
                          <span className="text-foreground/70">Testavimas:</span>{' '}
                          {submission.tech_stack_testing ? 'Taip' : 'Ne'}
                        </div>
                        <div>
                          <span className="text-foreground/70">Premium dizainas:</span>{' '}
                          {submission.tech_stack_premium_design ? 'Taip' : 'Ne'}
                        </div>
                      </div>
                    </div>

                    {/* Status Management */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Statusas:</h4>
                      <Select
                        value={submission.lead_status}
                        onValueChange={(value) =>
                          handleStatusChange(submission.id, value as Submission['lead_status'])
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Nauja</SelectItem>
                          <SelectItem value="contacted">Susisiekta</SelectItem>
                          <SelectItem value="qualified">Kvalifikuota</SelectItem>
                          <SelectItem value="converted">Konvertuota</SelectItem>
                          <SelectItem value="lost">Prarasta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Notes */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Pastabos:</h4>
                      {isEditingNotes ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingNotes[submission.id] || submission.notes || ''}
                            onChange={(e) =>
                              setEditingNotes((prev) => ({
                                ...prev,
                                [submission.id]: e.target.value,
                              }))
                            }
                            placeholder="Įveskite pastabas..."
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSaveNotes(submission.id)}
                              size="sm"
                            >
                              Išsaugoti
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingNotes((prev) => {
                                  const updated = { ...prev };
                                  delete updated[submission.id];
                                  return updated;
                                });
                              }}
                              variant="outline"
                              size="sm"
                            >
                              Atšaukti
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-foreground/70 mb-2">
                            {submission.notes || 'Nėra pastabų'}
                          </p>
                          <Button
                            onClick={() =>
                              setEditingNotes((prev) => ({
                                ...prev,
                                [submission.id]: submission.notes || '',
                              }))
                            }
                            variant="outline"
                            size="sm"
                          >
                            Redaguoti
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

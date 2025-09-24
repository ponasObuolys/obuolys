import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, MailOpen, Trash2, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { lt } from 'date-fns/locale';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
}

const ContactMessageManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Normalizuojame status reikšmes į sąjungą 'unread' | 'read', kad atitiktų komponento tipą
      const normalized: ContactMessage[] = (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        subject: row.subject,
        message: row.message,
        created_at: row.created_at,
        status: row.status === 'read' ? 'read' as const : 'unread' as const,
      }));
      setMessages(normalized);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast({
        title: 'Klaida',
        description: 'Nepavyko gauti kontaktų pranešimų.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status: 'read' as const } : msg
      ));

      toast({
        title: 'Sėkmė',
        description: 'Pranešimas pažymėtas kaip perskaitytas.',
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: 'Klaida',
        description: 'Nepavyko pažymėti pranešimo.',
        variant: 'destructive',
      });
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'unread' })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, status: 'unread' as const } : msg
      ));

      toast({
        title: 'Sėkmė',
        description: 'Pranešimas pažymėtas kaip neperskaitytas.',
      });
    } catch (error) {
      console.error('Error marking message as unread:', error);
      toast({
        title: 'Klaida',
        description: 'Nepavyko pažymėti pranešimo.',
        variant: 'destructive',
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Ar tikrai norite ištrinti šį pranešimą?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== id));

      toast({
        title: 'Sėkmė',
        description: 'Pranešimas sėkmingai ištrintas.',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: 'Klaida',
        description: `Nepavyko ištrinti pranešimo: ${error instanceof Error ? error.message : typeof error === 'string' ? error : 'nežinoma klaida'}`,
        variant: 'destructive',
      });
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      markAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  const unreadCount = messages.filter(msg => msg.status === 'unread').length;

  if (loading && messages.length === 0) {
    return <p className="text-center py-4">Kraunama...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kontaktų pranešimai</h2>
          <p className="text-muted-foreground">
            Iš viso: {messages.length} | Neperskaityti: {unreadCount}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Visi
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Neperskaityti ({unreadCount})
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('read')}
          >
            Perskaityti
          </Button>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Pranešimų nėra.' 
                : `${filter === 'unread' ? 'Neperskaitytų' : 'Perskaitytų'} pranešimų nėra.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Siuntėjas</TableHead>
                  <TableHead>Tema</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Būklė</TableHead>
                  <TableHead className="text-right">Veiksmai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow 
                    key={message.id} 
                    className={message.status === 'unread' ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
                  >
                    <TableCell>
                      {message.status === 'unread' ? (
                        <Mail className="h-4 w-4 text-blue-600" />
                      ) : (
                        <MailOpen className="h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{message.name}</div>
                        <div className="text-sm text-muted-foreground">{message.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={message.subject}>
                        {message.subject}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(message.created_at), 'yyyy-MM-dd HH:mm', { locale: lt })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={message.status === 'unread' ? 'default' : 'secondary'}>
                        {message.status === 'unread' ? 'Neperskaitytas' : 'Perskaitytas'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewMessage(message)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Peržiūrėti
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Kontakto pranešimas</DialogTitle>
                            </DialogHeader>
                            {selectedMessage && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      Siuntėjas
                                    </label>
                                    <p className="mt-1">{selectedMessage.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                      El. paštas
                                    </label>
                                    <p className="mt-1">
                                      <a 
                                        href={`mailto:${selectedMessage.email}`}
                                        className="text-blue-600 hover:underline"
                                      >
                                        {selectedMessage.email}
                                      </a>
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Tema
                                  </label>
                                  <p className="mt-1">{selectedMessage.subject}</p>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">
                                    Pranešimas
                                  </label>
                                  <Textarea
                                    value={selectedMessage.message}
                                    readOnly
                                    className="mt-1 min-h-[200px] resize-none"
                                  />
                                </div>
                                
                                <div className="text-sm text-muted-foreground">
                                  Gauta: {format(new Date(selectedMessage.created_at), 'yyyy-MM-dd HH:mm:ss', { locale: lt })}
                                </div>

                                <div className="flex justify-between pt-4">
                                  <div className="flex gap-2">
                                    {selectedMessage.status === 'read' ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => markAsUnread(selectedMessage.id)}
                                      >
                                        <Mail className="h-4 w-4 mr-1" />
                                        Žymėti kaip neperskaitytą
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => markAsRead(selectedMessage.id)}
                                      >
                                        <MailOpen className="h-4 w-4 mr-1" />
                                        Žymėti kaip perskaitytą
                                      </Button>
                                    )}
                                  </div>
                                  
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteMessage(selectedMessage.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Ištrinti
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactMessageManager;
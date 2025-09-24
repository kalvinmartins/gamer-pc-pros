import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Monitor } from 'lucide-react';

interface EquipmentEntry {
  id: string;
  client_id: string;
  equipment_type: string;
  brand: string;
  model: string;
  serial_number: string;
  problem_description: string;
  entry_date: string;
  exit_date: string;
  status: string;
  service_cost: number;
  notes: string;
  created_at: string;
  clients: {
    name: string;
  };
}

interface Client {
  id: string;
  name: string;
}

const equipmentTypes = [
  'Desktop',
  'Notebook',
  'Monitor',
  'Impressora',
  'Placa Mãe',
  'Placa de Vídeo',
  'Fonte',
  'HD/SSD',
  'Memória RAM',
  'Outros',
];

const statusOptions = [
  { value: 'in_service', label: 'Em Serviço', color: 'default' },
  { value: 'waiting_parts', label: 'Aguardando Peças', color: 'secondary' },
  { value: 'completed', label: 'Concluído', color: 'secondary' },
  { value: 'delivered', label: 'Entregue', color: 'default' },
  { value: 'cancelled', label: 'Cancelado', color: 'destructive' },
];

export const EquipmentManagement = () => {
  const [equipmentEntries, setEquipmentEntries] = useState<EquipmentEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EquipmentEntry | null>(null);
  const [formData, setFormData] = useState({
    client_id: '',
    equipment_type: '',
    brand: '',
    model: '',
    serial_number: '',
    problem_description: '',
    exit_date: '',
    status: 'in_service',
    service_cost: '',
    notes: '',
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEquipmentEntries();
    fetchClients();
  }, []);

  const fetchEquipmentEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment_entries')
        .select(`
          *,
          clients (name)
        `)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEquipmentEntries(data || []);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os equipamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const entryData = {
        ...formData,
        service_cost: formData.service_cost ? parseFloat(formData.service_cost) : null,
        exit_date: formData.exit_date || null,
        created_by: user?.id,
      };

      if (editingEntry) {
        const { error } = await supabase
          .from('equipment_entries')
          .update(entryData)
          .eq('id', editingEntry.id);

        if (error) throw error;
        toast({
          title: "Equipamento atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('equipment_entries')
          .insert([entryData]);

        if (error) throw error;
        toast({
          title: "Equipamento registrado com sucesso!",
        });
      }

      setIsDialogOpen(false);
      setEditingEntry(null);
      setFormData({
        client_id: '',
        equipment_type: '',
        brand: '',
        model: '',
        serial_number: '',
        problem_description: '',
        exit_date: '',
        status: 'in_service',
        service_cost: '',
        notes: '',
      });
      fetchEquipmentEntries();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (entry: EquipmentEntry) => {
    setEditingEntry(entry);
    setFormData({
      client_id: entry.client_id,
      equipment_type: entry.equipment_type,
      brand: entry.brand || '',
      model: entry.model || '',
      serial_number: entry.serial_number || '',
      problem_description: entry.problem_description || '',
      exit_date: entry.exit_date ? entry.exit_date.split('T')[0] : '',
      status: entry.status,
      service_cost: entry.service_cost ? entry.service_cost.toString() : '',
      notes: entry.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;

    try {
      const { error } = await supabase
        .from('equipment_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Registro excluído com sucesso!",
      });
      fetchEquipmentEntries();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(option => option.value === status);
    return (
      <Badge variant={statusConfig?.color as any}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Equipamentos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie a entrada e saída de equipamentos para manutenção
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingEntry(null);
              setFormData({
                client_id: '',
                equipment_type: '',
                brand: '',
                model: '',
                serial_number: '',
                problem_description: '',
                exit_date: '',
                status: 'in_service',
                service_cost: '',
                notes: '',
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Equipamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? 'Editar Equipamento' : 'Registrar Equipamento'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_id">Cliente *</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment_type">Tipo de Equipamento *</Label>
                  <Select
                    value={formData.equipment_type}
                    onValueChange={(value) => setFormData({ ...formData, equipment_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial_number">Número de Série</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="problem_description">Descrição do Problema</Label>
                <Textarea
                  id="problem_description"
                  value={formData.problem_description}
                  onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                  placeholder="Descreva o problema relatado pelo cliente..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service_cost">Valor do Serviço (R$)</Label>
                  <Input
                    id="service_cost"
                    type="number"
                    step="0.01"
                    value={formData.service_cost}
                    onChange={(e) => setFormData({ ...formData, service_cost: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exit_date">Data de Saída</Label>
                <Input
                  id="exit_date"
                  type="date"
                  value={formData.exit_date}
                  onChange={(e) => setFormData({ ...formData, exit_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações sobre o serviço realizado..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingEntry ? 'Atualizar' : 'Registrar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipamentos em Manutenção</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Marca/Modelo</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.clients?.name}
                  </TableCell>
                  <TableCell>{entry.equipment_type}</TableCell>
                  <TableCell>
                    {entry.brand} {entry.model}
                  </TableCell>
                  <TableCell>
                    {new Date(entry.entry_date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>
                    {entry.service_cost 
                      ? `R$ ${entry.service_cost.toFixed(2)}` 
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {equipmentEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum equipamento registrado ainda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
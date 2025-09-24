import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, Monitor, TrendingUp } from 'lucide-react';

export const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAppointments: 0,
    equipmentInService: 0,
    completedServices: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch clients count
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      // Fetch appointments count
      const { count: appointmentsCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

      // Fetch equipment in service
      const { count: equipmentInService } = await supabase
        .from('equipment_entries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_service');

      // Fetch completed services
      const { count: completedServices } = await supabase
        .from('equipment_entries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      setStats({
        totalClients: clientsCount || 0,
        totalAppointments: appointmentsCount || 0,
        equipmentInService: equipmentInService || 0,
        completedServices: completedServices || 0,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const statCards = [
    {
      title: 'Total de Clientes',
      value: stats.totalClients,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Agendamentos',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Equipamentos em Serviço',
      value: stats.equipmentInService,
      icon: Monitor,
      color: 'text-orange-600',
    },
    {
      title: 'Serviços Concluídos',
      value: stats.completedServices,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do sistema de gerenciamento da assistência técnica
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <a
                href="/admin/clients"
                className="p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Gerenciar Clientes</h3>
                <p className="text-sm text-muted-foreground">
                  Adicionar, editar ou visualizar informações dos clientes
                </p>
              </a>
              <a
                href="/admin/appointments"
                className="p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Agendamentos</h3>
                <p className="text-sm text-muted-foreground">
                  Visualizar e gerenciar agendamentos de serviços
                </p>
              </a>
              <a
                href="/admin/equipment"
                className="p-4 border rounded-lg hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Controle de Equipamentos</h3>
                <p className="text-sm text-muted-foreground">
                  Gerenciar entrada e saída de equipamentos
                </p>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">Sistema de Gestão</p>
                <p className="text-muted-foreground">
                  Assistência Técnica em Informática
                </p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Funcionalidades</p>
                <ul className="text-muted-foreground list-disc list-inside space-y-1">
                  <li>Cadastro de clientes</li>
                  <li>Agendamento de serviços</li>
                  <li>Controle de entrada/saída</li>
                  <li>Relatórios e estatísticas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
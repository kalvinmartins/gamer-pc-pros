import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Monitor, 
  Settings, 
  TrendingUp, 
  Shield, 
  Lightbulb, 
  Wrench 
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Monitor,
      title: "Manutenção de PC Gamer",
      description: "Limpeza completa, troca de pasta térmica, otimização de performance e diagnóstico de problemas em PCs gamers.",
      features: [
        "Limpeza interna completa",
        "Troca de pasta térmica",
        "Teste de componentes",
        "Otimização de performance"
      ]
    },
    {
      icon: Settings,
      title: "Montagem de PCs",
      description: "Montagem personalizada de PCs de acordo com suas necessidades e orçamento. Do básico ao high-end.",
      features: [
        "Consultoria de componentes",
        "Montagem profissional",
        "Teste de compatibilidade",
        "Garantia de montagem"
      ]
    },
    {
      icon: TrendingUp,
      title: "Upgrades",
      description: "Atualizações de hardware para melhorar a performance do seu PC. Análise e recomendações personalizadas.",
      features: [
        "Análise de performance",
        "Recomendação de upgrades",
        "Instalação de componentes",
        "Teste de estabilidade"
      ]
    },
    {
      icon: Shield,
      title: "Manutenção Preventiva",
      description: "Serviços regulares para manter seu PC funcionando perfeitamente e evitar problemas futuros.",
      features: [
        "Limpeza periódica",
        "Atualizações de software",
        "Backup de dados",
        "Monitoramento de saúde"
      ]
    },
    {
      icon: Lightbulb,
      title: "Consultoria Técnica",
      description: "Orientação especializada para compra de componentes e melhorias no seu setup gamer.",
      features: [
        "Análise de necessidades",
        "Orçamento personalizado",
        "Compatibilidade garantida",
        "Melhor custo-benefício"
      ]
    },
    {
      icon: Wrench,
      title: "Reparo de Equipamentos",
      description: "Diagnóstico e reparo de problemas diversos em computadores e componentes.",
      features: [
        "Diagnóstico completo",
        "Reparo de placas",
        "Recuperação de dados",
        "Orçamento sem compromisso"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Serviços</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Oferecemos soluções completas para manter seu PC funcionando perfeitamente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
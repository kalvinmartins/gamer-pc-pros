import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, Heart, Star } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Qualidade",
      description: "Utilizamos apenas componentes de qualidade e seguimos os melhores padrões do mercado."
    },
    {
      icon: Clock,
      title: "Agilidade",
      description: "Atendimento rápido e eficiente, respeitando sempre os prazos acordados."
    },
    {
      icon: Heart,
      title: "Transparência",
      description: "Orçamentos claros, sem surpresas. Você sabe exatamente o que está pagando."
    },
    {
      icon: Star,
      title: "Experiência",
      description: "Mais de 5 anos de experiência em manutenção e montagem de PCs gamers."
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sobre a <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TechAssist</span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg">
                Somos uma assistência técnica especializada em computadores, com foco especial em PCs gamers. 
                Nossa missão é fornecer soluções de qualidade para manter seu equipamento sempre em perfeito funcionamento.
              </p>
              
              <p>
                Com mais de 5 anos de experiência no mercado, já atendemos centenas de clientes, desde gamers 
                entusiastas até empresas que necessitam de equipamentos de alta performance.
              </p>
              
              <p>
                Nossa equipe é formada por técnicos especializados que estão sempre atualizados com as 
                últimas tecnologias e tendências do mercado de hardware.
              </p>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
              <h3 className="text-xl font-semibold mb-2 text-foreground">Por que nos escolher?</h3>
              <p className="text-muted-foreground">
                Combinamos experiência técnica, atendimento personalizado e preços justos para 
                oferecer a melhor solução para suas necessidades tecnológicas.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="mx-auto w-fit p-3 rounded-lg bg-primary/10 mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
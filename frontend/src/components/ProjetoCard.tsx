// frontend/src/components/ProjetoCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Projeto } from "@/types/projeto";

export function ProjetoCard({
  projeto,
  onClick,
}: {
  projeto: Projeto;
  onClick: () => void;
}) {
  const progresso = projeto.progresso ?? 0;

  const getStatus = (progress: number) => {
    if (progress >= 100) return "Finalizado";
    if (progress > 0) return "Em andamento";
    return "Planejado";
  };

  const getBarColor = (progress: number) => {
    if (progress >= 80) return "bg-green-600";
    if (progress >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition"
    >
      <CardHeader>
        <CardDescription className="text-sm text-muted-foreground">
          {getStatus(progresso)}
        </CardDescription>
        <CardTitle className="text-lg">{projeto.nome}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <Progress
          value={progresso}
          indicatorColor={getBarColor(progresso)}
          className="h-2"
        />
        <p className="text-sm text-muted-foreground">{progresso}% Completo</p>

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Criado em:</strong>{" "}
            {new Date(projeto.criado_em).toLocaleDateString("pt-BR")}
          </p>
          {projeto.data_entrega && (
            <p>
              <strong>Entrega:</strong>{" "}
              {new Date(projeto.data_entrega).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
      </CardContent>

      {projeto.usuariosOrdenados && projeto.usuariosOrdenados.length > 0 && (
        <CardFooter className="pt-4">
          <TooltipProvider delayDuration={300}>
            <div className="flex -space-x-2">
              {projeto.usuariosOrdenados.slice(0, 4).map((usuario, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage
                        src={usuario.avatar_url}
                        alt={usuario.primeiro_nome}
                      />
                      <AvatarFallback className="bg-gray-400 text-white text-sm">
                        {usuario.primeiro_nome.charAt(0)}
                        {usuario.sobrenome.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    {usuario.primeiro_nome} {usuario.sobrenome}
                  </TooltipContent>
                </Tooltip>
              ))}

              {projeto.usuariosOrdenados.length > 4 && (
                <Avatar className="w-8 h-8 bg-gray-300 text-xs flex items-center justify-center border-2 border-white">
                  +{projeto.usuariosOrdenados.length - 4}
                </Avatar>
              )}
            </div>
          </TooltipProvider>
        </CardFooter>
      )}
    </Card>
  );
}

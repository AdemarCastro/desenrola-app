import { Skeleton } from '@/components/ui/skeleton';

export const TimelineSkeleton = () => (
  <div className="p-4 space-y-4">
    {/* Skeleton para o Header (seletor de projeto, etc.) */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-64" />
    </div>

    {/* Skeleton para o corpo do cronograma, sem bordas extras */}
    <div className="flex space-x-4">
      {/* Coluna de tarefas */}
      <div className="w-64 flex-shrink-0 space-y-2">
        <Skeleton className="h-10 w-full" /> {/* Header da coluna */}
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Área do gráfico */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-10 w-full" /> {/* Header dos meses/dias */}
        <Skeleton className="h-56 w-full" /> {/* Corpo do gráfico */}
      </div>
    </div>
  </div>
);
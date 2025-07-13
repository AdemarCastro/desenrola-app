import { FormCriarProjeto } from "./FormCriarProjeto";
import { CriarProjetoFeedback } from "./CriarProjetoFeedback";

interface Usuario {
  id: number;
  primeiro_nome: string;
  sobrenome: string;
}

interface Props {
  action: (formData: FormData) => Promise<void>;
  proprietarios: Usuario[];
  membros: Usuario[];
}

export function FormCriarProjetoWrapper({
  action,
  proprietarios,
  membros,
}: Props) {
  return (
    <>
      <CriarProjetoFeedback />
      <FormCriarProjeto
        action={action}
        proprietarios={proprietarios}
        membros={membros}
      />
    </>
  );
}

import { FormCriarProjeto } from "./FormCriarProjeto";
import { CriarProjetoFeedback } from "./CriarProjetoFeedback";

interface Props {
  action: (formData: FormData) => Promise<void>;
}

export function FormCriarProjetoWrapper({ action }: Props) {
  return (
    <>
      <CriarProjetoFeedback />
      <FormCriarProjeto action={action} />
    </>
  );
}

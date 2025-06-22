// src/app/(private)/termos/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function TermosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      {/* container maior */}
      <div className="w-full max-w-5xl lg:max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          
          {/* Link de voltar removido para foco no conteúdo */}
          
          <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-6">
            Termos de Uso
          </h1>
          
          <div className="bg-gray-50 p-4 sm:p-6 rounded-md border border-gray-200 max-h-[75vh] overflow-y-auto">
            <article className="prose prose-sm sm:prose lg:prose-lg text-justify">
              <h2 className="font-bold text-lg">Termos de Uso – Plataforma Desenrola</h2>
              <p>
                Este Termo de Uso descreve as condições para acesso, utilização e tratamento de dados pessoais 
                dentro da plataforma Desenrola. Ao utilizar a plataforma, o usuário declara estar ciente e de 
                acordo com as condições aqui estabelecidas.
              </p>
              
              <h3 className="font-semibold mt-4">1. Coleta de Dados</h3>
              <p>
                A plataforma Desenrola poderá coletar os seguintes dados pessoais, fornecidos voluntariamente 
                pelo usuário no momento do cadastro ou durante o uso do sistema:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Informações de perfil e preferências de uso</li>
                <li>Dados relacionados a projetos, tarefas e atividades realizadas dentro da plataforma.</li>
              </ul>
              
              <h3 className="font-semibold mt-4">2. Finalidade do Uso dos Dados</h3>
              <p>
                Os dados pessoais coletados serão utilizados para as seguintes finalidades:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Permitir o acesso e autenticação do usuário na plataforma;</li>
                <li>Personalizar a experiência de navegação e uso das funcionalidades;</li>
                <li>Facilitar a criação, gestão e acompanhamento de tarefas e projetos;</li>
                <li>Melhorar os serviços oferecidos por meio de análises internas de uso;</li>
                <li>Promover a comunicação entre usuários, quando necessário.</li>
              </ul>
              
              <h3 className="font-semibold mt-4">3. Compartilhamento de Dados</h3>
              <p>
                O Desenrola compromete-se a não compartilhar, vender, ceder ou divulgar os dados pessoais 
                dos usuários a terceiros, salvo nas seguintes hipóteses:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Cumprimento de obrigação legal ou regulatória;</li>
                <li>Cumprimento de ordem judicial ou requisição por autoridades competentes;</li>
                <li>Necessidade para a execução de contratos estabelecidos com o próprio usuário.</li>
              </ul>
              
              <h3 className="font-semibold mt-4">4. Armazenamento e Segurança</h3>
              <p>
                As informações fornecidas serão armazenadas em ambiente seguro, com a adoção de medidas técnicas 
                e administrativas para garantir a proteção contra acessos não autorizados, perda, alteração ou 
                destruição.
              </p>
              
              <h3 className="font-semibold mt-4">5. Direitos do Usuário</h3>
              <p>
                O usuário poderá, a qualquer momento:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Solicitar acesso aos seus dados pessoais;</li>
                <li>Requerer a correção de dados incorretos ou desatualizados;</li>
                <li>Solicitar a exclusão de seus dados da plataforma, respeitando as obrigações legais de retenção de informações;</li>
                <li>Revogar o consentimento para o tratamento de dados, quando aplicável.</li>
              </ul>
              
              <h3 className="font-semibold mt-4">6. Conformidade com a LGPD</h3>
              <p>
                A plataforma Desenrola realiza o tratamento dos dados pessoais em conformidade com a Lei Geral 
                de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
              <p className="mt-2">
                O usuário tem os seguintes direitos garantidos pela LGPD:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Confirmação da existência de tratamento de dados;</li>
                <li>Acesso aos dados pessoais armazenados;</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados de forma inadequada;</li>
                <li>Portabilidade dos dados a outro fornecedor de serviço, quando aplicável;</li>
                <li>Informação sobre o compartilhamento de dados com terceiros;</li>
                <li>Revogação do consentimento, quando essa for a base legal utilizada.</li>
              </ul>
              <p className="mt-2">
                O usuário poderá exercer seus direitos entrando em contato com o canal oficial de atendimento da plataforma.
              </p>
              
              <h3 className="font-semibold mt-4">7. Alterações neste Termo</h3>
              <p>
                O Desenrola reserva-se o direito de alterar este Termo de Uso a qualquer momento, mediante aviso 
                prévio por meio da própria plataforma ou por e-mail, caso o usuário tenha fornecido este contato.
              </p>
              
              <h3 className="font-semibold mt-4">8. Aceite</h3>
              <p>
                Ao continuar utilizando a plataforma Desenrola, o usuário confirma que leu, compreendeu e aceita 
                integralmente os termos e condições aqui descritos.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
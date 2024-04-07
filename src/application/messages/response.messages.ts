import { DocumentType } from '../../domain/entities';

export const responseMessages = {
  notFound: (entity: string = 'Recurso', final = 'o') => `${entity} não encontrad${final}`,
  delete: {
    success: 'Deletado com sucesso',
    fail: 'Falha ao deletar',
  },

  update: {
    success: 'Atualizado com sucesso',
    fail: 'Falha ao atualizar',
  },

  auth: {
    codeSent: 'Código enviado para o email.',
    invalidCredentials: 'Email ou senha incorretos.',
    validCode: 'Código válido.',
    invalidCode: 'Código inválido.',
    invalidCodeOrExpired: 'Código inválido ou expirado.',
    emailRecoverSent: 'Email de recuperação enviado.',
    loginSuccess: 'Logado com sucesso.',
    invalidEmail: 'Email inválido',
    unauthorized: 'Não autorizado',
  },

  user: {
    emailConflictError: 'Um usuário com esse email já existe',
    documentConflictError: (documentType: DocumentType) => `Um usuário com esse ${documentType} já existe`,
    created: 'O usuário foi criado.',
    entity: 'Usuário',
    passwordDontMatch: 'Senha antiga informada é incorreta.',
    disabled: 'O usuário está desativado',
  },

  form: {
    someErrors: 'Há alguns erros no formulário',
  },

  asset: {
    entity: 'Arquivo/Imagem',
  },

  sms: {
    verificationCode: (code: string, otpHash: string) => `Seu código de verificação: ${code}\n\n${otpHash}`,
    sentCode: 'Código enviado',
    waitToSendAgain: (time: number) => `Aguarde ${time} minutos antes de obter um novo código`,
  },

  invalidPhone: 'Telefone inválido. Exemplo: +5511994941212',

  file: {
    entity: 'Arquivo',
    notFile: 'O caminho especificado não é um arquivo',
  },
  role: {
    entity: 'Perfil',
    finalLetter: 'o',
  },

  customer: {
    entity: 'Cliente',
    emailConflictError: 'Já existe um cliente com esse email',
  },

  admin: {
    entity: 'Administrador',
    emailConflictError: 'Já existe um administrador com esse email',
  },

  company: {
    entity: 'Empresa',
    finalLetter: 'a',
    documentConflictError: (documentType: DocumentType = 'CNPJ') => `Já existe uma empresa com esse ${documentType}`,
  },
};

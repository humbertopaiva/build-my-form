// src/lib/masks.ts
export const masks = {
  cpf: "999.999.999-99",
  cnpj: "99.999.999/9999-99",
  phone: "(99) 99999-9999",
  cep: "99999-999",
  date: "99/99/9999",
  time: "99:99",
  creditCard: "9999 9999 9999 9999",
};

export const maskPatterns = {
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  phone: /^\(\d{2}\) \d{5}-\d{4}$/,
  cep: /^\d{5}-\d{3}$/,
  date: /^\d{2}\/\d{2}\/\d{4}$/,
  time: /^\d{2}:\d{2}$/,
  creditCard: /^\d{4} \d{4} \d{4} \d{4}$/,
};

export const defaultValidationMessages = {
  required: "Este campo é obrigatório",
  email: "Digite um email válido",
  cpf: "CPF inválido",
  cnpj: "CNPJ inválido",
  phone: "Telefone inválido",
  cep: "CEP inválido",
  date: "Data inválida",
  time: "Hora inválida",
  creditCard: "Cartão de crédito inválido",
};

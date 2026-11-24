# AutoClean — Lava-Rápido

Projeto demonstrativo desenvolvido com React e Vite. Interface em português brasileiro, com catálogo de serviços, formulário de agendamento, listagem e cancelamento de reservas.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Executar no computador

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal, normalmente http://localhost:5173/.

## Gerar versão de produção

```bash
npm run build
```

## Publicar na Vercel

Importe o repositório GitHub na Vercel. Selecione Vite como framework, `npm run build` como comando de build e `dist` como diretório de saída.

## Observações

Os agendamentos ficam salvos no localStorage do navegador, sem sincronização entre computadores. Os horários e preços são demonstrativos e não representam disponibilidade real. O formulário não envia mensagens para uma empresa.


## Controle de horários

Ao selecionar uma data, os horários que já possuem agendamento nesse mesmo navegador aparecem como ocupados e não podem ser selecionados novamente. O formulário também confere a disponibilidade antes de salvar.

Os dados são armazenados no `localStorage` do navegador. Por isso, esta demonstração não compartilha reservas entre computadores ou navegadores diferentes. Para disponibilidade global em um site publicado, será necessário conectar o projeto a um banco de dados e a uma API.

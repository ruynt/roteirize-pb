# Roteirize PB

O **Roteirize PB** é uma aplicação Web-Mobile desenvolvida para apoiar a organização, divulgação e personalização de experiências turísticas no estado da Paraíba. A plataforma permite que turistas explorem pontos turísticos, criem roteiros personalizados, visualizem locais em mapa interativo, realizem check-ins e acompanhem sua jornada por meio de um passaporte digital gamificado.

O projeto também contempla a participação de parceiros locais, que podem cadastrar experiências turísticas, e uma área administrativa para análise e aprovação desses cadastros.

## Objetivo do Projeto

O objetivo do Roteirize PB é oferecer uma solução digital que centralize informações turísticas da Paraíba e facilite a criação de roteiros personalizados, conectando turistas, empreendedores locais e gestão pública em uma única plataforma.

## Funcionalidades Principais

* Catálogo de pontos turísticos com fotos, categorias, cidades, avaliações e informações práticas;
* Tela de detalhes para cada ponto turístico, com galeria de imagens, descrição, custo, duração sugerida, acessibilidade e integração com Google Maps;
* Criador de roteiros personalizados com base em cidade, tempo disponível, orçamento, transporte e interesses do usuário;
* Recomendações personalizadas com base nas interações do usuário;
* Mapa interativo para visualização dos pontos turísticos e organização de rotas;
* Área de roteiros salvos, permitindo consultar, copiar, abrir no Google Maps ou remover roteiros;
* Passaporte digital com check-ins, progresso de visitas, categorias exploradas e selos virtuais;
* Área do parceiro para cadastro de experiências turísticas;
* Área administrativa para aprovação ou rejeição de experiências cadastradas;
* Upload e exibição de imagens por meio do Cloudinary;
* Aplicação responsiva com recursos de PWA, permitindo instalação no dispositivo móvel.

## Perfis de Usuário

A aplicação conta com diferentes perfis de acesso:

* **Turista:** pode explorar locais, criar roteiros, salvar experiências, fazer check-ins e acompanhar o passaporte digital.
* **Parceiro:** pode cadastrar experiências turísticas, incluindo descrição, endereço, preço, contato e fotos.
* **Admin/Gestão:** pode analisar solicitações de parceiros, aprovar ou rejeitar cadastros e acompanhar informações da plataforma.

## Tecnologias Utilizadas

### Frontend e estrutura

* Next.js
* React
* TypeScript
* Tailwind CSS

### Banco de dados e autenticação

* PostgreSQL
* Neon
* Prisma ORM
* Sistema de login com perfis de usuário

### Serviços e funcionalidades

* Cloudinary para upload e armazenamento de imagens
* APIs próprias para lugares, roteiros, recomendações, parceiros, upload e autenticação
* PWA para uso Web-Mobile
* Integração com Google Maps

## Requisitos Implementados

O projeto contempla os principais requisitos propostos para a situação-problema:

* Aplicação Web-Mobile/PWA;
* Recomendação personalizada;
* Mapa interativo;
* Marketplace para parceiros locais;
* Gamificação com passaporte digital;
* Perfis para turista, parceiro e gestão;
* Fluxo de pagamento simulado para destaque de parceiros.

## Como Executar o Projeto Localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/ruynt/roteirize-pb.git
cd roteirize-pb
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias:

```env
DATABASE_URL="sua_url_do_banco_neon"

CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Gerar o Prisma Client

```bash
npx prisma generate
```

### 5. Rodar as migrations

```bash
npx prisma migrate dev
```

### 6. Executar o projeto

```bash
npm run dev
```

Depois, acesse:

```bash
http://localhost:3000
```

## Scripts Úteis

### Rodar o projeto em desenvolvimento

```bash
npm run dev
```

### Gerar build de produção

```bash
npm run build
```

### Executar o projeto após build

```bash
npm start
```

### Gerar Prisma Client

```bash
npx prisma generate
```

### Rodar seed de pontos turísticos

```bash
npx tsx prisma/seed.ts --reset --production-ok
```

> Observação: o comando acima pode alterar os dados do banco configurado em `DATABASE_URL`. Caso a URL seja a mesma utilizada em produção, os dados exibidos na Vercel também serão alterados.

## Deploy

O projeto foi publicado na Vercel.

**Link do projeto:**
https://roteirize-pb.vercel.app/

**Repositório GitHub:**
https://github.com/ruynt/roteirize-pb

## Equipe

* Pedro Henrique Leal Vieira
* Ruy Gerôncio da Silva Neto

## Status do Projeto

O Roteirize PB encontra-se funcional, com os principais módulos implementados: exploração de pontos turísticos, criação de roteiros, mapa interativo, recomendações personalizadas, área de parceiros, passaporte digital e suporte Web-Mobile/PWA.

Como possibilidades de evolução, destacam-se a integração com pagamento real, ampliação da base de pontos turísticos, melhoria das métricas para gestão e desenvolvimento de recursos com realidade aumentada.

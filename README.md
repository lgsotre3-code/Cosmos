# ✦ Cosmos — Mapa Astral Natal ✦

Cosmos é um aplicativo web moderno para cálculo e interpretação de mapas astrais natais, desenvolvido com **Next.js 14**, **React** e **TypeScript**. O projeto foi refatorado para oferecer alta performance, segurança e uma experiência de usuário imersiva (Premium "Pro Max").

## 🚀 Tecnologias

- **Framework:** Next.js 14 (App Router)
- **Lógica Astral:** Algoritmos personalizados em TypeScript (sem dependências externas pesadas)
- **Processamento:** Web Workers para cálculos astronômicos em segundo plano
- **Estilização:** CSS Vanilla com foco em design responsivo e estética espacial (glassmorphism)
- **Segurança:** Cabeçalhos CSP configurados e proteção contra ataques comuns

## 🛠️ Como Rodar Localmente

Certifique-se de ter o **Node.js (v18+)** instalado.

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/lgsotre3-code/Cosmos.git
   cd Cosmos
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Rodar em desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000).

4. **Build para produção:**
   ```bash
   npm run build
   npm run start
   ```

## 🌌 Estrutura do Projeto

- `/app`: Rotas e lógica da página principal (App Router).
- `/components`: Componentes UI reutilizáveis (Formulário, Mapa, Efeitos Visuais).
- `/lib/astro`: Núcleo de cálculo astronômico (Planetas, Casas, Aspectos).
- `/lib/workers`: Integração com Web Workers para não travar a UI.
- `/public`: Ativos estáticos e ícones.

## 📄 Licença

Este projeto é de uso privado para demonstração de refatoração e desenvolvimento web avançado.

---
✦ *Desenvolvido com luz e código.* ✦

# Relatório Completo do Frontend — LISORY

## 1. Framework e Tecnologias

| Aspecto | Tecnologia |
|---------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Linguagem** | TypeScript 5.8 |
| **UI Library** | React 19 |
| **Estilização** | Tailwind CSS v4 + `tw-animate-css` |
| **Componentes de UI** | shadcn/ui (Radix UI primitives + class-variance-authority) |
| **Ícones** | Lucide React |
| **Animações** | Motion (antigo Framer Motion) |
| **Estado Global** | React Context API |
| **Formulários** | react-hook-form |
| **Notificações** | Sonner |
| **Drawer Mobile** | Vaul |
| **Carrossel** | Embla Carousel |
| **Seletor de Data** | react-day-picker |
| **Bundler Dev** | Turbopack |
| **API/BaaS** | Firebase (instalado, não configurado) |
| **Backend (separado)** | Java Spring Boot (`Backend/`) |

---

## 2. Estrutura de Diretórios

```
Lisory/
├── app/                          # Rotas App Router
│   ├── about/                    # /about
│   ├── account/                  # /account
│   ├── admin/                    # /admin com sidebar + subrotas
│   │   ├── categorias/
│   │   ├── clientes/
│   │   ├── configuracoes/
│   │   ├── cupons/
│   │   ├── pedidos/
│   │   ├── perfil/
│   │   └── produtos/
│   ├── cart/                     # /cart
│   ├── category/                 # /category
│   ├── checkout/                 # /checkout
│   ├── confirmation/             # /confirmation
│   ├── contact/                  # /contact
│   ├── faq/                      # /faq
│   ├── product/[id]/             # /product/:id
│   ├── wishlist/                 # /wishlist
│   ├── layout.tsx                # RootLayout
│   ├── page.tsx                  # Home
│   ├── loading.tsx               # Loading global
│   ├── not-found.tsx             # 404
│   └── error.tsx                 # Erro
├── components/
│   ├── cart/                     # (vazio)
│   ├── checkout/                 # (vazio)
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── product/
│   │   ├── badge.tsx
│   │   ├── product-card.tsx
│   │   ├── product-gallery.tsx
│   │   ├── product-info.tsx
│   │   ├── product-skeleton.tsx
│   │   └── star-rating.tsx
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── trust-strip.tsx
│   │   ├── categories.tsx
│   │   ├── bestsellers.tsx
│   │   ├── editorial.tsx
│   │   ├── new-arrivals.tsx
│   │   ├── testimonials.tsx
│   │   ├── instagram.tsx
│   │   ├── newsletter.tsx
│   │   └── home-faq.tsx
│   └── ui/                       # shadcn/ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── pagination.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── tooltip.tsx
├── hooks/
│   ├── use-cart.tsx              # CartContext + hook
│   └── use-wishlist.tsx          # WishlistContext + hook
├── services/                     # CRUD mockados
│   ├── product.service.ts
│   ├── order.service.ts
│   ├── category.service.ts
│   ├── customer.service.ts
│   └── coupon.service.ts
├── constants/
│   ├── index.ts                  # SITE, NAV_LINKS, filtros
│   └── data.ts                   # Mock data (produtos, categorias, etc.)
├── types/
│   ├── index.ts                  # Product, CartItem, Category etc.
│   └── admin.ts                  # AdminProduct, AdminOrder etc.
├── lib/
│   └── utils.ts                  # cn() (clsx + tailwind-merge)
├── styles/
│   └── globals.css               # Tailwind v4 + tema customizado
└── public/images/                # 18 imagens estáticas
```

---

## 3. Dependências

### Produção

| Pacote | Versão | Finalidade |
|--------|--------|------------|
| `next` | ^16.0.0 | Framework |
| `react` / `react-dom` | ^19.0.0 | UI Library |
| `firebase` | ^12.15.0 | Backend/BaaS (não configurado) |
| `@radix-ui/*` (20+) | — | Primitivas acessíveis |
| `class-variance-authority` | 0.7.1 | Variantes CSS (cva) |
| `clsx` | 2.1.1 | Classes condicionais |
| `tailwind-merge` | 3.2.0 | Merge de classes Tailwind |
| `tw-animate-css` | 1.3.8 | Animações Tailwind |
| `lucide-react` | 0.487.0 | Ícones SVG |
| `motion` | 12.23.24 | Animações |
| `cmdk` | 1.1.1 | Command menu |
| `date-fns` | 3.6.0 | Manipulação de datas |
| `embla-carousel-react` | 8.6.0 | Carrossel |
| `react-day-picker` | 8.10.1 | Seletor de data |
| `react-hook-form` | 7.55.0 | Formulários |
| `react-resizable-panels` | 2.1.7 | Painéis redimensionáveis |
| `sonner` | 2.0.3 | Toast de notificação |
| `vaul` | 1.1.2 | Drawer animado (mobile) |
| `next-themes` | 0.4.6 | Tema claro/escuro |

### Desenvolvimento

| Pacote | Versão | Finalidade |
|--------|--------|------------|
| `tailwindcss` | 4.1.12 | CSS utilitário |
| `@tailwindcss/postcss` | ^4.1.12 | Plugin PostCSS |
| `typescript` | ^5.8.0 | TypeScript |
| `@types/react` / `@types/react-dom` | ^19 | Tipos React |
| `@types/node` | ^22 | Tipos Node |

---

## 4. Hierarquia de Componentes

### Layout Raiz (`app/layout.tsx`)

```
<RootLayout>
  <CartProvider>                    hooks/use-cart.tsx
    <WishlistProvider>              hooks/use-wishlist.tsx
      <Navbar />                    components/layout/navbar.tsx
      <main>{children}</main>
      <Footer />                    components/layout/footer.tsx
      <Toaster />                   sonner
    </WishlistProvider>
  </CartProvider>
</RootLayout>
```

### Home (`app/page.tsx`)

```
<HomePage>
  <HeroSection />
  <TrustStrip />
  <CategoriesSection />
  <BestsellersSection />
    <ProductCard>
      <Badge />
      <StarRating />
    </ProductCard>
  <EditorialSection />
  <NewArrivalsSection />
    <ProductCard>
    ...
  <TestimonialsSection />
  <InstagramSection />
  <HomeFaqSection />
  <NewsletterSection />
</HomePage>
```

### Detalhe do Produto (`app/product/[id]/`)

```
<ProductDetailContent>
  <ProductGallery />
  <ProductInfo>
    <StarRating />
  </ProductInfo>
  <ProductCard />  (relacionados)
</ProductDetailContent>
```

### Admin (`app/admin/layout.tsx`)

```
<AdminLayout>
  <aside>Sidebar</aside>
  <header>Top bar</header>
  <main>{children}</main>
    Dashboard | Produtos | Categorias | Pedidos | Clientes | Cupons | Config | Perfil
</AdminLayout>
```

---

## 5. Rotas e Navegação

### Públicas

| Rota | Descrição |
|------|-----------|
| `/` | Home |
| `/category` | Listagem de produtos (filtros, grid/lista) |
| `/product/[id]` | Detalhe do produto |
| `/cart` | Carrinho |
| `/checkout` | Checkout (4 etapas) |
| `/confirmation` | Confirmação de pedido |
| `/account` | Minha conta (pedidos, favoritos, endereços, cartões, dados) |
| `/wishlist` | Lista de desejos |
| `/about` | Sobre |
| `/contact` | Contato |
| `/faq` | Perguntas frequentes |

### Administrativas

| Rota | Descrição |
|------|-----------|
| `/admin` | Dashboard com métricas |
| `/admin/produtos` | CRUD produtos |
| `/admin/categorias` | CRUD categorias |
| `/admin/pedidos` | Gerenciamento de pedidos |
| `/admin/clientes` | Gerenciamento de clientes |
| `/admin/cupons` | Gerenciamento de cupons |
| `/admin/configuracoes` | Configurações |
| `/admin/perfil` | Perfil do admin |

**Navbar** usa `<Link>` do Next.js, `usePathname()` para highlight e `motion/react` para animações. Inclui Drawer (Vaul) para menu mobile.

---

## 6. Gerenciamento de Estado

React Context API, sem bibliotecas externas:

### CartContext (`hooks/use-cart.tsx`)
- `items: CartItem[]`
- Métodos: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `totalCount`, `totalPrice`

### WishlistContext (`hooks/use-wishlist.tsx`)
- `items: string[]` (IDs)
- Métodos: `toggleItem`, `isFavorite`

Providers aninhados no `RootLayout`.

---

## 7. Estilização

### Tailwind CSS v4

**Arquivo:** `styles/globals.css`

- `@import 'tailwindcss'`
- `@plugin 'tw-animate-css'`
- Tema inline com variáveis CSS customizadas (`--color-primary: #C98F8A`, `--color-background: #FDFBF8`, etc.)
- `@custom-variant dark` para tema escuro

### Fontes
- **Inter** (sans-serif, principal)
- **Cormorant Garamond** (serifada, títulos)

### Utilitário `cn()` (`lib/utils.ts`)
Combina `clsx` + `tailwind-merge` para merge inteligente de classes.

### shadcn/ui
Componentes em `components/ui/` com variantes via `cva()`.

---

## 8. Serviços e API

Todos os serviços usam **dados mockados em memória** (sem HTTP real).

| Serviço | Arquivo | Métodos |
|---------|---------|---------|
| Product | `services/product.service.ts` | `list`, `getById`, `create`, `update`, `delete`, `getLowStock`, `getOutOfStock` |
| Order | `services/order.service.ts` | `list`, `getById`, `getRecent`, `getDashboardStats`, `getSalesData`, `updateStatus` |
| Category | `services/category.service.ts` | `list`, `getById`, `create`, `update`, `delete`, `listCollections` |
| Customer | `services/customer.service.ts` | `list`, `getById`, `getRecent`, `getTopCustomers` |
| Coupon | `services/coupon.service.ts` | `list`, `getById`, `create`, `update`, `delete`, `getStatus`, `toggleActive`, `duplicate` |

Dados estáticos da vitrine (produtos, categorias, depoimentos, FAQ) ficam em `constants/data.ts`.

Firebase (`firebase@^12.15.0`) está instalado como dependência mas **não há inicialização ou configuração** (sem `initializeApp`, sem `.env`).

---

## 9. Páginas por Tipo

### Server Components (`page.tsx`)
- Home (`/`)
- About, Contact, FAQ, Confirmation
- Layout raiz e Admin layout

### Client Components (`content.tsx`)
- Category, Product, Cart, Checkout, Account, Wishlist
- Admin Dashboard e subpáginas

Padrão: `page.tsx` exporta metadata + renderiza `content.tsx` (com `"use client"`).

---

## 10. Testes

**Nenhum teste implementado no frontend.**
- Sem arquivos `.test.*` ou `.spec.*`
- Sem `__tests__/`
- Sem config de test runner
- Sem dependências de teste em `devDependencies`

O backend Java possui testes, mas estão fora do escopo do frontend.

---

## 11. Pontos de Atenção

1. **Firebase não configurado** — dependência instalada mas sem `initializeApp` ou `.env`
2. **Sem testes automatizados** no frontend
3. **Sem ESLint/Prettier** personalizado (usa apenas o `next lint` padrão)
4. **Dados mockados** — serviços em memória, sem chamadas HTTP reais
5. **Pastas vazias** — `components/cart/` e `components/checkout/` sem componentes (lógica inline nas páginas)
6. **Backend Spring Boot** existe em `Backend/Lisory/` com entidades, repositórios, serviços e controladores para produtos, categorias, pedidos, clientes, cupons, endereços e envios — mas sem integração com o frontend ainda

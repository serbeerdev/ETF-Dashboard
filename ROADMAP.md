# Roadmap - Funcionalidades Pendientes

Este documento detalla las funcionalidades que faltan por implementar en el frontend basándose en los endpoints disponibles en la API del backend.

## Estado Actual

### ✅ Implementado
- Homepage con ETFs destacados
- Página de detalle de ETF (`/etf/[symbol]`)
- Gráfico de precios con selector de intervalo (1D, 1M, 3M, 6M, 1Y, 5Y)
- Header del ETF con información básica
- Métricas clave (Expense Ratio, Assets, Category, Legal Type)
- Modo oscuro
- Navbar con búsqueda (básica)

---

## 🚧 Páginas Faltantes

### 1. Página de Búsqueda (`/search`)
**Estado:** Navbar tiene enlace pero la página no existe

**Ubicación:** `app/(dashboard)/search/page.tsx`

**Funcionalidad requerida:**
- Campo de búsqueda funcional (actualmente solo redirige a /search)
- Usar hook `useSearchEtfs(query)` de `hooks/use-etf-data.ts`
- Mostrar resultados de búsqueda con `EtfCard` para cada resultado
- Manejar estados de loading y error
- Mostrar mensaje cuando no hay resultados

**API endpoint disponible:**
- `GET /etf/search/{query}` → hook `useSearchEtfs()` ya implementado

---

### 2. Página de Comparación (`/compare`)
**Estado:** Navbar tiene enlace pero la página no existe

**Ubicación:** `app/(dashboard)/compare/page.tsx`

**Funcionalidad requerida:**
- Seleccionar 2-4 ETFs para comparar
- Tabla comparativa con métricas side-by-side:
  - Precio actual
  - Expense Ratio
  - Total Net Assets
  - Performance YTD, 1Y, 3Y, 5Y
  - Category
  - Fund Family
- Gráfico comparativo de precios

**API endpoints disponibles:**
- `GET /etf/{symbol}` → `useEtfInfo()` o `etfApi.getEtfInfo()`
- `GET /etf/{symbol}/price` → `useEtfPrice()`
- `GET /etf/{symbol}/history/daily` → `useDailyHistory()`

---

## 🧩 Componentes Faltantes (para página de detalle)

### 3. Componente de Holdings
**Estado:** Hook `useHoldings()` existe pero no hay UI

**Ubicación sugerida:** `components/etf/etf-holdings.tsx`

**Funcionalidad requerida:**
- Mostrar top holdings del ETF
- Tabla con: Symbol, Name, Weight, Shares, Value
- Gráfico de sector allocation (pie chart o bar chart)
- Performance del ETF (YTD, 1Y, 3Y, 5Y) si está disponible

**API endpoint disponible:**
- `GET /etf/{symbol}/holdings` → hook `useHoldings()` ya implementado

---

### 4. Componente de Insights (Análisis Técnico)
**Estado:** Hook `useInsights()` existe pero no hay UI

**Ubicación sugerida:** `components/etf/etf-insights.tsx`

**Funcionalidad requerida:**
- Señales técnicas (trend: bullish/bearish/neutral)
- Niveles de soporte y resistencia
- Medias móviles (SMA20, SMA50, SMA200, EMA12, EMA26)
- Indicador de fuerza de la tendencia

**API endpoint disponible:**
- `GET /etf/{symbol}/insights` → hook `useInsights()` ya implementado

---

### 5. Componente de Noticias
**Estado:** Hook `useNews()` existe pero no hay UI

**Ubicación sugerida:** `components/etf/etf-news.tsx`

**Funcionalidad requerida:**
- Lista de artículos recientes relacionados con el ETF
- Mostrar: thumbnail, título, publisher, fecha, link al artículo
- Click abre artículo en nueva pestaña

**API endpoint disponible:**
- `GET /etf/{symbol}/news` → hook `useNews()` ya implementado

---

### 6. Componente de Recomendaciones
**Estado:** Hook `useRecommendations()` existe pero no hay UI

**Ubicación sugerida:** `components/etf/etf-recommendations.tsx`

**Funcionalidad requerida:**
- Lista de ETFs recomendados similares al actual
- Mostrar: symbol, name, score, reason
- Links a las páginas de cada ETF recomendado

**API endpoint disponible:**
- `GET /etf/{symbol}/recommendations` → hook `useRecommendations()` ya implementado

---

### 7. Componente de Dividendos
**Estado:** Hook `useDividends()` existe pero no hay UI

**Ubicación sugerida:** `components/etf/etf-dividends.tsx`

**Funcionalidad requerida:**
- Historial de dividendos del ETF
- Tabla con: fecha, monto, frecuencia (monthly/quarterly/annual)
- Gráfico de dividendos a lo largo del tiempo
- Resumen: yield actual, frecuencia de pago

**API endpoint disponible:**
- `GET /etf/{symbol}/dividends` → hook `useDividends()` ya implementado en hooks

---

## 📡 API Routes Faltantes (Proxy Routes)

Los siguientes endpoints del backend no tienen su correspondiente proxy route en `/app/api/`:

### 8. API Route - Search
**Ubicación:** `app/api/etf/search/[query]/route.ts`

**Necesario para:** Búsqueda de ETFs desde componentes cliente

### 9. API Route - Recommendations
**Ubicación:** `app/api/etf/[symbol]/recommendations/route.ts`

**Necesario para:** Recomendaciones desde componentes cliente

### 10. API Route - Dividends
**Ubicación:** `app/api/etf/[symbol]/dividends/route.ts`

**Necesario para:** Dividendos desde componentes cliente

### 11. API Route - Full Report
**Ubicación:** `app/api/etf/[symbol]/report/route.ts`

**Necesario para:** Reporte completo (combina todos los datos)

---

## 🎯 Prioridades Sugeridas

### Alta Prioridad
1. **Página de Búsqueda** - Funcionalidad crítica para descubrir ETFs
2. **Componente de Holdings** - Información fundamental importante
3. **API Routes faltantes** - Requeridas para componentes cliente

### Media Prioridad
4. **Componente de Noticias** - Valor añadido para usuarios
5. **Componente de Insights** - Análisis técnico para inversores
6. **Componente de Dividendos** - Importante para inversores de ingresos

### Baja Prioridad
7. **Página de Comparación** - Funcionalidad avanzada
8. **Componente de Recomendaciones** - Nice-to-have

---

## 📝 Notas de Implementación

- Todos los hooks ya están implementados en `hooks/use-etf-data.ts`
- Los tipos TypeScript están definidos en `types/etf.types.ts`
- Seguir el patrón existente: server components para data inicial, client components con hooks para actualizaciones en tiempo real
- Recharts está disponible para gráficos ( Holdings sector allocation, dividendos, etc.)
- Componentes UI de Shadcn disponibles: Card, Table, Badge, Alert, etc.

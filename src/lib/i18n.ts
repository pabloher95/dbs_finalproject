export type Language = "en" | "es";

export const supportedLanguages: readonly Language[] = ["en", "es"];

export function isLanguage(value: string | null | undefined): value is Language {
  return value === "en" || value === "es";
}

export function getLanguageName(language: Language) {
  return language === "es" ? "Español" : "English";
}

function commonCopy(language: Language) {
  return {
    english: language === "es" ? "Inglés" : "English",
    spanish: language === "es" ? "Español" : "Spanish",
    save: language === "es" ? "Guardar" : "Save",
    reset: language === "es" ? "Restablecer" : "Reset",
    search: language === "es" ? "Buscar" : "Search",
    delete: language === "es" ? "Eliminar" : "Delete",
    edit: language === "es" ? "Editar" : "Edit",
    undo: language === "es" ? "Deshacer" : "Undo",
    cancel: language === "es" ? "Cancelar" : "Cancel",
    close: language === "es" ? "Cerrar" : "Close",
    loading: language === "es" ? "Cargando..." : "Loading...",
    synced: language === "es" ? "sincronizado" : "synced",
    syncing: language === "es" ? "sincronizando" : "syncing",
    step: language === "es" ? "Paso" : "Step",
    nextMove: language === "es" ? "Siguiente paso" : "Next move",
    home: language === "es" ? "Inicio" : "Home"
  };
}

export function landingCopy(language: Language) {
  return {
    navHowItWorks: language === "es" ? "Cómo funciona" : "How it works",
    navWhatItMeasures: language === "es" ? "Qué mide" : "What it measures",
    signIn: language === "es" ? "Iniciar sesión" : "Sign in",
    openStudio: language === "es" ? "Abrir estudio" : "Open studio",
    heroEyebrow: language === "es" ? "Inventario · Pedidos · Compras" : "Inventory · Orders · Purchasing",
    heroTitleLead: language === "es" ? "Un estudio operativo práctico" : "A practical operating studio",
    heroTitleTail: language === "es" ? "para el negocio de oficio." : "for the hands-on business.",
    heroBody:
      language === "es"
        ? "SmallBiz IQ mantiene el catálogo, los pedidos abiertos y el plan de materiales en una sola superficie medida. Importa un CSV, registra un pedido y obtén una lista de compra lista para proveedores."
        : "SmallBiz IQ keeps the catalog, the open orders, and the material plan in a single measured surface. Import a CSV, capture an order, get a supplier-ready buy list.",
    heroLink: language === "es" ? "Cómo funciona" : "How it works",
    methodEyebrow: language === "es" ? "Cómo funciona" : "How it works",
    methodTitle: language === "es" ? "Tres pasos." : "Three steps.",
    methodFootnotes: {
      intake: language === "es" ? "Ingesta" : "Intake",
      catalog: language === "es" ? "Catálogo" : "Catalog",
      purchasing: language === "es" ? "Compras" : "Purchasing"
    },
    dataFlow: {
      orders: language === "es" ? "Pedidos" : "Orders",
      buyList: language === "es" ? "Lista de compra" : "Buy list"
    },
    importTitle: language === "es" ? "Importar." : "Import.",
    importBody:
      language === "es"
        ? "Sube un CSV de productos, contactos o pedidos. Cada fila se valida antes de guardarse."
        : "Upload a CSV of products, contacts, or orders. Each row is validated before it lands.",
    defineTitle: language === "es" ? "Define productos." : "Define products.",
    defineBody:
      language === "es"
        ? "Escribe cada producto como una fórmula: materiales, rendimientos y unidades."
        : "Write each product as a formula - materials, yields, and units.",
    planTitle: language === "es" ? "Planificar compras." : "Plan purchasing.",
    planBody:
      language === "es"
        ? "Los pedidos abiertos se agrupan en demanda y se expanden en una lista de materiales lista para proveedores."
        : "Open orders aggregate into demand, which expands into a supplier-ready material list.",
    studioEyebrow: language === "es" ? "Qué mide el estudio" : "What the studio measures",
    studioTitle: language === "es" ? "Cuatro lecturas del negocio." : "Four readings of the business.",
    studioBody:
      language === "es"
        ? "Cuatro cifras en marcha, cada una unida a una pregunta real: qué reponer, qué comprar, dónde se inclina el negocio y qué sale después."
        : "A handful of running figures, each wired to a real question- what to stock, what to buy, where the business leans, what goes out the door next.",
    readings: {
      runway: {
        label: language === "es" ? "— Autonomía" : "— Runway",
        title: language === "es" ? "Días de inventario" : "Days of stock",
        body:
          language === "es"
            ? "Cuánto tiempo cubren tus materiales actuales la demanda registrada."
            : "How long your current materials cover the demand on your books."
      },
      buyList: {
        label: language === "es" ? "— Lista de compra" : "— Buy list",
        title: language === "es" ? "Lista preparada para proveedores" : "Supplier-ready",
        body:
          language === "es"
            ? "Demanda abierta, expandida en una orden de compra por proveedor con cantidades."
            : "Open demand, expanded into a per-supplier purchase order with quantities."
      },
      concentration: {
        label: language === "es" ? "— Concentración" : "— Concentration",
        title: language === "es" ? "Dónde recae el peso" : "Where weight sits",
        body:
          language === "es"
            ? "De qué productos y proveedores depende realmente tu negocio."
            : "Which products and suppliers your business actually depends on."
      },
      pipeline: {
        label: language === "es" ? "— Canal" : "— Pipeline",
        title: language === "es" ? "Qué sale después" : "What ships next",
        body:
          language === "es"
            ? "Pedidos abiertos ordenados por fecha de entrega, con el estado de disponibilidad de materiales marcado."
            : "Open orders sorted by due date, with material readiness flagged."
      }
    },
    footerStudio: language === "es" ? "Estudio" : "Studio",
    footerHowItWorks: language === "es" ? "Cómo funciona" : "How it works",
    footerWhatItMeasures: language === "es" ? "Qué mide" : "What it measures",
    howDataMoves: language === "es" ? "Cómo se mueven los datos" : "How the data moves",
    enterStudio: language === "es" ? "Entrar al estudio" : "Enter studio"
  };
}

export function workspaceCopy(language: Language) {
  const common = commonCopy(language);
  return {
    home: common.home,
    studioLabel: language === "es" ? "El estudio" : "The Studio",
    openOrder: language === "es" ? "pedido abierto" : "open order",
    openOrders: language === "es" ? "pedidos abiertos" : "open orders",
    openDemand: language === "es" ? "Demanda abierta" : "Open demand",
    due: language === "es" ? "Vence" : "Due",
    noOpenOrders: language === "es" ? "Todavía no hay pedidos abiertos." : "No open orders yet.",
    synced: common.synced,
    syncing: common.syncing,
    languageLabel: language === "es" ? "Idioma" : "Language",
    languageOptions: [
      { value: "en" as const, label: common.english },
      { value: "es" as const, label: common.spanish }
    ],
    nav: [
      { label: language === "es" ? "Estudio" : "Studio", description: language === "es" ? "Vista de hoy del trabajo y del siguiente paso." : "Today's view of the work and the next move." },
      { label: language === "es" ? "Ingesta" : "Intake", description: language === "es" ? "Plantillas CSV versionadas con vista previa." : "Versioned CSV templates with preview." },
      { label: language === "es" ? "Catálogo" : "Catalog", description: language === "es" ? "Productos, rendimientos y fórmulas de materiales." : "Products, yields, and material formulas." },
      { label: language === "es" ? "Contactos" : "Contacts", description: language === "es" ? "Clientes y fuentes de proveedores." : "Customers and supplier sources." },
      { label: language === "es" ? "Pedidos" : "Orders", description: language === "es" ? "Demanda abierta y la cola de producción." : "Open demand and the production queue." },
      { label: language === "es" ? "Compras" : "Purchasing", description: language === "es" ? "Plan de materiales a partir de la demanda abierta." : "Material plan from open demand." }
    ]
  };
}

export function dashboardCopy(language: Language) {
  return {
    today: language === "es" ? "Hoy" : "Today",
    sourcingGap: language === "es" ? "brecha de abastecimiento" : "sourcing gap",
    sourcingGaps: language === "es" ? "brechas de abastecimiento" : "sourcing gaps",
    sourcingComplete: language === "es" ? "Abastecimiento completo" : "Sourcing complete",
    title: language === "es" ? "El trabajo, por escrito." : "The work, written down.",
    body:
      language === "es"
        ? "Un canal de ingesta claro, un catálogo legible y un camino medido desde la demanda abierta hasta una lista de compra lista para proveedores. Empieza donde tenga sentido; lo demás sigue."
        : "A clean intake lane, a readable catalog, and a measured path from open demand to a supplier-ready buy list. Begin where it makes sense - the rest follows.",
    products: language === "es" ? "Productos" : "Products",
    openOrders: language === "es" ? "Pedidos abiertos" : "Open orders",
    unitsDue: language === "es" ? "Unidades pendientes" : "Units due",
    suppliers: language === "es" ? "Proveedores" : "Suppliers",
    beginIntake: language === "es" ? "Iniciar ingesta" : "Begin intake",
    reviewOrders: language === "es" ? "Revisar pedidos" : "Review orders",
    priorityQueue: language === "es" ? "Cola prioritaria" : "Priority queue",
    activeOrders: language === "es" ? "Pedidos activos de hoy" : "Today's active orders",
    open: language === "es" ? "abierto" : "open",
    units: language === "es" ? "unidades" : "units",
    due: language === "es" ? "vence" : "due",
    noOpenOrders: language === "es" ? "Todavía no hay pedidos abiertos. Agrega uno para poblar la cola." : "No open orders yet. Add one to populate the queue.",
    method: language === "es" ? "Método" : "Method",
    threeMoves: language === "es" ? "Tres movimientos" : "Three moves"
  };
}

export function workflowPageCopy(language: Language) {
  const common = commonCopy(language);
  return {
    stepLabel: common.step,
    nextMove: common.nextMove
  };
}

export function analyticsCopy(language: Language) {
  return {
    eyebrow: language === "es" ? "Lecturas" : "Readings",
    title: language === "es" ? "Señales de ingresos, margen y tendencia" : "Revenue, margin, and trend signals",
    description:
      language === "es"
        ? "Analítica descriptiva construida a partir del libro de pedidos actual, los precios de los productos y los costos de materiales. Sin previsiones todavía, solo la forma del negocio."
        : "Descriptive analytics built from the current order book, product pricing, and material costs. No forecasts yet, just the shape of the business.",
    revenue: language === "es" ? "Ingresos" : "Revenue",
    grossMargin: language === "es" ? "Margen bruto" : "Gross margin",
    marginRate: language === "es" ? "Tasa de margen" : "Margin rate",
    avgOrder: language === "es" ? "Pedido prom." : "Avg. order",
    trendChart: language === "es" ? "Gráfico de tendencia" : "Trend chart",
    chartTitle: language === "es" ? "Ingresos y margen por mes" : "Revenue and margin by month",
    month: language === "es" ? "Mes" : "Month",
    orders: language === "es" ? "Pedidos" : "Orders",
    leadingProduct: language === "es" ? "Producto líder" : "Leading product",
    leadingClient: language === "es" ? "Cliente líder" : "Leading client",
    strongestMonth: language === "es" ? "Mes más fuerte" : "Strongest month",
    workingNote: language === "es" ? "Nota de trabajo" : "Working note",
    noTrend: language === "es" ? "Aún no hay una tendencia de ingresos disponible." : "No revenue trend is available yet.",
    noProduct: language === "es" ? "Todavía no hay datos de productos" : "No product data yet",
    noClient: language === "es" ? "Todavía no hay datos de clientes" : "No client data yet",
    noMonth: language === "es" ? "Todavía no hay datos mensuales" : "No month data yet",
    addPrices:
      language === "es"
        ? "Agrega precios de productos y costos de materiales para mostrar ingresos, margen y lecturas de tendencia en el panel."
        : "Add product prices and material costs to surface revenue, margin, and trend readings in the dashboard.",
    setPricing:
      language === "es"
        ? "Define precios de producto y costos de material para desbloquear el análisis de ingresos."
        : "Set product prices and material costs to unlock revenue analysis.",
    openOrders:
      language === "es"
        ? "Los pedidos abiertos aparecerán aquí cuando haya precios definidos."
        : "Open orders will appear here once pricing is in place.",
    monthReadings:
      language === "es"
        ? "Las lecturas mes a mes aparecen una vez que los pedidos tienen precio."
        : "Month-over-month readings appear once orders are priced.",
    openOrdersFallback:
      language === "es"
        ? "Los pedidos abiertos aparecerán aquí una vez que haya precios definidos."
        : "Open orders will appear here once pricing is in place.",
    checks:
      language === "es"
        ? "El negocio ya muestra una mezcla de pedidos con precio. Usa los líderes de producto y cliente como primeras comprobaciones descriptivas antes de añadir cualquier capa de previsión."
        : "The business is already showing a priced order mix. Use the product and customer leaders as your first descriptive checks before adding any forecast layer."
  };
}

export function businessNameCopy(language: Language) {
  return {
    firstStep: language === "es" ? "Primer paso" : "First step",
    title: language === "es" ? "Nombra tu estudio" : "Name your studio",
    description:
      language === "es"
        ? "Este nombre aparece en el encabezado del espacio de trabajo y en la vista de lecturas del panel."
        : "This name appears in the workspace header and in your dashboard reading view.",
    label: language === "es" ? "Nombre de la empresa" : "Company name",
    placeholder: language === "es" ? "Estudio Northline" : "Northline Studio",
    enterName: language === "es" ? "Introduce un nombre de empresa." : "Enter a company name.",
    saveError:
      language === "es"
        ? "No se pudo guardar el nombre de la empresa."
        : "Unable to save the company name.",
    saving: language === "es" ? "Guardando..." : "Saving...",
    saveName: language === "es" ? "Guardar nombre" : "Save name"
  };
}

export function onboardingCopy(language: Language) {
  return {
    eyebrow: language === "es" ? "Empieza aquí" : "Start here",
    title: language === "es" ? "Tres pasos para tu primera lista de compra." : "Three steps to your first buy list.",
    description:
      language === "es"
        ? "Empieza con el catálogo o importa un CSV de ejemplo, registra un pedido y el estudio escribirá el resto."
        : "Start with the catalog or import a sample CSV, capture an order, and the studio writes the rest.",
    beginIntake: language === "es" ? "Iniciar ingesta" : "Begin intake",
    skip: language === "es" ? "Omitir" : "Skip"
  };
}

export function commandBarCopy(language: Language) {
  return {
    home: language === "es" ? "Inicio" : "Home",
    synced: language === "es" ? "sincronizado" : "synced",
    syncing: language === "es" ? "sincronizando" : "syncing"
  };
}

export function authCopy(language: Language) {
  return {
    signIn: language === "es" ? "Iniciar sesión" : "Sign in",
    createAccount: language === "es" ? "Crear cuenta" : "Create account",
    description:
      language === "es"
        ? "Accede a tu estudio y vuelve al espacio de trabajo."
        : "Access your studio and return to the workspace.",
    signUpDescription:
      language === "es"
        ? "Configura tu estudio y empieza a seguir inventario, pedidos y compras."
        : "Set up your studio and start tracking inventory, orders, and purchasing.",
    newHere: language === "es" ? "¿Nuevo por aquí?" : "New here?",
    alreadyHave: language === "es" ? "¿Ya tienes una cuenta?" : "Already have an account?",
    createAccountLink: language === "es" ? "Crear una cuenta" : "Create an account"
  };
}

export function catalogCopy(language: Language) {
  return {
    eyebrow: language === "es" ? "Catálogo" : "Catalog",
    title: language === "es" ? "Productos y matemática de fórmulas" : "Products and formula math",
    description:
      language === "es"
        ? "Cada producto incluye un rendimiento por lote y una lista de materiales explícita para que las cantidades de pedido se traduzcan limpiamente en demanda de compra."
        : "Each product carries an explicit batch yield and material bill so order quantities translate cleanly into purchasing demand.",
    materials: language === "es" ? "materiales" : "materials",
    unitPrice: language === "es" ? "precio unitario" : "unit price",
    unitCost: language === "es" ? "costo unitario" : "unit cost",
    material: language === "es" ? "Material" : "Material",
    perBatch: language === "es" ? "Por lote" : "Per batch",
    onHand: language === "es" ? "En mano" : "On hand",
    perUnit: language === "es" ? "Por unidad" : "Per unit"
  };
}

export function ordersBoardCopy(language: Language) {
  return {
    eyebrow: language === "es" ? "Pedidos" : "Orders",
    title: language === "es" ? "Demanda de producción abierta" : "Open production demand",
    description:
      language === "es"
        ? "Ve qué vence, a quién pertenece y cómo se acumula el volumen de pedidos en la línea de productos."
        : "See what is due, who it belongs to, and how order volume is building across the product line.",
    rollup: language === "es" ? "Resumen" : "Rollup",
    demandByProduct: language === "es" ? "Demanda por producto" : "Demand by product",
    due: language === "es" ? "vence" : "due",
    openOrder: language === "es" ? "pedido abierto" : "open order",
    openOrders: language === "es" ? "pedidos abiertos" : "open orders",
    units: language === "es" ? "unidades" : "units",
    noOrders: language === "es" ? "Todavía no se han registrado pedidos." : "No orders captured yet.",
    noDemand: language === "es" ? "Todavía no hay demanda abierta." : "No open demand yet."
  };
}

export function purchasingBoardCopy(language: Language) {
  return {
    todayRun: language === "es" ? "Corrida de hoy" : "Today's run",
    readyToSource:
      language === "es" ? "líneas de material listas para abastecer" : "material lines ready to source",
    description:
      language === "es"
        ? "Resumen de cada pedido abierto, expandido por fórmula, agrupado por material y proveedor."
        : "Roll-up of every open order, expanded by formula, grouped by material and supplier.",
    requiredUnits: language === "es" ? "unidades requeridas" : "required units",
    sourced: language === "es" ? "abastecido" : "sourced",
    stockedMaterials: language === "es" ? "materiales en stock" : "stocked materials",
    noOpenOrders:
      language === "es"
        ? "Todavía no hay pedidos abiertos. Agrega un pedido en Pedidos para generar las cantidades requeridas de material."
        : "No open orders yet. Add an order in Orders to generate required material quantities.",
    emptyCatalog:
      language === "es"
        ? "El catálogo está vacío. Agrega productos con fórmulas antes de generar una corrida de compras."
        : "Catalog is empty. Add products with formulas before generating a purchasing run.",
    uncovered:
      language === "es"
        ? "líneas de material todavía necesitan compra después de contar el stock."
        : "material lines still need buying after stock is counted.",
    material: language === "es" ? "Material" : "Material",
    onHand: language === "es" ? "En mano" : "On hand",
    required: language === "es" ? "Requerido" : "Required",
    netToBuy: language === "es" ? "Neto a comprar" : "Net to buy",
    supplier: language === "es" ? "Proveedor" : "Supplier",
    state: language === "es" ? "Estado" : "State",
    unassigned: language === "es" ? "Sin asignar" : "Unassigned",
    emptyPlan:
      language === "es"
        ? "El plan de compras está vacío. Importa o crea productos y pedidos abiertos para poblar esta vista."
        : "Purchasing plan is empty. Import or create products and open orders to populate this view."
  };
}

export function contactBoardCopy(language: Language) {
  return {
    customers: language === "es" ? "Clientes" : "Customers",
    orderDestinations: language === "es" ? "Destinos de pedido" : "Order destinations",
    customerDescription:
      language === "es"
        ? "Registra quién te compra, cómo compra y hacia dónde va la producción que viene."
        : "Track who orders from you, how they buy, and where upcoming production is headed.",
    suppliers: language === "es" ? "Proveedores" : "Suppliers",
    sourcingLinks: language === "es" ? "Enlaces de abastecimiento de materiales" : "Material sourcing links",
    supplierDescription:
      language === "es"
        ? "Asigna proveedores preferidos para que el plan de compras pueda apuntar a la fuente correcta desde el primer día."
        : "Assign preferred vendors so the purchasing plan can point to the right source on day one.",
    noCustomers: language === "es" ? "Todavía no hay clientes." : "No customers yet.",
    noSuppliers: language === "es" ? "Todavía no hay proveedores." : "No suppliers yet."
  };
}

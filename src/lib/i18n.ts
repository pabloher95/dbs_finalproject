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
    heroTitleBeforeEmphasis: language === "es" ? "para el negocio " : "for the ",
    heroEmphasis: language === "es" ? "de oficio" : "hands-on",
    heroTitleAfterEmphasis: language === "es" ? "." : " business.",
    heroBody:
      language === "es"
        ? "SmallBiz IQ mantiene el catálogo, los pedidos abiertos y el plan de materiales en una sola superficie medida. Crea productos, registra pedidos y obtén una lista de compra lista para proveedores."
        : "SmallBiz IQ keeps the catalog, the open orders, and the material plan in a single measured surface. Create products, capture orders, and get a supplier-ready buy list.",
    heroLink: language === "es" ? "Cómo funciona" : "How it works",
    methodEyebrow: language === "es" ? "Cómo funciona" : "How it works",
    methodTitle: language === "es" ? "Tres pasos." : "Three steps.",
    methodFootnotes: {
      intake: language === "es" ? "Ingesta" : "Intake",
      catalog: language === "es" ? "Catálogo" : "Catalog",
      purchasing: language === "es" ? "Compras" : "Purchasing"
    },
    marqueeWords:
      language === "es"
        ? [
            "Panaderías",
            "Librerías",
            "Cervecerías",
            "Constructoras",
            "Catering",
            "Cerámica",
            "Café",
            "Cooperativas",
            "Contratistas",
            "Distribuidores",
            "Puestos de granja",
            "Negocios familiares",
            "Food trucks",
            "Ferretería",
            "Importadoras",
            "Marcas independientes",
            "Jardinería",
            "Ensamble ligero",
            "Talleres mecánicos",
            "Insumos médicos",
            "Tiendas de barrio",
            "Marcas online",
            "Empaque",
            "Insumos para mascotas",
            "Farmacias",
            "Imprentas",
            "Talleres de reparación",
            "Minoristas",
            "Proyectos paralelos",
            "Cajas por suscripción",
            "Textiles",
            "Oficios",
            "Mayoristas",
            "Talleres de madera",
            "Refacciones automotrices"
          ]
        : [
            "Bakeries",
            "Bookshops",
            "Breweries",
            "Builders",
            "Caterers",
            "Ceramics",
            "Coffee",
            "Co-ops",
            "Contractors",
            "Distributors",
            "Farm stands",
            "Family businesses",
            "Food trucks",
            "Hardware",
            "Import firms",
            "Indie brands",
            "Landscapers",
            "Light assembly",
            "Machine shops",
            "Medical supply",
            "Neighborhood shops",
            "Online brands",
            "Packaging",
            "Pet supply",
            "Pharmacies",
            "Print shops",
            "Repair shops",
            "Retailers",
            "Side projects",
            "Subscription boxes",
            "Textiles",
            "Trades",
            "Wholesale",
            "Woodshops",
            "Auto parts"
          ],
    dataFlowStages:
      language === "es"
        ? [
            { label: "Formularios", note: "Ingesta" },
            { label: "Catálogo", note: "Catálogo" },
            { label: "Pedidos", note: "Pedidos" },
            { label: "Lista de compra", note: "Lista de compra" }
          ]
        : [
            { label: "Forms", note: "Intake" },
            { label: "Catalog", note: "Catalog" },
            { label: "Orders", note: "Orders" },
            { label: "Buy list", note: "Buy list" }
          ],
    dataFlowCaption:
      language === "es" ? "Formularios → Catálogo → Pedidos → Lista de compra" : "Forms → Catalog → Orders → Buy list",
    dataFlow: {
      orders: language === "es" ? "Pedidos" : "Orders",
      buyList: language === "es" ? "Lista de compra" : "Buy list"
    },
    importTitle: language === "es" ? "Capturar." : "Enter.",
    importBody:
      language === "es"
        ? "Completa los formularios de productos y pedidos. Cada guardado actualiza el espacio al instante."
        : "Fill out the product and order forms. Each save updates the workspace right away.",
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
      { label: language === "es" ? "Estudio" : "Studio", description: language === "es" ? "Señales operativas y de ventas." : "Current operating and sales signals." },
      { label: language === "es" ? "Ingesta" : "Intake", description: language === "es" ? "Crear productos con fórmulas." : "Create products with formulas." },
      { label: language === "es" ? "Catálogo" : "Catalog", description: language === "es" ? "Mantén productos y sus fórmulas." : "Maintain products and their formulas." },
      { label: language === "es" ? "Contactos" : "Contacts", description: language === "es" ? "Clientes y proveedores." : "Customers and suppliers." },
      { label: language === "es" ? "Pedidos" : "Orders", description: language === "es" ? "Pedidos abiertos y líneas de pedido." : "Open orders and line items." },
      { label: language === "es" ? "Compras" : "Purchasing", description: language === "es" ? "Lista de compra a partir de la demanda abierta." : "Buy list from open demand." }
    ]
  };
}

export function dashboardCopy(language: Language) {
  return {
    today: language === "es" ? "Hoy" : "Today",
    sourcingGap: language === "es" ? "brecha de abastecimiento" : "sourcing gap",
    sourcingGaps: language === "es" ? "brechas de abastecimiento" : "sourcing gaps",
    sourcingComplete: language === "es" ? "Abastecimiento completo" : "Sourcing complete",
    title:
      language === "es"
        ? "Base operativa y presión de ventas, de un vistazo."
        : "Operating base and sales pressure, at a glance.",
    body:
      language === "es"
        ? "Lecturas de demanda y tendencia, debajo."
        : "Demand and trend readings below.",
    operationsEyebrow: language === "es" ? "Base operativa" : "Operating base",
    operationsTitle: language === "es" ? "Capacidad del negocio" : "Business capacity",
    operationsBody:
      language === "es"
        ? "Tamaño del catálogo, red de proveedores, base de clientes y amplitud de los canales que realmente usas para vender."
        : "Catalog size, supplier bench, customer base, and the spread of the channels you actually use to sell.",
    salesEyebrow: language === "es" ? "Señal de ventas" : "Sales pulse",
    salesTitle: language === "es" ? "Demanda y presión de stock" : "Demand and stock pressure",
    salesBody:
      language === "es"
        ? "Pedidos abiertos, unidades pendientes y materiales que ya requieren reposición o una fuente asignada."
        : "Open orders, units due, and materials that now need replenishment or a named source.",
    shortcuts: [
      {
        href: "/import" as const,
        n: "01",
        title: language === "es" ? "Importar" : "Import",
        description:
          language === "es"
            ? "Captura productos y pedidos en formularios."
            : "Capture products and orders in forms."
      },
      {
        href: "/products" as const,
        n: "02",
        title: language === "es" ? "Definir productos" : "Define products",
        description:
          language === "es"
            ? "Escribe cada producto como una fórmula de materiales, rendimientos y unidades."
            : "Write each product as a formula of materials, yields, and units."
      },
      {
        href: "/purchasing" as const,
        n: "03",
        title: language === "es" ? "Planificar compras" : "Plan purchasing",
        description:
          language === "es"
            ? "Expande la demanda abierta en una lista de materiales lista para proveedores."
            : "Expand open demand into a supplier-ready material list."
      }
    ],
    products: language === "es" ? "Productos" : "Products",
    openOrders: language === "es" ? "Pedidos abiertos" : "Open orders",
    unitsDue: language === "es" ? "Unidades pendientes" : "Units due",
    suppliers: language === "es" ? "Proveedores" : "Suppliers",
    customers: language === "es" ? "Clientes" : "Customers",
    channels: language === "es" ? "Canales" : "Channels",
    lowStock: language === "es" ? "Stock bajo" : "Low stock",
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
    title:
      language === "es" ? "Señales de ingresos, margen y tendencia" : "Revenue, margin, and trend signals",
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
    saveName: language === "es" ? "Guardar nombre" : "Save name",
    cancel: language === "es" ? "Cancelar" : "Cancel",
    renameCompany: language === "es" ? "Renombrar empresa" : "Rename company"
  };
}

export function onboardingCopy(language: Language) {
  return {
    eyebrow: language === "es" ? "Empieza aquí" : "Start here",
    title: language === "es" ? "Tres pasos para tu primera lista de compra." : "Three steps to your first buy list.",
    description:
      language === "es"
        ? "Empieza con el catálogo o llena el formulario de ingreso, registra un pedido y el estudio escribirá el resto."
        : "Start with the catalog or fill out the intake form, capture an order, and the studio writes the rest.",
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
    open: language === "es" ? "abierto" : "open",
    fulfilled: language === "es" ? "cumplido" : "fulfilled",
    openOrder: language === "es" ? "pedido abierto" : "open order",
    openOrders: language === "es" ? "pedidos abiertos" : "open orders",
    units: language === "es" ? "unidades" : "units",
    markFulfilled: language === "es" ? "Marcar como cumplido" : "Mark fulfilled",
    reopenOrder: language === "es" ? "Reabrir" : "Reopen",
    backlog: language === "es" ? "cola" : "backlog",
    backlogOrder: language === "es" ? "pedido en cola" : "backlog order",
    backlogOrders: language === "es" ? "pedidos en cola" : "backlog orders",
    backlogHint:
      language === "es"
        ? "Pedidos abiertos con fecha de entrega anterior a hoy."
        : "Open orders due before today.",
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

export function importExperienceCopy(language: Language) {
  return {
    eyebrow: language === "es" ? "Productos" : "Products",
    title: language === "es" ? "Crea productos con fórmula" : "Create products with formulas",
    description:
      language === "es"
        ? "Completa el formulario del producto, guarda cada registro y deja que el espacio de trabajo se actualice al instante."
        : "Fill out the product form, save each record, and let the workspace update instantly.",
    productEyebrow: language === "es" ? "Producto" : "Product",
    productTitle: language === "es" ? "Agregar producto con fórmula" : "Add a product with a formula",
    productDescription:
      language === "es"
        ? "Captura SKU, precio y fórmula por unidad; después agrega los materiales una fila a la vez."
        : "Capture SKU, price, and a unit-level formula, then add materials one row at a time.",
    editing: language === "es" ? "Editando producto" : "Editing product",
    backToCatalog: language === "es" ? "Volver al catálogo" : "Back to catalog",
    saveProduct: language === "es" ? "Guardar producto" : "Save product",
    updateProduct: language === "es" ? "Actualizar producto" : "Update product",
    reset: language === "es" ? "Restablecer" : "Reset",
    addMaterial: language === "es" ? "Agregar material" : "Add material",
    productSaved: language === "es" ? "Producto guardado." : "Product saved.",
    productUpdated: language === "es" ? "Producto actualizado." : "Product updated.",
    skuPlaceholder: "SKU",
    namePlaceholder: language === "es" ? "Nombre del producto" : "Product name",
    categoryPlaceholder: language === "es" ? "Categoría" : "Category",
    unitPlaceholder: language === "es" ? "Unidad" : "Unit",
    unitPricePlaceholder: language === "es" ? "Precio unitario" : "Unit price",
    enterRequired:
      language === "es" ? "Introduce tanto el SKU como el nombre del producto." : "Enter both SKU and product name.",
    priceNegative: language === "es" ? "El precio unitario no puede ser negativo." : "Unit price cannot be negative.",
    formulaRequired:
      language === "es"
        ? "Añade al menos una línea válida de fórmula en formato nombre:unidad:cantidad."
        : "Add at least one valid formula line in name:unit:quantity format.",
    saveError: language === "es" ? "No se pudo guardar el producto." : "Unable to save product.",
    noEditTarget: language === "es" ? "Selecciona un producto desde el catálogo para editarlo." : "Select a product from the catalog to edit it."
  };
}

export function productStudioCopy(language: Language) {
  return {
    eyebrow: language === "es" ? "Catálogo de artículos" : "Item catalog",
    title: language === "es" ? "Productos y matemática de recetas" : "Products and recipe math",
    description:
      language === "es"
        ? "Busca un artículo, revisa su fórmula y compara el costo unitario con los materiales."
        : "Search an item, review its formula, and compare unit cost against the materials.",
    search: language === "es" ? "Buscar artículos" : "Search items",
    products: language === "es" ? "artículos" : "items",
    categories: language === "es" ? "categorías" : "categories",
    formulaLines: language === "es" ? "líneas de fórmula" : "formula lines",
    readOnly: language === "es" ? "Solo lectura" : "Read only",
    noProducts:
      language === "es" ? "Todavía no hay productos. Crea uno en Ingesta para empezar." : "No products yet. Create one in Intake to get started.",
    noMatch: language === "es" ? "Ningún artículo coincide con tu búsqueda." : "No items match your search.",
    yieldLabel: language === "es" ? "rendimiento" : "yield",
    materials: language === "es" ? "materiales" : "materials",
    unitPrice: language === "es" ? "precio" : "price",
    unitCost: language === "es" ? "costo" : "cost",
    editSpecs: language === "es" ? "Editar especificaciones" : "Edit specs"
  };
}

export function contactStudioCopy(language: Language) {
  return {
    customerEyebrow: language === "es" ? "Detalles del cliente" : "Customer details",
    customerTitle: language === "es" ? "Agregar un cliente" : "Add a customer",
    customerDescription:
      language === "es"
        ? "Captura los datos del cliente para que los pedidos nuevos puedan asignarse sin volver a escribirlos."
        : "Capture customer details so new orders can be assigned without retyping.",
    supplierEyebrow: language === "es" ? "Detalles del proveedor" : "Supplier details",
    supplierTitle: language === "es" ? "Agregar un proveedor" : "Add a supplier",
    supplierDescription:
      language === "es"
        ? "Mantén proveedores preferidos a mano para que el plan de compras ya apunte a la fuente correcta."
        : "Keep preferred suppliers on hand so the purchasing plan already points to the right source.",
    supplierTip:
      language === "es"
        ? "Consejo · agrega un proveedor para que las líneas de compras se conecten a una fuente."
        : "Tip · add a supplier so purchasing lines link to a source.",
    namePlaceholder: language === "es" ? "Nombre" : "Name",
    customerEmailPlaceholder: language === "es" ? "Correo del cliente" : "Customer email",
    supplierEmailPlaceholder: language === "es" ? "Correo del proveedor" : "Supplier email",
    channelPlaceholder: language === "es" ? "Canal de ventas" : "Sales channel",
    categoryPlaceholder: language === "es" ? "Categoría" : "Category",
    saveCustomer: language === "es" ? "Guardar cliente" : "Save customer",
    saveSupplier: language === "es" ? "Guardar proveedor" : "Save supplier",
    searchCustomers: language === "es" ? "Buscar clientes" : "Search customers",
    searchSuppliers: language === "es" ? "Buscar proveedores" : "Search suppliers",
    edit: language === "es" ? "Editar" : "Edit",
    delete: language === "es" ? "Eliminar" : "Delete",
    noCustomers:
      language === "es"
        ? "Todavía no hay clientes. Agrega uno para empezar a crear pedidos."
        : "No customers yet. Add one to start creating orders.",
    noCustomerMatches:
      language === "es" ? "No hay clientes que coincidan con tu búsqueda." : "No customers match your search.",
    noSuppliers:
      language === "es"
        ? "Todavía no hay proveedores. Agrega uno para vincular materiales en compras."
        : "No suppliers yet. Add one to link materials in purchasing.",
    noSupplierMatches:
      language === "es" ? "No hay proveedores que coincidan con tu búsqueda." : "No suppliers match your search.",
    saveError: language === "es" ? "No se pudo guardar el contacto." : "Unable to save contact.",
    deleteError: language === "es" ? "No se pudo eliminar el contacto." : "Unable to delete contact.",
    restoreError: language === "es" ? "No se pudo restaurar el contacto." : "Unable to restore contact.",
    saved: (kind: "client" | "supplier") =>
      language === "es"
        ? `${kind === "client" ? "Cliente" : "Proveedor"} guardado.`
        : `${kind === "client" ? "Customer" : "Supplier"} saved.`,
    deleted: (kind: "client" | "supplier") =>
      language === "es"
        ? `${kind === "client" ? "Cliente" : "Proveedor"} eliminado. Deshacer disponible.`
        : `${kind === "client" ? "Customer" : "Supplier"} deleted. Undo available.`,
    restored: language === "es" ? "Contacto restaurado." : "Contact restored.",
    undoLastDelete: language === "es" ? "Deshacer último borrado" : "Undo last delete",
    required: language === "es" ? "Nombre, correo y categoría/canal son obligatorios." : "Name, email, and category/channel are required.",
    emailInvalid: language === "es" ? "Introduce una dirección de correo válida." : "Please enter a valid email address.",
    deleteConfirm: (name: string) => (language === "es" ? `¿Eliminar ${name}?` : `Delete ${name}?`)
  };
}

export function orderStudioCopy(language: Language) {
  return {
    eyebrow: language === "es" ? "Intake de pedidos" : "Order intake",
    title: language === "es" ? "Agrega el siguiente trabajo a la cola" : "Add the next job to the queue",
    description:
      language === "es"
        ? "Escribe el cliente, la fecha de entrega y una o más líneas de producto. Si el cliente no existe, se crea al guardar."
        : "Enter the customer, the due date, and one or more product lines. If the customer does not exist, it is created on save.",
    customerNamePlaceholder: language === "es" ? "Nombre del cliente" : "Customer name",
    customerHint:
      language === "es"
        ? "Escribe un nombre de cliente y se añadirá al guardar si todavía no existe."
        : "Type a customer name and it will be added on save if it does not already exist.",
    customerRequired:
      language === "es" ? "El nombre del cliente es obligatorio." : "Customer name is required.",
    noProducts:
      language === "es" ? "Todavía no hay productos. Agrega uno primero en Catálogo." : "No products yet. Add one in Catalog before saving orders.",
    orderNumberRequired: language === "es" ? "El número de pedido es obligatorio." : "Order number is required.",
    noOrderLines: language === "es" ? "Agrega al menos una línea de pedido." : "Add at least one order line.",
    quantityRequired: language === "es" ? "La cantidad debe ser mayor que cero." : "Quantity must be greater than zero.",
    saveOrder: language === "es" ? "Guardar pedido" : "Save order",
    updateOrder: language === "es" ? "Actualizar pedido" : "Update order",
    undoDelete: language === "es" ? "Deshacer último borrado" : "Undo last delete",
    blocked:
      language === "es"
        ? "Agrega al menos una línea de producto antes de enviar un pedido."
        : "Add at least one product line before submitting an order.",
    statusLabel: language === "es" ? "Estado" : "Status",
    openStatus: language === "es" ? "abierto" : "open",
    fulfilledStatus: language === "es" ? "cumplido" : "fulfilled",
    markFulfilled: language === "es" ? "Marcar como cumplido" : "Mark fulfilled",
    reopenOrder: language === "es" ? "Reabrir" : "Reopen",
    backlog: language === "es" ? "cola" : "backlog",
    backlogHint:
      language === "es"
        ? "Pedidos abiertos con fecha de entrega anterior a hoy."
        : "Open orders due before today.",
    addLine: language === "es" ? "Agregar línea" : "Add line",
    removeLine: language === "es" ? "Quitar línea" : "Remove line",
    lineProduct: language === "es" ? "Producto" : "Product",
    lineQuantity: language === "es" ? "Cantidad" : "Quantity",
    manageEyebrow: language === "es" ? "Administrar pedidos" : "Manage orders",
    queueLabel: (count: number) => (language === "es" ? `${count} en la cola` : `${count} on the queue`),
    searchPlaceholder: language === "es" ? "Buscar número, cliente, estado, fecha" : "Search number, customer, status, date",
    edit: language === "es" ? "Editar" : "Edit",
    delete: language === "es" ? "Eliminar" : "Delete",
    noOrders:
      language === "es" ? "Todavía no hay pedidos. Crea uno para generar demanda de compras." : "No orders yet. Create one to generate purchasing demand.",
    noOrderMatches:
      language === "es" ? "No hay pedidos que coincidan con tu búsqueda." : "No orders match your search.",
    noItemRestore:
      language === "es" ? "No se puede restaurar un pedido sin líneas." : "Cannot restore an order with no line items.",
    saveError: language === "es" ? "No se pudo guardar el pedido." : "Unable to save order.",
    deleteError: language === "es" ? "No se pudo eliminar el pedido." : "Unable to delete order.",
    restoreError: language === "es" ? "No se pudo restaurar el pedido." : "Unable to restore order.",
    saved: language === "es" ? "Pedido guardado." : "Order saved.",
    deleted: language === "es" ? "Pedido eliminado. Deshacer disponible." : "Order deleted. Undo available.",
    restored: language === "es" ? "Pedido restaurado." : "Order restored.",
    due: language === "es" ? "vence" : "due",
    open: language === "es" ? "abierto" : "open",
    fulfilled: language === "es" ? "cumplido" : "fulfilled"
  };
}

export function materialStockCopy(language: Language) {
  return {
    eyebrow: language === "es" ? "Inventario" : "Inventory",
    title: language === "es" ? "Rastrea el stock disponible" : "Track stock on hand",
    description:
      language === "es"
        ? "Agrega entradas, descuenta uso y mantén el plan de compras basado en lo que ya está en la estantería."
        : "Add receipts, subtract usage, and keep the purchasing plan grounded in what is already on the shelf.",
    materials: language === "es" ? "materiales" : "materials",
    stocked: language === "es" ? "abastecidos" : "stocked",
    searchPlaceholder: language === "es" ? "Buscar material o proveedor" : "Search material or supplier",
    unitCostPlaceholder: language === "es" ? "Costo unitario" : "Unit cost",
    saveCost: language === "es" ? "Guardar costo" : "Save cost",
    applyAdjustment: language === "es" ? "Aplicar ajuste" : "Apply adjustment",
    saving: language === "es" ? "Guardando…" : "Saving…",
    chooseMaterial: language === "es" ? "Elige primero un material." : "Choose a material first.",
    nonZeroAdjustment:
      language === "es" ? "Introduce un ajuste de stock distinto de cero." : "Enter a non-zero stock adjustment.",
    validCost: language === "es" ? "Introduce un costo unitario válido." : "Enter a valid unit cost.",
    updateStockError: language === "es" ? "No se pudo actualizar el stock del material." : "Unable to update material stock.",
    updateCostError: language === "es" ? "No se pudo actualizar el costo del material." : "Unable to update material cost.",
    stockUpdated: language === "es" ? "Stock del material actualizado." : "Material stock updated.",
    costUpdated: language === "es" ? "Costo del material actualizado." : "Material cost updated.",
    material: language === "es" ? "Material" : "Material",
    onHand: language === "es" ? "En mano" : "On hand",
    cost: language === "es" ? "Costo" : "Cost",
    supplier: language === "es" ? "Proveedor" : "Supplier",
    unit: language === "es" ? "Unidad" : "Unit",
    noMaterials: language === "es" ? "Ningún material coincide con esa búsqueda." : "No materials match that search.",
    selected: language === "es" ? "Seleccionado" : "Selected",
    per: language === "es" ? "por" : "per",
    unassigned: language === "es" ? "Sin asignar" : "Unassigned"
  };
}

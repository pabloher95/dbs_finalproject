# SmallBiz IQ Execution Plan

## Summary
Turn the existing 4-revision roadmap into a build-first execution sequence that starts with a complete Revision 1 vertical slice, then layers reliability, analytics, and polish without reopening core architecture decisions.

The execution step is: build Revision 1 end-to-end first, with deployable schema, seeded sample data, first-run import flow, product/formula management, order entry, and purchasing-plan generation. Do not start Revision 2+ work until this workflow is demoable.

## Implementation Changes
- Stack: Next.js App Router, Tailwind, Supabase Postgres, Clerk, Vercel.
- App shape:
  - Server-render data-heavy pages.
  - Use client components only for forms, tables, CSV upload, filters, and charts.
  - Keep business logic in domain services for import parsing, formula expansion, purchasing-plan generation, inventory math, and analytics.
- Localization:
  - Add a global language dropdown with `English` and `Español`.
  - Persist the language choice across navigation and refreshes, defaulting to the browser language when possible and falling back to English.
  - Move every user-facing string currently in the app into a shared translation catalog instead of hardcoding copy inline.
  - Translate all visible English text, including landing-page copy, auth screens, onboarding, workspace navigation, page headers, form labels, placeholders, helper text, buttons, empty states, tooltips, toasts, table headings, and seeded demo content.
- Revision 1 execution order:
  1. Initialize app shell, auth gate, design system primitives, and seeded demo business.
  2. Define schema for `business`, `products`, `materials`, `product_materials`, `clients`, `suppliers`, `orders`, `order_items`.
  3. Build constrained CSV import with explicit templates, preview, row validation, and row-level error reporting.
  4. Build CRUD flows for products/formulas, contacts, and orders.
  5. Build purchasing-plan generation from open orders and formula quantities.
  6. Add the global language dropdown and wire the full current UI copy set through the translation catalog.
  7. Ship a first-run dashboard flow: import data, review catalog, create order, generate purchasing plan.
- Revision 2:
  - Add material inventory-on-hand and stock adjustments.
  - Extend purchasing-plan logic to subtract on-hand stock.
  - Improve import duplicate handling, validation recovery, search/filtering, and responsive workspace layout.
- Revision 3:
  - Add cost, margin, revenue, and product/client trend services.
  - Surface descriptive insights before any forecasting.
- Revision 4:
  - Default differentiator is smart reorder alerts based on projected material depletion from open orders and recent sales.
  - Add import history, error logging, correction flows, and regression coverage.
- Frontend requirement:
  - Use the installed `frontend-design` skill as a delivery requirement for all user-facing pages.
  - Visual direction is `soft craft`: warm, handmade, slightly premium, with distinctive typography, textured backgrounds, and polished onboarding/dashboard hierarchy.
  - Avoid generic SaaS styling, default font stacks, and plain CRUD-table aesthetics even when the functionality is operational.

## Localization Inventory
The English source copy below needs Spanish equivalents in the first release of the language switcher.

### Landing
- `How it works` -> `Cómo funciona`
- `What it measures` -> `Qué mide`
- `Sign in` -> `Iniciar sesión`
- `Open studio` -> `Abrir estudio`
- `Inventory · Orders · Purchasing` -> `Inventario · Pedidos · Compras`
- `A practical operating studio for the hands-on business.` -> `Un estudio operativo práctico para el negocio de oficio.`
- `SmallBiz IQ keeps the catalog, the open orders, and the material plan in a single measured surface. Import a CSV, capture an order, get a supplier-ready buy list.` -> `SmallBiz IQ mantiene el catálogo, los pedidos abiertos y el plan de materiales en una sola superficie ordenada. Importa un CSV, registra un pedido y obtén una lista de compra lista para proveedores.`
- `Three steps.` -> `Tres pasos.`
- `How the data moves` -> `Cómo se mueven los datos`
- `What the studio measures` -> `Qué mide el estudio`
- `Four readings of the business.` -> `Cuatro lecturas del negocio.`
- `Days of stock` -> `Días de inventario`
- `How long your current materials cover the demand on your books.` -> `Cuánto tiempo cubren tus materiales actuales la demanda registrada.`
- `Supplier-ready` -> `Lista preparada para proveedores`
- `Open demand, expanded into a per-supplier purchase order with quantities.` -> `Demanda abierta, expandida en una orden de compra por proveedor con cantidades.`
- `Where weight sits` -> `Dónde recae el peso`
- `Which products and suppliers your business actually depends on.` -> `De qué productos y proveedores depende realmente tu negocio.`
- `What ships next` -> `Qué sale después`
- `Open orders sorted by due date, with material readiness flagged.` -> `Pedidos abiertos ordenados por fecha de entrega, con el estado de disponibilidad de materiales marcado.`
- `Studio` -> `Estudio`
- `How it works` -> `Cómo funciona`
- `What it measures` -> `Qué mide`
- `©` -> `©`

### Dashboard and home content
- `Today` -> `Hoy`
- `sourcing gap` -> `brecha de abastecimiento`
- `sourcing gaps` -> `brechas de abastecimiento`
- `Sourcing complete` -> `Abastecimiento completo`
- `The work, written down.` -> `El trabajo, por escrito.`
- `A clean intake lane, a readable catalog, and a measured path from open demand to a supplier-ready buy list. Begin where it makes sense — the rest follows.` -> `Un canal de ingesta claro, un catálogo legible y un camino medido desde la demanda abierta hasta una lista de compra lista para proveedores. Empieza donde tenga sentido; lo demás sigue.`
- `Products` -> `Productos`
- `Open orders` -> `Pedidos abiertos`
- `Units due` -> `Unidades pendientes`
- `Suppliers` -> `Proveedores`
- `Begin intake` -> `Iniciar ingesta`
- `Review orders` -> `Revisar pedidos`
- `Priority queue` -> `Cola prioritaria`
- `Today's active orders` -> `Pedidos activos de hoy`
- `open` -> `abierto`
- `units` -> `unidades`
- `due` -> `vence`
- `No open orders yet. Add one to populate the queue.` -> `Todavía no hay pedidos abiertos. Agrega uno para poblar la cola.`
- `Method` -> `Método`
- `Three moves` -> `Tres pasos`
- `Import` -> `Importar`
- `Upload products, contacts, or orders as CSV.` -> `Sube productos, contactos o pedidos como CSV.`
- `Define products` -> `Definir productos`
- `Write each product as a formula of materials, yields, and units.` -> `Escribe cada producto como una fórmula de materiales, rendimientos y unidades.`
- `Plan purchasing` -> `Planificar compras`
- `Expand open demand into a supplier-ready material list.` -> `Convierte la demanda abierta en una lista de materiales lista para proveedores.`

### Workspace shell and navigation
- `The Studio` -> `El estudio`
- `open order` -> `pedido abierto`
- `open orders` -> `pedidos abiertos`
- `Open demand` -> `Demanda abierta`
- `Due` -> `Vence`
- `No open orders yet.` -> `Todavía no hay pedidos abiertos.`
- `synced` -> `sincronizado`
- `Next move` -> `Siguiente paso`
- `Step` -> `Paso`
- `Studio` -> `Estudio`
- `Today's view of the work and the next move.` -> `Vista de hoy del trabajo y del siguiente paso.`
- `Intake` -> `Ingesta`
- `Versioned CSV templates with preview.` -> `Plantillas CSV versionadas con vista previa.`
- `Catalog` -> `Catálogo`
- `Products, yields, and material formulas.` -> `Productos, rendimientos y fórmulas de materiales.`
- `Contacts` -> `Contactos`
- `Customers and supplier sources.` -> `Clientes y fuentes de proveedores.`
- `Orders` -> `Pedidos`
- `Open demand and the production queue.` -> `Demanda abierta y la cola de producción.`
- `Purchasing` -> `Compras`
- `Material plan from open demand.` -> `Plan de materiales a partir de la demanda abierta.`

### Import
- `Data intake` -> `Ingesta de datos`
- `Bring in your products, formulas, and orders` -> `Importa tus productos, fórmulas y pedidos`
- `Use guided CSV templates to catch row-level issues and duplicate lines before anything is saved, then move from incoming demand to material planning in one place.` -> `Usa plantillas CSV guiadas para detectar problemas por fila y líneas duplicadas antes de guardar nada; luego pasa de la demanda entrante a la planificación de materiales en un solo lugar.`
- `Catalog items` -> `Elementos del catálogo`
- `Choose a template` -> `Elige una plantilla`
- `Use the versioned CSV format for products/formulas or for orders.` -> `Usa el formato CSV versionado para productos/fórmulas o para pedidos.`
- `Paste and preview` -> `Pega y previsualiza`
- `Check row-level validation before anything is committed.` -> `Revisa la validación por fila antes de confirmar cualquier cosa.`
- `Move to operations` -> `Pasar a operaciones`
- `Review products, orders, and purchasing once the catalog is in shape.` -> `Revisa productos, pedidos y compras cuando el catálogo esté listo.`
- `Once the intake looks right, review products first so the purchasing plan has a clean source of truth.` -> `Una vez que la ingesta se vea bien, revisa primero los productos para que el plan de compras tenga una fuente de verdad limpia.`
- `Versioned templates` -> `Plantillas versionadas`
- `Validate before you commit` -> `Valida antes de confirmar`
- `Pick a template, drop a CSV or paste rows, and see exactly what will land in the workspace. Duplicate lines are reported before anything is saved.` -> `Elige una plantilla, suelta un CSV o pega filas y mira exactamente qué entrará en el espacio de trabajo. Las líneas duplicadas se informan antes de guardar nada.`
- `Products v1` -> `Productos v1`
- `Orders v1` -> `Pedidos v1`
- `Download template` -> `Descargar plantilla`
- `Drop a CSV or click to upload` -> `Suelta un CSV o haz clic para subirlo`
- `Drafts are kept for this browser session` -> `Los borradores se guardan en esta sesión del navegador`
- `Import to workspace` -> `Importar al espacio de trabajo`
- `row previewed` -> `fila previsualizada`
- `rows previewed` -> `filas previsualizadas`
- `Preview` -> `Vista previa`
- `Row-level validation report` -> `Informe de validación por fila`
- `See what is ready to load, what was skipped, and what needs correction before committing.` -> `Ve qué está listo para cargar, qué se omitió y qué necesita corrección antes de confirmar.`
- `Recovery` -> `Recuperación`
- `Pull only the rows with errors back into the editor and fix them in place.` -> `Recupera solo las filas con errores en el editor y corrígelas allí mismo.`
- `No row-level errors are currently blocking recovery.` -> `Actualmente no hay errores por fila que bloqueen la recuperación.`
- `Load error rows` -> `Cargar filas con error`
- `Created` -> `Creadas`
- `Skipped` -> `Omitidas`
- `Errors` -> `Errores`
- `Row` -> `Fila`
- `State` -> `Estado`
- `Detail` -> `Detalle`
- `Ready` -> `Listo`
- `Error` -> `Error`
- `Paste or drop a CSV above to preview row-level validation.` -> `Pega o suelta un CSV arriba para previsualizar la validación por fila.`

### Products
- `Build products your team can plan around` -> `Crea productos en torno a los que tu equipo pueda planificar.`
- `Add the product, define its yield, and capture the material formula that drives production and purchasing.` -> `Agrega el producto, define su rendimiento y registra la fórmula de materiales que impulsa la producción y las compras.`
- `Products` -> `Productos`
- `Categories` -> `Categorías`
- `Primary action` -> `Acción principal`
- `Add item` -> `Agregar elemento`
- `Capture product details` -> `Registra los detalles del producto`
- `Enter the name, SKU, category, and yield so the item is ready for planning.` -> `Ingresa el nombre, SKU, categoría y rendimiento para que el artículo quede listo para planificar.`
- `Tip · Add a customer next so this product can be used in orders.` -> `Consejo · agrega un cliente después para que este producto pueda usarse en pedidos.`
- `Formula` -> `Fórmula`
- `One material per line. Format: name:unit:quantity.` -> `Un material por línea. Formato: nombre:unidad:cantidad.`
- `Update item` -> `Actualizar elemento`
- `Save item` -> `Guardar elemento`
- `Reset` -> `Restablecer`
- `Undo last delete` -> `Deshacer última eliminación`
- `Catalog` -> `Catálogo`
- `{n} items` -> `{n} elementos`
- `Edit yields, replace placeholders, and keep formulas aligned with how items are actually made.` -> `Edita los rendimientos, reemplaza los marcadores y mantén las fórmulas alineadas con cómo se hacen realmente los artículos.`
- `Search name, SKU, category` -> `Buscar nombre, SKU, categoría`
- `No products yet. Save your first item to build formulas and unlock purchasing planning.` -> `Todavía no hay productos. Guarda tu primer elemento para construir fórmulas y desbloquear la planificación de compras.`
- `No products match that search yet.` -> `Todavía no hay productos que coincidan con esa búsqueda.`
- `Product details` -> `Detalles del producto`
- `Add or update an item` -> `Agrega o actualiza un elemento`
- `Capture name, SKU, unit, and batch yield so the item can be planned and priced consistently.` -> `Registra nombre, SKU, unidad y rendimiento por lote para que el elemento pueda planificarse y fijarse de forma coherente.`
- `No customers yet. Add one to start creating orders.` -> `Todavía no hay clientes. Agrega uno para empezar a crear pedidos.`
- `Edit` -> `Editar`
- `Delete` -> `Eliminar`
- `Enter both SKU and product name.` -> `Ingresa tanto el SKU como el nombre del producto.`
- `Yield quantity must be greater than zero.` -> `La cantidad de rendimiento debe ser mayor que cero.`
- `Add at least one valid formula line in name:unit:quantity format.` -> `Agrega al menos una línea de fórmula válida en formato nombre:unidad:cantidad.`
- `Unable to save product.` -> `No se pudo guardar el producto.`
- `Product saved.` -> `Producto guardado.`
- `Delete {name}? This can affect related orders.` -> `¿Eliminar {name}? Esto puede afectar pedidos relacionados.`
- `Unable to delete product.` -> `No se pudo eliminar el producto.`
- `{name} deleted. Undo available.` -> `{name} eliminado. Deshacer disponible.`
- `Unable to restore product.` -> `No se pudo restaurar el producto.`
- `Product restored.` -> `Producto restaurado.`

### Contacts
- `Keep customers and suppliers close to the work` -> `Mantén a clientes y proveedores cerca del trabajo.`
- `Add the people and companies your team depends on so order intake and purchasing stay fast and consistent.` -> `Agrega las personas y empresas de las que depende tu equipo para que la toma de pedidos y las compras sigan siendo rápidas y consistentes.`
- `Customers` -> `Clientes`
- `Suppliers` -> `Proveedores`
- `Primary action` -> `Acción principal`
- `Save records` -> `Guardar registros`
- `Customer details` -> `Detalles del cliente`
- `Add a customer` -> `Agregar un cliente`
- `Capture customer details so new orders can be assigned without retyping.` -> `Registra los detalles del cliente para poder asignar nuevos pedidos sin volver a escribirlos.`
- `Tip · add a supplier so purchasing lines link to a source.` -> `Consejo · agrega un proveedor para que las líneas de compra apunten a una fuente.`
- `Customer name` -> `Nombre del cliente`
- `Customer email` -> `Correo electrónico del cliente`
- `Sales channel` -> `Canal de ventas`
- `Save customer` -> `Guardar cliente`
- `Search customers` -> `Buscar clientes`
- `No customers yet. Add one to start creating orders.` -> `Todavía no hay clientes. Agrega uno para empezar a crear pedidos.`
- `No customers match your search.` -> `Ningún cliente coincide con tu búsqueda.`
- `Supplier details` -> `Detalles del proveedor`
- `Add a supplier` -> `Agregar un proveedor`
- `Keep preferred suppliers on hand so the purchasing plan already points to the right source.` -> `Mantén proveedores preferidos a mano para que el plan de compras ya apunte a la fuente correcta.`
- `Supplier name` -> `Nombre del proveedor`
- `Supplier email` -> `Correo electrónico del proveedor`
- `Category` -> `Categoría`
- `Save supplier` -> `Guardar proveedor`
- `Search suppliers` -> `Buscar proveedores`
- `No suppliers yet. Add one to link materials in purchasing.` -> `Todavía no hay proveedores. Agrega uno para vincular materiales en las compras.`
- `No suppliers match your search.` -> `Ningún proveedor coincide con tu búsqueda.`
- `Name, email, and category/channel are required.` -> `Se requieren nombre, correo electrónico y categoría/canal.`
- `Please enter a valid email address.` -> `Ingresa una dirección de correo electrónico válida.`
- `Unable to save contact.` -> `No se pudo guardar el contacto.`
- `Customer saved.` -> `Cliente guardado.`
- `Supplier saved.` -> `Proveedor guardado.`
- `Customer deleted. Undo available.` -> `Cliente eliminado. Deshacer disponible.`
- `Supplier deleted. Undo available.` -> `Proveedor eliminado. Deshacer disponible.`
- `Unable to delete contact.` -> `No se pudo eliminar el contacto.`
- `Unable to restore contact.` -> `No se pudo restaurar el contacto.`
- `Contact restored.` -> `Contacto restaurado.`

### Orders
- `Capture demand and keep the schedule moving` -> `Captura la demanda y mantén el cronograma en movimiento.`
- `Record what each customer needs, when it is due, and which products are driving the next production run.` -> `Registra lo que necesita cada cliente, cuándo vence y qué productos impulsan la siguiente corrida de producción.`
- `Open orders` -> `Pedidos abiertos`
- `Customers` -> `Clientes`
- `Products` -> `Productos`
- `Add the next job to the queue` -> `Agrega el siguiente trabajo a la cola.`
- `Pick the customer, the product, and a due date. The plan ahead reacts the moment you save.` -> `Elige el cliente, el producto y una fecha de entrega. El plan anticipado reacciona en cuanto guardas.`
- `No customers yet. Add one in Contacts first.` -> `Todavía no hay clientes. Agrega uno en Contactos primero.`
- `No products yet. Add one in Catalog before saving orders.` -> `Todavía no hay productos. Agrega uno en Catálogo antes de guardar pedidos.`
- `Order number is required.` -> `El número de pedido es obligatorio.`
- `Quantity must be greater than zero.` -> `La cantidad debe ser mayor que cero.`
- `Unable to save order.` -> `No se pudo guardar el pedido.`
- `Order saved.` -> `Pedido guardado.`
- `Delete {orderNumber}?` -> `¿Eliminar {orderNumber}?`
- `Unable to delete order.` -> `No se pudo eliminar el pedido.`
- `Order deleted. Undo available.` -> `Pedido eliminado. Deshacer disponible.`
- `Cannot restore an order with no line items.` -> `No se puede restaurar un pedido sin líneas.`
- `Unable to restore order.` -> `No se pudo restaurar el pedido.`
- `Order restored.` -> `Pedido restaurado.`
- `Order intake` -> `Ingesta de pedidos`
- `Search number, customer, status, date` -> `Buscar número, cliente, estado, fecha`
- `Update order` -> `Actualizar pedido`
- `Save order` -> `Guardar pedido`
- `Undo last delete` -> `Deshacer última eliminación`
- `Add a customer and a product before submitting an order.` -> `Agrega un cliente y un producto antes de enviar un pedido.`
- `Manage orders` -> `Administrar pedidos`
- `on the queue` -> `en la cola`
- `No orders yet. Create one to generate purchasing demand.` -> `Todavía no hay pedidos. Crea uno para generar demanda de compra.`
- `No orders match your search.` -> `Ningún pedido coincide con tu búsqueda.`
- `draft` -> `borrador`
- `open` -> `abierto`
- `fulfilled` -> `completado`

### Purchasing and stock
- `Turn open demand into a purchasing run` -> `Convierte la demanda abierta en una ronda de compras.`
- `Review the total quantity needed for each material, subtract what is already on hand, and prepare your next purchasing run.` -> `Revisa la cantidad total necesaria de cada material, resta lo que ya tienes en inventario y prepara tu próxima ronda de compras.`
- `Materials tracked` -> `Materiales registrados`
- `Stocked materials` -> `Materiales en stock`
- `Today's run` -> `La ronda de hoy`
- `material line` -> `línea de material`
- `material lines` -> `líneas de materiales`
- `ready to source` -> `listas para abastecerse`
- `Roll-up of every open order, expanded by formula, grouped by material and supplier.` -> `Resumen de cada pedido abierto, expandido por fórmula, agrupado por material y proveedor.`
- `required units` -> `unidades requeridas`
- `sourced` -> `abastecidas`
- `stocked materials` -> `materiales con stock`
- `No open orders yet. Add an order in Orders to generate required material quantities.` -> `Todavía no hay pedidos abiertos. Agrega un pedido en Pedidos para generar las cantidades de materiales requeridas.`
- `Catalog is empty. Add products with formulas before generating a purchasing run.` -> `El catálogo está vacío. Agrega productos con fórmulas antes de generar una ronda de compras.`
- `{n} material line(s) still need buying after stock is counted.` -> `Aún faltan comprar {n} línea(s) de materiales después de contar el stock.`
- `Material` -> `Material`
- `On hand` -> `En inventario`
- `Required` -> `Requerido`
- `Net to buy` -> `Neto a comprar`
- `Supplier` -> `Proveedor`
- `State` -> `Estado`
- `Unassigned` -> `Sin asignar`
- `Purchasing plan is empty. Import or create products and open orders to populate this view.` -> `El plan de compras está vacío. Importa o crea productos y pedidos abiertos para poblar esta vista.`
- `Inventory` -> `Inventario`
- `Track stock on hand` -> `Controla el stock disponible`
- `Add receipts, subtract usage, and keep the purchasing plan grounded in what is already on the shelf.` -> `Agrega entradas, resta consumo y mantiene el plan de compras anclado en lo que ya está en la estantería.`
- `{n} materials` -> `{n} materiales`
- `{n} stocked` -> `{n} en stock`
- `Search material or supplier` -> `Buscar material o proveedor`
- `Choose a material first.` -> `Elige primero un material.`
- `Enter a non-zero stock adjustment.` -> `Ingresa un ajuste de inventario distinto de cero.`
- `Unable to update material stock.` -> `No se pudo actualizar el stock del material.`
- `Material stock updated.` -> `Stock del material actualizado.`
- `Apply adjustment` -> `Aplicar ajuste`
- `Unit` -> `Unidad`
- `No materials match that search.` -> `Ningún material coincide con esa búsqueda.`
- `Selected {name} at {qty} {unit} on hand.` -> `Seleccionado {name} con {qty} {unit} en inventario.`

### Auth and onboarding
- `Sign in` -> `Iniciar sesión`
- `Access your studio and return to the workspace.` -> `Accede a tu estudio y vuelve al espacio de trabajo.`
- `New here?` -> `¿Eres nuevo?`
- `Create an account` -> `Crear una cuenta`
- `Create account` -> `Crear cuenta`
- `Set up your studio and start tracking inventory, orders, and purchasing.` -> `Configura tu estudio y empieza a controlar inventario, pedidos y compras.`
- `Already have an account?` -> `¿Ya tienes cuenta?`
- `First step` -> `Primer paso`
- `Name your studio` -> `Nombra tu estudio`
- `This name appears in the workspace header and in your dashboard reading view.` -> `Este nombre aparece en el encabezado del espacio de trabajo y en la vista de lectura del panel.`
- `Company name` -> `Nombre de la empresa`
- `Enter a company name.` -> `Ingresa un nombre de empresa.`
- `Unable to save the company name.` -> `No se pudo guardar el nombre de la empresa.`
- `Saving...` -> `Guardando...`
- `Save name` -> `Guardar nombre`

### Shared UI, defaults, and demo content
- `Versioned CSV templates with preview.` -> `Plantillas CSV versionadas con vista previa.`
- `Ready` -> `Listo`
- `Skipped` -> `Omitido`
- `Error` -> `Error`
- `No customers yet.` -> `Todavía no hay clientes.`
- `No suppliers yet.` -> `Todavía no hay proveedores.`
- `No orders captured yet.` -> `Todavía no hay pedidos registrados.`
- `No open demand yet.` -> `Todavía no hay demanda abierta.`
- `Drafts are kept for this browser session` -> `Los borradores se guardan en esta sesión del navegador`
- `Loaded {file}` -> `{file} cargado`
- `Importing rows...` -> `Importando filas...`
- `Imported {n} rows.` -> `Se importaron {n} filas.`
- `Unable to import data.` -> `No se pudieron importar los datos.`
- `Enter a company name.` -> `Ingresa un nombre de empresa.`
- `Your Business` -> `Tu negocio`
- `Northline Studio` -> `Estudio Northline`
- `Products v1` -> `Productos v1`
- `Orders v1` -> `Pedidos v1`
- `Base Material`, `Finishing Material` -> `Material base`, `Material de acabado`
- `Import target must be products or orders.` -> `El destino de importación debe ser productos o pedidos.`
- `CSV payload cannot be empty.` -> `La carga CSV no puede estar vacía.`

### Seeded demo data
- `Your Business` -> `Tu negocio`
- `Northline Materials` -> `Materiales Northline`
- `Foundry Supply Co.` -> `Foundry Supply Co.`
- `Atlas Packaging` -> `Atlas Packaging`
- `Soy Wax` -> `Cera de soja`
- `Fragrance Oil` -> `Aceite aromático`
- `Label Stock` -> `Stock de etiquetas`
- `Gift Box Insert` -> `Inserto de caja de regalo`
- `Cotton Wick` -> `Mecha de algodón`
- `Signature Candle` -> `Vela insignia`
- `Gift Set` -> `Set de regalo`
- `Common Goods Market` -> `Mercado de Bienes Comunes`
- `North Studio Events` -> `Eventos North Studio`
- `Add your own localized demo names and seeded rows to keep the first-run experience consistent in Spanish.` -> `Agrega tus propios nombres de demostración y filas sembradas localizados para mantener la experiencia inicial coherente en español.`

## Public Interfaces
- CSV import contracts must be explicit and versioned in-app for products/formulas and orders.
- Import result shape must include created records, skipped rows, and row-level errors.
- Purchasing-plan output must include material, required quantity, on-hand quantity, net-to-buy quantity, unit, and supplier link when available.
- Analytics outputs must support date-range revenue, bundle/order margin, and material/product usage summaries.
- Auth remains one owner to one business in app behavior, while schema keeps a path open for future multi-business support.

## Test Plan
- Unit tests: formula expansion, purchasing-plan aggregation, inventory subtraction, cost calculation, margin calculation, reorder projection.
- Integration tests: CSV parsing, validation failures, duplicate handling, database writes, purchasing-plan service outputs.
- End-to-end tests:
  - first-run import
  - create/edit formula-backed product
  - create order
  - generate purchasing plan
  - review analytics
  - trigger reorder alert in seeded scenario
- Manual checks each revision: empty states, broken imports, invalid forms, mobile layout, and visual consistency with the `soft craft` direction.

## Assumptions and Defaults
- Single business and single primary owner for the whole project.
- Revision 1 is the implementation starting point and must be fully demoable before Revision 2 begins.
- Clerk stays in scope, but if time pressure appears, auth implementation stays minimal and must not block the core workflow.
- Forecasting is out of scope unless Revisions 1-3 are stable.
- Revision 4 defaults to reorder alerts rather than customer intake forms.

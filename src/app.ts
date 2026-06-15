// ✅ IMPORTACIÓN CORRECTA DE LA BASE DE DATOS (COMO ME PEDISTE)
import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/database-memory'// <--- AQUÍ ESTÁ LO QUE PEDISTE
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const PORT = process.env.PORT ?? 3008
const CONTACT_NUMBER = '527721603207'
const CONTACT_LINK = `https://wa.me/${CONTACT_NUMBER}`
const LIST_BUTTON_TEXT = 'Ver opciones'

// 🔹 MENSAJES PRINCIPALES
const MAIN_MENU_MESSAGE = `
✨ Bienvenido a Rancho El Bienamado ✨

Productos 100% naturales elaborados con respeto por la tierra y nuestros animales.

🐑 Borregos de libre pastoreo
🌱 Producción artesanal
🍯 Ingredientes naturales

Selecciona una opción:

1️⃣ Kombucha
2️⃣ Kéfir
3️⃣ Vinagres Artesanales
4️⃣ Miel Natural
5️⃣ Café Artesanal
6️⃣ Sábila
7️⃣ Carne de Cordero Premium
8️⃣ Ubicación
9️⃣ Hablar con Nosotros
`

const MAIN_MENU_BUTTONS = [
    { body: '1️⃣ Kombucha' },
    { body: '2️⃣ Kéfir' },
    { body: '3️⃣ Vinagres Artesanales' },
    { body: '4️⃣ Miel Natural' },
    { body: '5️⃣ Café Artesanal' },
    { body: '6️⃣ Sábila' },
    { body: '7️⃣ Carne de Cordero Premium' },
    { body: '8️⃣ Ubicación' },
    { body: '9️⃣ Hablar con Nosotros' },
]

const ACTION_MENU_MESSAGE = `
¿Qué te gustaría hacer?

1️⃣ Hacer un pedido
2️⃣ Resolver una duda
3️⃣ Volver al menú principal
`

const ACTION_MENU_BUTTONS = [
    { body: '1️⃣ Hacer pedido' },
    { body: '2️⃣ Tengo una duda' },
    { body: '3️⃣ Menú principal' },
]

const handleActionMenu = async (ctx, { gotoFlow, flowDynamic }) => {
    const text = normalizeText(ctx.body)
    if (text.startsWith('1') || text.includes('pedido')) return gotoFlow(pedidoFlow)
    if (text.startsWith('2') || text.includes('duda')) return gotoFlow(dudaFlow)
    if (text.startsWith('3') || text.includes('menú')) return gotoFlow(welcomeFlow)
    await flowDynamic('Escribe 1, 2 o 3 para continuar.')
}

const FAQ_TOPICS = [
    { key: '1', label: 'Beneficios' },
    { key: '2', label: 'Precio' },
    { key: '3', label: 'Presentación / Tamaño' },
    { key: '4', label: 'Ingredientes / Proceso' },
    { key: '5', label: 'Consumo / Conservación' },
]

// 🔹 UTILIDADES
const normalizeText = (value: string | undefined | null) => (value ?? '').toLowerCase().trim()
const isYes = (text: string) => text === 'si' || text === 'sí' || text.startsWith('s')
const isNo = (text: string) => text === 'no' || text.startsWith('n')

// 🔹 CATÁLOGOS DE PRODUCTOS
const PRODUCT_OPTIONS = [
    { label: 'Kombucha', keywords: ['kombucha', '1'] },
    { label: 'Kéfir', keywords: ['kefir', 'kéfir', '2'] },
    { label: 'Vinagres Artesanales', keywords: ['vinagre', 'vinagres', '3'] },
    { label: 'Miel Natural', keywords: ['miel', '4'] },
    { label: 'Café Artesanal', keywords: ['cafe', 'café', '5'] },
    { label: 'Sábila', keywords: ['sabila', 'sábila', '6'] },
    { label: 'Carne de Cordero Premium', keywords: ['carne', 'cordero', '7'] },
]

const ORDER_ITEMS = [
    { label: 'Kombucha 250 ml', keywords: ['kombucha', '1'] },
    { label: 'Kéfir Bebible 250 ml', keywords: ['kefir bebible', 'kéfir bebible', '2'] },
    { label: 'Kéfir Untable 250 g', keywords: ['kefir untable', 'kéfir untable', '3'] },
    { label: 'Vinagre de Manzana 500 ml', keywords: ['vinagre manzana', 'manzana', '4'] },
    { label: 'Vinagre de Pera 500 ml', keywords: ['vinagre pera', 'pera', '5'] },
    { label: 'Vinagre de Albahaca 500 ml', keywords: ['vinagre albahaca', 'albahaca', '6'] },
    { label: 'Miel Natural 350 g', keywords: ['miel', '7'] },
    { label: 'Café Artesanal', keywords: ['cafe', 'café', '8'] },
    { label: 'Carne - Rack Francés (kg)', keywords: ['rack frances', 'rack francés', '9'] },
    { label: 'Carne - Rack Chops (kg)', keywords: ['rack chops', '10'] },
    { label: 'Carne - T-Bone (kg)', keywords: ['t-bone', 'tbone', '11'] },
    { label: 'Carne - Osobuco (kg)', keywords: ['osobuco', '12'] },
    { label: 'Carne - Medallón de Pierna (kg)', keywords: ['medallon', 'medallón', '13'] },
    { label: 'Carne - Pierna en Cubos (kg)', keywords: ['pierna en cubos', 'pierna cubos', '14'] },
    { label: 'Carne - Hamburguesa de Cordero (500 g)', keywords: ['hamburguesa', '15'] },
    { label: 'Carne - Chorizo de Cordero (kg)', keywords: ['chorizo', '16'] },
    { label: 'Carne - Gaoneras (500 g)', keywords: ['gaoneras', 'gaonera', '17'] },
]

const ORDER_MENU_MESSAGE = `
📋 Lista de productos disponibles:

1️⃣ Kombucha 250 ml
2️⃣ Kéfir Bebible 250 ml
3️⃣ Kéfir Untable 250 g
4️⃣ Vinagre de Manzana 500 ml
5️⃣ Vinagre de Pera 500 ml
6️⃣ Vinagre de Albahaca 500 ml
7️⃣ Miel Natural 350 g
8️⃣ Café Artesanal
9️⃣ Carne - Rack Francés (kg)
1️⃣0️⃣ Carne - Rack Chops (kg)
1️⃣1️⃣ Carne - T-Bone (kg)
1️⃣2️⃣ Carne - Osobuco (kg)
1️⃣3️⃣ Carne - Medallón de Pierna (kg)
1️⃣4️⃣ Carne - Pierna en Cubos (kg)
1️⃣5️⃣ Carne - Hamburguesa (500 g)
1️⃣6️⃣ Carne - Chorizo (kg)
1️⃣7️⃣ Carne - Gaoneras (500 g)
1️⃣8️⃣ ✅ Terminar pedido

Escribe el número o nombre del producto que deseas agregar.
`

const MAIN_MENU_LIST_SECTIONS = [
    {
        title: 'Productos',
        rows: [
            { title: '1️⃣ Kombucha', rowId: 'menu_1' },
            { title: '2️⃣ Kéfir', rowId: 'menu_2' },
            { title: '3️⃣ Vinagres Artesanales', rowId: 'menu_3' },
            { title: '4️⃣ Miel Natural', rowId: 'menu_4' },
            { title: '5️⃣ Café Artesanal', rowId: 'menu_5' },
            { title: '6️⃣ Sábila', rowId: 'menu_6' },
            { title: '7️⃣ Carne de Cordero Premium', rowId: 'menu_7' },
        ],
    },
    {
        title: 'Más opciones',
        rows: [
            { title: '8️⃣ Ubicación', rowId: 'menu_8' },
            { title: '9️⃣ Hablar con nosotros', rowId: 'menu_9' },
        ],
    },
]

const ORDER_MENU_LIST_SECTIONS = [
    {
        title: 'Elige productos',
        rows: ORDER_ITEMS.map((item, index) => ({
            title: `${index + 1}️⃣ ${item.label}`,
            rowId: `order_${index + 1}`,
        })),
    },
    {
        title: 'Acciones',
        rows: [
            { title: '18️⃣ ✅ Terminar pedido', rowId: 'order_finish' },
            { title: '🏠 Menú principal', rowId: 'order_menu' },
            { title: '💬 Hablar con nosotros', rowId: 'order_contact' },
        ],
    },
]

const sendListMessage = async (provider: Provider, to: string, listPayload: Record<string, any>) => {
    const vendor = (provider as any)?.vendor
    if (!vendor?.sendMessage) return false
    await vendor.sendMessage(to, listPayload)
    return true
}

const buildMainMenuList = () => ({
    text: 'Selecciona una opción del menú:',
    footer: 'Rancho El Bienamado - Productos Artesanales',
    title: '🏠 MENÚ PRINCIPAL',
    buttonText: LIST_BUTTON_TEXT,
    sections: MAIN_MENU_LIST_SECTIONS,
})

const buildOrderMenuList = () => ({
    text: 'Agrega productos a tu carrito:',
    footer: 'Rancho El Bienamado',
    title: '🛒 REALIZAR PEDIDO',
    buttonText: LIST_BUTTON_TEXT,
    sections: ORDER_MENU_LIST_SECTIONS,
})

const parseProduct = (text: string) => {
    const normalized = normalizeText(text)
    const match = PRODUCT_OPTIONS.find((option) => option.keywords.some((keyword) => normalized.includes(keyword)))
    return match?.label ?? null
}

const parseOrderProduct = (text: string) => {
    const normalized = normalizeText(text)
    const numberMatch = normalized.match(/\d+/)
    
    if (numberMatch) {
        const index = Number(numberMatch[0])
        if (Number.isFinite(index) && index >= 1 && index <= ORDER_ITEMS.length) {
            return ORDER_ITEMS[index - 1].label
        }
    }

    const match = ORDER_ITEMS.find((option) => option.keywords.some((keyword) => normalized.includes(keyword)))
    return match?.label ?? null
}

const parseQuantity = (text: string) => {
    const match = text.match(/\d+/)
    if (!match) return null
    const value = Number(match[0])
    return Number.isFinite(value) && value > 0 ? value : null
}

const buildFaqMenuMessage = (title: string) => {
    const lines = FAQ_TOPICS.map((topic) => `${topic.key}️⃣ ${topic.label}`)
    return `
❓ DUDAS SOBRE ${title.toUpperCase()}

Elige el tema sobre el que quieres información:

${lines.join('\n')}

🏠 Volver al menú principal
🛒 Hacer un pedido
`
}

const buildFaqButtons = () => [
    { body: '1️⃣ Beneficios' },
    { body: '2️⃣ Precio' },
    { body: '3️⃣ Presentación' },
    { body: '4️⃣ Ingredientes' },
    { body: '5️⃣ Conservación' },
    { body: '🛒 Hacer pedido' },
    { body: '🏠 Menú principal' },
]

const handleFaqMenu = async (ctx, { gotoFlow, flowDynamic, state }) => {
    const text = normalizeText(ctx.body)
    const answers = state.get('faqAnswers') || {}

    if (text.includes('pedido') || text.includes('comprar')) return gotoFlow(pedidoFlow)
    if (text.includes('menu') || text.includes('menú') || text.includes('inicio')) return gotoFlow(welcomeFlow)

    if (text.startsWith('1') || text.includes('beneficio')) {
        await flowDynamic(answers.beneficios ?? 'Información no disponible por el momento.')
        return gotoFlow(state.get('faqReturnFlow'))
    }
    if (text.startsWith('2') || text.includes('precio')) {
        await flowDynamic(answers.precio ?? 'Información no disponible por el momento.')
        return gotoFlow(state.get('faqReturnFlow'))
    }
    if (text.startsWith('3') || text.includes('presentacion') || text.includes('presentación')) {
        await flowDynamic(answers.presentacion ?? 'Información no disponible por el momento.')
        return gotoFlow(state.get('faqReturnFlow'))
    }
    if (text.startsWith('4') || text.includes('ingrediente') || text.includes('proceso')) {
        await flowDynamic(answers.ingredientes ?? 'Información no disponible por el momento.')
        return gotoFlow(state.get('faqReturnFlow'))
    }
    if (text.startsWith('5') || text.includes('consumo') || text.includes('conservacion') || text.includes('conservación')) {
        await flowDynamic(answers.consumo ?? 'Información no disponible por el momento.')
        return gotoFlow(state.get('faqReturnFlow'))
    }

    await flowDynamic('⚠️ Opción no válida. Escribe un número del 1 al 5 o elige una de las opciones del menú.')
}

const kombuchaFaqFlow = addKeyword<Provider, Database>(['duda kombucha', 'kombucha duda'])
    .addAnswer(buildFaqMenuMessage('KOMBUCHA'), { capture: true, buttons: buildFaqButtons() }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: kombuchaFaqFlow,
            faqAnswers: {
                beneficios: 'Ayuda a la digestión, aporta probióticos naturales y antioxidantes. Es una bebida refrescante y saludable.',
                precio: '$45.00 MXN (250ml) | $75.00 MXN (500ml)',
                presentacion: 'Botellas de 250 ml y 500 ml.',
                ingredientes: 'Té verde o negro, azúcar de caña y cultivo vivo de kombucha. Proceso 100% artesanal.',
                consumo: 'Tomar frío, agitar suavemente antes de abrir. Conservar siempre en refrigeración. Consumir preferentemente en 5-7 días.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const kefirFaqFlow = addKeyword<Provider, Database>(['duda kefir', 'duda kéfir', 'kefir duda'])
    .addAnswer(buildFaqMenuMessage('KÉFIR'), { capture: true, buttons: buildFaqButtons() }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: kefirFaqFlow,
            faqAnswers: {
                beneficios: 'Excelente para la salud intestinal, refuerza el sistema inmune y mejora la digestión. Rico en probióticos.',
                precio: '$40.00 MXN Bebible | $45.00 MXN Untable',
                presentacion: 'Bebible (250 ml) y Untable tipo queso crema (250 g).',
                ingredientes: 'Leche de vaca y granos de kéfir. Fermentación controlada sin aditivos.',
                consumo: 'Consumir frío. Ideal para desayunos, con fruta o en pan. Mantener refrigerado.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const vinagreFaqFlow = addKeyword<Provider, Database>(['duda vinagre', 'duda vinagres', 'vinagre duda'])
    .addAnswer(buildFaqMenuMessage('VINAGRES ARTESANALES'), { capture: true, buttons: buildFaqButtons() }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: vinagreFaqFlow,
            faqAnswers: {
                beneficios: 'Ayuda a la digestión, regula el azúcar en sangre y es excelente para aderezos naturales.',
                precio: '$55.00 MXN cada uno (500ml)',
                presentacion: 'Botella de vidrio de 500 ml. Sabores: Manzana, Pera y Albahaca.',
                ingredientes: 'Fruta 100% natural y proceso de fermentación lenta y natural.',
                consumo: 'Para ensaladas, carnes o diluido en agua. Conservar en lugar fresco y seco.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const mielFaqFlow = addKeyword<Provider, Database>(['duda miel', 'miel duda'])
    .addAnswer(buildFaqMenuMessage('MIEL NATURAL'), { capture: true, buttons: buildFaqButtons() }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: mielFaqFlow,
            faqAnswers: {
                beneficios: 'Endulzante natural, energía rápida, ayuda a la garganta y sistema respiratorio.',
                precio: '$85.00 MXN (350g)',
                presentacion: 'Frasco de vidrio de 350 gramos.',
                ingredientes: 'Miel 100% pura de abeja, sin mezclas ni aditivos.',
                consumo: 'Directa, en tés, leche o postres. No requiere refrigeración.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const cafeFaqFlow = addKeyword<Provider, Database>(['duda cafe', 'duda café', 'cafe duda'])
    .addAnswer(buildFaqMenuMessage('CAFÉ ARTESANAL'), { capture: true, buttons: buildFaqButtons() }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: cafeFaqFlow,
            faqAnswers: {
                beneficios: 'Sabor intenso, aroma único y energía natural. Cultivo responsable.',
                precio: 'Consultar disponibilidad y precios.',
                presentacion: 'Molido o en grano (presentación estándar 500g).',
                ingredientes: 'Café seleccionado y tostado artesanalmente.',
                consumo: 'Preparar a gusto. Conservar en frasco hermético.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const sabilaFaqFlow = addKeyword<Provider, Database>(['duda sabila', 'duda sábila', 'sabila duda'])
    .addAnswer(buildFaqMenuMessage('SÁBILA'), { capture: true, buttons: buildFaqButtons() }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: sabilaFaqFlow,
            faqAnswers: {
                beneficios: 'Cuidado de la piel, digestivo, hidratante y regenerador celular.',
                precio: 'Varía según tamaño y presentación.',
                presentacion: 'Planta en maceta o esqueje.',
                ingredientes: 'Planta natural de sábila.',
                consumo: 'Uso externo o interno según indicación. Requiere cuidados de luz y riego.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const carneFaqFlow = addKeyword<Provider, Database>(['duda carne', 'duda cordero', 'carne duda'])
    .addAnswer(buildFaqMenuMessage('CARNE DE CORDERO'), { capture: true, buttons: buildFaqButtons() }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: carneFaqFlow,
            faqAnswers: {
                beneficios: 'Carne tierna, baja en grasas, alta en proteínas y sabor exquisito. Libre pastoreo.',
                precio: 'Desde $220.00 - $320.00 MXN el kg según corte.',
                presentacion: 'Por kilo o paquetes de 500g.',
                ingredientes: 'Carne fresca de cordero criado de forma natural.',
                consumo: 'Conservar refrigerada o congelada. Cocción rápida o lenta según corte.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const pedidoFlow = addKeyword<Provider, Database>(['pedido', 'comprar', 'hacer pedido'])
    .addAnswer(`
🛒 INICIANDO PEDIDO

Vamos a armar tu carrito. Selecciona los productos que deseas:
`, null, async (_ctx, { state, gotoFlow }) => {
        const cart = state.get('cart') || []
        state.update({ cart, pendingProduct: null })
        return gotoFlow(addProductFlow)
    })

const addProductFlow = addKeyword<Provider, Database>(['__add_product__'])
    .addAction(async (ctx, { provider }) => {
        await sendListMessage(provider, ctx.from, buildOrderMenuList())
    })
    .addAnswer(ORDER_MENU_MESSAGE, { capture: true }, async (ctx, { state, flowDynamic, gotoFlow }) => {
        const text = normalizeText(ctx.body)
        if (text.includes('menu') || text.includes('menú') || text.includes('inicio')) return gotoFlow(welcomeFlow)
        if (text.includes('hablar') || text.includes('asesor')) return gotoFlow(contactFlow)
        if (text.includes('terminar') || text.includes('finalizar') || text === '18') return gotoFlow(confirmFinishOrderFlow)

        const product = parseOrderProduct(ctx.body ?? '')
        if (!product) {
            await flowDynamic('❌ No reconozco ese producto. Por favor elige una opción del 1 al 18.')
            return gotoFlow(addProductFlow)
        }

        state.update({ pendingProduct: product })
        return gotoFlow(addQuantityFlow)
    })

const addQuantityFlow = addKeyword<Provider, Database>(['__add_quantity__'])
    .addAnswer('🔢 ¿Cuántas unidades deseas? (Escribe solo el número, ej: 2)', { capture: true }, async (ctx, { state, flowDynamic, gotoFlow }) => {
        const quantity = parseQuantity(ctx.body ?? '')
        if (!quantity) {
            await flowDynamic('⚠️ Cantidad inválida. Escribe solo un número mayor a 0.')
            return gotoFlow(addQuantityFlow)
        }

        const product = state.get('pendingProduct')
        if (!product) return gotoFlow(addProductFlow)

        const cart = state.get('cart') || []
        cart.push({ producto: product, cantidad: quantity })
        state.update({ cart, pendingProduct: null })

        await flowDynamic(`✅ Agregado al carrito: *${quantity} ${product}*`)
        return gotoFlow(addMoreFlow)
    })

const addMoreFlow = addKeyword<Provider, Database>(['__add_more__'])
    .addAnswer('¿Quieres agregar algo más a tu pedido?', {
        capture: true,
        buttons: [{ body: '✅ Sí, agregar más' }, { body: '❌ No, terminar pedido' }, { body: '🏠 Menú principal' }],
    }, async (ctx, { state, flowDynamic, gotoFlow }) => {
        const text = normalizeText(ctx.body)
        if (text.includes('menu')) return gotoFlow(welcomeFlow)
        if (isYes(text) || text.includes('agregar')) return gotoFlow(addProductFlow)
        if (isNo(text) || text.includes('terminar')) return gotoFlow(confirmFinishOrderFlow)
        await flowDynamic('Por favor responde con *Sí* o *No*.')
        return gotoFlow(addMoreFlow)
    })

const confirmFinishOrderFlow = addKeyword<Provider, Database>(['__confirm_finish_order__'])
    .addAnswer('📋 RESUMEN DE TU PEDIDO:', null, async (ctx, { state, flowDynamic, gotoFlow }) => {
        const cart = state.get('cart') || []
        if (cart.length === 0) {
            await flowDynamic('❌ Tu carrito está vacío. Agrega al menos un producto.')
            return gotoFlow(addProductFlow)
        }

        let resumen = ''
        cart.forEach((item, i) => {
            resumen += `${i+1}. ${item.cantidad} ${item.producto}\n`
        })

        await flowDynamic(resumen)
        await flowDynamic('¿Todo es correcto y deseas continuar con los datos de entrega?', {
            buttons: [{ body: '✅ Sí, continuar' }, { body: '❌ No, modificar' }]
        })
    })
    .addAnswer('', { capture: true }, async (ctx, { state, flowDynamic, gotoFlow }) => {
        const text = normalizeText(ctx.body)
        if (isYes(text)) return gotoFlow(datosEntregaFlow)
        if (isNo(text)) return gotoFlow(addProductFlow)
        await flowDynamic('Responde Sí o No por favor.')
        return gotoFlow(confirmFinishOrderFlow)
    })

const datosEntregaFlow = addKeyword<Provider, Database>(['__datos_entrega__'])
    .addAnswer('📝 Perfecto. Ahora necesito tus datos para coordinar la entrega:', null, async () => {})
    .addAnswer('1️⃣ Nombre completo:', { capture: true }, async (ctx, { state }) => {
        state.update({ nombre: ctx.body.trim() })
    })
    .addAnswer('2️⃣ Teléfono de contacto:', { capture: true }, async (ctx, { state }) => {
        state.update({ telefono: ctx.body.trim() })
    })
    .addAnswer('3️⃣ Localidad / Colonia (Ej: Tula, Tlahuelilpan, El Carmen...):', { capture: true }, async (ctx, { state }) => {
        state.update({ colonia: ctx.body.trim() })
    })
    .addAnswer('4️⃣ Dirección completa y referencias (calle, número, entre calles):', { capture: true }, async (ctx, { state, flowDynamic }) => {
        state.update({ direccion: ctx.body.trim() })

        const datos = state.get()
        const resumenPedido = (datos.cart || []).map(i => `• ${i.cantidad} ${i.producto}`).join('\n')

        await flowDynamic(`
🙌 ¡Gracias por tu compra, ${datos.nombre}!

Tu pedido ha sido registrado:

📦 PRODUCTOS:
${resumenPedido}

📍 ENTREGA:
${datos.direccion}, ${datos.colonia}
📞 Tel: ${datos.telefono}

Entregamos personalmente en Tula y alrededores.
En breve nos pondremos en contacto contigo para confirmar el pago y la hora de entrega.

¡Gracias por elegir productos de Rancho El Bienamado! 🐑🌱
        `)
    })

const dudaFlow = addKeyword<Provider, Database>(['duda', 'pregunta', 'consulta', 'tengo una duda'])
    .addAnswer(`
❓ ¿Sobre qué producto tienes dudas?

Elige una opción:

1️⃣ Kombucha
2️⃣ Kéfir
3️⃣ Vinagres Artesanales
4️⃣ Miel Natural
5️⃣ Café Artesanal
6️⃣ Sábila
7️⃣ Carne de Cordero Premium

O escribe "Hacer pedido" si ya deseas comprar.
`, { capture: true, buttons: [
            { body: '1️⃣ Kombucha' },
            { body: '2️⃣ Kéfir' },
            { body: '3️⃣ Vinagres' },
            { body: '4️⃣ Miel' },
            { body: '5️⃣ Café' },
            { body: '6️⃣ Sábila' },
            { body: '7️⃣ Carne' },
            { body: '🛒 Hacer pedido' },
            { body: '🏠 Menú principal' },
        ]
    }, async (ctx, { gotoFlow, flowDynamic }) => {
        const text = normalizeText(ctx.body)
        if (text.includes('pedido') || text.includes('comprar')) return gotoFlow(pedidoFlow)
        if (text.startsWith('1') || text.includes('kombucha')) return gotoFlow(kombuchaFaqFlow)
        if (text.startsWith('2') || text.includes('kefir')) return gotoFlow(kefirFaqFlow)
        if (text.startsWith('3') || text.includes('vinagre')) return gotoFlow(vinagreFaqFlow)
        if (text.startsWith('4') || text.includes('miel')) return gotoFlow(mielFaqFlow)
        if (text.startsWith('5') || text.includes('cafe')) return gotoFlow(cafeFaqFlow)
        if (text.startsWith('6') || text.includes('sabila')) return gotoFlow(sabilaFaqFlow)
        if (text.startsWith('7') || text.includes('cordero') || text.includes('carne')) return gotoFlow(carneFaqFlow)
        if (text.includes('menu')) return gotoFlow(welcomeFlow)
        await flowDynamic('Escribe un número del 1 al 7 o selecciona una opción.')
    })

const contactFlow = addKeyword<Provider, Database>(['hablar', 'contacto', 'asesor', 'hablar con nosotros'])
    .addAnswer(`
📞 Claro que sí. En un momento uno de nuestros asesores te atenderá personalmente.

También puedes escribirnos directamente aquí:
${CONTACT_LINK}
`)
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const ubicacionFlow = addKeyword<Provider, Database>(['ubicacion', 'ubicación', 'donde estan'])
    .addAnswer(`
📍 UBICACIÓN Y ZONA DE ENTREGAS

Estamos en la zona de Tula de Allende, Hidalgo.
Entregamos sin costo en localidades cercanas: Tula, Tlahuelilpan, El Carmen, Doxey, Iturbe, El Llano y zonas aledañas.

Ver ubicación en Google Maps:
https://maps.app.goo.gl/e2SGQNkZDPid6CWG6
`)
    .addAnswer('¿Qué deseas hacer ahora?', { capture: true, buttons: [{ body: '🛒 Hacer pedido' }, { body: '🏠 Menú principal' }] }, async (ctx, { gotoFlow }) => {
        const text = normalizeText(ctx.body)
        if (text.includes('pedido')) return gotoFlow(pedidoFlow)
        return gotoFlow(welcomeFlow)
    })

const cafeFlow = addKeyword<Provider, Database>(['cafe', 'café', 'cafe artesanal'])
    .addAnswer(`
☕ CAFÉ ARTESANAL

Café seleccionado cuidadosamente para ofrecer una experiencia auténtica en cada taza.
📦 Presentación: Café molido o en grano.

⚠️ Actualmente con disponibilidad limitada.
`, null, async (_ctx, { state }) => { state.update({ lastProduct: 'Café Artesanal' }) })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const mielFlow = addKeyword<Provider, Database>(['miel', 'miel natural'])
    .addAnswer(`
🍯 MIEL NATURAL

Miel artesanal producida de manera natural sin aditivos.
📦 Presentación: Frasco de 350 g.
💰 Precio: $85.00 MXN
`, { media: './assets/catalogoimagenes/miel.jpg.png' }, async (_ctx, { state }) => { state.update({ lastProduct: 'Miel Natural' }) })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const kefirFlow = addKeyword<Provider, Database>(['kefir', 'kéfir'])
    .addAnswer(`
🥛 KÉFIR

Fermento artesanal rico en probióticos, excelente para la digestión.
📦 Presentaciones:
• Bebible 250 ml - $40.00 MXN
• Untable 250 g - $45.00 MXN
`, { media: './assets/catalogoimagenes/kefirbebible.jpg.png' }, async (_ctx, { state }) => { state.update({ lastProduct: 'Kéfir' }) })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const kombuchaFlow = addKeyword<Provider, Database>(['kombucha'])
    .addAnswer(`
🍹 KOMBUCHA

Bebida fermentada naturalmente, refrescante y saludable.
📦 Presentaciones:
• 250 ml - $45.00 MXN
• 500 ml - $75.00 MXN
`, { media: './assets/catalogoimagenes/kombucha.jpg.png' }, async (_ctx, { state }) => { state.update({ lastProduct: 'Kombucha' }) })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const vinagreFlow = addKeyword<Provider, Database>(['vinagre', 'vinagres', 'vinagres artesanales'])
    .addAnswer(`
🍎 VINAGRES ARTESANALES

Fermentados naturalmente con frutas seleccionadas.
📦 Presentación: Botella 500 ml - $55.00 MXN
Sabores disponibles:
• Manzana
• Pera
• Albahaca
`, { media: './assets/catalogoimagenes/vinagremanzana.jpg.png' }, async (_ctx, { state }) => { state.update({ lastProduct: 'Vinagres Artesanales' }) })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const sabilaFlow = addKeyword<Provider, Database>(['sabila', 'sábila'])
    .addAnswer(`
🌵 SÁBILA

Contamos con plantas de sábila de excelente calidad y asesoría personalizada.
Para información detallada y compra, contáctanos directamente:
📞 7736801583
`, { media: './assets/catalogoimagenes/sabila.png' }, async (_ctx, { state }) => { state.update({ lastProduct: 'Sábila' }) })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const sabilaContactFlow = addKeyword<Provider, Database>(['sabila asesor', 'sábila asesor'])
    .addAnswer(`
Para asesoría personalizada y compra de planta de sábila, contáctanos aquí:
📞 7736801583
`)

const carneFlow = addKeyword<Provider, Database>(['carne', 'cordero', 'carne de cordero'])
    .addAnswer(`
🍖 CARNE DE CORDERO PREMIUM

Nuestros borregos son criados en libre pastoreo para ofrecer una carne tierna, jugosa y de excelente calidad.

Selecciona un corte para ver detalles:

1️⃣ Rack Francés (kg)
2️⃣ Rack Chops (kg)
3️⃣ T-Bone (kg)
4️⃣ Osobuco (kg)
5️⃣ Medallón de Pierna (kg)
6️⃣ Pierna en Cubos (kg)
7️⃣ Hamburguesa de Cordero (500 g)
8️⃣ Chorizo de Cordero (kg)
9️⃣ Gaoneras (500 g)
`, { capture: true, buttons: [
            { body: '1️⃣ Rack Francés' },
            { body: '2️⃣ Rack Chops' },
            { body: '3️⃣ T-Bone' },
            { body: '4️⃣ Osobuco' },
            { body: '5️⃣ Medallón' },
            { body: '6️⃣ Pierna Cubos' },
            { body: '7️⃣ Hamburguesa' },
            { body: '8️⃣ Chorizo' },
            { body: '9️⃣ Gaoneras' },
            { body: '🏠 Menú principal' },
        ]
    }, async (ctx, { gotoFlow, flowDynamic, state }) => {
        state.update({ lastProduct: 'Carne de Cordero Premium' })
        const text = normalizeText(ctx.body)
        if (text.startsWith('1') || text.includes('rack francés')) return gotoFlow(rackFrancesFlow)
        if (text.startsWith('2') || text.includes('rack chops')) return gotoFlow(rackChopsFlow)
        if (text.startsWith('3') || text.includes('t-bone')) return gotoFlow(tboneFlow)
        if (text.startsWith('4') || text.includes('osobuco')) return gotoFlow(osobucoFlow)
        if (text.startsWith('5') || text.includes('medallón')) return gotoFlow(medallonFlow)
        if (text.startsWith('6') || text.includes('pierna en cubos')) return gotoFlow(piernaCubosFlow)
        if (text.startsWith('7') || text.includes('hamburguesa')) return gotoFlow(hamburguesaFlow)
        if (text.startsWith('8') || text.includes('chorizo')) return gotoFlow(chorizoFlow)
        if (text.startsWith('9') || text.includes('gaoneras')) return gotoFlow(gaonerasFlow)
        if (text.includes('menú')) return gotoFlow(welcomeFlow)
        await flowDynamic('Escribe un número del 1 al 9 para continuar.')
    })

const rackFrancesFlow = addKeyword<Provider, Database>(['rack frances', 'rack francés'])
    .addAnswer(`
🥩 Rack Francés

Corte premium, presentación elegante, ideal para asados y ocasiones especiales.
💲 Precio: $320.00 MXN / kg
`, { media: './assets/catalogoimagenes/rack frances.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const rackChopsFlow = addKeyword<Provider, Database>(['rack chops'])
    .addAnswer(`
🥩 Rack Chops

Chuletas individuales con hueso, muy tiernas y sabrosas.
💲 Precio: $310.00 MXN / kg
`, { media: './assets/catalogoimagenes/rackchops.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const tboneFlow = addKeyword<Provider, Database>(['t-bone', 'tbone'])
    .addAnswer(`
🥩 T-Bone

Corte con forma de T, combina dos músculos diferentes, muy jugoso.
💲 Precio: $290.00 MXN / kg
`, { media: './assets/catalogoimagenes/t-bone.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const osobucoFlow = addKeyword<Provider, Database>(['osobuco'])
    .addAnswer(`
🥩 Osobuco

Corte con hueso y médula, ideal para cocción lenta, guisos o consomés.
💲 Precio: $220.00 MXN / kg
`, { media: './assets/catalogoimagenes/osobuco.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const medallonFlow = addKeyword<Provider, Database>(['medallon', 'medallón', 'medallón de pierna'])
    .addAnswer(`
🥩 Medallón de Pierna

Carne magra, sin hueso, muy suave, perfecta para parrilla o sartén.
💲 Precio: $280.00 MXN / kg
`, { media: './assets/catalogoimagenes/medallondepierna.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const piernaCubosFlow = addKeyword<Provider, Database>(['pierna en cubos', 'pierna cubos'])
    .addAnswer(`
🥩 Pierna en Cubos

Carne cortada en trozos, lista para guisados, estofados o birria.
💲 Precio: $230.00 MXN / kg
`, { media: './assets/catalogoimagenes/piernaencubos.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const hamburguesaFlow = addKeyword<Provider, Database>(['hamburguesa', 'hamburguesa de cordero'])
    .addAnswer(`
🍔 Hamburguesa de Cordero

Carne molida seleccionada, sazonada, lista para cocinar.
📦 Presentación: Paquete de 500 g
💲 Precio: $130.00 MXN
`, { media: './assets/catalogoimagenes/carnehamburguesas.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const chorizoFlow = addKeyword<Provider, Database>(['chorizo', 'chorizo de cordero'])
    .addAnswer(`
🌭 Chorizo de Cordero

Elaborado con carne de cordero y especias naturales, sabor único.
📦 Presentación: Por kilo
💲 Precio: $240.00 MXN / kg
`, { media: './assets/catalogoimagenes/chorizo.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const gaonerasFlow = addKeyword<Provider, Database>(['gaoneras', 'gaonera'])
    .addAnswer(`
🥩 Gaoneras

Cortes delgados y amplios, ideales para rellenar o asar rápido.
📦 Presentación: Paquete de 500 g
💲 Precio: $140.00 MXN
`, { media: './assets/catalogoimagenes/gaoneras.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

// ✅ AQUÍ ESTÁ LO QUE ME PEDISTE EXACTAMENTE
const welcomeFlow = addKeyword<Provider, Database>([
    'hola',
    'buenas',
    'info',
    'informacion',
    'menú',
    'menu',
    'inicio',
    'empezar',
    'entrada',
    'ola',
    'holi',
    'holaa'
])
    .addAction(async (ctx, { provider }) => {
        await sendListMessage(provider, ctx.from, buildMainMenuList())
    })
    .addAnswer(MAIN_MENU_MESSAGE, { capture: true }, async (ctx, { gotoFlow, flowDynamic }) => {
        const text = normalizeText(ctx.body)
        
        if (text.startsWith('1') || text.includes('kombucha')) return gotoFlow(kombuchaFlow)
        if (text.startsWith('2') || text.includes('kéfir')) return gotoFlow(kefirFlow)
        if (text.startsWith('3') || text.includes('vinagre')) return gotoFlow(vinagreFlow)
        if (text.startsWith('4') || text.includes('miel')) return gotoFlow(mielFlow)
        if (text.startsWith('5') || text.includes('café')) return gotoFlow(cafeFlow)
        if (text.startsWith('6') || text.includes('sábila')) return gotoFlow(sabilaFlow)
        if (text.startsWith('7') || text.includes('cordero')) return gotoFlow(carneFlow)
        if (text.startsWith('8') || text.includes('ubicación')) return gotoFlow(ubicacionFlow)
        if (text.startsWith('9') || text.includes('hablar')) return gotoFlow(contactFlow)

        await flowDynamic('⚠️ Opción no válida. Escribe un número del 1 al 9 o una palabra clave como "menú" o "inicio".')
        return gotoFlow(welcomeFlow)
    })

// ✅ CONFIGURACIÓN FINAL CORREGIDA
const main = async () => {
    const adapterFlow = createFlow([
        welcomeFlow,
        cafeFlow,
        mielFlow,
        kefirFlow,
        kombuchaFlow,
        vinagreFlow,
        sabilaFlow,
        sabilaContactFlow,
        carneFlow,
        kombuchaFaqFlow,
        kefirFaqFlow,
        vinagreFaqFlow,
        mielFaqFlow,
        cafeFaqFlow,
        sabilaFaqFlow,
        carneFaqFlow,
        rackFrancesFlow,
        rackChopsFlow,
        tboneFlow,
        osobucoFlow,
        medallonFlow,
        piernaCubosFlow,
        hamburguesaFlow,
        chorizoFlow,
        gaonerasFlow,
        ubicacionFlow,
        pedidoFlow,
        addProductFlow,
        confirmFinishOrderFlow,
        addQuantityFlow,
        addMoreFlow,
        datosEntregaFlow,
        dudaFlow,
        contactFlow,
    ])

    const adapterProvider = createProvider(Provider, { 
        version: [2, 3000, 1035824857],
        session: { 
            path: './session',
            read: true,
            write: true
        }
    })
    const adapterDB = new Database()

    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    httpServer(+PORT)
}

main()
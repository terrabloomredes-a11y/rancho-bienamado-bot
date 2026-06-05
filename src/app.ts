import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const PORT = process.env.PORT ?? 3008
const CONTACT_NUMBER = '527721603207'
const CONTACT_LINK = `https://wa.me/${CONTACT_NUMBER}`
const LIST_BUTTON_TEXT = 'Ver opciones'

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
Opciones:

1️⃣ Pedido
2️⃣ Duda
3️⃣ Menú principal
`

const ACTION_MENU_BUTTONS = [
    { body: '1️⃣ Pedido' },
    { body: '2️⃣ Duda' },
    { body: '3️⃣ Menú principal' },
]



const FAQ_TOPICS = [
    { key: '1', label: 'Beneficios' },
    { key: '2', label: 'Precio' },
    { key: '3', label: 'Presentacion/tamano' },
    { key: '4', label: 'Ingredientes/proceso' },
    { key: '5', label: 'Consumo/conservacion' },
]

const normalizeText = (value: string | undefined | null) => (value ?? '').toLowerCase().trim()

const isYes = (text: string) => text === 'si' || text === 'sí' || text.startsWith('s')
const isNo = (text: string) => text === 'no' || text.startsWith('n')

const PRODUCT_OPTIONS = [
    { label: 'Kombucha', keywords: ['kombucha', '1'] },
    { label: 'Kefir', keywords: ['kefir', 'kéfir', '2'] },
    { label: 'Vinagres Artesanales', keywords: ['vinagre', 'vinagres', '3'] },
    { label: 'Miel Natural', keywords: ['miel', '4'] },
    { label: 'Cafe Artesanal', keywords: ['cafe', 'café', '5'] },
    { label: 'Sabila', keywords: ['sabila', 'sábila', '6'] },
    { label: 'Carne de Cordero Premium', keywords: ['carne', 'cordero', '7'] },
]

const ORDER_ITEMS = [
    { label: 'Kombucha 250 ml', keywords: ['kombucha', '1'] },
    { label: 'Kefir Bebible 250 ml', keywords: ['kefir bebible', 'kefir', 'kéfir', '2'] },
    { label: 'Kefir Untable 250 g', keywords: ['kefir untable', 'kéfir untable', '3'] },
    { label: 'Vinagre Manzana 500 ml', keywords: ['vinagre manzana', 'manzana', '4'] },
    { label: 'Vinagre Pera 500 ml', keywords: ['vinagre pera', 'pera', '5'] },
    { label: 'Vinagre Albahaca 500 ml', keywords: ['vinagre albahaca', 'albahaca', '6'] },
    { label: 'Miel Natural 350 g', keywords: ['miel', '7'] },
    { label: 'Cafe Artesanal', keywords: ['cafe', 'café', '8'] },
    { label: 'Carne - Rack Frances (kg)', keywords: ['rack frances', 'rack francés', '9'] },
    { label: 'Carne - Rack Chops (kg)', keywords: ['rack chops', '10'] },
    { label: 'Carne - T-Bone (kg)', keywords: ['t-bone', 'tbone', '11'] },
    { label: 'Carne - Osobuco (kg)', keywords: ['osobuco', '12'] },
    { label: 'Carne - Medallon de Pierna (kg)', keywords: ['medallon', 'medallón', '13'] },
    { label: 'Carne - Pierna en Cubos (kg)', keywords: ['pierna en cubos', 'pierna cubos', '14'] },
    { label: 'Carne - Hamburguesa de Cordero (500 g)', keywords: ['hamburguesa', '15'] },
    { label: 'Carne - Chorizo de Cordero (kg)', keywords: ['chorizo', '16'] },
    { label: 'Carne - Gaoneras (500 g)', keywords: ['gaoneras', 'gaonera', '17'] },
]

const ORDER_MENU_MESSAGE = `
Agrega productos a tu pedido:

1️⃣ Kombucha 250 ml
2️⃣ Kefir Bebible 250 ml
3️⃣ Kefir Untable 250 g
4️⃣ Vinagre Manzana 500 ml
5️⃣ Vinagre Pera 500 ml
6️⃣ Vinagre Albahaca 500 ml
7️⃣ Miel Natural 350 g
8️⃣ Cafe Artesanal
9️⃣ Carne - Rack Frances (kg)
10️⃣ Carne - Rack Chops (kg)
11️⃣ Carne - T-Bone (kg)
12️⃣ Carne - Osobuco (kg)
13️⃣ Carne - Medallon de Pierna (kg)
14️⃣ Carne - Pierna en Cubos (kg)
15️⃣ Carne - Hamburguesa de Cordero (500 g)
16️⃣ Carne - Chorizo de Cordero (kg)
17️⃣ Carne - Gaoneras (500 g)
18️⃣ Terminar pedido
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
        title: 'Opciones',
        rows: [
            { title: '8️⃣ Ubicación', rowId: 'menu_8' },
            { title: '9️⃣ Hablar con nosotros', rowId: 'menu_9' },
        ],
    },
]

const ORDER_MENU_LIST_SECTIONS = [
    {
        title: 'Productos',
        rows: ORDER_ITEMS.map((item, index) => ({
            title: `${index + 1}️⃣ ${item.label}`,
            rowId: `order_${index + 1}`,
        })),
    },
    {
        title: 'Pedido',
        rows: [{ title: '18️⃣ Terminar pedido', rowId: 'order_finish' }],
    },
    {
        title: 'Ayuda',
        rows: [
            { title: '🏠 Menú principal', rowId: 'order_menu' },
            { title: '💬 Hablar con nosotros', rowId: 'order_contact' },
        ],
    },
]

const sendListMessage = async (ctx, provider, config: {
    title: string
    text: string
    footer?: string
    buttonText?: string
    sections: Array<{ title: string; rows: Array<{ title: string; rowId: string }> }>
}) => {
    const vendor = provider?.vendor
    if (!vendor?.sendMessage) return

    await vendor.sendMessage(ctx.from, {
        title: config.title,
        text: config.text,
        footer: config.footer ?? '',
        buttonText: config.buttonText ?? LIST_BUTTON_TEXT,
        sections: config.sections,
    })
}

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
❓ DUDAS SOBRE ${title}

Elige una pregunta:

${lines.join('\n')}
\n🏠 Menu principal\n🧾 Hacer pedido\n`
}

const buildFaqButtons = () => [
    { body: '1️⃣ Beneficios' },
    { body: '2️⃣ Precio' },
    { body: '3️⃣ Presentacion/tamano' },
    { body: '4️⃣ Ingredientes/proceso' },
    { body: '5️⃣ Consumo/conservacion' },
    { body: '🧾 Hacer pedido' },
    { body: '🏠 Menu principal' },
]

const sendListMessage = async (provider: Provider, to: string, listPayload: Record<string, any>) => {
    const vendor = (provider as any)?.vendor
    if (!vendor?.sendMessage) return false
    await vendor.sendMessage(to, listPayload)
    return true
}

const buildMainMenuList = () => ({
    text: 'Selecciona una opcion:',
    footer: 'Rancho El Bienamado',
    title: 'Menu principal',
    buttonText: LIST_BUTTON_TEXT,
    sections: [
        {
            title: 'Opciones',
            rows: [
                { title: '1️⃣ Kombucha', rowId: 'menu_1' },
                { title: '2️⃣ Kéfir', rowId: 'menu_2' },
                { title: '3️⃣ Vinagres Artesanales', rowId: 'menu_3' },
                { title: '4️⃣ Miel Natural', rowId: 'menu_4' },
                { title: '5️⃣ Café Artesanal', rowId: 'menu_5' },
                { title: '6️⃣ Sábila', rowId: 'menu_6' },
                { title: '7️⃣ Carne de Cordero Premium', rowId: 'menu_7' },
                { title: '8️⃣ Ubicación', rowId: 'menu_8' },
                { title: '9️⃣ Hablar con Nosotros', rowId: 'menu_9' },
            ],
        },
    ],
})

const buildOrderMenuList = () => ({
    text: 'Agrega productos a tu pedido:',
    footer: 'Rancho El Bienamado',
    title: 'Menu de pedido',
    buttonText: LIST_BUTTON_TEXT,
    sections: [
        {
            title: 'Productos',
            rows: [
                { title: '1️⃣ Kombucha 250 ml', rowId: 'order_1' },
                { title: '2️⃣ Kefir Bebible 250 ml', rowId: 'order_2' },
                { title: '3️⃣ Kefir Untable 250 g', rowId: 'order_3' },
                { title: '4️⃣ Vinagre Manzana 500 ml', rowId: 'order_4' },
                { title: '5️⃣ Vinagre Pera 500 ml', rowId: 'order_5' },
                { title: '6️⃣ Vinagre Albahaca 500 ml', rowId: 'order_6' },
                { title: '7️⃣ Miel Natural 350 g', rowId: 'order_7' },
                { title: '8️⃣ Cafe Artesanal', rowId: 'order_8' },
                { title: '9️⃣ Carne - Rack Frances (kg)', rowId: 'order_9' },
                { title: '10️⃣ Carne - Rack Chops (kg)', rowId: 'order_10' },
                { title: '11️⃣ Carne - T-Bone (kg)', rowId: 'order_11' },
                { title: '12️⃣ Carne - Osobuco (kg)', rowId: 'order_12' },
                { title: '13️⃣ Carne - Medallon de Pierna (kg)', rowId: 'order_13' },
                { title: '14️⃣ Carne - Pierna en Cubos (kg)', rowId: 'order_14' },
                { title: '15️⃣ Carne - Hamburguesa de Cordero (500 g)', rowId: 'order_15' },
                { title: '16️⃣ Carne - Chorizo de Cordero (kg)', rowId: 'order_16' },
                { title: '17️⃣ Carne - Gaoneras (500 g)', rowId: 'order_17' },
                { title: '18️⃣ Terminar pedido', rowId: 'order_18' },
            ],
        },
        {
            title: 'Ayuda',
            rows: [
                { title: '🏠 Menú principal', rowId: 'order_menu' },
                { title: '💬 Hablar con nosotros', rowId: 'order_contact' },
            ],
        },
    ],
})

const handleFaqMenu = async (ctx, { gotoFlow, flowDynamic, state }) => {
    const text = normalizeText(ctx.body)
    const answers = state.get('faqAnswers') || {}

    if (text.includes('pedido') || text.includes('comprar')) return gotoFlow(pedidoFlow)
    if (text.includes('menu') || text.includes('menú') || text.includes('inicio')) return gotoFlow(welcomeFlow)

    if (text.startsWith('1') || text.includes('beneficio')) {
        await flowDynamic(answers.beneficios ?? 'Beneficios no disponibles por ahora.')
        return gotoFlow(state.get('faqReturnFlow'))
    }
    if (text.startsWith('2') || text.includes('precio')) {
        await flowDynamic(answers.precio ?? 'Precio no disponible por ahora.')
        return gotoFlow(state.get('faqReturnFlow'))
    }
    if (text.startsWith('3') || text.includes('presentacion') || text.includes('presentación') || text.includes('tamano') || text.includes('tamaño')) {
        await flowDynamic(answers.presentacion ?? 'Presentacion no disponible por ahora.')
        return gotoFlow(state.get('faqReturnFlow'))
    }
    if (text.startsWith('4') || text.includes('ingrediente') || text.includes('proceso')) {
        await flowDynamic(answers.ingredientes ?? 'Ingredientes/proceso no disponible por ahora.')
        return gotoFlow(state.get('faqReturnFlow'))
    }
    if (text.startsWith('5') || text.includes('consumo') || text.includes('conservacion') || text.includes('conservación')) {
        await flowDynamic(answers.consumo ?? 'Consumo/conservacion no disponible por ahora.')
        return gotoFlow(state.get('faqReturnFlow'))
    }

    await flowDynamic('Escribe 1, 2, 3, 4 o 5 para continuar, o elige Menu principal/Hacer pedido.')
}

const kombuchaFaqFlow = addKeyword<Provider, Database>(['duda kombucha', 'kombucha duda'])
    .addAnswer(buildFaqMenuMessage('KOMBUCHA'), {
        capture: true,
        buttons: buildFaqButtons(),
    }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: kombuchaFaqFlow,
            faqAnswers: {
                beneficios: 'Ayuda a la digestion y aporta probioticos naturales. (Ajustar segun receta).',
                precio: 'Precio: $___ (ajustar).',
                presentacion: 'Presentaciones: 250 ml y 500 ml (si aplica).',
                ingredientes: 'Te verde o negro, azucar y cultivo de kombucha. Proceso fermentado artesanal.',
                consumo: 'Tomar frio. Agitar suave. Conservar refrigerado. Consumir preferente en 5-7 dias.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const kefirFaqFlow = addKeyword<Provider, Database>(['duda kefir', 'duda kéfir', 'kefir duda', 'kéfir duda'])
    .addAnswer(buildFaqMenuMessage('KEFIR'), {
        capture: true,
        buttons: buildFaqButtons(),
    }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: kefirFaqFlow,
            faqAnswers: {
                beneficios: 'Aporta probioticos y puede apoyar la salud intestinal. (Ajustar segun receta).',
                precio: 'Precio: $___ (ajustar).',
                presentacion: 'Bebible 250 ml y untable 250 g.',
                ingredientes: 'Leche y granos de kefir; fermentacion artesanal controlada.',
                consumo: 'Consumir frio. Conservar refrigerado. Ideal en desayunos o colaciones.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const vinagreFaqFlow = addKeyword<Provider, Database>(['duda vinagre', 'duda vinagres', 'vinagre duda'])
    .addAnswer(buildFaqMenuMessage('VINAGRES ARTESANALES'), {
        capture: true,
        buttons: buildFaqButtons(),
    }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: vinagreFaqFlow,
            faqAnswers: {
                beneficios: 'Puede apoyar digestiones ligeras y realzar sabores. (Ajustar segun receta).',
                precio: 'Precio: $___ (ajustar).',
                presentacion: 'Botella 500 ml. Sabores: manzana, pera y albahaca.',
                ingredientes: 'Fruta natural y fermentacion artesanal.',
                consumo: 'Ideal para ensaladas o aderezos. Conservar en lugar fresco.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const mielFaqFlow = addKeyword<Provider, Database>(['duda miel', 'miel duda'])
    .addAnswer(buildFaqMenuMessage('MIEL NATURAL'), {
        capture: true,
        buttons: buildFaqButtons(),
    }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: mielFaqFlow,
            faqAnswers: {
                beneficios: 'Endulzante natural y fuente de energia. (Ajustar segun origen).',
                precio: 'Precio: $___ (ajustar).',
                presentacion: 'Frasco 350 g.',
                ingredientes: 'Miel 100% natural sin aditivos.',
                consumo: 'Ideal en bebidas o postres. Conservar cerrada, lejos del sol.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const cafeFaqFlow = addKeyword<Provider, Database>(['duda cafe', 'duda café', 'cafe duda', 'café duda'])
    .addAnswer(buildFaqMenuMessage('CAFE ARTESANAL'), {
        capture: true,
        buttons: buildFaqButtons(),
    }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: cafeFaqFlow,
            faqAnswers: {
                beneficios: 'Aroma intenso y sabor autentico. (Ajustar segun tu cafe).',
                precio: 'Precio: $___ (ajustar).',
                presentacion: 'Presentacion artesanal (definir gramos).',
                ingredientes: 'Cafe seleccionado y tostado artesanalmente.',
                consumo: 'Moler al momento si es en grano. Conservar en frasco hermetico.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const sabilaFaqFlow = addKeyword<Provider, Database>(['duda sabila', 'duda sábila', 'sabila duda', 'sábila duda'])
    .addAnswer(buildFaqMenuMessage('SABILA'), {
        capture: true,
        buttons: buildFaqButtons(),
    }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: sabilaFaqFlow,
            faqAnswers: {
                beneficios: 'Planta con multiples usos cosmeticos y de cuidado personal. (Ajustar).',
                precio: 'Precio: $___ (ajustar).',
                presentacion: 'Planta en maceta o esqueje (definir).',
                ingredientes: 'Planta natural de sabila.',
                consumo: 'Te orientamos para uso adecuado. Conservar en lugar ventilado.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const carneFaqFlow = addKeyword<Provider, Database>(['duda carne', 'duda cordero', 'carne duda', 'cordero duda'])
    .addAnswer(buildFaqMenuMessage('CARNE DE CORDERO'), {
        capture: true,
        buttons: buildFaqButtons(),
    }, async (ctx, tools) => {
        tools.state.update({
            faqReturnFlow: carneFaqFlow,
            faqAnswers: {
                beneficios: 'Carne de alta calidad de libre pastoreo. (Ajustar).',
                precio: 'Precio: $___ (ajustar).',
                presentacion: 'Cortes disponibles por kg y presentaciones de 500 g.',
                ingredientes: 'Carne fresca de cordero.',
                consumo: 'Conservar refrigerado o congelado. Coccion a gusto.',
            },
        })
        return handleFaqMenu(ctx, tools)
    })

const pedidoFlow = addKeyword<Provider, Database>(['pedido', 'comprar'])
    .addAnswer(`
Gracias por tu pedido.

Vamos a agregar productos a tu carrito.
`, null, async (_ctx, { state, gotoFlow }) => {
        const existingCart = state.get('cart') || []
        if (existingCart.length) {
            state.update({ pendingProduct: null })
            return gotoFlow(addProductFlow)
        }

        const lastProduct = state.get('lastProduct')
        const orderable = ORDER_ITEMS.find((item) => item.label === lastProduct)?.label
        state.update({ cart: [], pendingProduct: orderable ?? null })
        if (orderable) return gotoFlow(addQuantityFlow)
        return gotoFlow(addProductFlow)
    })

const addProductFlow = addKeyword<Provider, Database>(['__add_product__'])
    .addAction(async (ctx, { provider }) => {
        await sendListMessage(ctx, provider, {
            title: 'Pedido',
            text: 'Agrega productos a tu pedido:',
            sections: ORDER_MENU_LIST_SECTIONS,
        })
    })
    .addAnswer(ORDER_MENU_MESSAGE, { capture: true }, async (ctx, { state, flowDynamic, gotoFlow }) => {
        const text = normalizeText(ctx.body)
        const numberMatch = text.match(/\d+/)
        const menuNumber = numberMatch ? Number(numberMatch[0]) : null

        if (text.includes('menu') || text.includes('menú') || text.includes('inicio')) return gotoFlow(welcomeFlow)
        if (text.includes('hablar') || text.includes('asesor') || text.includes('contacto')) return gotoFlow(contactFlow)

        if (menuNumber === 18 || text.includes('terminar') || text.includes('finalizar') || text.includes('listo')) {
            return gotoFlow(confirmFinishOrderFlow)
        }

        const product = parseOrderProduct(ctx.body ?? '')
        if (!product) {
            await flowDynamic('No identifique el producto. Elige una opcion del 1 al 18.')
            return gotoFlow(addProductFlow)
        }
        state.update({ pendingProduct: product })
        return gotoFlow(addQuantityFlow)
    })

const confirmFinishOrderFlow = addKeyword<Provider, Database>(['__confirm_finish_order__'])
    .addAnswer('Quieres terminar tu pedido y continuar con el registro? (Si/No)', {
        capture: true,
        buttons: [{ body: 'Si' }, { body: 'No' }, { body: '💬 Hablar con nosotros' }],
    }, async (ctx, { state, flowDynamic, gotoFlow }) => {
        const cart = state.get('cart') || []
        if (!cart.length) {
            await flowDynamic('Tu pedido esta vacio. Agrega al menos un producto para continuar.')
            return gotoFlow(addProductFlow)
        }

        const text = normalizeText(ctx.body)
        if (text.includes('hablar') || text.includes('asesor') || text.includes('contacto')) return gotoFlow(contactFlow)
        if (text.includes('menu') || text.includes('menú') || text.includes('inicio')) return gotoFlow(welcomeFlow)
        if (isYes(text)) return gotoFlow(datosEntregaFlow)
        if (isNo(text)) return gotoFlow(addProductFlow)
        await flowDynamic('Responde "Si" o "No" para continuar.')
        return gotoFlow(confirmFinishOrderFlow)
    })

const addQuantityFlow = addKeyword<Provider, Database>(['__add_quantity__'])
    .addAnswer('Cuantas unidades quieres? (solo numero)', { capture: true }, async (ctx, { state, flowDynamic, gotoFlow }) => {
        const text = normalizeText(ctx.body)
        if (text.includes('menu') || text.includes('menú') || text.includes('inicio')) return gotoFlow(welcomeFlow)
        if (text.includes('hablar') || text.includes('asesor') || text.includes('contacto')) return gotoFlow(contactFlow)

        const quantity = parseQuantity(ctx.body ?? '')
        if (!quantity) {
            await flowDynamic('Cantidad invalida. Escribe solo un numero, por ejemplo: 2')
            return gotoFlow(addQuantityFlow)
        }
        const product = state.get('pendingProduct')
        if (!product) return gotoFlow(addProductFlow)
        const cart = state.get('cart') || []
        cart.push({ product, quantity })
        state.update({ cart, pendingProduct: null, lastProduct: null })
        await flowDynamic(`Agregado: ${quantity} ${product}.`)
        return gotoFlow(addMoreFlow)
    })

const addMoreFlow = addKeyword<Provider, Database>(['__add_more__'])
    .addAnswer('Quieres agregar otro producto? Responde "Si" o "No".', {
        capture: true,
        buttons: [{ body: 'Si' }, { body: 'No' }, { body: '🏠 Menú principal' }],
    }, async (ctx, { gotoFlow, flowDynamic }) => {
        const text = normalizeText(ctx.body)
        if (text.includes('menu') || text.includes('menú') || text.includes('inicio')) return gotoFlow(welcomeFlow)
        if (text.includes('hablar') || text.includes('asesor') || text.includes('contacto')) return gotoFlow(contactFlow)
        if (isYes(text)) return gotoFlow(addProductFlow)
        if (isNo(text)) return gotoFlow(datosEntregaFlow)
        await flowDynamic('Responde "Si" o "No" para continuar.')
        return gotoFlow(addMoreFlow)
    })

const datosEntregaFlow = addKeyword<Provider, Database>(['__datos_entrega__'])
    .addAnswer('Perfecto. Ahora necesito tus datos para la entrega.', null, async () => {})
    .addAnswer('Nombre completo:', { capture: true }, async (ctx, { state }) => {
        const nombre = (ctx.body ?? '').trim()
        if (nombre) state.update({ nombre })
    })
    .addAnswer('Telefono de contacto:', { capture: true }, async (ctx, { state }) => {
        const telefono = (ctx.body ?? '').trim()
        if (telefono) state.update({ telefono })
    })
    .addAnswer('Colonia o localidad (Tula, Tlahuelilpan, El Carmen, Doxey, Iturbe, El Llano, etc.):', { capture: true }, async (ctx, { state }) => {
        const colonia = (ctx.body ?? '').trim()
        if (colonia) state.update({ colonia })
    })
    .addAnswer('Direccion completa y referencias:', { capture: true }, async (ctx, { state, flowDynamic }) => {
        const direccion = (ctx.body ?? '').trim()
        if (direccion) state.update({ direccion })
        const cart = state.get('cart') || []
        const resumen = cart.length ? cart.map((item) => `• ${item.quantity} ${item.product}`).join('\n') : 'Sin productos registrados.'
        await flowDynamic(`Resumen del pedido:\n${resumen}`)
        await flowDynamic('Entregamos personalmente en Tula y alrededores. Si eres de otro lugar, tomamos tus datos para envio por paqueteria.')
        await flowDynamic('Gracias. En un momento te contactamos para confirmar tu pedido y la entrega.')
    })

const dudaFlow = addKeyword<Provider, Database>(['duda', 'pregunta', 'consulta'])
    .addAnswer(`
Entiendo, quieres resolver una duda.
Selecciona el producto para ayudarte mejor:

1️⃣ Kombucha
2️⃣ Kefir
3️⃣ Vinagres Artesanales
4️⃣ Miel Natural
5️⃣ Cafe Artesanal
6️⃣ Sabila
7️⃣ Carne de Cordero Premium

O escribe "Hacer pedido" si ya deseas comprar.
`, {
        capture: true,
        buttons: [
            { body: '1️⃣ Kombucha' },
            { body: '2️⃣ Kefir' },
            { body: '3️⃣ Vinagres Artesanales' },
            { body: '4️⃣ Miel Natural' },
            { body: '5️⃣ Cafe Artesanal' },
            { body: '6️⃣ Sabila' },
            { body: '7️⃣ Carne de Cordero Premium' },
            { body: '🧾 Hacer pedido' },
            { body: '🏠 Menu principal' },
        ],
    }, async (ctx, { gotoFlow, flowDynamic }) => {
        const text = normalizeText(ctx.body)
        if (text.includes('pedido') || text.includes('comprar')) return gotoFlow(pedidoFlow)
        if (text.startsWith('1') || text.includes('kombucha')) return gotoFlow(kombuchaFaqFlow)
        if (text.startsWith('2') || text.includes('kefir') || text.includes('kéfir')) return gotoFlow(kefirFaqFlow)
        if (text.startsWith('3') || text.includes('vinagre')) return gotoFlow(vinagreFaqFlow)
        if (text.startsWith('4') || text.includes('miel')) return gotoFlow(mielFaqFlow)
        if (text.startsWith('5') || text.includes('cafe') || text.includes('café')) return gotoFlow(cafeFaqFlow)
        if (text.startsWith('6') || text.includes('sabila') || text.includes('sábila')) return gotoFlow(sabilaFaqFlow)
        if (text.startsWith('7') || text.includes('cordero') || text.includes('carne')) return gotoFlow(carneFaqFlow)
        if (text.includes('menu') || text.includes('menú') || text.includes('inicio')) return gotoFlow(welcomeFlow)
        await flowDynamic('Escribe un numero del 1 al 7, o elige Menu principal/Hacer pedido.')
    })

const contactFlow = addKeyword<Provider, Database>([
    'hablar',
    'contacto',
    'asesor',
    'hablar con nosotros',
]).addAnswer(
    `
📞 En un momento uno de nuestros asesores te atenderá.

También puedes escribirnos directamente aquí:
${CONTACT_LINK}
`
)
.addAnswer(
    ACTION_MENU_MESSAGE,
    {
        capture: true,
        buttons: ACTION_MENU_BUTTONS,
    },
    handleActionMenu
)

const welcomeFlow = addKeyword<Provider, Database>([
    'hola',
    'buenas',
    'info',
    'informacion',
    'menú',
    'menu',
    'inicio',
])
    .addAction(async (ctx, { provider }) => {
        await sendListMessage(ctx, provider, {
            title: 'Menú principal',
            text: 'Selecciona una opcion:',
            sections: MAIN_MENU_LIST_SECTIONS,
        })
    })
    .addAnswer(MAIN_MENU_MESSAGE, { capture: true }, async (ctx, { gotoFlow, flowDynamic }) => {
    const text = normalizeText(ctx.body)
    if (text.startsWith('1') || text.includes('kombucha')) return gotoFlow(kombuchaFlow)
    if (text.startsWith('2') || text.includes('kéfir') || text.includes('kefir')) return gotoFlow(kefirFlow)
    if (text.startsWith('3') || text.includes('vinagre')) return gotoFlow(vinagreFlow)
    if (text.startsWith('4') || text.includes('miel')) return gotoFlow(mielFlow)
    if (text.startsWith('5') || text.includes('café') || text.includes('cafe')) return gotoFlow(cafeFlow)
    if (text.startsWith('6') || text.includes('sábila') || text.includes('sabila')) return gotoFlow(sabilaFlow)
    if (text.startsWith('7') || text.includes('cordero') || text.includes('carne')) return gotoFlow(carneFlow)
    if (text.startsWith('8') || text.includes('ubicación') || text.includes('ubicacion')) return gotoFlow(ubicacionFlow)
    if (text.startsWith('9') || text.includes('hablar')) return gotoFlow(contactFlow)
    await flowDynamic('Escribe un número del 1 al 9 para continuar.')
})

const handleActionMenu = async (ctx, { gotoFlow, flowDynamic }) => {
    const text = normalizeText(ctx.body)
    if (text.startsWith('1') || text.includes('pedido')) return gotoFlow(pedidoFlow)
    if (text.startsWith('2') || text.includes('duda') || text.includes('pregunta') || text.includes('consulta')) return gotoFlow(dudaFlow)
    if (text.startsWith('3') || text.includes('menú') || text.includes('menu') || text.includes('inicio')) return gotoFlow(welcomeFlow)
    await flowDynamic('Escribe 1, 2 o 3 para continuar.')
}

const cafeFlow = addKeyword<Provider, Database>(['cafe', 'café', 'cafe artesanal'])
    .addAnswer(`
☕ CAFÉ ARTESANAL

Café seleccionado cuidadosamente para ofrecer una experiencia auténtica en cada taza.
📦 Presentación:
• Café artesanal

⚠️ Actualmente agotado.
`, null, async (_ctx, { state }) => {
        state.update({ lastProduct: 'Cafe Artesanal' })
    })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const mielFlow = addKeyword<Provider, Database>(['miel', 'miel natural'])
    .addAnswer(`
🍯 MIEL NATURAL

Miel artesanal producida de manera natural.
📦 Presentación:
• 350 g
`, { media: './assets/catalogoimagenes/miel.jpg.png' }, async (_ctx, { state }) => {
        state.update({ lastProduct: 'Miel Natural' })
    })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const kefirFlow = addKeyword<Provider, Database>(['kefir', 'kéfir'])
    .addAnswer(`
🥛 KÉFIR

Fermento artesanal rico en probióticos.
📦 Presentaciones:
• Bebible 250 ml
• Untable 250 g
`, { media: './assets/catalogoimagenes/kefirbebible.jpg.png' }, async (_ctx, { state }) => {
        state.update({ lastProduct: 'Kefir' })
    })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const kombuchaFlow = addKeyword<Provider, Database>(['kombucha'])
    .addAnswer(`
🍹 KOMBUCHA

Bebida fermentada naturalmente.
📦 Presentaciones:
• 250 ml
• 500 ml (agotada)
`, { media: './assets/catalogoimagenes/kombucha.jpg.png' }, async (_ctx, { state }) => {
        state.update({ lastProduct: 'Kombucha' })
    })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const vinagreFlow = addKeyword<Provider, Database>(['vinagre', 'vinagres', 'vinagres artesanales'])
    .addAnswer(`
🍎 VINAGRES ARTESANALES

Fermentados naturalmente.
📦 Presentación:
• 500 ml
Sabores:
• Manzana
• Pera
• Albahaca
`, { media: './assets/catalogoimagenes/vinagremanzana.jpg.png' }, async (_ctx, { state }) => {
        state.update({ lastProduct: 'Vinagres Artesanales' })
    })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const sabilaFlow = addKeyword<Provider, Database>(['sabila', 'sábila'])
    .addAnswer(`
🌵 SÁBILA

Contamos con plantas de sábila y asesoría relacionada con su manejo.
Para la asesoría de sábila te atenderemos por este número: 7721603207.
Debido a que cada caso es diferente, la información y cotizaciones se brindan de forma personalizada.
`, { media: './assets/catalogoimagenes/sabila.png' }, async (_ctx, { state }) => {
        state.update({ lastProduct: 'Sabila' })
    })

const sabilaContactFlow = addKeyword<Provider, Database>(['sabila asesor', 'sábila asesor'])
    .addAnswer(`
Para asesoría personalizada y compra de planta de sábila, contáctanos aquí:
7721603207
`)

const carneFlow = addKeyword<Provider, Database>(['carne', 'cordero', 'carne de cordero'])
    .addAnswer(`
🍖 CARNE DE CORDERO PREMIUM

Nuestros borregos son criados en libre pastoreo para ofrecer una carne de excelente calidad.

Selecciona un corte:

1️⃣ Rack Francés (kg)
2️⃣ Rack Chops (kg)
3️⃣ T-Bone (kg)
4️⃣ Osobuco (kg)
5️⃣ Medallón de Pierna (kg)
6️⃣ Pierna en Cubos (kg)
7️⃣ Hamburguesa de Cordero (500 g)
8️⃣ Chorizo de Cordero (kg)
9️⃣ Gaoneras (500 g)
`, {
        capture: true,
        buttons: [
            { body: '1️⃣ Rack Francés (kg)' },
            { body: '2️⃣ Rack Chops (kg)' },
            { body: '3️⃣ T-Bone (kg)' },
            { body: '4️⃣ Osobuco (kg)' },
            { body: '5️⃣ Medallón de Pierna (kg)' },
            { body: '6️⃣ Pierna en Cubos (kg)' },
            { body: '7️⃣ Hamburguesa de Cordero (500 g)' },
            { body: '8️⃣ Chorizo de Cordero (kg)' },
            { body: '9️⃣ Gaoneras (500 g)' },
            { body: '🏠 Menú principal' },
        ],
    }, async (ctx, { gotoFlow, flowDynamic, state }) => {
        state.update({ lastProduct: 'Carne de Cordero Premium' })
        const text = normalizeText(ctx.body)
        if (text.startsWith('1') || text.includes('rack francés') || text.includes('rack frances')) return gotoFlow(rackFrancesFlow)
        if (text.startsWith('2') || text.includes('rack chops')) return gotoFlow(rackChopsFlow)
        if (text.startsWith('3') || text.includes('t-bone') || text.includes('tbone')) return gotoFlow(tboneFlow)
        if (text.startsWith('4') || text.includes('osobuco')) return gotoFlow(osobucoFlow)
        if (text.startsWith('5') || text.includes('medallón') || text.includes('medallon')) return gotoFlow(medallonFlow)
        if (text.startsWith('6') || text.includes('pierna en cubos') || text.includes('pierna cubos')) return gotoFlow(piernaCubosFlow)
        if (text.startsWith('7') || text.includes('hamburguesa')) return gotoFlow(hamburguesaFlow)
        if (text.startsWith('8') || text.includes('chorizo')) return gotoFlow(chorizoFlow)
        if (text.startsWith('9') || text.includes('gaoneras') || text.includes('gaonera')) return gotoFlow(gaonerasFlow)
        if (text.includes('menú') || text.includes('menu') || text.includes('inicio')) return gotoFlow(welcomeFlow)
        await flowDynamic('Escribe un numero del 1 al 9 para continuar.')
    })

const rackFrancesFlow = addKeyword<Provider, Database>(['rack frances', 'rack francés'])
    .addAnswer(`
🥩 Rack Francés

Corte premium ideal para asados y ocasiones especiales.
`, { media: './assets/catalogoimagenes/rack frances.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const rackChopsFlow = addKeyword<Provider, Database>(['rack chops'])
    .addAnswer(`
🥩 Rack Chops
Corte premium ideal para asados y ocasiones especiales.
`, { media: './assets/catalogoimagenes/rackchops.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const tboneFlow = addKeyword<Provider, Database>(['t-bone', 'tbone'])
    .addAnswer(`
🥩 T-Bone
Corte premium ideal para asados y ocasiones especiales.
`, { media: './assets/catalogoimagenes/t-bone.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const osobucoFlow = addKeyword<Provider, Database>(['osobuco'])
    .addAnswer(`
🥩 Osobuco
Corte premium ideal para asados y ocasiones especiales.
`, { media: './assets/catalogoimagenes/osobuco.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const medallonFlow = addKeyword<Provider, Database>(['medallon', 'medallón', 'medallón de pierna', 'medallon de pierna'])
    .addAnswer(`
🥩 Medallón de Pierna
Corte premium ideal para asados y ocasiones especiales.
`, { media: './assets/catalogoimagenes/medallondepierna.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const piernaCubosFlow = addKeyword<Provider, Database>(['pierna en cubos', 'pierna cubos'])
    .addAnswer(`
🥩 Pierna en Cubos
Corte premium ideal para asados y ocasiones especiales.
`, { media: './assets/catalogoimagenes/piernaencubos.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const hamburguesaFlow = addKeyword<Provider, Database>(['hamburguesa', 'hamburguesa de cordero'])
    .addAnswer(`
🍔 Hamburguesa de Cordero
Presentación:
• 500 g
`, { media: './assets/catalogoimagenes/carnehamburguesas.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const chorizoFlow = addKeyword<Provider, Database>(['chorizo', 'chorizo de cordero'])
    .addAnswer(`
🌭 Chorizo de Cordero
Presentación:
• 1 kg
`, { media: './assets/catalogoimagenes/chorizo.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const gaonerasFlow = addKeyword<Provider, Database>(['gaoneras', 'gaonera'])
    .addAnswer(`
🥩 Gaoneras
Presentación:
• 500 g
`, { media: './assets/catalogoimagenes/gaoneras.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const ubicacionFlow = addKeyword<Provider, Database>(['ubicacion', 'ubicación'])
    .addAnswer(`
📍 UBICACIÓN

https://maps.app.goo.gl/e2SGQNkZDPid6CWG6
`)
    .addAnswer('Opciones:', {
        capture: true,
        buttons: [
            { body: '💬 Hablar con nosotros' },
            { body: '🏠 Menú principal' },
        ],
    }, async (ctx, { gotoFlow, flowDynamic }) => {
        const text = normalizeText(ctx.body)
        if (text.includes('hablar')) return gotoFlow(contactFlow)
        if (text.includes('menú') || text.includes('menu') || text.includes('inicio')) return gotoFlow(welcomeFlow)
        await flowDynamic('Escribe "Hablar con nosotros" o "Menú principal" para continuar.')
    })

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

    const adapterProvider = createProvider(Provider, { version: [2, 3000, 1035824857] })
    const adapterDB = new Database()

    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    httpServer(+PORT)
}

main()

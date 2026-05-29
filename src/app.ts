import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const PORT = process.env.PORT ?? 3008
const CONTACT_NUMBER = '527721603207'
const CONTACT_LINK = `https://wa.me/${CONTACT_NUMBER}`

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

const pedidoFlow = addKeyword<Provider, Database>(['pedido', 'comprar'])
    .addAnswer(`
Gracias por tu pedido. En un momento el admin o el dueño te contacta para terminarlo.

Si quieres adelantar información, escribe tu nombre, producto y cantidad.
`)

const dudaFlow = addKeyword<Provider, Database>(['duda', 'pregunta', 'consulta'])
    .addAnswer(`
Gracias por tu mensaje. En un momento respondemos tu duda.

Escribe tu pregunta y con gusto te ayudamos.
`)

const contactFlow = addKeyword<Provider, Database>([
    'hablar',
    'contacto',
    'asesor',
    'hablar con nosotros',
]).addAnswer(`
Gracias por escribirnos. En un momento te atendemos con gusto.
`)

const welcomeFlow = addKeyword<Provider, Database>([
    'hola',
    'buenas',
    'info',
    'informacion',
    'menú',
    'menu',
    'inicio',
]).addAnswer(MAIN_MENU_MESSAGE, { capture: true, buttons: MAIN_MENU_BUTTONS }, async (ctx, { gotoFlow, flowDynamic }) => {
    const text = (ctx.body ?? '').toLowerCase().trim()
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
    const text = ctx.body.toLowerCase().trim()
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
`)
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const mielFlow = addKeyword<Provider, Database>(['miel', 'miel natural'])
    .addAnswer(`
🍯 MIEL NATURAL

Miel artesanal producida de manera natural.
📦 Presentación:
• 350 g
`, { media: './assets/catalogoimagenes/miel.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const kefirFlow = addKeyword<Provider, Database>(['kefir', 'kéfir'])
    .addAnswer(`
🥛 KÉFIR

Fermento artesanal rico en probióticos.
📦 Presentaciones:
• Bebible 250 ml
• Untable 250 g
`, { media: './assets/catalogoimagenes/kefirbebible.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const kombuchaFlow = addKeyword<Provider, Database>(['kombucha'])
    .addAnswer(`
🍹 KOMBUCHA

Bebida fermentada naturalmente.
📦 Presentaciones:
• 250 ml
• 500 ml (agotada)
`, { media: './assets/catalogoimagenes/kombucha.jpg.png' })
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
`, { media: './assets/catalogoimagenes/vinagremanzana.jpg.png' })
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, handleActionMenu)

const sabilaFlow = addKeyword<Provider, Database>(['sabila', 'sábila'])
    .addAnswer(`
🌵 SÁBILA

Contamos con plantas de sábila y asesoría relacionada con su manejo.
Para la asesoría de sábila te atenderemos por este número: 7721603207.
Debido a que cada caso es diferente, la información y cotizaciones se brindan de forma personalizada.
`, { media: './assets/catalogoimagenes/sabila.png' })

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
    }, async (ctx, { gotoFlow, flowDynamic }) => {
        const text = ctx.body.toLowerCase().trim()
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
        const text = ctx.body.toLowerCase().trim()
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

import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot';
import { MemoryDB as Database } from '@builderbot/bot';
import { BaileysProvider as Provider } from '@builderbot/provider-baileys';
const PORT = process.env.PORT ?? 3008;
const CONTACT_NUMBER = '527721603207';
const CONTACT_LINK = `https://wa.me/${CONTACT_NUMBER}`;
const MAIN_MENU_MESSAGE = `
✨ Bienvenido a Rancho El Bienamado ✨
Todo aqui es 100% natural, borregos de libre pastoreo y productos artesanales con amor.

Selecciona una opcion:
1️⃣ Cafe Artesanal
2️⃣ Miel / Fermentos / Vinagres
3️⃣ Sabila
4️⃣ Carne de cordero premium
5️⃣ Ubicacion
6️⃣ Hablar con nosotros
`;
const MAIN_MENU_BUTTONS = [
    { body: '☕ Cafe Artesanal' },
    { body: '🍯 Miel / Fermentos / Vinagres' },
    { body: '🌵 Sabila' },
    { body: '🍖 Carne de cordero premium' },
    { body: '📍 Ubicacion' },
    { body: '💬 Hablar con nosotros' },
];
const ACTION_MENU_MESSAGE = `
Que te gustaria hacer?
1️⃣ Hacer pedido
2️⃣ Tengo una duda
3️⃣ Menu principal
`;
const ACTION_MENU_BUTTONS = [
    { body: '1️⃣ Hacer pedido' },
    { body: '2️⃣ Tengo una duda' },
    { body: '3️⃣ Menu principal' },
];
const contactFlow = addKeyword(['6', 'hablar', 'contacto', 'asesor', 'ayuda'])
    .addAnswer(`
💬 Tienes dudas o quieres hacer un pedido? Escribenos directamente, estamos felices de atenderte.
${CONTACT_LINK}
`);
const welcomeFlow = addKeyword(['hola', 'buenas', 'info', 'informacion', 'menu', 'inicio'])
    .addAnswer(MAIN_MENU_MESSAGE, { buttons: MAIN_MENU_BUTTONS });
const cafeFlow = addKeyword(['1', 'cafe', 'café', 'cafe artesanal'])
    .addAnswer(`
☕ Cafe Artesanal

Cafe seleccionado cuidadosamente para ofrecer una experiencia autentica en cada taza.
📸 Fotos disponibles al solicitar
📦 Presentacion: consulta disponibilidad
💰 Precio: consulta disponibilidad

Nota: Actualmente agotado, se avisa cuando regrese.
`)
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, async (ctx, { gotoFlow, flowDynamic }) => {
    const text = ctx.body.toLowerCase().trim();
    if (text.startsWith('1'))
        return gotoFlow(contactFlow);
    if (text.startsWith('2'))
        return gotoFlow(contactFlow);
    if (text.startsWith('3') || text.includes('menu'))
        return gotoFlow(welcomeFlow);
    await flowDynamic('Escribe 1, 2 o 3 para continuar.');
});
const kefirDetailFlow = addKeyword(['kefir', 'kéfir', '1 kefir', '1'])
    .addAnswer(`
🥛 Kefir

Opciones:
• Bebible
• Untable
`)
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, async (ctx, { gotoFlow, flowDynamic }) => {
    const text = ctx.body.toLowerCase().trim();
    if (text.startsWith('1'))
        return gotoFlow(contactFlow);
    if (text.startsWith('2'))
        return gotoFlow(contactFlow);
    if (text.startsWith('3') || text.includes('menu'))
        return gotoFlow(welcomeFlow);
    await flowDynamic('Escribe 1, 2 o 3 para continuar.');
});
const kombuchaDetailFlow = addKeyword(['kombucha', '2 kombucha', '2'])
    .addAnswer(`
🍹 Kombucha

Presentaciones:
• Mini
• Otra presentacion (agotada)
`)
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, async (ctx, { gotoFlow, flowDynamic }) => {
    const text = ctx.body.toLowerCase().trim();
    if (text.startsWith('1'))
        return gotoFlow(contactFlow);
    if (text.startsWith('2'))
        return gotoFlow(contactFlow);
    if (text.startsWith('3') || text.includes('menu'))
        return gotoFlow(welcomeFlow);
    await flowDynamic('Escribe 1, 2 o 3 para continuar.');
});
const vinagreDetailFlow = addKeyword(['vinagre', '3 vinagre', '3'])
    .addAnswer(`
🍯 Vinagre

Opciones:
• Manzana
• Pera
• Albahaca
`)
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, async (ctx, { gotoFlow, flowDynamic }) => {
    const text = ctx.body.toLowerCase().trim();
    if (text.startsWith('1'))
        return gotoFlow(contactFlow);
    if (text.startsWith('2'))
        return gotoFlow(contactFlow);
    if (text.startsWith('3') || text.includes('menu'))
        return gotoFlow(welcomeFlow);
    await flowDynamic('Escribe 1, 2 o 3 para continuar.');
});
const mielFlow = addKeyword(['2', 'miel', 'fermentos', 'vinagres'])
    .addAnswer(`
🍯 Miel Natural / Fermentos / Vinagres

Submenu:
1️⃣ Kefir
2️⃣ Kombucha
3️⃣ Vinagre
4️⃣ Menu principal
`)
    .addAnswer('Responde con una opcion.', {
    capture: true,
    buttons: [
        { body: '1️⃣ Kefir' },
        { body: '2️⃣ Kombucha' },
        { body: '3️⃣ Vinagre' },
        { body: '4️⃣ Menu principal' },
    ],
}, async (ctx, { gotoFlow, flowDynamic }) => {
    const text = ctx.body.toLowerCase().trim();
    if (text.startsWith('1'))
        return gotoFlow(kefirDetailFlow);
    if (text.startsWith('2'))
        return gotoFlow(kombuchaDetailFlow);
    if (text.startsWith('3'))
        return gotoFlow(vinagreDetailFlow);
    if (text.startsWith('4') || text.includes('menu'))
        return gotoFlow(welcomeFlow);
    await flowDynamic('Escribe 1, 2, 3 o 4 para continuar.');
});
const sabilaFlow = addKeyword(['3', 'sabila', 'sabia', 'sábila'])
    .addAnswer(`
🌵 Sabila

Para mas informacion personalizada, contactanos directamente.
${CONTACT_LINK}
`)
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, async (ctx, { gotoFlow, flowDynamic }) => {
    const text = ctx.body.toLowerCase().trim();
    if (text.startsWith('1'))
        return gotoFlow(contactFlow);
    if (text.startsWith('2'))
        return gotoFlow(contactFlow);
    if (text.startsWith('3') || text.includes('menu'))
        return gotoFlow(welcomeFlow);
    await flowDynamic('Escribe 1, 2 o 3 para continuar.');
});
const carneFlow = addKeyword(['4', 'carne', 'cordero'])
    .addAnswer(`
🍖 Carne de Cordero Premium

Selecciona corte:
• Rack chops
• Rack frances
• Forequarter
• T-Bone
• Osobuco
• Medallon de pierna
• Pierna en cubos
• Hamburguesas de cordero
• Chorizo
• Gaoneras
`)
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, async (ctx, { gotoFlow, flowDynamic }) => {
    const text = ctx.body.toLowerCase().trim();
    if (text.startsWith('1'))
        return gotoFlow(contactFlow);
    if (text.startsWith('2'))
        return gotoFlow(contactFlow);
    if (text.startsWith('3') || text.includes('menu'))
        return gotoFlow(welcomeFlow);
    await flowDynamic('Escribe 1, 2 o 3 para continuar.');
});
const ubicacionFlow = addKeyword(['5', 'ubicacion', 'ubicación', 'direccion', 'direccion'])
    .addAnswer(`
📍 Estamos en un rincon natural donde la tradicion vive. Aqui puedes encontrarnos:
https://maps.app.goo.gl/e2SGQNkZDPid6CWG6
`)
    .addAnswer(ACTION_MENU_MESSAGE, { capture: true, buttons: ACTION_MENU_BUTTONS }, async (ctx, { gotoFlow, flowDynamic }) => {
    const text = ctx.body.toLowerCase().trim();
    if (text.startsWith('1'))
        return gotoFlow(contactFlow);
    if (text.startsWith('2'))
        return gotoFlow(contactFlow);
    if (text.startsWith('3') || text.includes('menu'))
        return gotoFlow(welcomeFlow);
    await flowDynamic('Escribe 1, 2 o 3 para continuar.');
});
const main = async () => {
    const adapterFlow = createFlow([
        welcomeFlow,
        cafeFlow,
        mielFlow,
        kefirDetailFlow,
        kombuchaDetailFlow,
        vinagreDetailFlow,
        sabilaFlow,
        carneFlow,
        ubicacionFlow,
        contactFlow,
    ]);
    const adapterProvider = createProvider(Provider, { version: [2, 3000, 1035824857] });
    const adapterDB = new Database();
    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });
    httpServer(+PORT);
};
main();

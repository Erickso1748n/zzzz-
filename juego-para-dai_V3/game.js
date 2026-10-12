'use strict';
const $=q=>document.querySelector(q),dlg=$('#dlg'),stage=$('#stage'),scr=$('#scr');
let S={ch:{},mem:[],fl:[]},ok=1,on=0,AC,mus,busy=0,pb=0,mc,cur=0,gy=262,dx=40,spots=[],hn=0;
try{localStorage.setItem('_t',1);localStorage.removeItem('_t');const r=localStorage.getItem('dai-save');if(r)S=Object.assign(S,JSON.parse(r))}catch(e){ok=0}
const save=()=>{try{localStorage.setItem('dai-save',JSON.stringify(S))}catch(e){ok=0}};
/* audio opcional: solo suena si Dai lo activa */
const tone=(f,t=.3,v=.05)=>{if(!on||!AC)return;const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime;o.frequency.value=f;g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+t);o.connect(g);g.connect(AC.destination);o.start();o.stop(n+t)};
function sndT(){on=!on;clearInterval(mus);if(on)try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume();let i=0;const n=[523,659,784,659,587,698,880,698];tone(660);mus=setInterval(()=>tone(n[i++%8],1.4,.02),1500)}catch(e){on=0}hud();if(!cur)title()}
/* personajes chibi (SVG) */
const SK='#f4cba8',A={
d:`<path d="M17 48Q14 12 50 11Q86 12 83 48L86 84Q70 88 66 72H34Q30 88 14 84Z" fill="#ff8ec8"/><rect x="44" y="62" width="12" height="14" fill="${SK}"/>
<rect x="9" y="78" width="15" height="38" rx="7" fill="#20202c"/><rect x="76" y="78" width="15" height="38" rx="7" fill="#20202c"/><circle cx="16" cy="118" r="5" fill="${SK}"/><circle cx="84" cy="118" r="5" fill="${SK}"/>
<path d="M24 76Q50 68 76 76L82 114H18Z" fill="#20202c"/><path d="M38 92Q44 88 50 92Q56 88 62 92Q59 93 57 96Q54 94 50 100Q46 94 43 96Q41 93 38 92Z" fill="#8fb0ff"/>
<path d="M22 110H78L73 148H53L50 128L47 148H27Z" fill="#3d6cb9"/><path d="M25 148H48V156Q48 158 44 158H28Q24 158 24 154ZM52 148H75L76 154Q76 158 72 158H56Q52 158 52 156Z" fill="#15151d"/><path d="M30 151H44M56 151H70" stroke="#fff" stroke-width="1.6"/>
<ellipse cx="50" cy="42" rx="31" ry="29" fill="${SK}"/><ellipse cx="38" cy="47" rx="5.5" ry="7" fill="#2a1f3d"/><ellipse cx="62" cy="47" rx="5.5" ry="7" fill="#2a1f3d"/><circle cx="40" cy="44" r="2" fill="#fff"/><circle cx="64" cy="44" r="2" fill="#fff"/>
<path d="M29 43Q38 37 46 41M54 41Q62 37 71 43" stroke="#1a1020" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="29" cy="57" rx="5" ry="3" fill="#ff8fa8" opacity=".45"/><ellipse cx="71" cy="57" rx="5" ry="3" fill="#ff8fa8" opacity=".45"/>
<path d="M45 61Q50 64 55 61" stroke="#b4574f" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="50" cy="66" r="1.7" fill="#e6ecf5" stroke="#7b86a0" stroke-width=".5"/><circle cx="57" cy="65" r="1.4" fill="#e6ecf5" stroke="#7b86a0" stroke-width=".5"/>
<circle cx="66" cy="55" r="1" fill="#7a4a3a"/><circle cx="35" cy="59" r=".9" fill="#7a4a3a"/>
<path d="M19 42Q20 14 50 13Q80 14 81 42Q66 22 50 34Q34 22 19 42Z" fill="#ff8ec8"/><path d="M19 42Q15 60 22 72L29 56Z" fill="#ff8ec8"/><path d="M81 42Q85 60 78 72L71 56Z" fill="#ff8ec8"/>`,
e:`<rect x="44" y="62" width="12" height="14" fill="#eab98f"/><rect x="6" y="78" width="16" height="40" rx="8" fill="#8d909c"/><rect x="78" y="78" width="16" height="40" rx="8" fill="#8d909c"/><circle cx="14" cy="120" r="5" fill="#eab98f"/><circle cx="86" cy="120" r="5" fill="#eab98f"/>
<path d="M22 76Q50 68 78 76L84 118H16Z" fill="#8d909c"/><path d="M41 71L50 86L59 71Q50 66 41 71Z" fill="#fff"/><path d="M50 86V118" stroke="#d7dae3" stroke-width="1.6"/><ellipse cx="66" cy="96" rx="3.2" ry="3.8" fill="#7fe08a"/><circle cx="65" cy="95.5" r=".8" fill="#143"/><circle cx="67.3" cy="95.5" r=".8" fill="#143"/>
<path d="M18 114H82L86 150H54L50 132L46 150H14Z" fill="#3c3e48"/><path d="M12 150H46V157Q46 159 42 159H16Q12 159 12 155ZM54 150H88V155Q88 159 84 159H58Q54 159 54 157Z" fill="#e8e8ee"/>
<ellipse cx="50" cy="42" rx="31" ry="29" fill="#eab98f"/><path d="M17 46Q14 10 50 10Q86 10 83 46L80 55Q78 36 70 33Q50 25 30 33Q22 36 20 55Z" fill="#3a2218"/>
<rect x="27" y="39" width="18" height="15" rx="5" fill="#cfe6ff" fill-opacity=".35" stroke="#1d1d28" stroke-width="2"/><rect x="55" y="39" width="18" height="15" rx="5" fill="#cfe6ff" fill-opacity=".35" stroke="#1d1d28" stroke-width="2"/><path d="M45 45H55" stroke="#1d1d28" stroke-width="2"/>
<circle cx="36" cy="47" r="2.7" fill="#2a1f1a"/><circle cx="64" cy="47" r="2.7" fill="#2a1f1a"/><path d="M43 62Q50 67 57 62" stroke="#8a4a40" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="29" cy="58" rx="4" ry="2.6" fill="#ff8fa8" opacity=".35"/><ellipse cx="71" cy="58" rx="4" ry="2.6" fill="#ff8fa8" opacity=".35"/>`};
const portraitSrc={d:'assets/characters/cabeza1.png',e:'assets/characters/cabeza2.png'};
const actorSrc={d:'assets/characters/chibi1.png',e:'assets/characters/chibi2.png'};
const pt=w=>w=='d'||w=='e'?`<img src="${portraitSrc[w]}" alt="${NM[w]}" style="width:100%;height:100%;object-fit:contain;">`:w=='p'?'📱':'📖';
const actor=(id,w,x,z)=>`<g id="${id}" class="ac" style="transform:translate(${x}px,${gy}px)"><g class="f"><g class="b"><svg x="${-z/2}" y="${-z*1.6}" width="${z}" height="${z*1.6}" viewBox="0 0 100 160" overflow="visible"><image href="${actorSrc[w]}" x="0" y="0" width="100" height="160" preserveAspectRatio="xMidYMid meet"/></svg></g></g></g>`;
const svgImg=(src,x,y,w,h)=>`<image href="${src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
const NM={d:'Dai',e:'Erick',n:'',p:'Mensajes'};
/* flores */
const FL={l:'<path d="M0 0V-18" stroke="#4a9b5a" stroke-width="2"/><g transform="translate(0 -20)"><path d="M0-10L2.5-3 10-4 4 1 7 9 0 4-7 9-4 1-10-4-2.5-3Z" fill="#fff" stroke="#ff9ccf" stroke-width=".8"/><circle r="2" fill="#ffb347"/></g>',
g:'<path d="M0 0V-18" stroke="#4a9b5a" stroke-width="2"/><g transform="translate(0 -22)"><circle r="7" fill="none" stroke="#ffc928" stroke-width="5" stroke-dasharray="3.1 3.1"/><circle r="4.5" fill="#6b4226"/></g>',
t:'<path d="M0 0V-16" stroke="#4a9b5a" stroke-width="2"/><path transform="translate(0 -18)" d="M-6-8Q-7 4 0 6Q7 4 6-8L3-3 0-9-3-3Z" fill="#ff6f91"/>'};
const em=(c,s=26)=>`<text text-anchor="middle" font-size="${s}" y="8">${c}</text>`;
/* recuerdos (páginas del libro) */
const M={m1:['Primer mensaje','02/05/25','Una app, una noche y un mensaje. Todavía no nos conocíamos en persona, pero ya había algo especial.'],
m2:['Tu guitarra','','Negra con blanco, lista para sonar bajito mientras te pierdes en tu música.'],
m3:['Tus libros','','Historias de amor que se sienten en el pecho. La nuestra también, pero es de verdad.'],
m4:['El primer ramo de lirios','','Tu carita llena de ilusión al recibirlo. Esa felicidad se quedó guardada para siempre.'],
m5:['El parque japonés','12/10/25','No sabías a dónde íbamos… y aun así dijiste que sí. Ahí empezó nuestro noviazgo.'],
m6:['La casita soñada','','Jardín, piscina, mil gatitos, erizos y conejos. Con calma, juntos, de a poquito.']};
const LET=`Hola miamor, esta es otra carta que pus, como ves, viene con un videojuego JSJSJ 🎮💙

Hoy cumplimos 1 año de conocernos. Un año entero desde que coincidimos y la verdad sigo sin creérmela. No sé exactamente cómo ocurrió todo para que encajáramos, pero sé que te amo muchísimo y que no cambiaría absolutamente nada de nuestra historia. Cada mensaje, cada salida, cada desvelada hablando… todo ha valido la pena porque me llevó a ti.

Y la verdad, mi mayor meta es que lleguemos a ese sueño que tanto anhelamos tener nuestra propia casita, con la piscina, rodeados de todas nuestras mascotas (ya sabes, los gatitos, Dairick, el conejo) y, en un futuro, ver a nuestros hijos corriendo por el jardín. Quiero construir esa vida a tu lado, irla armando de a poquito, y despertarme todos los días sabiendo que logramos lo que un día solo imaginábamos.

Gracias por aguantarme este primer año, por enseñarme a amar de verdad y por ser mi lugar seguro. Eres mi paz y mi alegría al mismo tiempo. Esto es solo el primer nivel de nuestra vida juntos, todavía nos faltan muchísimas aventuras y logros por desbloquear.

Te amo de aquí a las estrellas, mi Dai. Felices 365 días desde que mi vida se volvió más bonita. Vamos por toda una vida juntos. Muaaaaaeeeee 👽💙`;
/* escenas */
const stars=(n,x0,y0,w,h)=>[...Array(n)].map((_,i)=>`<circle class="tw" cx="${x0+i*37%w}" cy="${y0+i*23%h}" r="${.8+i%3*.5}" fill="#fff" style="animation-delay:${i%7*.4}s"/>`).join('');
const sp=(x,y,h,fn,o)=>Object.assign({x,y,h,fn},o);
const say2=(t,f)=>()=>say([['d',t]],f||hint);
const SC={
room:{t:'Cap. 1 · Mensajes de noche',c:'#18246a',gy:262,
art:()=>`<rect width="400" height="300" fill="#18246a"/><circle cx="250" cy="190" r="70" fill="#ffd77a" opacity=".1"/><rect y="232" width="400" height="68" fill="#2c2f78"/><path d="M0 250H400M0 272H400" stroke="#3a3e92" stroke-width="2"/>
<rect x="62" y="58" width="76" height="70" rx="6" fill="#0b1450" stroke="#c7b8ff" stroke-width="4"/>${stars(9,66,64,64,58)}<circle cx="120" cy="82" r="9" fill="#fff4d6"/><path d="M100 58V128M62 93H138" stroke="#c7b8ff" stroke-width="2"/>
<rect x="158" y="118" width="64" height="84" fill="#6b4a8f"/>${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${162+i%4*15}" y="${124+(i>3)*40}" width="11" height="32" fill="${['#ff9ccf','#6f93ff','#ffd77a','#c7b8ff'][i%4]}"/>`).join('')}
<rect x="96" y="214" width="72" height="8" fill="#8a6aa8"/><rect x="102" y="222" width="6" height="30" fill="#8a6aa8"/><rect x="156" y="222" width="6" height="30" fill="#8a6aa8"/>
<rect x="268" y="190" width="132" height="62" rx="8" fill="#3e6bff"/><rect x="268" y="176" width="34" height="26" rx="8" fill="#fff4e0"/><rect x="302" y="198" width="98" height="54" fill="#6f93ff"/>`,
mk:()=>[sp(95,100,svgImg('assets/items/Varita Estrella de Caramelo.png',-18,-28,36,36),say2('Una varita de estrella… pediré un deseo. ¡Listo!')),
sp(245,95,em('👽'),say2('Alguien dejó un alien pegado en mi pared. Sospechoso')),
sp(190,168,em('📚'),()=>say([['d','Mis libros. QUIERO MAS!']],()=>gain('m3'))),
sp(28,226,em('🎸',32),()=>say([['d','Mi guitarra. Ya no he tocado canciones :(🎸']],()=>gain('m2'))),
sp(132,204,em('🖥️'),say2('Roblox y Minecraft abiertos… Jugare un ratito')),
sp(335,214,em('📱',30),phone)],
intro:()=>say([['n','Una noche cualquiera, hace no mucho. estas en tu cuarto.'],['d','Mmm… voy a ver mi celular un rato mas']],hint)},
park:{t:'Cap. 4 · El parque japonés',c:'#ffd9c2',gy:262,
art:()=>`<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f8fe8"/><stop offset=".6" stop-color="#ffc6d9"/><stop offset="1" stop-color="#ffe3b8"/></linearGradient></defs><rect width="400" height="300" fill="url(#sk)"/><circle cx="330" cy="62" r="24" fill="#fff4d6" opacity=".9"/>
<path d="M0 175Q80 120 160 165T320 150T400 175V300H0Z" fill="#7fb98f"/><rect x="190" y="130" width="8" height="60" fill="#7b5a48"/><circle cx="194" cy="118" r="34" fill="#ffb3cf"/><circle cx="350" cy="130" r="26" fill="#ffb3cf"/><rect x="347" y="138" width="6" height="50" fill="#7b5a48"/>
<g fill="#d8433f"><rect x="22" y="126" width="7" height="64"/><rect x="67" y="126" width="7" height="64"/><rect x="14" y="122" width="68" height="8" rx="3"/><rect x="22" y="138" width="52" height="5"/></g>
<rect y="190" width="400" height="110" fill="#8fcf9a"/><path d="M0 240Q200 222 400 245V288Q200 268 0 282Z" fill="#f2dfb7"/>
<ellipse cx="215" cy="208" rx="74" ry="17" fill="#5aa7e8"/><ellipse cx="190" cy="209" rx="9" ry="3.5" fill="#ff9a5c" class="koi"/><ellipse cx="240" cy="205" rx="8" ry="3" fill="#fff4e0" class="koi" style="animation-delay:-3s"/><ellipse cx="236" cy="212" rx="6" ry="2.5" fill="#4a9b5a"/><path d="M155 210Q215 178 275 210" stroke="#d8433f" stroke-width="6" fill="none"/>
${[[112,205],[318,214]].map(p=>`<circle cx="${p[0]}" cy="${p[1]-12}" r="26" fill="#ffd77a" opacity=".28"/><rect x="${p[0]-5}" y="${p[1]-20}" width="10" height="26" fill="#b9b3c9"/><rect x="${p[0]-8}" y="${p[1]-28}" width="16" height="10" fill="#ffd77a"/><path d="M${p[0]-11} ${p[1]-28}L${p[0]} ${p[1]-36}L${p[0]+11} ${p[1]-28}Z" fill="#8d86a3"/>`).join('')}
<rect x="312" y="228" width="44" height="6" fill="#8a5a3c"/><rect x="316" y="234" width="4" height="12" fill="#8a5a3c"/><rect x="348" y="234" width="4" height="12" fill="#8a5a3c"/>
${[...Array(7)].map((_,i)=>`<ellipse class="pe" cx="${30+i*55}" cy="-8" rx="3" ry="2" fill="#ffd1e3" style="animation-delay:-${i*1.3}s;animation-duration:${8+i%3}s"/>`).join('')}`,
mk:()=>{const f=(id,t,x,y)=>{const src=t=='g'?'assets/items/Girasol chibi sobre fondo transparente.png':t=='t'?'assets/items/tulipan.png':null;const flower=src?svgImg(src,-15,-31,30,34):FL[t];const o={id,x,y,h:`<g transform="scale(1.3)">${flower}</g>`,hide:S.fl.includes(id),fn:()=>pick(o,t)};return o};
const a=[f('f0','l',52,226),f('f1','l',352,246),f('f2','g',135,232),f('f3','g',292,224),f('f4','t',245,248),f('f5','t',92,250),
sp(190,214,em('🐟'),say2('Este pez me está juzgando por no encontrar las flores rápido jeje like 🐟')),
sp(112,206,em('🏮',24),say2('Una farolita que pro✨'))];
if(S.fl.length>5)a.push(LS());return a},
intro:()=>say([['n','Un camino de piedras, cosa japonesas y un estanque que brilla. No sabes a dónde te trajo Erick…'],['d','¿Dónde estamos? Solo me dijo que confiara en él 👀'],['p','Erick: Confía en tu aliensote 👽 JKASJSA. Junta flores, que ahorita te alcanzo.']],hint)},
home:{t:'Epílogo · La casita soñada',c:'#bfe6ff',gy:268,
art:()=>`<rect width="400" height="300" fill="#bfe6ff"/><ellipse cx="300" cy="50" rx="40" ry="12" fill="#fff"/><ellipse cx="90" cy="35" rx="34" ry="10" fill="#fff"/><rect y="200" width="400" height="100" fill="#8fd49a"/>
<rect x="36" y="112" width="140" height="92" fill="#fff4e0"/><path d="M26 114L106 58L186 114Z" fill="#3e6bff"/><rect x="92" y="150" width="26" height="54" rx="4" fill="#ff9ccf"/><rect x="48" y="130" width="30" height="26" rx="3" fill="#ffd77a"/><rect x="134" y="130" width="30" height="26" rx="3" fill="#ffd77a"/>
<rect x="228" y="206" width="150" height="40" rx="14" fill="#62c6f2" stroke="#fff" stroke-width="4"/><path d="M240 222Q252 214 264 222T288 222T312 222T336 222T360 222" stroke="#fff" stroke-width="2" fill="none"/>
<rect x="362" y="130" width="8" height="64" fill="#7b5a48"/><circle cx="366" cy="118" r="30" fill="#5fb878"/><path d="M0 250H20M0 240V260" stroke="#fff4e0" stroke-width="3"/>${[8,24,40,56].map(x=>`<rect x="${x}" y="212" width="8" height="24" fill="#fff4e0"/>`).join('')}`,
mk:()=>{const c=(x,y,e,t)=>sp(x,y,em(e,28),()=>say([['d',t]],()=>{if(++hn==3)endg();else hint()}),{once:1});
return[c(70,240,'🐱','Un gatito se me frota en la pierna. Siiii tengo mil gatitos 🐾'),c(205,246,'🐈','Este gato se durmió en mi zapato. No pienso moverlo 😹'),c(150,258,'😺','Gatito con cara de «dame comidaa». Lo siento, no tengo Takis jeje like 😂'),c(330,254,'🦔','¡Un erizooo! Tu eres Dairick? 🥹'),c(260,236,'🐇','Un conejito esponjoso saltando en el pasto 🐰')]},
intro:()=>say([['n','Una casa con jardín, una piscina y muchos gatitos. Esto es lo que soñamos.'],['d','Esto es lo que soñamos… ¿verdad? 🥹']],()=>{say([['n','Acaricia a tres mascotas del jardin 🐾']],hint)})}};
/* Fondos PNG: cada imagen reemplaza por completo el dibujo del escenario. */
const BG={
 room:'assets/backgrounds/Dormitorio acogedor bajo la luz de la luna.png',
 park:'assets/backgrounds/parque-japones.png',
 home:'assets/backgrounds/Patio soleado con casa, árbol y piscina.png',
 bus:'assets/backgrounds/Atardecer urbano con autobuses verdes.png',
 villa:'assets/backgrounds/Casa Pastel con Fuente y Tienda.png',
 casa5:'assets/backgrounds/Lata Ultra Peachy Keen en interior pastel.png'
};

/* acciones */
function phone(){say([['p','Erick: Holaaa 👽'],['p','Erick: Como te llamas?']],()=>ask('d','¿Qué le respondes?',[['Holaaa Dai y tu?',()=>say([['p','Erick: Qué bueno 🥹 me gusta hablar contigo'],['n','Fue el 02/05/25. Dos personas, una app y ninguna idea de lo que venía.']],()=>gain('m1'))],['¿Quién eres, alien? 😏',()=>say([['p','Erick: Un alien muy amigable, te lo juro 👽'],['n','Te hizo reír. Fue el 02/05/25. Ahí empezó todo.']],()=>gain('m1'))]]))}
const GOAL={room:[1,['m1','m2','m3'],'Tres recuerdos recogidos. Una página más del libro se ilumina 💙'],park:[4]};
function chk(){const g=GOAL[cur];if(g&&g[1]&&!S.ch[g[0]]&&g[1].every(m=>S.mem.includes(m)))setTimeout(()=>say([['n',g[2]]],()=>{S.ch[g[0]]=1;save();menu()}),400)}
function gain(id){if(!S.mem.includes(id)){S.mem.push(id);save();tone(784,.5);toast('📖 Nueva página: '+M[id][0])}hud();chk();if(GOAL[cur])hint()}
function pick(o,t){o.hide=1;S.fl.push(o.id);save();tone(880,.4);drawSpots();const T={l:'¡Un lirio! uy mi flor favorita 🤍',g:'Un girasol… esta mirando la luz🌻',t:'Un tulipán chiquito, ¡me lo llevooo! 🌷'},lil=S.fl.includes('f0')&&S.fl.includes('f1'),L=[['d',T[t]]];
if(t=='l'&&lil)L.push(['n','Lirios.💙']);
say(L,()=>{if(t=='l'&&lil)gain('m4');if(S.fl.length==6)allF();else hint()})}
const LS=()=>sp(330,236,em('💌',30),letter);
function allF(){say([['n','¡Ramo completo! Lirios, girasoles y tulipanes. En la banca junto al estanque hay un sobre azul 💌']],()=>{spots.push(LS());drawSpots();hint()})}
function letter(){modal(`<div class="lt">Hola ñiña, si lees esto será porque dijiste que sí y por fin somos novios. Te amo.

Ya ha pasado tiempo desde que te conocí, pero nunca olvidaré ese día, porque para mí fue el mejor de todos. No voy a olvidar que contigo todo fue diferente; aunque no te conocí de una manera común, me alegra que así fuera, porque eso es único y muy pocos pueden experimentarlo. No sé cómo pasó, pero me fui enamorando de ti. No creí enamorarme de una forma así, pero cuando sentí la gran conexión que empezamos a tener, supe que esto no iba a ser solo una amistad, sino un vínculo que yo quería tener contigo, Dai.

Desde que te conozco todo cambió en mi vida. No paraba de pensar en si ya había un mensaje tuyo; me ayudaste a crecer y a entender más el amor, que no solo es decirlo sino sentirlo, tener la paciencia para entenderte, poder cuidarte y no solo enseñarte yo cosas, sino también aprender de ti, mi amorcita. Gracias a ti descubrí la parte que yo quería saber de mí, y era demostrar mi amor con todo mi corazón a una persona que lo mereciera, y esa fuiste tú. Y aún falta más.
Contigo aprendí que no necesito ser perfecto para ser amado, sino solo ser yo y demostrarlo todo siendo sincero. Me hiciste creer en las segundas oportunidades, en el cariño y en el amor que no se pierde con la distancia. Tú me diste motivos para levantarme en los momentos que para mí ya no valían la pena.
Te agradezco todo lo que has hecho por mí. Gracias por estar, gracias por quedarte.👽

Cada momento desde que te conocí fue único; cada palabra tuya es especial para mí. Cada mensaje tuyo es como un despertar para mi corazón. Cuando tengo la oportunidad de verte, solo quiero mirarte, porque para mí eres hermosa… más que hermosa. En verdad no hay nada que no me guste de tu belleza. Dai, tú eres más que un arte, y por eso amo amarte: porque eres bastante, pero bastante preciosa. Me da igual si tienes el pelo corto, perforaciones o no, maquillaje o no: para mí eres bellísima, simplemente perfecta. Amo pensarte en cada momento, cada pensamiento tuyo me llena de alegría. Cada que te sueño, cada segundo que estás en mi mente, hace que me enamore cada día más de ti.

Amo que tú fuiste la primera en mi vida que me dio más bonitos recuerdos que malos. Nuestro vínculo es perfecto: cada palabra nuestra, cada cosa que nos recuerda al uno del otro, lo amo. Yo creo que lo nuestro no fue solo casualidad; ya estábamos destinados a encontrarnos, porque no hay explicación tan tremenda de cómo pasó. Y soy, y siempre seré, feliz si estás tú.

Quiero seguir siendo tu compañero, tu mejor amigo y ahora tu novio. Quiero seguir estando junto a ti, seguir creciendo juntos, seguir creando recuerdos que solo nosotros podamos entender. Quiero estar para ti pase lo que pase; quiero acompañarte en tus momentos más felices, apoyarte en los momentos tristes, abrazarte hasta explotar de amor… porque te amo, y nunca pararé de sentir amor por ti. Nunca dejaré de recordarte que te amo, Dai, y si algún día no lo hago, perdóname, pero con esta carta me alegra decírtelo.

Gracias por existir. Gracias por no dejarme. Gracias por dejarte amar por mí. Gracias por ser ahora mi novia. Este es solo el comienzo, y juro serte fiel y leal a ti, cuidarte y protegerte, y proteger este amor que tengo por ti.

Te amo, Dai. Te amo mucho más de lo que las palabras puedan escribir.
Muaaaaaaaeeeeeeeeeee 💜

 -Tu alien Erick 👽</div><button class="b" onclick="cm()">Levantar la mirada</button>`,()=>{showE(300);say([['e','¡Sorpresaaa! JSJSJ… ¿te gustó el lugar, mi Dai?'],['e','Te traje sin decirte nada porque quería que fuera especial.'],['e','Dai… ¿quieres ser mi novia?']],()=>ask('d','¿Qué respondes?',[['¡Sí, mil veces! 💙',yes],['Mmm… déjame pensarlo… 😏',()=>say([['d','…ya. Sí. Obvio sí 💙'],['e','No asustes miamorr 🥹']],yes)]]))})}
function yes(){say([['e','Muaaaaa 🥹 te amooo, Dai.'],['n','12/10/25. Empieza su noviazgo, entre flores, luces cálidas y un estanque.']],()=>{gain('m5');S.ch[4]=1;save();setTimeout(menu,600)})}
function endg(){showE(300);say([['e','¡Miamorcitaaa! Por fin llegas a la casitaa 👽'],['d','¿Esto es… lo que soñamos?'],['e','Todavía es un sueño, pero espero se cumpla… pero aquí vamos, juntos.'],['e','Tengo algo para ti. Es una carta, no te rías si es nuv JSAKJAS.']],()=>modal(`<div class="lt">${LET}</div><button class="b" onclick="cm()">💙</button>`,()=>{gain('m6');S.ch[6]=1;save();fin()}))}
function showE(x){$('#ak').insertAdjacentHTML('beforeend',actor('erick','e',x,39))}
/* motor */
function drawSpots(){$('#sg').innerHTML=spots.map((s,i)=>s.hide?'':`<g class="spot${s.z?' done':''}" data-i="${i}" style="transform:translate(${s.x}px,${s.y}px)"><circle r="22" fill="#fff" fill-opacity=".001"/>${s.h}<text class="sp2" y="-24" text-anchor="middle" font-size="11">✨</text></g>`).join('')}
function go(k){cur=k;const s=SC[k];gy=s.gy;dx=40;hn=0;scr.style.display='none';stage.style.background=s.c;stage.innerHTML=`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet"><image href="${BG[k]}" x="0" y="0" width="400" height="300" preserveAspectRatio="xMidYMid slice"/><g id="sg"></g><g id="ak">${actor('dai','d',dx,36)}</g></svg>`;spots=s.mk();spots.forEach(p=>{if(p.id==null&&!p.once)p.z=0});
spots.forEach(p=>{if(p.m&&S.mem.includes(p.m))p.z=1});if(k=='room')spots.forEach((p,i)=>{if([2,3,5].includes(i)&&S.mem.includes(['m3','m2','m1'][[2,3,5].indexOf(i)]))p.z=1});drawSpots();hud();busy=0;s.intro()}
function walk(x,cb){x=Math.max(24,Math.min(376,x));const a=$('#dai'),d=Math.abs(x-dx);if(d<4){cb&&cb();return}busy=1;a.style.transition=`transform ${d/110}s linear`;a.classList.add('walk');a.firstChild.style.transform=x<dx?'scaleX(-1)':'scaleX(1)';a.style.transform=`translate(${x}px,${gy}px)`;setTimeout(()=>{dx=x;busy=0;a.classList.remove('walk');cb&&cb()},d/110*1000+40)}
stage.onclick=e=>{if(busy||!cur)return;const g=e.target.closest('.spot'),v=stage.querySelector('svg');if(g){const s=spots[+g.dataset.i];if(s.once&&s.z)return;walk(s.x,()=>{s.z=1;drawSpots();s.fn()})}else{const r=v.getBoundingClientRect(),k=Math.min(r.width/400,r.height/300);walk((e.clientX-r.left-(r.width-400*k)/2)/k)}};
document.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();if(dlg.onclick)return dlg.onclick();if(busy||!cur)return;const i=spots.findIndex(s=>!s.hide&&!(s.once&&s.z)&&Math.abs(s.x-dx)<36);if(i>=0){spots[i].z=1;drawSpots();spots[i].fn()}}if(busy||!cur)return;if(e.key=='ArrowLeft')walk(dx-30);if(e.key=='ArrowRight')walk(dx+30)};
function say(L,done){busy=1;let i=0;const n=()=>{if(i>=L.length){dlg.onclick=null;busy=0;done&&done();return}const[w,t]=L[i++];dlg.innerHTML=`<div class="pt">${pt(w)}</div><div class="tx"><b>${NM[w]}</b><p>${t}</p></div>`;dlg.onclick=n;tone(520+i*40,.15,.03)};n()}
function ask(w,t,o){busy=1;dlg.onclick=null;dlg.innerHTML=`<div class="pt">${pt(w)}</div><div class="tx"><b>${NM[w]}</b><p>${t}</p><div class="ch"></div></div>`;o.forEach(x=>{const b=document.createElement('button');b.className='b';b.textContent=x[0];b.onclick=()=>{busy=0;x[1]()};dlg.querySelector('.ch').appendChild(b)})}
function hint(){busy=0;dlg.onclick=null;dlg.innerHTML=`<div class="tx"><p>${cur=='park'?'🌷 Flores: '+S.fl.length+'/6 · ':cur=='casa5'?'🧸 Peluches: '+(S.pl||[]).length+'/4 · ':''}Toca los objetos que tienen ✨ o camina con Tocando el suelo.</p></div>`}
/* interfaz */
function modal(h,x){const o=$('#md');if(o)o.remove();else pb=busy;busy=1;mc=x;const m=document.createElement('div');m.className='mod';m.id='md';m.innerHTML=`<div class="card">${h}</div>`;document.body.appendChild(m)}
function cm(){const m=$('#md');if(m)m.remove();busy=pb;const f=mc;mc=null;f&&f()}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),3000)}
function hud(){$('#hud').innerHTML=`<button class="b ib" onclick="pause()" aria-label="Pausa">⏸</button><div class="pill">${cur?SC[cur].t:'Aventura pro'}</div><button class="b ib" onclick="mems()" aria-label="Recuerdos">📖<small>${S.mem.length}</small></button><button class="b ib" onclick="sndT()" aria-label="Sonido">${on?'🔊':'🔇'}</button>`}
function pause(){modal(`<h2 style="margin:0">Pausa 💙</h2><button class="b" onclick="cm()">Seguir jugando</button><button class="b alt" onclick="cm();menu()">Capítulos</button><button class="b alt" onclick="sndT();cm();pause()">Sonido: ${on?'activado':'desactivado'}</button><button class="b alt" onclick="rst()">Reiniciar partida</button>`)}
function mems(){modal(`<h2 style="margin:0">Libro de recuerdos</h2>`+Object.keys(M).map(k=>S.mem.includes(k)?`<div class="mm"><b>${M[k][0]}</b> <small>${M[k][1]}</small><br>${M[k][2]}</div>`:`<div class="mm"><small>🔒 Página por descubrir</small></div>`).join('')+`<button class="b" onclick="cm()">Cerrar</button>`)}
function rst(){modal(`<p><b>¿Reiniciar la partida?</b> Se borrarán los recuerdos y el progreso guardados.</p><button class="b" onclick="doR()">Sí, reiniciar</button><button class="b alt" onclick="cm()">Cancelar</button>`)}
function doR(){S={ch:{},mem:[],fl:[]};save();cm();title()}
const C=[[1,'Mensajes de noche','🌙','room'],[2,'El camión RTP','🚌','bus'],[3,'La Villa','⛲','villa'],[4,'El parque japonés','🏮','park'],[5,'Nuestras cositas','🐨','casa5']];
function menu(){cm();cur=0;hud();stage.innerHTML='';hint();const n=Object.keys(M).length,rdy=C.filter(c=>c[3]).every(c=>S.ch[c[0]]);scr.style.display='flex';
scr.innerHTML=`<h2>Capítulos</h2><div class="bar"><i style="width:${S.mem.length/n*100}%"></i></div><small>${S.mem.length} de ${n} páginas del libro</small>`+C.map(c=>`<button class="b ch ${S.ch[c[0]]?'ok':''}" ${c[3]?'':'disabled'} onclick="go('${c[3]}')">${c[2]} Cap. ${c[0]} · ${c[1]}<small>${S.ch[c[0]]?'✔ completado (puedes volver a jugarlo)':c[3]?'Jugar':'Próximamente'}</small></button>`).join('')+
`<button class="b ch ${S.ch[6]?'ok':''}" ${rdy?'':'disabled'} onclick="go('home')">🏡 Epílogo · La casita<small>${rdy?'Desbloqueado':'Se desbloquea al completar los capítulos disponibles'}</small></button><button class="b alt" onclick="title()">Volver al título</button>`}
function fin(){cur=0;hud();stage.innerHTML='';hint();scr.style.display='flex';scr.innerHTML=`<div class="pr"><svg viewBox="0 0 100 160">${A.d}</svg><svg viewBox="0 0 100 160">${A.e}</svg></div><h2>Fin de la primera parte 💙</h2><p>Gracias por jugar, Dai. El camión, La Villa, Mila y Tomi y más aventuras esperan su turno.</p><button class="b" onclick="modal('<div class=lt>'+LET+'</div><button class=b onclick=cm()>💙</button>')">💌 Releer la carta</button><button class="b alt" onclick="menu()">Volver a los capítulos</button>`}
function title(){cm();cur=0;hud();stage.innerHTML='';hint();const p=S.mem.length||Object.keys(S.ch).length;scr.style.display='flex';
scr.innerHTML=`<div class="pr"><svg viewBox="0 0 100 160">${A.d}</svg><svg viewBox="0 0 100 160">${A.e}</svg></div><h1>Aventura pro</h1><p style="margin:0">Un juego para Dai 💙</p><button class="b" onclick="${p?'menu()':"go('room')"}">${p?'Continuar':'Empezar'}</button>${p?'<button class="b alt" onclick="rst()">Partida nueva</button>':''}<button class="b alt" onclick="sndT()">${on?'🔊 Sonido activado':'🔇 Activar sonido (opcional)'}</button>${ok?'':'<small>⚠️ Este navegador no permite guardar el progreso.</small>'}`}
title();

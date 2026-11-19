# Contexto del proyecto — "Mi Carrera"

## Qué es

Juego web de simulación de carrera futbolística. El jugador elige nombre, posición, nacionalidad, ritmo de decisiones y una meta opcional. Arranca a los 16 años en un club de ascenso y avanza temporada a temporada hasta el retiro (máx. 40 años), tomando decisiones de fichajes y eventos de vida.

Es un proyecto **sin build, sin dependencias y sin servidor**: HTML + CSS + JS clásicos que se abren directamente en el navegador.

## Cómo ejecutarlo

```
Abrir index.html con doble clic.
```

Si el navegador restringe `localStorage` en `file://`, serví la carpeta:

```
npx serve .
# o
python -m http.server 8000
```

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Markup de las 3 pantallas (inicio, juego, fin) + carga de scripts |
| `styles.css` | Variables, tema claro/oscuro, layout mobile-first (max 520px) |
| `data.js` | Datos puros: posiciones, torneos, lesiones, rasgos, nacionalidades, eventos |
| `leagues.js` | 11 ligas, 20 divisiones y ~430 clubes reales con fuerza `k` |
| `game.js` | Lógica: estado, simulación, ofertas, eventos, UI, persistencia |
| `assets/escudos/` | 424 escudos PNG + `crests.json` con el manifiesto |
| `assets/trofeos/` | 45 logos/trofeos de ligas, copas y torneos |
| `assets/CREDITOS.md` | Fuente, licencias y clubes sin escudo |
| `scripts/` | Scrapers y descargadores de assets (no se usan en runtime) |
| `CONTEXT.md` | Este documento |
| `Mi Carrera.html` | Versión original monolítica (se conserva como referencia) |

Orden de carga: `leagues.js` → `data.js` → `game.js`. Son scripts clásicos, así que comparten el entorno léxico global (`const`/`let` de nivel superior son visibles entre archivos).

## Flujo del juego

```
Inicio → go(posición)
  → seedUp()            // siembra el PRNG local rnd()
  → crea estado S
  → trait()             // asigna rasgo aleatorio
  → panel de 4 ofertas iniciales
  → step()  (bucle)
       ├─ retire()? → fin()
       ├─ edad ≥ 34 → askRetire()
       ├─ ventana de decisión → offer() | event2()
       └─ season() → edad++ → step() (delay = S.spd)
```

- **Ventana de decisión**: desde los 18, cada `S.f` temporadas (1 o 2).
- **Oferta** si el OVR está muy por debajo del nivel del club, si pasaron 3 ventanas sin oferta, o 45 % al azar. Las ofertas priorizan el mismo país/división; las del exterior son más raras y se filtran por confederación, OVR y edad.
- **Evento** en caso contrario (`event2()`), con eventos filtrados por edad/nivel y sin repetir hasta agotar el pool.
- **Velocidad**: `#sp` define `S.spd` (320 ms normal, 120 rápida, 0 instantánea).

## Modelo de estado (`S`)

Creado en `go()`.

| Campo | Significado |
|---|---|
| `p` | Posición `[nombre, prob. gol, prob. asistencia, emoji]` |
| `nt` | Nacionalidad (objeto de `NT`) |
| `n` | Nombre del jugador |
| `age` | Edad actual (16 → 40) |
| `ovr` / `pot` | Nivel actual / techo |
| `tier` | Derivado de `tierOf(k, div)`: 0 Ascenso, 1 Primera, 2 Club grande, 3 Europa, 4 Élite |
| `club`, `k`, `tl`, `lg`, `cp` | Club, fuerza, torneos, liga, copa |
| `pj`, `g`, `a` | Partidos, goles, asistencias |
| `t` | Títulos totales |
| `caps`, `cg`, `ca` | Partidos/goles/asist. con la selección |
| `peak`, `pv` | OVR pico y valor máximo |
| `pal` | Palmarés `[nombre, emoji, tier]` |
| `cj` | Partidos por club |
| `gk` | Stats de arquero `{p, m, v}` |
| `seen` | Eventos ya vistos (anti-repetición) |
| `gb`, `ij` | Bonus de crecimiento, prob. de lesión |
| `mod` | Modificador temporal de rendimiento (se resetea cada temporada) |
| `mt` | Meta elegida (0 = sin meta) |
| `spd` | Delay entre temporadas en ms |
| `lgId` | Liga actual (`ENG`, `ESP`, `ARG`, …) |
| `div` | División actual (1 o 2) |
| `lg`, `cp` | Nombre de la liga/división y de la copa |
| `slot` | Copa continental para la próxima temporada |
| `pos` | Última posición en la liga |
| `rel` | Relaciones `{dt, hin, pre, dir}` (0–100) |
| `ag`, `agOff`, `agB` | Representante: índice, modificador de ofertas y bonus de club |
| `injured` | Lesión grave pendiente de decisión |
| `ch` | Índice de desafío (-1 = modo libre) |
| `chDone` | Objetivo del desafío cumplido |
| `ctr` | Contrato `{w, y, cl, s}`: sueldo en €K/semana, años restantes, cláusula en €M y edad al firmar |
| `money` | Patrimonio acumulado en millones de € |
| `free` | Quedó libre al vencer el contrato |
| `pre` | Acción de pretemporada elegida para la temporada en curso `{pj, g, a, inj, gr, mod, gk, dt, hin, press}` |
| `preAge` | Edad en la que ya se eligió la pretemporada |
| `fc` | Club formador (primer club) |
| `home` | Club de origen durante un préstamo |
| `ra`, `asked`, `since` | Control de retiro y ventanas de decisión |
| `lab`, `sc` | Etiqueta y puntaje final (se setean en `fin()`) |

## Constantes de contenido (`data.js`)

- `POS` — 9 posiciones con probabilidades de gol/asistencia.
- `CL` — legado: 5 tiers de clubes; ya no se usa desde `leagues.js`.
- `CA` — legado: clubes de Arabia; reemplazado por `ALL_CLUBS` de `ARA`.
- `TN` / `EX` / `AM` — nombres de tier, OVR de entrada y edad máxima por tier.
- `TT` — legado: torneos por tier; ya no se usa desde `leagues.js`.
- `INJ` — 4 tipos de lesión con peso, penalización de OVR y duración.
- `TR` — 8 rasgos: Crack precoz, Late bloomer, Propenso a lesiones, Líder, Disciplinado, Goleador nato, Nómada, Resiliente.
- `NT` — 20 nacionalidades distintas, con copa continental y `d2`. El selector muestra solo el nombre del país, sin el prefijo "Nacionalidad:" y sin duplicados.
- `EV` — 8 eventos base (6 comunes + lesión grave + capitanía).
- `EV2` — 21 eventos condicionales por edad/tier/nivel y relaciones.
- `SEL` — evento de convocatoria a la selección.
- `AGENTS` — 3 perfiles de representante.
- `PRE` — 15 acciones de pretemporada (generales, de arquero y de defensor).
- `CH` — 10 desafíos de club, cada uno con club, liga, meta y `goal()` propio.
- `LEAGUES` / `ALL_CLUBS` / `tierOf` — ligas, clubes y mapeo a tiers (`leagues.js`).

## Funciones clave (`game.js`)

| Función | Rol |
|---|---|
| `go(i)` | Inicializa la partida para la posición `i` |
| `step()` | Bucle principal: retiro → agente libre → contrato por vencer → decisión → pretemporada → temporada |
| `preSeason()` | Muestra 4 acciones de pretemporada y guarda la elegida en `S.pre` |
| `playSeason()` | Ejecuta `season()` y el post-temporada (préstamo, lesión, edad) |
| `season()` | Simula una temporada (crecimiento, lesiones, títulos, selección, premios) |
| `offer()` | Genera ofertas realistas priorizando el mismo país/división |
| `event2()` | Elige y muestra un evento de vida |
| `panel(txt, opts, fn)` | Renderiza un panel de decisión con botones |
| `head()` | Actualiza la cabecera (club, OVR, valor, color) |
| `fin()` | Cierra la carrera, calcula puntaje y etiqueta |
| `extras()` | Meta, efemérides, guarda en `localStorage` |
| `hist()` | Muestra la mejor carrera guardada |
| `val()` | Calcula valor de mercado realista (OVR, edad, potencial, posición y tier) |
| `valueOf(ovr,age,pot,pos,tier)` | Valor de mercado para cualquier club/edad |
| `wageOf(ovr,age,pot,pos,tier,k)` | Sueldo semanal estimado en €K |
| `contractTerms(x,kind)` | Términos base, corto o con cláusula baja para un club |
| `signContract(x,terms)` | Firma y guarda `S.ctr`; quita el estado de agente libre |
| `contractLine()` | Texto compacto del contrato actual |
| `negotiate(x,done)` | Panel de negociación: firmar, pedir aumento, cláusula baja o contrato corto |
| `fm(m)` | Formatea millones/miles/mil millones en euros |
| `oc(o)` | Color del badge según OVR |
| `M(n)` | Traduce nombres genéricos de torneo al torneo real del club |
| `sv(x)` | Copia club/tier/torneos al estado |
| `seedUp()` | Siembra el PRNG local `rnd()` |
| `restoreRnd(v)` | Restaura el estado del PRNG |
| `saveRun()` | Guarda la partida en curso |
| `checkRun()` | Muestra/oculta "Continuar carrera" |
| `continueRun()` | Restaura y reanuda la partida |
| `newSeed()` | Genera un código base36 de 6 caracteres |
| `scrollEnd(el)` | Scroll único con debounce |
| `relBar(vid,bid,v)` | Actualiza una barra de relación |
| `injuryPanel(done)` | Panel de decisión para lesiones graves |
| `drawCard()` | Dibuja la tarjeta de despedida en `<canvas>` (async: espera escudo y trofeos) |
| `renderHf()` | Renderiza el Salón de la Fama con filtros |
| `simLeague(g)` | Simula la tabla de la liga y devuelve la posición |
| `continentalSlot(pos,conf)` | Calcula el cupo continental según la posición |
| `leagueOf(id)` / `tierOf(k,div)` | Resuelve liga y tier desde los datos |
| `crestSrc(lgId,club)` | Construye la ruta `assets/escudos/{liga}-{slug}.png` |
| `hasCrest(lgId,club)` | Indica si el club tiene escudo descargado |
| `setCrest(el,lgId,club)` | Pinta el escudo en la cabecera o el badge de iniciales |
| `trophySrc(nombre)` | Mapea el nombre del título al logo en `assets/trofeos` |
| `loadImg(src)` | Precarga y cachea imágenes para la tarjeta |

## Semillas y determinismo

`seedUp()` reemplaza **solo la variable local `rnd`** (no `Math.random` global) con un PRNG tipo mulberry32. La semilla se hashea con `a*31 + charCode`.

- Sin semilla se genera un código **base36 de 6 caracteres** (~2.100 millones de combinaciones).
- El código se muestra al final ("Código: XXXXXX") para comparar con amigos.
- La misma semilla + mismas elecciones = misma carrera, incluido el confeti.

## Valor de mercado

`val()` devuelve millones de euros y se recalcula en cada temporada:

```
base = 3.4e-7 * max(0, OVR - 40)^5
valor = base * edad * potencial * posición * liga
```

- **Edad**: 16–18 ×1.6, 19–21 ×1.45, 22–24 ×1.25, 25–27 ×1.1, 28–29 ×0.95, 30–31 ×0.75, 32–33 ×0.5, 34–35 ×0.3, 36+ ×0.15.
- **Potencial**: `1 + max(0, pot - ovr) * 0.008` (premio por margen de crecimiento).
- **Posición**: arquero ×0.85, defensor ×0.9, mediocampista ×0.97, delantero ×1.05.
- **Tier**: 0 ×0.5, 1 ×0.72, 2 ×1.0, 3 ×1.1, 4 ×1.22.
- **Piso**: €50K. **Tope**: €250M.

Ejemplos: 80 OVR / 25 años / tier 4 ≈ €51M; 90 OVR / 27 años ≈ €150M; 94 OVR ≈ €220M.

## Ofertas

`offer()` arma 2–4 opciones:

- **Renovación** si el DT te quiere (`rel.dt >= 25`) o la dirigencia confía en vos (`rel.dir >= 60`), y tu OVR está cerca del nivel del club.
- **Misma división y país**: la opción más común. El club puede ser más fuerte, parecido o más débil.
- **Otra división del mismo país**: salto a Primera si rendís; descenso a Segunda solo si estás flojo.
- **Exterior**: probabilidad baja (10 % en segunda, 28 % en primera, más bonus por agente/OVR). Se filtra por confederación, fuerza del club, edad y OVR. Un jugador de la Primera Nacional argentina no recibe ofertas del Championship; para saltar a Europa necesita OVR 70+ y estar en primera.
- **Jugadores de 79+**: `canJoin()` les permite saltar a cualquier tier (respetando `AM[tier]`). `offer()` agrega una oferta de club grande (`k >= 0.78`) con 80–90 % de probabilidad y otra de élite (`k >= 0.88`) con 35–75 %. Así un 79 de un club chico recibe a Real Madrid, Barcelona, Bayern, PSG, Inter, etc.
- **Alcance**: `reach` = 0.65 para 79+, 0.32 para jugadores por encima del nivel del club y 0.18 para el resto. El club oferente no puede estar más de `reach` por encima de la fuerza actual.
- **78 o menos**: solo pueden subir un tier, con el umbral `EX[tier] - 4`. Un 78 recibe clubes grandes de tier 3 (Roma, Lazio, Fiorentina), pero no la élite.
- **Arabia Saudita**: oferta especial para 29+.
- **Préstamo**: solo dentro del mismo país y si no estás libre.
- **Agente libre**: si el contrato vence, el panel cambia a "Quedaste libre" y podés firmar con cualquier club que te acepte.
- **Texto**: muestra la liga/división real, el motivo (`misma categoría`, `salto a Primera`, `volver a Argentina`, `club más exigente`, `más minutos`) y el sueldo estimado en €K/semana. Nunca dice "Europa" para un club sudamericano.

## Contratos

Cada fichaje o renovación abre `negotiate()` con cuatro caminos:

| Opción | Efecto |
|---|---|
| **Firmar la oferta** | Sueldo base, 3 años, cláusula = 2× valor |
| **Pedir más sueldo** | +30 % de sueldo, pero puede fracasar y retirar la oferta |
| **Cláusula baja** | Cláusula = 1,1× valor, sueldo −8 % |
| **Contrato corto** | 2 años, sueldo +5 %, cláusula = 1,6× valor |

- **Sueldo**: `wageOf()` parte del 12 % del valor de mercado, con piso por tier y ajuste por fuerza del club. Se muestra en €K/semana.
- **Riesgo**: `0.5 + (rel.dir − 50)/250 + bonus del agente + (OVR − EX[tier])/100`, entre 15 % y 90 %. Si falla, la dirigencia retira la oferta (fichaje) o rechaza la mejora (renovación) y `rel.dir` baja 6.
- **Duración**: `S.ctr.y` baja 1 por temporada. Al llegar a 0, `S.free = true` y el próximo `step()` fuerza el panel de agente libre.
- **Patrimonio**: cada temporada suma `w * 52 / 1000` millones de € a `S.money`.
- **Dirigencia**: `rel.dir` sube con buenas temporadas y posiciones de podio, y baja con malas campañas o negociaciones fallidas.
- **Interfaz**: la franja `#ctrBox` muestra sueldo, años y cláusula; la barra "Dirigencia" se suma a DT, Hinchada y Prensa.
- **Ofertas antes del vencimiento**: si te queda 1 año de contrato, `step()` abre el panel de ofertas aunque no sea ventana de decisión. El texto avisa "Te queda un año de contrato" y la renovación queda disponible para evitar quedar libre seguido.

## Pretemporada

Antes de cada temporada se eligen **4 acciones al azar de un pool de 15** (`PRE`). Cada acción modifica la simulación de esa temporada:

| Efecto | Qué cambia |
|---|---|
| `pj` | Multiplicador de partidos jugados |
| `g` / `a` | Multiplicador de goles / asistencias |
| `inj` | Suma a la probabilidad de lesión |
| `gr` | Suma al crecimiento de OVR |
| `mod` | Suma a la forma de la temporada |
| `gk` | Multiplicador de penales atajados, mano a mano y vallas |
| `dt`, `hin`, `press` | Cambios en las relaciones con DT, hinchada y prensa |

- Los arqueros no reciben acciones de goles/asistencias y sí acciones de reflejos y salida en juego.
- Los defensores reciben "Trabajo defensivo".
- La acción se guarda en `S.pre`, se aplica en `season()` y se limpia al terminar la temporada.
- `S.preAge` evita que la pretemporada se repita en la misma edad.

## Desafíos de club

`CH` tiene 10 desafíos. Cada uno define club, liga, división, fuerza, meta y una función `goal()` que se evalúa al retirarse:

| Desafío | Club | Objetivo |
|---|---|---|
| Chacarita a la Libertadores | Chacarita | Ganar la Copa Libertadores |
| Ajax campeón de Europa | Ajax | Ganar la Champions League |
| Valencia a la cima | Valencia | Llegar a 85 de OVR |
| Rey del Bernabéu | Real Madrid | Ganar la Champions League |
| Salvar al Lobo | Gimnasia | Terminar la primera temporada fuera del descenso |
| Ascenso histórico | Deportivo Madryn | Ascender con el club |
| Rey de Arabia | Al-Nassr | Ganar la Saudi Pro League y la AFC Champions League |
| Milagro en Turquía | Trabzonspor | Ganar la Süper Lig |
| La joya del Ajax | Ajax | Ganar el Balón de Oro |
| Doble corona en Porto | Porto | Ganar la Primeira Liga y la Europa League |

`S.chDone` se activa en `season()` para los desafíos de salvación y ascenso. El resto se evalúa contra `S.pal`. El resultado se muestra en `#gl` como "Desafío: … ✅ Cumplido" o "❌ No cumplido".

## Persistencia

`localStorage["mc"]` guarda un array de hasta **30 carreras** con el registro completo: `{n, l, s, p, club, age, peak, pj, g, a, t, caps, pv, mt, seed, gkp, gkm, gkv, money, d}`. Se lee en `hist()` y `renderHf()`, y se escribe en `extras()`. Todo envuelto en `try/catch` (modo privado). Las entradas viejas `{n, l, s}` siguen siendo compatibles.

`localStorage["mc_run"]` guarda la partida en curso `{S, SD, rndState}`. Al recargar aparece el botón "▶️ Continuar carrera". Se borra al terminar o al volver a jugar.

## Puntaje final

```
tw(t) = 0.25 + t*0.35
sc = peak + Σtw(tier)*2.5 + caps/10 + g/25 + Σtw(tier)*3 + nScore*4
```

Los títulos y premios se ponderan por el tier en el que se ganaron. Los títulos de selección suman 1.2 (Mundial 2.0).

Etiquetas: `<90` Jugador de plantel, `<110` Pilar del equipo, `<130` Figura, `<160` Ídolo, `≥160` Leyenda.

## Cambios aplicados en esta iteración

### Split
- `index.html`, `styles.css`, `data.js`, `game.js` separados.
- `Mi Carrera.html` se conserva como versión original.

### Rendimiento
- `background-attachment:fixed` reemplazado por `body::before` fijo (evita repaint en móvil).
- Scroll único con debounce (`scrollEnd`) en lugar de 3 `scrollIntoView` por turno.
- Confeti con contenedor fijo `#cf` y limpieza por `animationend` (sin `setTimeout`).
- PRNG local `rnd()` en vez de pisar `Math.random` global.
- Control de velocidad (`#sp`): normal / rápida / instantánea.

### Bugs y balance
- Contraste de la cabecera corregido (gradiente termina en `#0f172a`, texto blanco legible en claro y oscuro).
- Safe-area movida de `:root` a `body`.
- Código muerto `event()` eliminado.
- Semilla base36 de 6 caracteres.
- `MR` eliminado (el confeti ahora usa `rnd`).
- `TT[0]` mapeado a la segunda división real de cada nacionalidad (`S.nt.d2`).
- `val()` recalculado con una curva realista: OVR 80 ≈ €51M, 85 ≈ €76M, 90 ≈ €150M, 94 ≈ €220M. Tope de €250M.
- Bucle de ofertas iniciales con límite de 50 intentos.
- Préstamo bloqueado si ya estás cedido (`!S.home`).
- `S.mod` inicializado en 0.
- Toggle de tema (`#th`) que activa las reglas `[data-theme]`.
- Accesibilidad básica: `aria-label` en inputs/selects, `:focus-visible`, `type="button"`.

## Fase 1 aplicada — Interfaz

- **Carta UT**: cabecera rediseñada con degradado por tier (`t0`–`t4`), chips de tier y nacionalidad, OVR grande y valor con animación.
- **Feed FutApp**: notas y eventos como tarjetas de noticias con icono, etiqueta "FutApp" y texto limpio (el emoji inicial se usa como icono).
- **Hitos**: riel horizontal (`#ms`) con Debut, Fichaje, Primer título, Selección, Mundial, OVR 85 y 500 PJ.
- **Tema**: botón en la cabecera (`#th2`) que cicla automático → claro → oscuro, sincronizado con el selector del inicio.
- **Sonido**: efectos sintéticos con Web Audio API (subir/bajar OVR, títulos, retiro) y botón de mute (`#mu`).
- **Animaciones**: bump del OVR al subir/bajar y conteo animado del valor de mercado.

## Fase 2 aplicada — Gameplay

- **Relaciones**: `S.rel` con DT, hinchada y prensa (0–100). Panel de barras en la pantalla de juego. El DT afecta los minutos, la hinchada el ánimo y la prensa las chances de premios. Se actualizan por temporada y por eventos nuevos.
- **Representante**: tres perfiles (`AGENTS`) elegibles en el inicio. `agOff` ajusta la frecuencia de ofertas y `agB` el acceso a clubes grandes. Evento especial para El Mercenario.
- **Decisiones de lesión**: las lesiones graves (`inj[2] <= -1`) abren un panel para elegir operarse, rehabilitación conservadora o jugar infiltrado, con riesgos distintos.
- **Desafíos de club**: modo alternativo (`CH`) para empezar en un club y con una meta fija (Chacarita, Ajax, Valencia, Real Madrid).

## Fase 3 aplicada — Social

- **Salón de la Fama**: pantalla `#hf` con las 10 mejores carreras, medallas para el podio y filtros por puntaje, goles, títulos y OVR pico.
- **Persistencia ampliada**: cada carrera guarda posición, club, edad de retiro, PJ, goles, asistencias, títulos, selección, valor máximo, meta, semilla y stats de arquero.
- **Tarjeta de despedida**: `drawCard()` dibuja una tarjeta 1080×1080 en `<canvas>` con degradado por tier, nombre, OVR pico, estadísticas y palmarés. El fondo se pinta opaco antes del degradado, así el PNG nunca sale transparente. "Descargar tarjeta" usa `toBlob` y revoca la URL a los 60 s (antes lo hacía a 1 s y podía cortar la descarga). La tarjeta se puede tocar para verla en un visor a pantalla completa (`#zoom`).

## Ligas y divisiones

- `leagues.js` define 11 ligas (las 10 principales + Arabia Saudita) con D1/D2, copa, confederación y clubes.
- **Arabia Saudita** tiene liga completa: 18 clubes en `Saudi Pro League` y 18 en `Saudi First Division` (Al-Hilal, Al-Ittihad, Al-Nassr, Al-Ahli, Al-Qadsiah, Al-Shabab, etc.). También se agregó la nacionalidad "Arabia Saudita" y arranca en `ARA`.
- Cada club tiene una fuerza `k` de 0–1. `tierOf(k,div)` lo mapea a los 5 tiers existentes.
- `simLeague(g)` simula una tabla con ruido (`rnd()*46`) y un bonus por rendimiento del jugador. El equipo fuerte no gana siempre: Real Madrid ~44 %, Barcelona ~38 %, un club medio ~1–2 %.
- Posición: los 2 primeros de D2 ascienden; los 2 últimos de D1 descienden.
- Cupos continentales: top 4 → Champions/Libertadores; 5–6 → Europa/Sudamericana; 7 → Conference (UEFA).
- **Copas del club, no de la nacionalidad**: `S.slot` se limpia en `sv(x)` al cambiar de club y se sanitiza en `season()` según la confederación del club actual. Un club UEFA nunca gana Copa Sudamericana/Libertadores, ni uno CONMEBOL gana Champions/Europa/Conference. `M(n)` también traduce según `leagueOf(S.lgId).conf`.

## Nacionalidades

El selector `#nat` muestra **20 países distintos**, solo el nombre, sin prefijo y sin duplicados:

Argentina, Brasil, Uruguay, España, Francia, Inglaterra, Alemania, Italia, Portugal, Países Bajos, Colombia, Chile, Perú, Ecuador, Paraguay, México, Estados Unidos, Bélgica, Croacia y Arabia Saudita.

`NAT_LEAGUE` define la liga inicial:

- Argentina → `ARG`; Brasil → `BRA`.
- Uruguay, Colombia, Chile, Perú, Ecuador y Paraguay → `ARG`.
- España y México → `ESP`.
- Francia y Bélgica → `FRA`.
- Inglaterra y Estados Unidos → `ENG`.
- Alemania → `GER`; Italia y Croacia → `ITA`.
- Portugal → `POR`; Países Bajos → `NED`; Arabia Saudita → `ARA`.

## Balance y autosave

- **Premios y títulos ponderados**: cada entrada de `S.pal` guarda el tier (`[nombre, emoji, tier]`). El puntaje usa `tw(t)=0.25+t*0.35`, así que un título de Ascenso vale mucho menos que uno de Élite. Los umbrales de etiqueta subieron para que "Leyenda" exija una carrera de tier alto.
- **Autosave**: `head()` guarda `{S, SD, rndState}` en `localStorage["mc_run"]` en cada punto seguro. Al recargar aparece "▶️ Continuar carrera". Se borra al terminar o al volver a jugar. El PRNG se restaura con `restoreRnd(rndState)` para no repetir resultados.

## Escudos y trofeos (implementado)

- **424 escudos** descargados (419 de football-logos.cc + 4 de TheSportsDB + 1 de Wikipedia), guardados como `assets/escudos/{liga}-{slug}.png`. El manifiesto está en `assets/escudos/crests.json`.
- **2 clubes de la Saudi First Division** (Al-Qaisumah, Al-Taraji) no tienen escudo disponible: usan el badge de iniciales.
- **45 archivos de trofeos**: 43 logos de las 22 ligas/divisiones, 10 copas, 6 torneos continentales y 5 torneos de selecciones, más un trofeo genérico para premios individuales y la King Cup. Están en `assets/trofeos/{clave}.png`.
- El escudo se muestra en la cabecera, en las ofertas, en cada fila de temporada y en la tarjeta final.
- Los trofeos se muestran en el palmarés y en la tarjeta.
- **Limitación `file://`**: si se abre `index.html` con doble clic, el canvas se contamina al dibujar imágenes locales y `toDataURL()` falla. Por eso la tarjeta usa los emojis y el badge de iniciales cuando `location.protocol === "file:"`. Servido por HTTP (por ejemplo `npx serve .`) la tarjeta incluye escudo y trofeos.
- Créditos y licencias: `assets/CREDITOS.md`.

## Fase 4 aplicada — Contratos y desafíos

- **Negociación de contratos**: cada fichaje/renovación abre un panel con cuatro caminos (firmar, pedir aumento, cláusula baja, contrato corto). El sueldo se calcula con `wageOf()` a partir del valor de mercado y la fuerza del club.
- **Duración y agente libre**: `S.ctr.y` baja cada temporada. Al vencer, `S.free = true` y el próximo `step()` fuerza el panel de agente libre.
- **Patrimonio**: `S.money` acumula el sueldo anual y se muestra en el resumen y en la tarjeta.
- **Dirigencia**: nueva relación `rel.dir` (barra "Dirigencia") que influye en renovaciones y en el riesgo de las negociaciones.
- **10 desafíos de club**: se sumaron Salvar al Lobo (Gimnasia), Ascenso histórico (Deportivo Madryn), Rey de Arabia (Al-Nassr), Milagro en Turquía (Trabzonspor), La joya del Ajax y Doble corona en Porto. Cada uno tiene su propio `goal()` y se evalúa al retirarse.
- **Tarjeta**: ahora muestra 8 estadísticas en 4 columnas, incluyendo sueldo y patrimonio.

## Fase 5 aplicada — Pretemporada, contratos y copas

- **Acciones de pretemporada**: 4 opciones al azar de un pool de 15 antes de cada temporada. Modifican partidos, goles, asistencias, lesiones, crecimiento, forma, stats de arquero y relaciones. Los arqueros y defensores tienen acciones propias.
- **Ofertas antes del vencimiento**: con 1 año de contrato restante se abre el panel de ofertas aunque no toque ventana de decisión. La renovación está siempre disponible en ese caso.
- **Fix de copas cruzadas**: `sv(x)` limpia `S.slot` y `S.pos` al cambiar de club; `season()` sanitiza `S.slot` según la confederación. Sevilla (UEFA) ya no puede ganar la Copa Sudamericana ni Boca la Champions.
- **`M(n)`** ahora traduce según la confederación del club, no según la nacionalidad del jugador.

## Fase 6 aplicada — Ofertas de clubes grandes

- **Umbral 79**: con 79+ de OVR se puede saltar a cualquier tier (respetando la edad máxima). Antes el salto estaba limitado a `T+1`, así que un 79 en un club de tier 2 nunca veía a Real Madrid, Barcelona, Bayern o PSG.
- **Oferta de club grande**: `bigPool` con clubes de `k >= 0.78` y una probabilidad de 80 % (79–84) o 90 % (85+).
- **Oferta de élite**: `elitePool` con clubes de `k >= 0.88` y una probabilidad de 35 % (79–81), 55 % (82–84) o 75 % (85+).
- **Alcance**: `reach` sube a 0.65 para 79+, así un jugador de un club chico puede recibir a los gigantes.
- **Exterior**: más probabilidad para 79+ (+18 %) y 85+ (+10 %).
- **78 o menos**: sigue limitado a un tier de salto; recibe clubes grandes de tier 3 pero no la élite.
- **Cache**: `index.html` carga `styles.css`, `leagues.js`, `data.js` y `game.js` con `?v=8` para evitar que el navegador use versiones viejas.

## Fase 7 aplicada — Rasgos nuevos

- **Goleador nato**: `S.gf=1.25` y `S.af=.85`; multiplica goles y asistencias en `season()`. No modifica `POS` (que es compartido por todos los jugadores).
- **Nómada**: `S.agOff+=.06`, `S.rel.dir-=8`, `+12 %` de probabilidad de oferta exterior y `+10 %` de sueldo en `contractTerms()`.
- **Resiliente**: `S.rs=1`; en `season()` saca la lesión más grave del pool (máximo 5 meses), reduce a la mitad la caída de OVR y suma `.2` al factor de partidos jugados.
- **Helper `trIs(n)`**: reemplaza las comparaciones directas con `S.tr[0]`, usadas por `Líder` y los rasgos nuevos.
- **Compatibilidad**: `continueRun()` inicializa `gf=1`, `af=1` y `rs=0` en partidas guardadas antes de este cambio.

## Publicación en GitHub Pages

- **Repositorio**: `https://github.com/facundosotoalan24/Soy-Leyenda` (público, rama `main`).
- **Web**: `https://facundosotoalan24.github.io/Soy-Leyenda/`.
- **Origen de Pages**: rama `main`, carpeta `/`, `build_type: legacy`, HTTPS forzado.
- **Rutas**: todas las referencias a `assets/` y scripts son relativas, así que funcionan tanto en `file://` como bajo el subdirectorio `/Soy-Leyenda/`.
- **Cada push a `main`** dispara un rebuild automático de GitHub Pages (aprox. 1 minuto).

## Deuda técnica pendiente

1. **Nombres descriptivos** — `game.js` sigue usando `S`, `R`, `I`, `C`, `M`, `sv`, `oc`, `fm`. Renombrar reduce el costo de razonamiento de la IA (aunque agrande el archivo ~10 %).
2. **Tests** — la simulación es pura y testeable si se extrae `season()`/`offer()` a funciones sin DOM.
3. **`retire()` y el resumen** — `retire()` corta en `age>40`, así que el resumen muestra "retiro a los 41" aunque la última temporada jugada fue a los 40. Unificar.
4. **`S.ra` y `S.home`** — ya se inicializan en `go()` (`ra:0`, `home:null`); revisar si algún flujo antiguo los deja en `undefined`.
5. **Accesibilidad** — falta `aria-live` para los cambios de temporada.
6. **`data.js` como JSON** — si el contenido crece, mover `NT` y `EV2` a JSON para editar sin tocar lógica.
7. **Datos legados** — `CL`, `TT`, `CA` y `NT.cl` ya no se usan desde `leagues.js`; se pueden borrar para reducir `data.js`.
8. **Plantillas** — los clubes son un snapshot realista; algunos pueden haber cambiado de división en la temporada 2026-27.
9. **Escudos faltantes** — 2 clubes de la Saudi First Division usan iniciales; si aparece una fuente, agregar los PNG y quitarlos de `CREST_MISSING`.
10. **Tarjeta en `file://`** — para incluir escudo/trofeos en el PNG hay que servir por HTTP o embeber las imágenes como data URLs.

## Próximos pasos sugeridos

1. Renombrar variables en `game.js`.
2. Extraer la simulación a funciones puras y agregar tests con Node.
3. Ajustar `retire()`/resumen.
4. Añadir `aria-live`.
5. Completar los 2 escudos saudíes faltantes si aparece una fuente.

## Notas para trabajar con IA (tokens)

- Editá por función ("cambiá `season()`"), no reescribas el archivo entero.
- Para cambios de contenido, abrí solo `data.js`; para lógica, solo `game.js`.
- Usá `grep` por nombre de función en vez de leer todo.
- Mantené este `CONTEXT.md` actualizado: es el mapa que evita re-leer el código.

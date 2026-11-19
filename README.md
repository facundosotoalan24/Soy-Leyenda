# Soy Leyenda

Simulador de carrera futbolística en español, jugable directamente en el navegador.

## Jugar online

**https://facundosotoalan24.github.io/Soy-Leyenda/**

## Jugar en local

Abrí `index.html` con doble clic. Para que la tarjeta de despedida incluya escudos y trofeos, serví la carpeta por HTTP:

```bash
npx serve .
```

Y entrá a la URL que muestra (por ejemplo `http://localhost:3000`).

## Qué incluye

- 11 ligas reales, 20 divisiones y 426 clubes con escudos.
- 45 trofeos entre ligas, copas, torneos y premios individuales.
- Contratos con negociación, sueldo, cláusula, duración y dirigencia.
- Ofertas priorizadas por país y división, con clubes grandes a partir de 79 de media.
- Pretemporada con 15 acciones que afectan la temporada.
- 10 desafíos de club con objetivos propios.
- Copas continentales según la confederación de cada club.
- Guardado automático en `localStorage` e historial de hasta 30 carreras.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Pantallas y controles |
| `styles.css` | Estilos, temas y respuesta móvil |
| `leagues.js` | Ligas, divisiones, clubes y fuerzas |
| `data.js` | Posiciones, nacionalidades, agentes, eventos y desafíos |
| `game.js` | Lógica de partidos, ofertas, contratos y temporadas |
| `Mi Carrera.html` | Versión original monolito (solo referencia) |
| `CONTEXT.md` | Mapa técnico y fórmulas |
| `assets/` | Escudos y trofeos (ver `assets/CREDITOS.md`) |
| `scripts/` | Scripts de descarga de imágenes |

## Atajos

La partida se guarda sola al cambiar de pantalla. Si ves una versión vieja después de una actualización, recargá con **Ctrl + F5**.

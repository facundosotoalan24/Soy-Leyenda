# Créditos de imágenes

## Escudos de clubes

- Fuente principal: **football-logos.cc** — https://football-logos.cc (419 escudos, PNG transparente 256×256).
- Cuatro escudos extra de **TheSportsDB** — https://www.thesportsdb.com (Al-Adalah, Al-Safa, Al-Zulfi y Al-Jubail; PNG con fondo opaco).
- Archivos: `assets/escudos/{liga}-{club}.png`
- Manifiesto: `assets/escudos/crests.json`

Los escudos son marcas registradas de sus clubes y federaciones. Se usan con fines
informativos y para un proyecto personal/fan, no comercial. No implican afiliación
ni respaldo de los clubes.

Siete clubes de la Saudi First Division no tenían escudo en la fuente principal.
Cuatro se completaron con badges de **TheSportsDB** (Al-Adalah, Al-Safa, Al-Zulfi y
Al-Jubail; tienen fondo opaco y se muestran recortados en círculo) y uno con el
logo de **Wikipedia** (Al-Ansar). Los otros dos usan el badge de iniciales del juego:

- Al-Qaisumah
- Al-Taraji

## Trofeos y competiciones

- Fuente: **football-logos.cc** — https://football-logos.cc
- Archivos: `assets/trofeos/{clave}.png`
- Son los logos oficiales de cada liga, copa o torneo. También son marcas de sus
  organizadores y se usan con fines informativos/personales.

La **King Cup** de Arabia Saudita no tiene logo en la fuente: se usa un trofeo
genérico. Los premios individuales (Goleador, MVP, Balón de Oro, Guante de Oro)
también usan ese trofeo genérico.

## Icono genérico

- Twemoji `1F3C6` (trofeo) — https://github.com/jdecked/twemoji
- Licencia de los gráficos: CC-BY 4.0.

## Reproducir la descarga

```bash
node scripts/scrape-logos.js      # genera scripts/logo-index.json
node scripts/fetch-escudos.js     # descarga assets/escudos
node scripts/fetch-faltantes.js   # completa 4 escudos saudíes desde TheSportsDB
node scripts/fetch-trofeos.js     # descarga assets/trofeos
```

Los scripts solo se usan para preparar los assets; el juego no los necesita en
tiempo de ejecución.

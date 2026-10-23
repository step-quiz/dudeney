# Discrepàncies amb Dudeney

Tot el que afirma Dudeney als enigmes publicats s'ha tornat a calcular (`tests/motors.test.js`). Coincideix en tot,
llevat d'aquests detalls, que també s'expliquen a la «nota del matemàtic» de cada enigma:

| Enigma | Què diu Dudeney | Què hem trobat | Què fa el web |
|---|---|---|---|
| El vuit rebel (AM 399) | Amb «un nombre enter diferent» seria impossible | Amb el 0 hi ha solució entera: 6, 8, 1 / 0, 5, 10 / 9, 2, 4. Amb enters positius sí que és impossible | Accepta qualsevol solució correcta |
| Travessant el rierol (AM 373) | No diu el pes del gos | La solució d'11 travessies només val si el gos pesa entre 1 i 75 lliures (amb 0 n'hi ha prou amb 9; amb més de 75 és impossible) | El gos pesa 30 lliures (s'avisa a l'enunciat) |
| L'aranya i la mosca (CP 75) | El camí 3 fa 40,718 peus | √1658 = 40,7185…: Dudeney talla els decimals | Mostra 40,719 |
| Les sis granotes (AM 214) | Fórmula per a n senar: (n² + 3n)/2 − 4 | Per a n = 1 dona −2 | Només de 6 a 8 granotes |
| El número estripat (AM 113) | Solució general | El text de Project Gutenberg havia perdut els exponents (10ⁿ − 1, 37¹, 3³…) | Exponents restituïts a la traducció |
| Els quadrats de brocat (AM 174) | «Només hi ha una solució» | No ho hem comprovat per ordinador | Es diu a la nota |

**Tanda 1** (AM 216, 362, 297, 298, 317 i 247): tot el que diu Dudeney s'ha confirmat (10 salts, 11 manipulacions,
8 i 10 alfils, els 16 peons i 36 furlongs). Una precisió d'interpretació, no un error:

| Enigma | Què diu Dudeney | Què hem trobat | Què fa el web |
|---|---|---|---|
| Alfils (AM 297 i 298) | No diu si un alfil ataca a través d'una altra peça | Els mínims (8 i 10) i les seves figures valen tant si les peces tapen el camí com si no | Les peces tapen el camí, com en una partida (s'avisa a l'enunciat) |

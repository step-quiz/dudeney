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

**Tanda 2** (AM 217, 219, 341, 375, 377, 249 i 320): tot el que diu Dudeney s'ha confirmat (26, 23, 16 i 7, 11, 11,
les 4 rutes del mariner i els 16 de la torre). A més, hem trobat que les solucions de Twickenham (26) i de les lletres
(23) són les **úniques** mínimes, i que «només hi ha les dues solucions de les figures» de la torre és cert llevat de
girs i simetries (amb la torre a d5 n'hi ha 8, o 16 comptant el sentit). Dues precisions, no errors:

| Enigma | Què diu Dudeney | Què hem trobat | Què fa el web |
|---|---|---|---|
| El trencaclosques del mariner (AM 249) | Dona el mapa dibuixat a mà, amb rutes corbes que es creuen | L'hem reconstruït (20 illes, 28 rutes). Comprovació: les seves 4 rutes, juntes, fan servir exactament les 28 rutes del mapa, i el programa en troba 4, ni més ni menys, amb la C als llocs 12, 13, 16 i 17 | Mapa redibuixat amb les illes al mateix lloc i les rutes traçades perquè cap no passi per sobre d'una altra illa (s'avisa a l'enunciat) |
| El tresor del castell (AM 377) | No diu qui posa el tresor a la cistella quan és sol a terra | La seva solució el deixa dins la cistella (passos 1 i 2): el comptem així | El tresor es pot carregar encara que no hi hagi ningú al costat (s'avisa a l'enunciat) |

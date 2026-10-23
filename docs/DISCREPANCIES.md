# Discrepàncies amb Dudeney (mostra de 14)

Tot el que afirma Dudeney als 14 enigmes s'ha tornat a calcular (`tests/motors.test.js`). Coincideix en tot,
llevat d'aquests detalls, que també s'expliquen a la «nota del matemàtic» de cada enigma:

| Enigma | Què diu Dudeney | Què hem trobat | Què fa el web |
|---|---|---|---|
| El vuit rebel (AM 399) | Amb «un nombre enter diferent» seria impossible | Amb el 0 hi ha solució entera: 6, 8, 1 / 0, 5, 10 / 9, 2, 4. Amb enters positius sí que és impossible | Accepta qualsevol solució correcta |
| Travessant el rierol (AM 373) | No diu el pes del gos | La solució d'11 travessies només val si el gos pesa entre 1 i 75 lliures (amb 0 n'hi ha prou amb 9; amb més de 75 és impossible) | El gos pesa 30 lliures (s'avisa a l'enunciat) |
| L'aranya i la mosca (CP 75) | El camí 3 fa 40,718 peus | √1658 = 40,7185…: Dudeney talla els decimals | Mostra 40,719 |
| Les sis granotes (AM 214) | Fórmula per a n senar: (n² + 3n)/2 − 4 | Per a n = 1 dona −2 | Només de 6 a 8 granotes |
| El número estripat (AM 113) | Solució general | El text de Project Gutenberg havia perdut els exponents (10ⁿ − 1, 37¹, 3³…) | Exponents restituïts a la traducció |
| Els quadrats de brocat (AM 174) | «Només hi ha una solució» | No ho hem comprovat per ordinador | Es diu a la nota |

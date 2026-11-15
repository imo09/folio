# folio

Blocco note calmo, a pagine, di nautargo. Il Quaderno contiene i Gruppi, il Gruppo contiene i Fogli.
I Fogli, e le immagini incorporate, restano sul dispositivo di chi usa l'app: nessun account, nessun server.
Dalla 8.0, se si vuole, si allineano fra i propri dispositivi in una cartella del proprio Dropbox: il browser parla solo con Dropbox.
Dalla 9.0 importa file di testo, archivi .zip e cartelle, con anteprima e annullamento; le note di altre app arrivano con l'aiuto di un assistente AI, che riceve da folio le istruzioni.
L'app parla italiano e inglese (Notebook, Group, Page).

Online su [folio.nautargo.com](https://folio.nautargo.com).

## Cosa c'è in questo repository

| File | A cosa serve |
|---|---|
| `index.html` | l'app intera, in un solo file |
| `manifest.webmanifest` | nome, colori e icone per installarla sul telefono |
| `sw.js` | la copia che fa funzionare l'app anche senza rete |
| `icona.svg` | icona della scheda del browser |
| `icona-192.png`, `icona-512.png` | icone con gli angoli tondi |
| `icona-maschera-512.png` | icona a tutto campo, per le forme di Android |
| `icona-180.png` | icona a tutto campo per iPhone, che arrotonda da solo |
| `icona-mono-512.png` | icona a un colore, per i temi di Android |
| `CNAME` | collega il repository a `folio.nautargo.com` |
| `_progetto/` | istruzioni, handoff e mockup: GitHub Pages non la pubblica |

## Aggiornare l'app

Si sostituiscono i file con quelli della nuova versione. Il numero di versione è già scritto dentro `index.html`
e `sw.js`: chi ha l'app installata riceve l'aggiornamento entro un paio di riaperture.

Chi modifica `index.html` deve ricalcolare l'impronta dei due script nella regola di sicurezza (riga 5): il comando
è in `_progetto/folio-istruzioni-9.0.md`, punto 129.

## Caratteri

Il nome "folio" è disegnato con il carattere Poppins 600 (Indian Type Foundry, licenza SIL Open Font License 1.1),
trasformato in un tracciato SVG dentro `index.html`: l'app non carica caratteri dalla rete.

## Versione

9.0

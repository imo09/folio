# folio.

Blocco note calmo, a pagine, di Nautargo. Il Quaderno contiene i Gruppi, il Gruppo contiene i Fogli.
I Fogli, e le immagini incorporate, restano sul dispositivo di chi usa l'app: nessun account, nessun server.
Dalla 8.0, se si vuole, si allineano fra i propri dispositivi in una cartella del proprio Dropbox: il browser parla solo con Dropbox.
L'app parla italiano e inglese (Notebook, Group, Page).

Online su [folio.nautargo.com](https://folio.nautargo.com).

## Cosa c'è in questo repository

| File | A cosa serve |
|---|---|
| `index.html` | l'app intera, in un solo file |
| `manifest.webmanifest` | nome, colori e icone per installarla sul telefono |
| `sw.js` | la copia che fa funzionare l'app anche senza rete |
| `icona-180.png`, `icona-192.png`, `icona-512.png` | icone |
| `CNAME` | collega il repository a `folio.nautargo.com` |

## Aggiornare l'app

Si sostituiscono i file con quelli della nuova versione. Il numero di versione è già scritto dentro `index.html`
e `sw.js`: chi ha l'app installata riceve l'aggiornamento entro un paio di riaperture.

## Versione

8.0 (prova della sincronizzazione con Dropbox)

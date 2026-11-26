# folio - handoff 9.2

26/11/2026. Partenza: 9.1. Insieme a hora 1.8.

## Fatto

1. **`ponte.html`** [fatto]: pagina senza interfaccia che hora apre in un iframe invisibile. Risponde solo a `https://hora.nautargo.com` (e a `localhost` per le prove), con tre operazioni: `leggi` (titolo, Quaderno / Gruppo, markdown, data di modifica, protetto), `crea` (Foglio nel Gruppo "hora", come l'arrivo da `#hora?`), `scrivi` (nuovo markdown). Regola di sicurezza propria (`default-src 'none'`, impronta dello script); in `sw.js` per l'uso senza rete.
2. **Con folio aperta** [fatto]: il ponte chiede sul canale `folio` (BroadcastChannel) chi c'è; la finestra attiva risponde e fa il lavoro sui dati in memoria (`servizioHora`), così niente si sovrascrive. Le finestre in pausa non rispondono. Con il Foglio aperto nell'editor, una modifica da hora lo ridisegna.
3. **Con folio chiusa** [fatto]: il ponte legge e scrive direttamente "struttura" e "f:<id>" in IndexedDB. Non crea mai un archivio: se folio non è mai stata aperta sul dispositivo risponde "vuoto" e hora apre folio come prima.
4. **Aggiornamento delle anteprime** [fatto]: dopo ogni salvataggio folio annuncia `{ hora:'salvato' }` sul canale; il ponte lo passa a hora, che rilegge.
5. **Fogli protetti e sola lettura** [fatto]: un Foglio protetto si legge solo come "protetto" e non si scrive; con folio in sola lettura (Dropbox in uso altrove) creazione e scrittura da hora sono rifiutate.
6. **Impronte**: ricalcolate per `index.html` e per `ponte.html` (stesso comando del punto 129, esteso ai due file).

## Prove fatte

7. Chromium, hora e folio su due porte locali: creazione dal modulo di hora con folio chiusa, anteprima, modifica da hora con folio chiusa e con folio aperta (editor ridisegnato), modifica in folio con anteprima di hora aggiornata da sola; nessun errore in console.

## Da verificare

8. **Safari e iPhone** [da verificare]: Safari separa i dati dei siti dentro iframe; fra sottodomini dello stesso dominio dovrebbe condividerli, va provato. Con l'app installata su iPhone gli archivi restano comunque separati da Safari.
9. **Una finestra di folio 9.1 ancora aperta** [da verificare]: non conosce il ponte e, al suo salvataggio, potrebbe sovrascrivere un Foglio creato da hora nel frattempo; con la 9.2 installata ovunque il caso sparisce.

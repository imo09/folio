# folio - handoff 9.1

26/11/2026. Partenza: 9.0. Collegamento con hora 1.7.

## Fatto

1. **Arrivo da hora** [fatto]: `https://folio.nautargo.com/#hora?id=<id>&t=<titolo>&q=<quando>` apre il Foglio legato a quell'id; se non c'è, lo crea nel Gruppo "hora" del Quaderno aperto (il Gruppo nasce se manca), con la data dell'evento e il collegamento "Apri in hora" come primo testo. L'id accetta lettere, cifre, `-` e `_` (4-40 caratteri); titolo e "quando" sono ripuliti e accorciati. Un secondo arrivo con lo stesso id non crea doppioni.
2. **Collegamento a un Foglio** [fatto]: `#foglio=<id>` apre quel Foglio; se non è su questo dispositivo compare un avviso.
3. **Menu del Foglio** [fatto]: "Copia collegamento" (da incollare in hora per legare un Foglio già esistente) e, per i Fogli nati da hora, "Apri in hora" (`https://hora.nautargo.com/#nota=<id>`).
4. **Campo `hora`** [fatto]: id della nota, aggiunto a `META`, quindi viaggia con la sincronizzazione Dropbox e resta nei backup.
5. **Regola di sicurezza**: impronte dei due script ricalcolate; nessuna origine nuova (i collegamenti verso hora sono navigazioni, non richieste).
6. **Versione**: 9.1 in `VERSIONE_APP`, `sw.js` e `README.md`.

## Prove fatte

7. Chromium: creazione da hora (Gruppo e Foglio), secondo arrivo senza doppioni, `#foglio=`, campo `hora` dopo la ricarica, menu con le due voci nuove; nessun errore in console.

## Da verificare

8. **iPhone con l'app installata** [da verificare]: Safari e app installata hanno archivi separati; un Foglio creato da un collegamento aperto in Safari sta in Safari, a meno della sincronizzazione Dropbox.
9. **Sola lettura** [da verificare]: creare un Foglio da hora su un dispositivo in sola lettura chiede "Usa qui", come ogni altra modifica.

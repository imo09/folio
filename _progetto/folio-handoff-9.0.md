# folio - handoff 9.0

15/11/2026. Partenza: 8.3. Riferimento di progetto: `_progetto/folio-istruzioni-9.0.md` (i numeri fra parentesi rimandano ai suoi punti). Schermate in `_progetto/schermate-9.0/`, mockup in `_progetto/mockup/` e su https://claude.ai/artifact/FiZbhryvGTztCDSznZRRof (privato).

Etichette: [deciso], [fatto], [proposto], [aperto], [da verificare].

## Stato

1. **Versione**: 9.0, una consegna sola con funzioni, motore e aspetto [deciso]. Scritta in `VERSIONE_APP`, `sw.js` e `README.md`.
2. **File toccati**: `index.html`, `sw.js`, `manifest.webmanifest`, `README.md`, icone (`icona-192.png`, `icona-512.png`, `icona-180.png` rifatte; nuove `icona.svg`, `icona-maschera-512.png`, `icona-mono-512.png`), cartella `_progetto/`.
3. **Regola di sicurezza**: impronte dei due script ricalcolate; nessuna origine nuova, nessun carattere o libreria dalla rete.
4. **Formati salvati**: invariati. Unico campo nuovo, solo locale e mai sincronizzato: `impostazioni.ultimaImportazione`.

## Fatto

### Funzioni richieste

5. **Copia testo nelle tessere e nel diario** [fatto] (25-32): voce "Copia testo" nel menu della presa, subito dopo "Seleziona testo". Testo senza segni markdown, come "Copia il testo" del Foglio. Su tessera vuota: "Niente da copiare.". Sui dispositivi in sola lettura la presa apre un menu ridotto (seleziona e copia), senza trascinamento.
6. **Peso dei Fogli** [fatto] (33-40): verificato che nel codice 8.3 non c'era alcun limite; il limite era la lentezza. Nessun limite aggiunto. Sopra 300 kB avviso con "Dividi"; sopra 1 MB il Foglio si apre in vista testo con una fascia "Apri formattato" e "Dividi". "Dividi" taglia ai titoli più alti (H1, altrimenti H2), con anteprima e annullamento; l'originale va nel Cestino. Nelle Impostazioni, blocco Archivio: spazio usato e disponibile; avviso giornaliero sopra l'80%.
7. **Importazione** [fatto] (41-56): un solo pannello "Importa" (Impostazioni, menu del Quaderno) con File di testo, Archivio .zip o cartella, Backup di folio, Da un'altra app con un'AI. Lettore zip senza librerie (non compresso e deflate), cartelle dove il browser lo permette. Le cartelle diventano Quaderni e Gruppi, le immagini accanto ai file entrano in folio, le immagini scritte dentro al testo (data:) diventano incorporate. Doppioni saltati, date dei file conservate, diario riconosciuto, titolo ripetuto tolto, testo windows-1252 riconosciuto. Anteprima sempre prima di scrivere; l'ultima importazione si annulla (avviso con "Annulla" e riga nel pannello).
8. **Importare con un'AI** [fatto] (57-64): schermata a tre passi, scelta della struttura (un Foglio per nota nei Gruppi, tutto a tessere, tutto in un Gruppo), istruzioni in italiano e inglese da copiare o scaricare (`folio-istruzioni-importazione.md`). Testo completo in Appendice 1 del documento di istruzioni.

### Motore

9. **Conversione a pezzi** [fatto] (65): a ogni pausa si riconvertono solo i blocchi cambiati; il primo salvataggio di ogni Foglio sotto i 120.000 caratteri viene confrontato con la conversione intera e, se differisce, quel Foglio torna alla conversione intera. Aprendo un Foglio lungo, i blocchi si preparano nei momenti liberi.
10. **Misure** (telefono medio simulato, processore rallentato 4 volte):

| Testo | Apertura 8.3 | Apertura 9.0 | Salvataggio 8.3 | Salvataggio 9.0, a freddo |
|---|---|---|---|---|
| 300 kB | 1,74 s | 1,40 s | 1,98 s | 0,54 s |
| 1.000 kB | 5,92 s | 4,88 s | 15,24 s | 1,38 s |

11. **Altro** [fatto] (66-72): pausa di salvataggio che si allunga se la conversione è lenta; annulla con un tetto di circa 12 MB; colonna ridisegnata solo quando cambia quello che mostra; "Citato in" ricalcolato solo all'apertura e dopo le rinomine; ricerca con testo già normalizzato in memoria e risultati oltre i 200 a richiesta; copia di riserva riscritta solo se i Fogli cambiano; esportazioni troppo grandi fermate con un messaggio.
12. **Banco di prova** [fatto] (73): `window.__prova.banco(kb)`.

### Correzioni

13. **Immagini data: perse in silenzio** [fatto] (49): ora restano nel file; importando o incollando diventano incorporate.
14. **Collegamenti a file locali** [fatto] (56): `allegati/x.pdf` non apre più una pagina inesistente; toccandolo compare un avviso.
15. **Zip con le date dei Fogli** [fatto] (51): "Esporta i Fogli" scrive la data di modifica di ogni Foglio; esporta e reimporta conserva le date.
16. **Icone** [fatto] (74, 112): icona a tutto campo per Android (maskable) e per iPhone, icona SVG per il browser, icona a un colore.
17. **Accessibilità** [fatto] (76-78): al massimo due avvisi insieme, letti dai lettori di schermo e sopra il pulsante più o la barra vicino alla tastiera; bersagli da 44 px con il dito; dialoghi con fuoco trattenuto e restituito; menu con ruoli, frecce ed Esc.
18. **Backup .json** [fatto] (75): scelta di un file solo.
19. **"Citato in"** [fatto]: tolto il trattino in più davanti al primo Foglio citato.

### Miglioramenti

20. **Informazioni sul Foglio** [fatto] (81): date, parole, caratteri, peso, immagini, tessere; per i Fogli lunghi anche "Dividi".
21. **Stampa o salva in PDF** [fatto] (79): nel menu "Condividi ed esporta".
22. **Elenco su due righe** [fatto] (82, 144): data e inizio del testo; per i Fogli protetti solo "protetto".

### Aspetto

23. **Colori** [fatto] (87-93): stessa carta e stesso ottone; nuovi `--filo` (separatori), `--ottone-vivo` (solo decorazione), `--galleggia` (ombra di ciò che galleggia). Nel tema scuro l'ottone è quello della famiglia, #E8A867.
24. **Elenco** [fatto] (94-98): barra senza bordo (compare una riga quando qualcosa scorre); nome del Quaderno grande con "3 Gruppi - 24 Fogli"; Gruppi senza fasce piene, icona in tessera tonda; voce attiva con tacca ottone; più tondo in basso a destra che crea un Foglio; "Nuovo Gruppo" in fondo all'elenco e nel menu del Quaderno.
25. **Foglio** [fatto] (99-103): titolo 28 px; su telefono nella barra il percorso Quaderno / Gruppo; pillola del sommario accanto alla data (foglio dal basso su telefono, riquadro su computer); barra di formattazione galleggiante; tessere più pulite; data del diario piccola e tenue (solo stile).
26. **Fogli dal basso** [fatto] (104): sotto i 900 px dialoghi e menu salgono dal fondo, con presa e velo.
27. **Impostazioni** [fatto] (105): schede chiare su fondo carta, scelte a segmenti.
28. **Logo e nome** [fatto] (109-114): "f" ridisegnata, con il taglio che parte dall'asta e va solo a destra [deciso]; punto in Ottone #E8A867; nome "folio" in Poppins 600 come tracciato SVG; splash più breve (1,60 s) con "by **nautargo**".
29. **Benvenuto** [fatto] (123): testi aggiornati in italiano e inglese (più tondo, sommario, importazione, Fogli lunghi). I Fogli di benvenuto già creati non cambiano.

## Prove fatte

30. **Motore**: conversione a pezzi identica a quella intera su un insieme di Fogli di prova (elenchi annidati, caselle, tabelle, citazioni, codice, immagini, blocchi allineati, tessere, diario) e sui Fogli di benvenuto; giri md - html - md uguali alla 8.3.
31. **Importazione**: zip compresso e non, nomi accentati, voci da ignorare (`__MACOSX`, `.DS_Store`), percorso con `..` scartato, cartella vuota, immagini relative e `data:`, allegati, immagine mancante, testo windows-1252, radice tolta, doppioni, annullamento; giro completo "Esporta i Fogli" - "Importa" in un archivio vuoto con titoli, testi, diario, immagini e date uguali.
32. **Regressioni**: tessere (nuova, sposta, elimina, unisci), diario, annulla e rifai, vista testo, sommario e pieghe, preferiti, selezione, cestino, ricerca, password, protezione, chiusura e apertura dei Fogli protetti, esportazioni, riordino dei Gruppi, lingua inglese, salvataggio.
33. **Schermate**: Chromium a 390 x 844 in chiaro e scuro, 1.280 x 800 in chiaro; nessun errore in console.

## Da verificare

34. **Dispositivi veri** [da verificare]: tocchi, fogli dal basso, pulsante più, trascinamento delle tessere, tastiera su Android e iPhone.
35. **Import con AI dal vero** [da verificare] (63): un'esportazione Evernote vera (almeno 20 note con immagini, caselle, tabelle e un pdf) passata a due assistenti diversi, poi importata.
36. **Sincronizzazione** [da verificare]: provata solo la parte locale; serve un giro con due dispositivi e Dropbox (collega, modifica in due posti, conflitto, sola lettura), anche dopo un'importazione grande.
37. **Cartelle su Safari** [da verificare]: la scelta di una cartella compare solo dove il browser la offre.
38. **Icone installate** [da verificare]: aspetto dell'icona dopo l'installazione su Android (maschera tonda) e iPhone.

## Non fatto, di proposito

39. **`content-visibility`** [proposto] (71): non adottato, va provato prima su Chrome Android e Safari iPhone.
40. **Front matter** (80): un blocco iniziale fra due righe `---` diventa ancora una linea e un titolo; le istruzioni per l'AI lo vietano.
41. **Fuori perimetro** (139): etichette, allegati dentro folio, immagini nei Fogli protetti, altri servizi di sincronizzazione.

## Aperto

42. **Pubblicazione**: la pull request va unita su `main` per arrivare su folio.nautargo.com; chi ha l'app installata vedrà "Nuova versione di folio pronta".
43. **Soglie di peso**: 300 kB e 1 MB vengono dalle misure simulate; ritararle se sul telefono di Simo i tempi sono diversi.

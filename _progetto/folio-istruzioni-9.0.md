# folio - istruzioni di passaggio per la prossima versione (8.4 e 9.0)

Documento per l'AI che eseguirà il lavoro. Scritto il 15/11/2026 partendo da folio 8.3 (`index.html`, 8.477 righe, ramo `claude/next-version-features-optimization-u24tby`). Contiene: stato verificato, richieste di Simo, progetto di dettaglio, ordine dei lavori, prove, punti aperti. I mockup stanno in `_progetto/mockup/` e su https://claude.ai/artifact/FiZbhryvGTztCDSznZRRof (privato: lo apre solo Simo finché non lo condivide).

Etichette: **[deciso]** richiesto da Simo o vincolo esistente. **[proposto]** scelta di progetto, da considerare valida salvo diversa indicazione. **[aperto]** va chiesto a Simo prima di toccare quel pezzo. **[verificato]** controllato sul codice 8.3 o misurato. **[da verificare]** va provato prima di darlo per buono.

---

## A. Come lavorare

1. **Prima leggi**: `index.html` per intero (la mappa è al punto 135), `README.md`, `sw.js`, `manifest.webmanifest`, questo documento, i mockup.
2. **Prima chiedi**: i punti [aperto] (da 140 a 147) si sciolgono con Simo prima di scrivere codice. Sul resto non servono conferme.
3. **Metodo nautargo**: scope stretto (solo ciò che è scritto qui), file completi e funzionanti, una versione raccoglie tutte le sue modifiche, handoff a fine versione con le etichette [deciso], [fatto], [proposto], [aperto], [da verificare].
4. **Lingua**: interfaccia in italiano con parole comuni, nessun termine inglese; ogni testo nuovo va anche nel dizionario `EN` (riga 2085). Mai lineetta lunga né punto mediano: si usa " - ". Numeri con virgola decimale e due decimali (c'è già `numero()`).
5. **Rispondi a Simo** in italiano, a punti numerati con argomento in grassetto, numerazione continua, sezioni Note e Punti aperti con alternative a lettere.

## B. Stato di partenza [verificato]

6. **Cos'è**: blocco note locale in un solo `index.html` (stile, due librerie incorporate - marked 12.0.2 e Turndown con plugin GFM - e 6.590 righe di JavaScript semplice), più `sw.js`, `manifest.webmanifest`, tre icone PNG, `CNAME`. Pubblicata su folio.nautargo.com con GitHub Pages.
7. **Dati**: IndexedDB `folio`, negozio `dati`: `struttura` (Quaderni, Gruppi, titoli, impostazioni), un record `f:<id>` per Foglio, uno `i:<id>` per immagine, `riserva` (copia intera ogni 10 minuti), `sync` (stato Dropbox). Senza IndexedDB ripiega su localStorage.
8. **Regola di sicurezza (CSP)**: riga 5, con l'impronta sha256 dei due `<script>` in linea. Le impronte attuali corrispondono al codice. **Ogni modifica a uno dei due script obbliga a ricalcolarne l'impronta**, altrimenti l'app non parte (vedi punto 129).
9. **Versione scritta in tre posti**: `VERSIONE_APP` (riga 1891), `VERSIONE` in `sw.js`, tabella del `README.md`.
10. **Appiglio per le prove**: `window.__prova` (riga 8444) espone le funzioni interne. Va esteso con le funzioni nuove.
11. **Tessere e diario**: `<section class="tessera">` dentro `#corpo`; nel file ogni tessera è preceduta da `<!-- tessera -->`. La presa in alto è un `::before` riconosciuto per coordinate (`zonaTessera`, riga 7015); toccarla apre `menuTessera` (riga 6970), che oggi ha "Seleziona testo" ma non una copia.
12. **Importazione oggi**: backup `.json` (aggiungi o sostituisci) e file `.md`/`.txt` sciolti in un Gruppo. Non esiste l'importazione di uno `.zip`, quindi "Esporta i Fogli" non ha un ritorno.
13. **Peso dei Fogli oggi**: nel codice non c'è alcun limite al peso del testo, né scrivendo né importando. I soli tetti sono: immagini ridotte a 1.600 px e ricompresse sopra 900 kB (riga 6461); circa 5 MB in tutto se il browser nega IndexedDB; 150 MB per file caricato su Dropbox (limite del servizio, irrilevante per il testo). Il limite vero è la lentezza, misurata al punto 14.
14. **Misure** (Chromium, 390 x 844, processore rallentato 4 volte per imitare un telefono medio, Foglio di prova con titoli, elenchi, caselle e tabelle):

| Testo | Nodi | Apertura | Conversione a ogni pausa di scrittura |
|---|---|---|---|
| 50 kB | 2.133 | 0,39 s | 0,14 s |
| 150 kB | 6.372 | 0,99 s | 0,59 s |
| 300 kB | 12.717 | 1,74 s | 1,98 s |
| 600 kB | 25.407 | 2,79 s | 5,70 s |
| 1.000 kB | 42.363 | 5,92 s | 15,24 s |
| 2.000 kB | 84.699 | 9,84 s | 57,62 s |

15. **Lettura delle misure**: l'apertura cresce in modo regolare; la conversione da pagina a markdown (`htmlVersoMd`, chiamata da `registra` a ogni pausa di 700 ms) cresce più che in proporzione e blocca la scrittura già a 300 kB. È il primo collo di bottiglia da togliere (punto 65).

## C. Vincoli che non si toccano [deciso]

16. **Local-first**: nessun server, nessun account, nessuna libreria dalla rete, CSP senza origini nuove. I dati restano sul dispositivo; Dropbox resta facoltativo.
17. **File unico**: l'app consegnata resta un solo `index.html` più service worker, manifest e icone. Nessun framework, nessuna dipendenza nuova (lo zip si legge con le funzioni del browser, punto 42).
18. **Mai perdite silenziose, tutto reversibile**: ogni cosa che non entra, non si salva o viene scartata va detta, con una scelta. Le importazioni hanno anteprima e annullamento.
19. **Formati aperti**: i Fogli restano markdown pulito; il file deve funzionare anche fuori dall'app.
20. **Nessuna regressione**: struttura dell'archivio, sincronizzazione (8.0, 8.1), Fogli protetti, cestino, tessere e diario devono comportarsi come oggi. Non cambiare i nomi dei campi salvati né il formato di `.folio/indice.json`.
21. **Lessico**: Quaderno > Gruppo > Foglio; tessera; diario. Nessuna parola nuova per concetti esistenti.

## D. Due consegne [proposto, vedi punto 140]

22. **8.4 "motore"**: funzioni richieste (copia tessera, peso, importazioni), ottimizzazioni, correzioni. Aspetto invariato.
23. **9.0 "aspetto"**: nuova grafica, logo, icone, splash, fogli dal basso. Nessuna funzione nuova.
24. **Perché separate**: è la regola nautargo (aspetto e motore in versioni diverse) e rende rintracciabile una regressione. Se Simo sceglie una consegna sola, l'ordine dei lavori resta lo stesso.

---

## E. Fase 1 - versione 8.4

### E1. Copia del testo di una tessera [deciso]

25. **Cosa**: nel menu della presa, subito dopo "Seleziona testo", la voce "Copia testo". Vale per tessere e diario.
26. **Come**: `copiaTessera(t)` = `copia(testoSemplice(htmlVersoMd(t.innerHTML)), T('Testo della tessera copiato.'))`. Stessa resa di "Copia il testo" del Foglio: senza segni markdown, caselle come "[fatto]" e "[da fare]", immagini come segnaposto. Nel diario la prima riga è la data.
27. **Tessera vuota**: avviso "Niente da copiare.", nessuna scrittura negli appunti.
28. **Se il browser nega gli appunti**: resta il dialogo "Copia a mano" che `copia()` apre già.
29. **Sola lettura** [proposto]: oggi su un dispositivo in sola lettura la presa non risponde (`avviaTessere` esce su `soloLettura()`). Deve aprire un menu ridotto con le sole "Seleziona testo" e "Copia testo"; il trascinamento resta spento.
30. **Icona**: nuova voce `copia` in `TRATTI` (appunti con due righe): `<rect x="6" y="5" width="12" height="15" rx="2"/><path d="M9 5V3.8h6V5M9.5 11h5M9.5 14.5h5"/>`.
31. **Testi**: aggiornare il paragrafo "Tessere e diario" di `BENVENUTO_IT` e `BENVENUTO_EN` ("toccala per selezionarne o copiarne il testo...").
32. **Accettazione**: il menu mostra la voce; negli appunti arriva il testo atteso (con e senza data di diario); funziona in sola lettura; su tessera vuota non copia.

### E2. Peso dei Fogli: nessun limite, avvisi chiari [deciso]

33. **Principio**: nessun rifiuto per peso, né scrivendo né importando. Sopra certe soglie folio lo dice e offre un rimedio.
34. **Come si misura**: peso del testo markdown in UTF-8 (`new Blob([md]).size`), immagini escluse (stanno a parte).
35. **Soglie** [proposto]: `PESO_LUNGO = 300 * 1024` e `PESO_ENORME = 1024 * 1024`. Vanno ritarate con il banco di prova dopo il punto 65: "lungo" è il peso a cui l'apertura supera 1,50 s o la conversione 0,50 s su telefono medio; "enorme" quello a cui l'apertura supera 5,00 s.
36. **Foglio lungo, all'apertura**: una volta per Foglio e per sessione, avviso "Foglio lungo ({kb} kB): può aprirsi e salvarsi più lentamente." con il pulsante "Dividi". Non blocca niente.
37. **Foglio enorme, all'apertura** [proposto]: si apre in vista testo (il markdown com'è, che resta veloce), con una fascia in alto "Foglio molto lungo ({mb} MB): aperto in vista testo." e i pulsanti "Apri formattato" e "Dividi". Serve da valvola: oggi su computer folio riapre da solo l'ultimo Foglio all'avvio, e un Foglio enorme bloccherebbe ogni avvio.
38. **Dividi** [proposto]: divide il Foglio ai titoli di livello più alto presenti (H1, altrimenti H2). Ogni parte diventa un Foglio nuovo nello stesso Gruppo, con titolo "Titolo - nome del paragrafo"; l'originale va nel Cestino (30 giorni). Prima un'anteprima: "Diventano {n} Fogli". Senza titoli: avviso "Non ci sono titoli su cui dividerlo." e nessuna modifica. Non disponibile per i Fogli protetti chiusi.
39. **Importando**: nell'anteprima (punto 46) i Fogli sopra soglia sono contati ("3 Fogli lunghi, 1 molto lungo") e per quelli enormi c'è la scelta "Importa così" oppure "Dividi ai titoli".
40. **Archivio nel suo insieme**: nel blocco Archivio delle Impostazioni mostrare lo spazio usato e disponibile (`navigator.storage.estimate()`, se c'è): "Occupa {x} MB su circa {y} disponibili." Sopra l'80% un avviso all'avvio, una volta al giorno, con "Esporta". Senza IndexedDB avviso sopra 4 MB (il tetto di 5 MB è del browser e non si può togliere: va detto). Calcolare il peso una volta all'apertura del pannello, non a ogni ridisegno (oggi `JSON.stringify(A)` gira a ogni aggiornamento della sincronizzazione).

### E3. Importazione: un solo ingresso, zip e cartelle [proposto]

41. **Nuovo pannello "Importa"**: sostituisce le due righe del blocco Backup e la voce "Importa file" del menu del Quaderno. Quattro scelte, ciascuna con una riga di spiegazione:
    - "File di testo" - `.md`, `.txt` (come oggi)
    - "Archivio .zip o cartella" - con Quaderni, Gruppi e immagini (nuovo)
    - "Backup di folio" - `.json` (come oggi)
    - "Da un'altra app, con un'AI" (nuovo, sezione E4)
    La voce "Importa file qui" del menu di un Gruppo apre direttamente la scelta dei file (`.md`, `.txt`, `.zip`) con quel Gruppo come destinazione.
42. **Lettore zip senza librerie**: leggere l'indice centrale dalla coda del file con `Blob.slice` (mai tutto lo zip in memoria), poi una voce alla volta. Metodo 0 (senza compressione) letto direttamente; metodo 8 (deflate) con `new DecompressionStream('deflate-raw')`. Se manca `DecompressionStream`: "Questo browser non apre gli zip compressi: aggiornalo, oppure crea lo zip senza compressione." Nomi in UTF-8 (segnale 0x0800), altrimenti tentare UTF-8 e ripiegare su latin1. Zip64, zip cifrati e zip divisi: messaggio chiaro, nessun tentativo.
43. **Voci ignorate**: `__MACOSX/`, `.DS_Store`, tutto ciò che inizia con un punto (compresa `.folio/`), `per-claude.md`. Percorsi con `..` o assoluti: scartati e contati. Il file `.cartella` vuoto crea il Gruppo vuoto (lo scrive già l'esportazione).
44. **Dalle cartelle alla struttura**: conta il numero di cartelle sopra ogni `.md`, senza contare `immagini/` e `allegati/`.

| Cartelle sopra il file | Diventa |
|---|---|
| 0 | Foglio nel Gruppo scelto dall'utente |
| 1 | Gruppo/Foglio, nel Quaderno scelto dall'utente |
| 2 | Quaderno/Gruppo/Foglio |
| 3 o più | la prima è il Quaderno, le altre unite con " - " sono il Gruppo |

45. **Regole di unione**: Quaderni e Gruppi si abbinano per nome a quelli esistenti (come fa `unisci`). Un Foglio con lo stesso titolo e lo stesso testo di uno esistente è un doppione: saltato e contato. Stesso titolo ma testo diverso: entra con " (2)", " (3)" (non con il timbro di data di `nomeUnico`, che in una migrazione sporca i titoli).
46. **Anteprima obbligatoria**: prima di scrivere qualcosa, un dialogo con: quanti Quaderni, Gruppi, Fogli, immagini; peso totale; albero richiudibile; scelta della destinazione quando serve; avvisi (Fogli lunghi, doppioni, allegati non importati, immagini mancanti, file ignorati). Pulsanti "Importa" e "Annulla".
47. **Annullamento**: salvare in `A.impostazioni.ultimaImportazione` data e identificativi creati (Fogli, Gruppi, Quaderni). Subito dopo: avviso "{n} Fogli importati." con "Annulla" (15 secondi). Fino all'importazione successiva, nel pannello Importa resta la riga "Annulla l'ultima importazione ({quando})": manda quei Fogli nel Cestino e toglie Gruppi e Quaderni creati e rimasti vuoti. Il campo non va nell'indice Dropbox (è locale: aggiungerlo a ciò che `perSalvare` tiene, non a `META`).
48. **Immagini nello zip**: per ogni Foglio cercare `![..](percorso)` e `<img src="percorso">` con percorso relativo. Risolverlo rispetto alla cartella del file (`%20`, `./`, `../`). Se il file c'è ed è jpg, png, gif o webp: passa da `preparaImmagine` (riduzione compresa), prende un identificativo nuovo, si scrive in `i:<id>` e il percorso nel testo diventa `immagini/<id>.<ext>`. Stessa immagine citata più volte: un solo record. File citato ma assente: il testo resta com'è e si conta fra le "immagini mancanti".
49. **Immagini scritte dentro al testo (`data:`)** [verificato, è un difetto]: oggi un `.md` con `![x](data:image/png;base64,...)` si vede, ma alla prima modifica l'immagine sparisce dal file senza avviso (`imgPulita`, riga 3310, scarta `data:` e `blob:`). Correzione: in ogni importazione e in ogni incolla le immagini `data:` diventano immagini incorporate come al punto 48; nei Fogli protetti (che non possono incorporare) `imgPulita` deve lasciare passare `data:image/`.
50. **Altri file nello zip** (pdf, audio, documenti): non entrano. Contati come "allegati non importati" ed elencati nell'anteprima e nel riepilogo finale. Vedi punto 143.
51. **Date**: la data della voce nello zip diventa `modificata` e `creata` del Foglio, se plausibile (dal 1990 a oggi), altrimenti adesso. In parallelo `creaZip` deve scrivere per ogni Foglio la sua `modificata` (oggi scrive l'ora dell'esportazione per tutti): così esporta e reimporta conserva le date. Per i file sciolti resta la data di importazione, come oggi.
52. **Titolo ripetuto**: se la prima riga non vuota del file è `# ` più lo stesso titolo del nome file (senza badare a maiuscole e accenti), quella riga si toglie: la aggiunge "Condividi" di folio e reimportando raddoppierebbe.
53. **Diario riconosciuto** [proposto]: un Foglio a tessere in cui ogni tessera inizia con la data in grassetto nel formato `gg/mm/aaaa, hh:mm` entra con `diario: true`.
54. **Cartella** [proposto]: dove il browser lo permette (`webkitdirectory`, in pratica su computer) la stessa scelta offre "Scegli una cartella": stessi percorsi (`webkitRelativePath`), stesso motore. Dove non c'è, la voce non compare.
55. **Testo non UTF-8**: se un `.txt` letto come UTF-8 contiene il carattere di sostituzione (U+FFFD), rileggerlo come windows-1252.
56. **Collegamenti relativi** [verificato, è un difetto]: un collegamento come `[file](allegati/x.pdf)` in un Foglio importato oggi apre `folio.nautargo.com/allegati/x.pdf`, cioè una pagina che non esiste. In `mdVersoHtml` i collegamenti che non iniziano con `http:`, `https:`, `mailto:`, `tel:` o `#` diventano inerti (classe `rotto`, niente navigazione) e toccandoli compare "Questo collegamento porta a un file che non è in folio."

### E4. Importare da un'altra app con un'AI [deciso]

57. **Idea**: folio non converte i formati delle altre app. Dà all'utente un testo di istruzioni incorporato nell'app, da consegnare a un assistente AI insieme al file esportato dall'altra app. L'assistente restituisce uno `.zip` nel formato del punto 44, che folio importa con il motore di E3.
58. **Schermata** (mockup "Importa con AI"): titolo "Importa da un'altra app, con un'AI" e tre passi numerati:
    1. "Esporta le note dall'altra app." (esempio: "da Evernote su computer, File > Esporta, formato .enex")
    2. "Dai all'assistente il file e queste istruzioni." con i pulsanti "Copia le istruzioni" e "Scarica (.md)"
    3. "Importa qui lo .zip che ti restituisce." con il pulsante "Scegli lo .zip"
59. **Una scelta sola prima di copiare**: "Come vuoi ritrovarle?" - "Un Foglio per nota, nei Gruppi come nell'altra app" (predefinita), "Tutto in un solo Foglio, a tessere", "Un Foglio per nota, tutte in un Gruppo". La scelta scrive una riga in cima alle istruzioni ("Struttura richiesta: A"), niente altro.
60. **Avvertenze a vista**, nello stesso pannello:
    - "Così le note passano dall'assistente che scegli tu. folio non le manda a nessuno."
    - "Gli assistenti accettano file fino a una certa dimensione: se il tuo è troppo grande, esporta un taccuino alla volta."
    - "Serve un assistente che sappia leggere file e crearne (per esempio Claude o ChatGPT con gli strumenti per i file)."
61. **Il testo delle istruzioni**: una costante `ISTRUZIONI_AI_IT` e una `ISTRUZIONI_AI_EN`, come già `PER_CLAUDE_IT/EN` (riga 7791). La bozza italiana è in Appendice 1. Il file scaricato si chiama `folio-istruzioni-importazione.md`. Vale per qualsiasi assistente: nessun riferimento a un prodotto solo.
62. **Contenuto incorporato, non un Foglio** [proposto]: le istruzioni vivono nell'app e si copiano o scaricano da lì. Non si crea un Foglio nell'archivio dell'utente: resterebbe fermo alla versione in cui è nato.
63. **Da verificare prima di congelare il testo** [da verificare]: i particolari del formato `.enex` citati in Appendice 1 vanno controllati sulla definizione ufficiale di Evernote (`evernote-export`), e l'intero giro va provato con un'esportazione vera di almeno 20 note con immagini, caselle, tabelle e un allegato pdf, su due assistenti diversi.
64. **Accettazione**: copia e scarica danno lo stesso testo; lo zip prodotto seguendo le istruzioni entra senza errori; struttura, date, immagini e caselle corrispondono all'origine; gli allegati non importati sono elencati.

### E5. Ottimizzazioni [proposto]

65. **Conversione a pezzi** (la più importante): oggi `scriviCorrente` converte tutto il Foglio a ogni pausa. Tenere una memoria per ogni blocco di primo livello (figlio diretto di `#corpo`, o di una tessera): chiave il suo `outerHTML`, valore il markdown. A ogni salvataggio si riconvertono solo i blocchi cambiati e si riuniscono con una riga vuota. `normalizzaElenchi` va fatta prima, sul Foglio intero. **Condizione di accettazione**: su un insieme di Fogli di prova (benvenuto IT ed EN, elenchi annidati, caselle, tabelle, citazioni, codice, immagini con larghezza e bordo, blocchi allineati, tessere, diario) il risultato a pezzi deve essere identico, carattere per carattere, a `htmlVersoMd` sul Foglio intero. Se anche un solo caso differisce, quel tipo di blocco torna alla conversione intera.
66. **Pausa che si adatta**: il ritardo di `registra` resta 700 ms; se l'ultima conversione è durata più di 150 ms diventa quattro volte quella durata, fino a 3.000 ms.
67. **Annulla con un tetto di memoria**: oggi fino a 150 fotografie del Foglio intero (per 300 kB di testo sono decine di MB). Tenere al massimo 150 passi e al massimo 12 MB in tutto, mai meno di 20 passi.
68. **Meno ridisegni mentre si scrive**: `registra` ridisegna a ogni pausa tutta la colonna (`disegnaLato`) e ricalcola "Citato in" (`disegnaRimandi`, che scorre tutti i Fogli). La colonna va ridisegnata solo se cambiano titolo, ordine o anteprima del Foglio aperto; "Citato in" dipende dagli altri Fogli e va ricalcolato solo aprendo il Foglio e dopo una rinomina.
69. **Ricerca**: oggi a ogni tasto si toglie l'accento a tutto il testo di tutti i Fogli. Tenere in memoria il testo già normalizzato per Foglio (chiave: identificativo più `modificata`), mostrare i primi 200 risultati con "Mostra gli altri".
70. **Copia di riserva**: riscriverla solo se dall'ultima è cambiato qualcosa nei Fogli (oggi basta aprire un Foglio, perché cambia l'elenco dei recenti).
71. **Fogli lunghi a schermo** [da verificare]: provare `content-visibility:auto` con `contain-intrinsic-size` sui blocchi di primo livello. Prima una prova breve su Chrome Android e Safari iPhone: cursore, selezione, ricerca nel Foglio, tessere trascinate. Si adotta solo se non rompe niente.
72. **Esportazioni pesanti**: `esportaJson` costruisce un solo testo con tutte le immagini; su archivi molto grandi può fallire. Avvolgere in un controllo d'errore con "Il backup è troppo grande per questo dispositivo: usa 'Esporta i Fogli' (.zip) o un computer." Stesso controllo su `esportaMd`.
73. **Banco di prova**: aggiungere a `window.__prova` una funzione `banco(kb)` che crea un Foglio di prova del peso dato e restituisce i tempi di apertura e conversione, per rifare la tabella del punto 14 prima e dopo.

### E6. Correzioni [verificato sul codice, salvo dove indicato]

74. **Icone dell'app**: i tre PNG hanno gli angoli trasparenti e lo stesso file è dichiarato sia `any` sia `maskable`. Su Android una maschera può mostrare gli angoli vuoti; su iPhone la trasparenza diventa nera. Servono file a tutto campo (punto 112).
75. **`importaJson` legge solo il primo file** anche se la scelta ne ammette più d'uno: passare a scelta singola.
76. **Avvisi sovrapposti**: gli avvisi in basso si impilano senza limite e coprono testo e barra sopra la tastiera. Al massimo due insieme; con la barra in posizione "tastiera" stanno sopra di lei; `role="status"` per i lettori di schermo.
77. **Bersagli piccoli al tocco**: `.mini` 28 px, `.stella` 26 px, `.att` 30 px. Con puntatore grossolano (`pointer:coarse`) l'area toccabile deve arrivare a 44 px, anche solo allargando la zona attiva senza cambiare il disegno.
78. **Dialoghi e menu per chi usa la tastiera**: il fuoco resta dentro al dialogo aperto e torna al pulsante di partenza alla chiusura; i menu hanno `role="menu"` e voci `role="menuitem"`, frecce su e giù, Esc.
79. **Stampa** [proposto]: il foglio di stile per la stampa esiste ma nell'app installata non c'è modo di chiamarla. Aggiungere "Stampa o salva in PDF" nel menu "Condividi ed esporta" (`window.print()`).
80. **Front matter**: un blocco iniziale fra due righe `---` oggi diventa una linea e un titolo. Non si corregge in questa versione: le istruzioni per l'AI lo vietano. Annotarlo nell'handoff come limite noto.

### E7. Piccoli miglioramenti [proposto]

81. **Informazioni sul Foglio**: voce nel menu a tre punti. Mostra creato, modificato, parole, caratteri, peso del testo, immagini (numero e MB), tessere. Dà anche un posto naturale al peso (E2).
82. **Anteprima nell'elenco**: sotto il titolo una seconda riga tenue con data breve e inizio del testo (c'è già `primeRighe`), tenuta in memoria per Foglio. Per i Fogli protetti chiusi solo "protetto". Vedi punto 144.

---

## F. Fase 2 - versione 9.0 "aspetto"

### F1. Direzione [proposto]

83. **In una riga**: la stessa carta calda e lo stesso ottone, con meno cornici e più gerarchia. Si toglie prima di aggiungere.
84. **Cosa non va oggi** (dalle schermate 8.3): prima del testo ci sono due barre incorniciate una sull'altra (sommario e formattazione); le righe dei Gruppi sono fasce piene con quattro comandi ciascuna; le voci dei Fogli sono una riga nuda; il pulsante più evidente della schermata crea un Gruppo, cioè l'azione meno frequente; dialoghi e menu su telefono sono finestre sospese; il punto del logo è un marrone spento.
85. **Tre mosse**: (1) gerarchia tipografica netta: titolo del Quaderno e del Foglio grandi e pesanti, informazioni secondarie piccole e tenui; (2) superfici: una carta di fondo e una sola carta chiara sopra, bordi sottili, ombra solo per ciò che galleggia; (3) ottone solo dove si tocca o dove serve orientarsi.
86. **Cosa resta uguale**: palette calda, un solo accento, tema scuro "luce di lampada", carattere di sistema per l'interfaccia, tre stili per il testo (Lineare, Libro, Macchina), trame di sfondo, tutto il comportamento.

### F2. Colori e misure

87. **Tema chiaro**:

| Nome | Valore | Uso |
|---|---|---|
| `--carta` | #F2EBDC | fondo |
| `--superficie` | #FBF8F1 | schede, fogli dal basso, tessere |
| `--superficie-2` | #E9E0CD | sfondo al passaggio, codice |
| `--inchiostro` | #26211B | testo |
| `--tenue` | #5A5045 | testo secondario (contrasto 6,70 su carta) |
| `--bordo` | #CEBFA2 | campi e controlli |
| `--filo` | #DDD0B6 | separatori e bordi delle schede (nuovo) |
| `--ottone` | #82531A | testo e icone che si toccano (contrasto 5,56 su carta) |
| `--ottone-vivo` | #B8863F | solo decorazione: punto, presa, segni (nuovo) |
| `--ottone-tenue` | #EED7B0 | fondo della voce attiva |
| `--allarme` | #8E3B31 | eliminazioni, errori |

88. **Tema scuro**: `--carta` #1B1815, `--superficie` #24201A, `--superficie-2` #332D24, `--inchiostro` #F1E8D7, `--tenue` #B5AA9A, `--bordo` #4A4134, `--filo` #3A332A, `--ottone` e `--ottone-vivo` #E8A867 (l'Ottone della famiglia nautargo, al posto di #E0B26C), `--ottone-tenue` #4A3A22, `--allarme` #E39486.
89. **`--fascia` sparisce** dalle righe dei Gruppi (resta solo dove serve un fondo tenue nei blocchi delle Impostazioni).
90. **Raggi**: 8 px controlli, 12 px schede e tessere, 18 px fogli dal basso, tondo pieno per pillole e pulsante più.
91. **Ombre**: nessuna per ciò che sta nel piano; una sola, morbida, per ciò che galleggia (barra di formattazione, menu, fogli dal basso, pulsante più): `0 1px 2px rgba(60,48,30,.06), 0 6px 18px rgba(60,48,30,.08)`.
92. **Scala del testo** (interfaccia): 12, 13, 15, 17, 20, 28 px. Pesi 400, 600, 700. Date e conteggi con cifre allineate (`tabular-nums`).
93. **Contrasto**: testo almeno 4,50 a 1, anche le etichette piccole. `--ottone-vivo` non si usa mai per testo.

### F3. Schermate

94. **Barra in alto**: 56 px; logo 28 px e nome "folio" con il punto ottone a sinistra, lente e ingranaggio a destra. Nessun bordo sotto: una riga `--filo` compare solo quando l'elenco è scorso.
95. **Testata del Quaderno**: nome a 22 px, peso 700, con la freccetta per cambiare Quaderno; sotto, una riga tenue "3 Gruppi - 24 Fogli". A destra i tre punti e "chiudi tutti".
96. **Riga del Gruppo**: niente fascia piena. Icona del Gruppo in una tessera tonda da 32 px con fondo `--ottone-tenue`, nome a 15 px peso 600 (non più maiuscolo), conteggio tenue, poi tre punti e più. La freccia separata sparisce: tocca già il nome per aprire e chiudere; lo stato si legge da una freccetta piccola accanto al conteggio.
97. **Voce del Foglio**: titolo a 15 px; seconda riga tenue a 12,5 px con data e inizio del testo (punto 82). Voce attiva: fondo `--ottone-tenue` e una tacca `--ottone-vivo` di 3 px a sinistra. Stella a destra, tenue finché non è piena.
98. **Pulsante più** [aperto, punto 141]: un più tondo, pieno, da 56 px in basso a destra dell'elenco crea un Foglio (nel Gruppo dell'ultimo Foglio aperto, altrimenti nel primo). "Nuovo Gruppo" resta nel menu a tre punti del Quaderno e come pulsante a contorno in fondo all'elenco. Il più sulla riga del Gruppo resta.
99. **Foglio aperto**: titolo a 28 px peso 700, interlinea stretta; sotto, una riga sola con "Modificato oggi alle 16:26" e, a destra, la pillola del sommario (icona e numero dei titoli).
100. **Sommario** [aperto, punto 142]: non più una barra fissa sopra il testo, ma la pillola del punto 99 che apre l'elenco dei titoli in un foglio dal basso (su computer un riquadro accanto). Dentro restano "chiudi o apri tutti i paragrafi".
101. **Barra di formattazione**: stessa logica e stesse tre posizioni. Aspetto: una sola scheda galleggiante con ombra, senza bordo, icone a 20 px, separatori sottili, stato acceso con fondo `--ottone-tenue`.
102. **Testo**: invariato nelle misure. Titoli con peso 700; citazioni e tabelle come oggi; i segni degli elenchi restano ottone.
103. **Tessere**: scheda `--superficie` con bordo `--filo`, raggio 12 px, senza ombra; presa più visibile (36 x 4 px, `--bordo`, `--ottone-vivo` al tocco). Nel diario la data in testa alla tessera è piccola, tenue e a cifre allineate: regola di solo stile, `#corpo[data-diario]>.tessera>p:first-child>strong:only-child` (serve l'attributo `data-diario` su `#corpo`, messo come `data-tessere`). Nessuna classe salvata nel testo.
104. **Fogli dal basso**: sotto i 900 px dialoghi e menu lunghi salgono dal basso, a tutta larghezza, con raggio 18 px in alto, una presa di 36 x 4 px e il margine dell'area sicura. Si impilano e si chiudono un passo alla volta. Sopra i 900 px restano finestre centrate e menu accanto al pulsante.
105. **Impostazioni**: stessi contenuti e stesso ordine; ogni blocco diventa una scheda `--superficie` con titolo a 13 px peso 600 (non maiuscolo) e icona; le scelte multiple diventano selettori a segmenti a tutta larghezza.
106. **Avvisi**: fondo `--inchiostro`, raggio 12 px, sopra la barra in basso; il pulsante dell'avviso in ottone chiaro.
107. **Stati vuoti**: mai un riquadro vuoto. Gruppo vuoto: riga in corsivo "Nessun Foglio. Tocca + per scriverne uno." Ricerca senza esiti: una frase e un suggerimento.
108. **Computer**: due colonne come oggi; colonna sinistra 320 px su `--superficie`, Foglio centrato sulla larghezza scelta. La barra di formattazione sta sopra il Foglio, allineata alla colonna del testo.

### F4. Logo, icone, splash

109. **Scelta** [aperto, punto 145]: evoluzione del monogramma attuale, non un segno nuovo. Chi ha folio installata lo riconosce; cambiano peso, geometria e colore del punto.
110. **Costruzione** (griglia 512, colori pieni, nessuna sfumatura):

```svg
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#26211B"/>
  <path d="M232 388V208a72 72 0 0 1 72-72h14" fill="none" stroke="#F6F0E3" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M176 250h120" fill="none" stroke="#F6F0E3" stroke-width="52" stroke-linecap="round"/>
  <circle cx="338" cy="384" r="30" fill="#E8A867"/>
</svg>
```

111. **Cosa cambia rispetto a oggi**: asta e taglio hanno lo stesso spessore (52) e sono lo stesso tipo di tratto; l'uncino è un quarto di cerchio esatto; il segno è centrato da solo, senza spostamenti; il punto è più grande e prende l'Ottone della famiglia (#E8A867 al posto di #8F5F22); il fondo prende l'inchiostro caldo dell'app (#26211B).
112. **File da produrre**: `icona-192.png` e `icona-512.png` (angoli tondi, `purpose: any`); `icona-maschera-512.png` a tutto campo senza trasparenza (`purpose: maskable`, il segno sta dentro il cerchio di sicurezza: verificato, il punto più lontano è a 194 px dal centro contro i 204 ammessi); `icona-180.png` a tutto campo senza trasparenza (iPhone arrotonda da solo); `icona.svg` come icona della scheda del browser, con il PNG di riserva; facoltativa `icona-mono-512.png` (`purpose: monochrome`). Aggiornare `manifest.webmanifest`, i `<link>` in testa e l'elenco `ROBA` di `sw.js`.
113. **Nome** [aperto, punto 146]: "folio" in Poppins 600 come le altre app nautargo, con il punto ottone. Per non caricare niente dalla rete: un file di carattere ridotto alle sole lettere f, o, l, i, incorporato in base64 (pochi kB), oppure le cinque lettere disegnate come tracciati SVG. Licenza OFL: citarla nel `README.md`.
114. **Splash**: stessa idea di oggi con il segno nuovo: l'asta si traccia, il taglio si allunga, il punto cade; poi il nome; in basso "by **nautargo**". Dura 1,60 s o un tocco, non blocca i tocchi, resta disattivabile, assente con "riduci movimento" e alla ricarica nella stessa sessione.

### F5. Movimento e accessibilità

115. **Movimento**: poco e con un senso. Fogli dal basso 220 ms; voci dell'elenco che compaiono a cascata solo al cambio di Quaderno (20 ms l'una, al massimo 10); niente altro di nuovo. Tutto spento con "riduci movimento".
116. **Fuoco visibile**: contorno ottone di 2 px su ogni controllo, anche nei fogli dal basso.
117. **Nomi per i lettori di schermo**: ogni pulsante con sola icona ha la sua etichetta (controllare i nuovi).

---

## G. Testi nuovi (italiano; l'inglese va aggiunto in `EN`)

118. **Tessere**: "Copia testo", "Testo della tessera copiato.", "Niente da copiare."
119. **Peso**: "Foglio lungo ({kb} kB): può aprirsi e salvarsi più lentamente.", "Dividi", "Foglio molto lungo ({mb} MB): aperto in vista testo.", "Apri formattato", "Diventano {n} Fogli", "Non ci sono titoli su cui dividerlo.", "Occupa {x} MB su circa {y} disponibili."
120. **Importa**: "Importa", "File di testo", "Archivio .zip o cartella", "Backup di folio", "Da un'altra app, con un'AI", "Anteprima", "Importa così", "Dividi ai titoli", "{n} doppioni saltati", "{n} allegati non importati", "{n} immagini mancanti", "Annulla l'ultima importazione ({quando})", "Questo browser non apre gli zip compressi: aggiornalo, oppure crea lo zip senza compressione.", "Questo collegamento porta a un file che non è in folio."
121. **Import con AI**: i testi dei punti 58, 59 e 60; "Copia le istruzioni", "Scarica (.md)", "Scegli lo .zip", "Istruzioni copiate."
122. **Altro**: "Informazioni sul Foglio", "Stampa o salva in PDF", "Il backup è troppo grande per questo dispositivo: usa 'Esporta i Fogli' (.zip) o un computer."
123. **Benvenuto**: aggiornare i paragrafi su tessere, importazione e limiti nei due testi di benvenuto. I Fogli di benvenuto già creati non si toccano.

## H. Prove

124. **Motore**: lettore zip (senza compressione, deflate, nomi accentati, voci da ignorare, percorsi con `..`), regola delle cartelle (punto 44), unione senza doppioni, annullamento, immagini `data:`, titolo ripetuto, date, conversione a pezzi identica a quella intera (punto 65).
125. **Giro completo**: "Esporta i Fogli" e poi "Importa" in un archivio vuoto devono ridare gli stessi Quaderni, Gruppi, titoli, testi, immagini e date di modifica.
126. **Schermate**: Chromium a 360 x 640 e 390 x 844, chiaro e scuro, e a 1.280 x 800. Per ogni schermata dei mockup una fotografia di confronto.
127. **Regressioni**: tutte le funzioni in `window.__prova` devono rispondere come in 8.3; sincronizzazione provata con due finestre e un Dropbox di prova (collega, modifica in due posti, conflitto, sola lettura); Fogli protetti (imposta, apri, chiudi, importa); cestino; annulla e rifai; tessere trascinate; diario.
128. **Dispositivi veri**: tocchi, tastiera, trascinamento e fogli dal basso vanno provati da Simo su Android e iPhone. Dirlo nell'handoff come [da verificare].

## I. Consegna

129. **Impronte CSP**: dopo ogni modifica a uno script in linea ricalcolare l'impronta e sostituirla alla riga 5. Con Python:

```python
import re, hashlib, base64
h = open('index.html', encoding='utf-8').read()
for m in re.finditer(r'<script>(.*?)</script>', h, re.S):
    print('sha256-' + base64.b64encode(hashlib.sha256(m.group(1).encode('utf-8')).digest()).decode())
```

130. **Versione**: aggiornare `VERSIONE_APP`, `VERSIONE` in `sw.js` (da lì nasce l'avviso "Nuova versione di folio pronta") e la riga in `README.md`.
131. **`_progetto/`**: questa cartella inizia con un trattino basso, quindi GitHub Pages non la pubblica. Non rinominarla e non spostarne il contenuto nella radice.
132. **Git**: lavorare sul ramo indicato da Simo, un commit per fase con messaggio in italiano ("v8.4: ..."). Nessuna richiesta di unione finché Simo non la chiede.
133. **Handoff**: a fine versione `_progetto/folio-handoff-8.4.md` (poi `-9.0.md`): stato, file, modifiche fatte, decisioni, punti aperti, misure del banco prima e dopo.

## J. Ordine dei lavori

134. **Sequenza**:
    1. Banco di prova (punto 73) e misure di partenza.
    2. E1 copia tessera.
    3. E5 punti 65-70 (ottimizzazioni), con le prove di identità.
    4. E2 peso e avvisi, ritarando le soglie sulle misure nuove.
    5. E3 lettore zip, anteprima, annullamento, immagini; poi E6 punti 49, 56, 75.
    6. E4 import con AI (dopo la verifica del punto 63).
    7. E6 e E7 restanti. Consegna 8.4, handoff.
    8. F2 colori e misure, poi F3 una schermata alla volta, nell'ordine: elenco, Foglio, tessere, fogli dal basso, Impostazioni, computer.
    9. F4 logo, icone, splash. Consegna 9.0, handoff.

135. **Mappa del codice 8.3** (righe di `index.html`):

| Righe | Contenuto |
|---|---|
| 17-586 | stile |
| 588-736 | pagina: splash, barra, colonna, Foglio, cestino |
| 737-1885 | librerie incorporate |
| 1893-2037 | utilità e archivio (IndexedDB) |
| 2039-2642 | lingua e dizionario `EN` |
| 2643-3047 | modello, benvenuto, `normalizza`, `carica`, `salvaDavvero` |
| 3049-3287 | Fogli protetti |
| 3288-3521 | markdown: `mdVersoHtml`, `htmlVersoMd`, `imgPulita`, tessere nel file |
| 3587-3669 | icone (`ICONE`, `TRATTI`), `vista`, `impostaModo` |
| 3671-3945 | colonna, preferiti, ricerca, selezione |
| 3947-4311 | `apri`, sommario, `scriviCorrente`, `registra`, vista testo |
| 4432-5100 | comandi di scrittura, annulla, caselle, tabelle, collegamenti |
| 5102-5400 | avvisi, dialoghi, menu |
| 5609-6004 | aspetto, barra di formattazione, Impostazioni |
| 6006-6287 | esportazione, zip, condivisione, copia, importazione |
| 6289-6537 | immagini |
| 6825-7083 | tessere e diario |
| 7085-8017 | sincronizzazione con Dropbox |
| 8019-8341 | eventi |
| 8343-8475 | avvio, `window.__prova` |

---

## Note

136. **Peso massimo**: la verifica chiesta da Simo dà questo esito: nessun limite scritto nel codice; il limite pratico è la velocità, e oggi si sente già a 300 kB (tabella al punto 14). La 8.4 non aggiunge limiti: toglie la causa principale della lentezza e avvisa sopra soglia.
137. **Perché lo zip e non il backup `.json` per l'AI**: lo zip di file markdown è lo stesso formato di "Esporta i Fogli", si controlla a occhio, lo produce anche una persona, e chiude un vuoto di oggi (esportazione senza ritorno). Il `.json` resta il backup fedele.
138. **Dropbox**: chi ha la sincronizzazione accesa può già far comparire Fogli nuovi mettendo file `.md` nella cartella di folio. Resta com'è; l'importazione da zip è la strada principale perché porta anche le immagini.
139. **Fuori perimetro**: etichette, allegati dentro folio, immagini nei Fogli protetti, sincronizzazione su altri servizi, monetizzazione, versione nativa.

## Punti aperti

140. **Consegne**: (a) due versioni, 8.4 motore e 9.0 aspetto [consigliata], (b) una sola 9.0 con tutto.
141. **Pulsante più**: (a) più tondo in basso a destra che crea un Foglio, "Nuovo Gruppo" nel menu e a contorno in fondo all'elenco [consigliata], (b) resta com'è oggi: il più del Quaderno crea un Gruppo, quello del Gruppo un Foglio.
142. **Sommario**: (a) pillola accanto alla data che apre i titoli in un foglio dal basso [consigliata], (b) resta la barra fissa sopra il testo, solo ridisegnata.
143. **Allegati che non sono immagini** (pdf, audio, documenti) nell'importazione: (a) restano nello zip in `allegati/` e nel Foglio compare una riga "[Allegato non importato: nome.pdf]" [consigliata], (b) l'AI li ignora e li elenca solo nel riepilogo, (c) folio impara a tenere allegati, in una versione futura a parte.
144. **Elenco dei Fogli**: (a) due righe con data e inizio del testo [consigliata], (b) una riga come oggi, (c) scelta nelle Impostazioni fra le due.
145. **Logo**: (a) l'evoluzione del punto 110 [consigliata], (b) esplorare altre due direzioni prima di decidere.
146. **Carattere del nome**: (a) Poppins 600 incorporato per la sola parola "folio" [consigliata], (b) resta il carattere di sistema.
147. **Copia della tessera**: (a) solo la voce nel menu della presa [consigliata], (b) anche una piccola icona di copia in alto a destra di ogni tessera, per copiare con un tocco.

---

## Appendice 1 - bozza delle istruzioni per l'AI (italiano)

Testo di `ISTRUZIONI_AI_IT`. I particolari su Evernote sono [da verificare] (punto 63).

```markdown
# Istruzioni: preparare un archivio di note da importare in folio

Ti allego le note esportate da un'altra app. Convertile in un archivio .zip che l'app folio (folio.nautargo.com) sa importare. Converti solo quello che c'è: non riassumere, non correggere, non inventare. Se qualcosa non si può convertire, lascialo fuori e dimmelo alla fine.

Struttura richiesta: A

## Cosa devi produrre

Un solo file `folio-import.zip`, fatto così:

    Nome del Quaderno/
      Nome del Gruppo/
        Titolo della nota.md
        immagini/
          foto-1.jpg
        allegati/
          documento.pdf

- Tre livelli: la cartella del Quaderno, la cartella del Gruppo, un file .md per ogni nota.
- Il nome del file è il titolo della nota. Togli i caratteri \ / : * ? " < > | e fermati a 80 caratteri. Nota senza titolo: usa le prime parole del testo. Due note con lo stesso titolo nello stesso Gruppo: aggiungi " (2)", " (3)".
- File in UTF-8, righe che finiscono con \n.
- Nello zip, la data di ogni file .md deve essere la data di ultima modifica della nota: folio la usa come data del Foglio.

## Struttura

- A (predefinita): un file per nota. Ogni taccuino o cartella dell'altra app diventa un Gruppo. Il Quaderno prende il nome della raccolta che contiene i taccuini, se c'è, altrimenti il nome dell'app di origine.
- B: un solo file .md con tutte le note, dalla più vecchia alla più recente. Prima di ogni nota scrivi una riga con solo `<!-- tessera -->`, poi una riga vuota, poi `## Titolo della nota`, poi il testo. Il file sta in `Nome dell'app/Importate/`.
- C: un file per nota, tutti nello stesso Gruppo `Nome dell'app/Importate/`.

Usa la lettera indicata nella riga "Struttura richiesta".

## Come scrivere ogni file .md

- Markdown semplice: titoli con #, ## e ###; **grassetto**, *corsivo*, ~~barrato~~, `codice`; elenchi con "- " e con "1. "; caselle con "- [ ] " e "- [x] "; citazioni con "> "; tabelle con |; linea con ---; collegamenti [testo](https://...).
- Non ripetere il titolo della nota come prima riga.
- Niente HTML, niente blocco iniziale fra righe --- (front matter), niente colori o stili: folio non li conserva.
- Sottolineato ed evidenziato in folio non esistono: scrivili in **grassetto**.
- Immagini: salva il file in `immagini/`, accanto al .md, e nel testo scrivi `![descrizione](immagini/nome.jpg)` nel punto in cui stava. Formati ammessi: jpg, png, gif, webp. Converti gli altri (heic, tiff, bmp, svg) in jpg o png. Nomi dei file solo con lettere minuscole, cifre e trattini. Non scrivere mai un'immagine dentro al testo come `data:`.
- Altri allegati (pdf, audio, documenti): folio non li contiene. Mettili in `allegati/`, accanto al .md, e nel punto in cui stavano scrivi una riga: `[Allegato non importato: nome.pdf]`.
- Etichette, se ci sono: ultima riga della nota, `Etichette: lavoro, casa`.
- Indirizzo web di origine, se c'è: penultima riga, `Origine: https://...`.
- Se una nota ne richiama un'altra, scrivi `[[Titolo dell'altra nota]]`.
- Testo cifrato o protetto che non puoi leggere: scrivi `[Testo protetto non importato]`.

## Se il file viene da Evernote (.enex)

- Ogni file .enex è un taccuino: il nome del file è il nome del Gruppo.
- Ogni nota è un elemento `note` con `title`, `content`, `created`, `updated`, zero o più `tag`, zero o più `resource`.
- Il testo sta in `content`, in un formato simile all'HTML. `en-todo` è una casella (`checked="true"` vuol dire spuntata). `en-media` indica un'immagine o un allegato: il suo `hash` è l'MD5 dei dati della `resource` corrispondente.
- Ogni `resource` ha i dati in base64 in `data`, il tipo in `mime` e spesso il nome in `resource-attributes/file-name`.
- Le date sono scritte come `20240131T101500Z`, in ora universale.

## Se non puoi creare file

Dimmelo subito. In quel caso scrivi qui in risposta un solo testo markdown con la struttura B, senza immagini: lo incollerò io in un Foglio.

## Alla fine

Scrivi un riepilogo breve: note convertite per Gruppo, immagini, allegati non importati (con il nome), note saltate e perché, note con più di 300 kB di testo.
```

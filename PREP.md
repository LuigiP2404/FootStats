# Piano di preparazione – footstats

Obiettivo: arrivare al colloquio tecnico (pair programming con AI, focus React + TypeScript) avendo costruito e capito ogni concetto qui sotto.

Ciclo per ogni giorno:
1. 15-20 minuti di lettura sul concetto (documento di studio o react.dev).
2. Costruzione: le parti [A MANO] le scrivo io, le parti [CLAUDE] le guido io.
3. Spiegazione ad alta voce, 2 minuti: "perché ho fatto così?".

Regola di uscita per ogni giorno: tutti i criteri spuntati, type check e lint puliti, e so spiegare ogni riga delle parti [A MANO].

---

## Giorno 0 – Analisi dello stato attuale [CLAUDE]

- [x] In plan mode, analizza il progetto e confrontalo con questo piano: cosa esiste già, cosa manca, cosa va sistemato.
- [x] Controlla la versione di Next.js in package.json (il caching e alcune API cambiano tra la 15 e la 16).
- [x] Nessuna modifica al codice: solo un report.

## Giorno 1 – Risultato live di una partita

- [x] [A MANO] Client component `LiveScore` con polling (intervallo ragionevole: il piano gratuito di API-Football ha un limite giornaliero di richieste basso, quindi in sviluppo usa dati mock).
- [x] [A MANO] Cleanup corretta: `clearTimeout` e `AbortController` sulla fetch in corso.
- [x] [A MANO] Dipendenze corrette: se cambia la partita, si ferma il vecchio polling e parte il nuovo.
- [x] [A MANO] Stato come discriminated union generica: `loading | success | error`.
- [x] [A MANO] Validazione a runtime della risposta (Zod o type guard), niente `any`.
- [x] [CLAUDE] Stile del componente e dati mock.

Da saper spiegare: quando parte la cleanup, perché la dipendenza serve, perché `unknown` + validazione invece di un'interfaccia.

## Giorno 2 – Lista giocatori filtrabile

- [x] [A MANO] Input di ricerca + lista filtrata calcolata nel render (niente stato derivato con useEffect).
- [x] [A MANO] `useTransition` sul filtraggio, `isPending` mostrato in UI.
- [x] [A MANO] `React.memo` sulla riga, con props stabili (verifica che non si ri-renderizzino tutte).
- [x] [A MANO] Misura con il Profiler dei React DevTools prima e dopo, e annota i tempi.
- [x] [CLAUDE] Dati mock con almeno 2.000 giocatori per rendere visibile il problema.
- [x] [A MANO] Key stabili (id del giocatore).

Estensione – paginazione (dopo le misure, così i numeri sopra restano il "prima"):
- [x] [A MANO] Paginazione client-side sulla lista filtrata (es. 50 per pagina): la pagina corrente è stato, la fetta da mostrare è calcolata nel render.
- [x] [A MANO] Al cambio della query si torna a pagina 1, nell'handler e non con un `useEffect`.
- [x] [A MANO] Controlli Prev / Next + "Page X of Y", disabilitati ai bordi; nessun controllo se c'è una sola pagina.
- [x] [A MANO] Verifica che `memo` e `useTransition` funzionino ancora (le props della lista restano stabili?).
- [x] [CLAUDE] Stile dei controlli di paginazione.
- [x] [A MANO] Misura di nuovo con il Profiler e confronta con la tabella sotto.

Da saper spiegare: paginazione vs virtualizzazione, perché il reset della pagina non va in un `useEffect`, pagina nello stato vs nell'URL (`?page=`).

### Misure (Profiler, `npm run dev`, 2.500 giocatori, senza CPU throttling, query "and")

| Versione | Commit urgenti (per tasto) | Transition "a" | Transition "and" | Note |
|---|---|---|---|---|
| Ingenua (un solo stato) | ~37 ms al primo tasto, 7 ms al secondo | — | — | Misura iniziale con query diversa: solo indicativa |
| Solo `useTransition` | ~95 ms (97,5 / 98 / 93,6) | scartata | 8,1 ms | Il render urgente ri-renderizza tutta la lista con la query vecchia |
| + `memo` sulla lista (`PlayerResults`) | < 1 ms (0,6 / 0,4 / 0,2) | 104 ms | 16,9 ms | Il render urgente salta la lista: l'input non si blocca più |
| + `memo` sulla riga (`PlayerRow`) | < 1 ms (0,5 / 0,6 / 0,2) | 77 ms | 6,9 ms | Le righe che restano vengono saltate |
| + paginazione (15 per pagina) | ~1 ms (0,8 / 0,7 / 1) | 4,5 ms | 8,7 ms | Al massimo 15 righe per commit; nessuna transition scartata, perché finiscono prima del tasto successivo |

Caso peggiore, cancellando la query: urgente 0,3 ms, transition **198 ms** con `memo` sulla riga (mount di circa 2.400 righe: `memo` non può aiutare). Con la paginazione: urgente 0,9 ms, transition **10,2 ms**.

Il costo che resta è il `.filter()` su 2.500 giocatori, puro JavaScript. Con la paginazione `memo` e `useTransition` non sono più necessari: restano nel codice di proposito, per documentare il percorso (vedi i commenti in `PlayerList.tsx`). In un progetto di lavoro andrebbero tolti, oppure tenuti solo se la pagina può crescere.

Con CPU throttling 4x e la sola `useTransition`, lettera "a": urgente 744 ms, transition 588 ms.

Lezioni:
- `useTransition` serve solo se il render urgente è leggero, quindi il componente lento va memoizzato.
- Mai chiamare `memo()` dentro un componente: crea un tipo nuovo a ogni render, con remount di tutto (misurato: 146 ms).
- Il `memo` va messo al livello in cui le props restano stabili: la riga (un `player`), non l'array filtrato (nuovo a ogni filtro).
- Il Profiler rallenta l'app mentre registra: va usato per confrontare, non per giudicare la fluidità.
- Ridurre il lavoro alla radice (paginazione, virtualizzazione) batte l'ottimizzazione del render: 198 ms → 10 ms nel caso peggiore.
- Si ottimizza in base ai numeri: `memo`, `useMemo` e `useCallback` hanno un costo e vanno giustificati.

Da saper spiegare: perché la riga si ri-renderizza senza memo, perché memo da solo non basta se le props cambiano riferimento, cosa fa `useTransition`.

## Giorno 3 – Pagina profilo giocatore

- [x] [A MANO] Rotta `app/players/[id]/page.tsx` come Server Component async, con `await params`.
- [x] [A MANO] Strategia di cache/revalidate scelta e motivata (dati aggiornati una volta al giorno).
  Scelta: ISR on-demand. `generateStaticParams` restituisce `[]` (nessun id al build), `dynamicParams` resta `true` (ogni id generato alla prima visita), `revalidate = 86400`. Verificato con `npm run start`: `x-nextjs-cache` MISS alla prima visita, HIT alla ricarica.
- [x] [CLAUDE] `generateMetadata` con nome del giocatore.
  `getPlayer` è avvolto in `cache()` di React: metadata e page lo chiamano nella stessa richiesta e viene eseguito una volta sola. `cache()` deduplica dentro una richiesta, l'ISR mette in cache tra una richiesta e l'altra.
- [x] [CLAUDE] `loading.tsx` ed `error.tsx` per la rotta.
- [x] [CLAUDE] Mock con latenze diverse: `getPlayerTransfers` (lenta, 600 ms) e `getPlayerTrophies` (veloce, 150 ms), oltre a `getPlayer` (300 ms).
- [x] [A MANO] Fetch indipendenti in parallelo (`Promise.all` o sezioni separate con `<Suspense>`), niente waterfall.

### Misure (`npm run dev`, `/players/100000`, latenze mock: player 300 ms, transfers 600 ms, trophies 150 ms)

| Versione | Tempo totale | Cosa vede l'utente |
|---|---|---|
| 1 – tre `await` in sequenza | ~1.100 ms | skeleton di `loading.tsx` fino alla fine |
| 2 – `getPlayer` + controllo 404, poi `Promise.all` | ~940 ms | skeleton fino alla fine |
| 3 – `getPlayer` + controllo 404, poi `<Suspense>` per sezione | ~940 ms | dati del giocatore a ~300 ms, trofei a ~450 ms, trasferimenti a ~900 ms |

Lezioni:
- Con `loading.tsx` la risposta è in streaming: il TTFB (~50 ms) non misura più la pagina. Va misurato il tempo totale (`curl -w "%{time_total}"`) o osservato quando compare il contenuto.
- Il parallelo completo ("start early, await late") darebbe ~600 ms, ma per gli id inesistenti spreca 2 richieste. Con ISR la latenza la paga solo il primo visitatore e la quota è limitata, quindi qui il controllo prima del parallelo è la scelta giusta.
- Suspense non riduce il tempo totale, riduce il tempo fino al primo contenuto utile. Non parallelizza da solo: un componente inizia a caricare solo quando viene renderizzato (waterfall genitore → figlio).
- Il dato che decide se la pagina esiste (`getPlayer` + `notFound()`) va atteso nella Page, prima dello streaming: dopo, lo status 200 è già partito ("soft 404"). In streaming vanno solo le sezioni secondarie.
- Un `<Suspense>` cattura solo i figli che sospendono, non l'`await` nel corpo del componente che lo renderizza.
- Le `key` devono essere uniche tra i fratelli: il lint ne controlla solo la presenza. Senza `id`, si compongono con i campi che identificano l'elemento.

- [x] [CLAUDE] Stile del profilo: header, card delle statistiche, trasferimenti, trofei, stati vuoti, skeleton per i fallback di `<Suspense>`.

Nota: il punto "parti interattive in piccoli Client Components" è spostato al Giorno 4. I preferiti nel progetto sono squadre, non giocatori, quindi il profilo giocatore resta tutto server.

Da saper spiegare: perché ISR e non SSR per questa pagina, cosa succede durante l'hydration, cosa non posso passare come prop a un Client Component.

## Giorno 4 – Preferiti (Redux), Server Action e layout CSS

Scelta (opzione C): i preferiti sono stato client per utente, quindi Redux + localStorage come da CLAUDE.md. Le Server Actions si esercitano a parte, su un caso in cui una mutazione sul server ha senso. Con preferiti su cookie + Server Action, le pagine squadra che leggono `cookies()` diventerebbero dinamiche e perderebbero l'ISR.

### 4a – Store Redux e preferiti
- [x] [A MANO] Store con `configureStore` creato per richiesta (`makeStore`), non un singleton globale: sul server più utenti condividerebbero lo stesso store.
- [x] [A MANO] `StoreProvider` come Client Component, montato nel layout, che crea lo store una sola volta (`lazy useState`).
- [x] [A MANO] Hook tipizzati `useAppDispatch` / `useAppSelector` (tipi `RootState` e `AppDispatch` ricavati dallo store).
- [x] [A MANO] `favoritesSlice`: aggiungi / rimuovi / toggle. Nello stato salvi i dati minimi per mostrare la squadra (id, nome, logo), non i dati dell'API.
- [x] [A MANO] Sync con localStorage: lettura solo dopo il mount (evitando l'hydration mismatch) e scrittura a ogni cambiamento.
- [x] [A MANO] Pulsante stella come piccolo Client Component dentro una pagina server: `'use client'` il più in basso possibile (spostato dal Giorno 3). Dove: righe partite della home (c'è già il segnaposto) e/o pagina squadra.
- [ ] [A MANO] Sezione "Preferiti" della sidebar e pagina `/favorites` che leggono dallo store.
- [ ] [CLAUDE] Stile del pulsante, della sidebar e di `/favorites`.

### 4b – Server Action (esercizio separato)
- [ ] [A MANO] Una Server Action con `"use server"`, input validato con Zod (gli argomenti arrivano dal client, quindi non sono affidabili).
- [ ] [A MANO] Form o pulsante client con stato di attesa (`useActionState` o `useTransition`) e gestione dell'errore.
- [ ] [A MANO] `revalidatePath` o `revalidateTag` dopo la mutazione.
- Caso d'uso da decidere. Candidato: pulsante "Refresh data" sul profilo giocatore che forza la rigenerazione ISR della pagina (`revalidatePath` on-demand), visibile solo in dev, perché in produzione chiunque potrebbe consumare la quota.

### 4c – Layout CSS
- [ ] [A MANO] Griglia di card su `/favorites` con Grid `repeat(auto-fill, minmax(250px, 1fr))`, senza media query.
- [ ] [A MANO] La card della squadra preferita cambia layout con una container query (orizzontale se larga, verticale se stretta).
- [ ] [CLAUDE] Rifinitura dello stile e responsive.

Da saper spiegare: perché lo store va creato per richiesta in Next, perché leggere localStorage durante il render causa un hydration mismatch, quando Redux e quando stato locale o server, differenza tra Server Action e Route Handler, `auto-fill` vs `auto-fit`, container query vs media query.

## Giorno 5 – Simulazione

- [ ] Esercizio a tempo di 45 minuti con AI abilitata, seguendo le 5 fasi: chiarire, progettare ad alta voce, plan mode, piccoli passi con verifica, review finale (`/code-review`).
- [ ] Ripasso della tabella degli errori nel documento di studio.

## Giorno prima del colloquio

- [ ] Niente codice nuovo.
- [ ] Ripasso leggero del documento.
- [ ] Preparare 3-4 storie sulla search (problema, cosa ho fatto, risultato in numeri).
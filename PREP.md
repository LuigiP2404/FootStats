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

- [ ] [A MANO] Client component `LiveScore` con polling (intervallo ragionevole: il piano gratuito di API-Football ha un limite giornaliero di richieste basso, quindi in sviluppo usa dati mock).
- [ ] [A MANO] Cleanup corretta: `clearInterval` e `AbortController` sulla fetch in corso.
- [ ] [A MANO] Dipendenze corrette: se cambia la partita, si ferma il vecchio polling e parte il nuovo.
- [ ] [A MANO] Stato come discriminated union generica: `loading | success | error`.
- [ ] [A MANO] Validazione a runtime della risposta (Zod o type guard), niente `any`.
- [ ] [CLAUDE] Stile del componente e dati mock.

Da saper spiegare: quando parte la cleanup, perché la dipendenza serve, perché `unknown` + validazione invece di un'interfaccia.

## Giorno 2 – Lista giocatori filtrabile

- [ ] [A MANO] Input di ricerca + lista filtrata calcolata nel render (niente stato derivato con useEffect).
- [ ] [A MANO] `useTransition` sul filtraggio, `isPending` mostrato in UI.
- [ ] [A MANO] `React.memo` sulla riga, con props stabili (verifica che non si ri-renderizzino tutte).
- [ ] [A MANO] Misura con il Profiler dei React DevTools prima e dopo, e annota i tempi.
- [ ] [CLAUDE] Dati mock con almeno 2.000 giocatori per rendere visibile il problema.
- [ ] [A MANO] Key stabili (id del giocatore).

Da saper spiegare: perché la riga si ri-renderizza senza memo, perché memo da solo non basta se le props cambiano riferimento, cosa fa `useTransition`.

## Giorno 3 – Pagina profilo giocatore

- [ ] [A MANO] Rotta `app/player/[id]/page.tsx` come Server Component async, con `await params`.
- [ ] [A MANO] Strategia di cache/revalidate scelta e motivata (dati aggiornati una volta al giorno).
- [ ] [CLAUDE] `generateMetadata` con nome del giocatore.
- [ ] [CLAUDE] `loading.tsx` ed `error.tsx` per la rotta.
- [ ] [A MANO] Fetch indipendenti in parallelo (`Promise.all` o sezioni separate con `<Suspense>`), niente waterfall.
- [ ] [A MANO] Parti interattive in piccoli Client Components, `'use client'` il più in basso possibile.

Da saper spiegare: perché ISR e non SSR per questa pagina, cosa succede durante l'hydration, cosa non posso passare come prop a un Client Component.

## Giorno 4 – Preferiti e layout CSS

- [ ] [A MANO] Server Action "aggiungi/rimuovi preferito" con `revalidatePath` o `revalidateTag`.
- [ ] [A MANO] Pulsante che usa la Server Action con stato di attesa.
- [ ] [A MANO] Griglia di card con Grid `repeat(auto-fill, minmax(250px, 1fr))`, senza media query.
- [ ] [A MANO] Una card che cambia layout con una container query.
- [ ] [CLAUDE] Rifinitura dello stile e responsive.

Da saper spiegare: differenza tra Server Action e Route Handler, `auto-fill` vs `auto-fit`, container query vs media query.

## Giorno 5 – Simulazione

- [ ] Esercizio a tempo di 45 minuti con AI abilitata, seguendo le 5 fasi: chiarire, progettare ad alta voce, plan mode, piccoli passi con verifica, review finale (`/code-review`).
- [ ] Ripasso della tabella degli errori nel documento di studio.

## Giorno prima del colloquio

- [ ] Niente codice nuovo.
- [ ] Ripasso leggero del documento.
- [ ] Preparare 3-4 storie sulla search (problema, cosa ho fatto, risultato in numeri).
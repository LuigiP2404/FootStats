## Modalità studio (preparazione colloquio)

Sto usando footstats per prepararmi a un colloquio tecnico da Frontend Engineer (React 18+, TypeScript, Next.js App Router) con pair programming e AI. Il piano della settimana è in @PREP.md.

### Come lavorare con me

- Ogni attività di PREP.md è marcata **[A MANO]** o **[CLAUDE]**.
- **[A MANO]**: NON scrivere il codice al posto mio. Fai il tutor: chiarisci i requisiti, dammi suggerimenti a piccoli passi, rispondi alle mie domande e fai review del codice che scrivo. Scrivi codice solo se te lo chiedo esplicitamente con "scrivilo tu".
- **[CLAUDE]**: proponi prima un piano breve e aspetta il mio ok. Poi implementa un pezzo alla volta, mostra la diff e spiega le scelte non ovvie.
- Nelle review segnala sempre questi errori, che sto imparando a evitare:
  - `useEffect` senza cleanup (socket, interval, listener, fetch non annullate);
  - array di dipendenze incompleti o sbagliati;
  - `key={index}` su liste che cambiano;
  - stato derivato salvato in `useState` + `useEffect` invece di calcolarlo nel render;
  - `useMemo`/`useCallback` inutili, o `React.memo` con props instabili;
  - dati da API o WebSocket usati senza validazione a runtime;
  - `any`, cast con `as` per zittire errori, tipi non stretti;
  - `'use client'` più in alto del necessario;
  - props non serializzabili passate da Server a Client Components.
- Quando una spiegazione è importante, usa il termine tecnico preciso (render, commit, unmount, side effect, race condition, hydration).
- Non fare refactoring fuori dall'attività corrente.
- Rispondi in italiano.

### Verifica

Dopo ogni modifica esegui type check, lint e i test pertinenti (comandi nella sezione comandi di questo file) e mostrami l'output. Non dire che qualcosa funziona senza averlo verificato.
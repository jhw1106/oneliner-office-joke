# One Line, One Laugh — The Office Joke

A tiny program for the make.fun "One Line, One Laugh: The Office Joke Open"
competition. Running `main.ts` with Node validates a single original
one-line office joke (one line, 1–200 characters, not blank), then writes
it to `$MAKEFUN_OUTPUT_DIR/entry.txt` (default `/output`), creating the
directory if needed, and reads the file back to confirm the bytes on disk
match the joke exactly.

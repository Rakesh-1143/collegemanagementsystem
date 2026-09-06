# Run doc — College ERP (MERN)

## Reproduce uncommitted artifacts (fresh checkout)

1. Create the server env file (gitignored) and fill in values:
   - `cp server/.env.example server/.env`
   - `CONNECTION_URL` — MongoDB connection string (local dev: `mongodb://127.0.0.1:27017/college_erp_test`, or Atlas)
   - `JWT_SECRET` — any secret string (server falls back to `sEcReT` if unset)
2. Install dependencies:
   - `cd server && npm install`
   - `cd client && npm install`
3. If not using Atlas, start a local MongoDB:
   - `mkdir -p .tmp-mongo && mongod --dbpath .tmp-mongo --port 27017 --bind_ip 127.0.0.1`
   - The server auto-creates a dummy admin on startup: username `ADMDUMMY`, password `123`.
   - NOTE: in this sandbox mongod instances crash after a few minutes with an
     "unhandled exception" (tcmalloc) — if the API hangs, check `netstat` for
     the mongod listener and restart mongod, then `touch server/index.js` so
     nodemon reconnects (or restart the API server).

## Run the servers

Two processes. NOTE: this sandbox exports `PORT=0` globally, which makes both
servers bind to a random port — always override `PORT` explicitly.

- API server (Express + MongoDB), **port 5001** — this port is hardcoded as the
  client's API base in `client/src/redux/api/index.js`:
  - `cd server && PORT=5001 npm run start` (or `PORT=5001 node index.js`)
- Client (React dev server, CRA), **port 3100**:
  - `cd client && PORT=3100 BROWSER=none npm start`
  - Port 3000 is the CRA default but is occupied by a non-HTTP process in this
    sandbox, so the client runs on 3100 instead.
- Open `http://localhost:3100` → login page at `/login/adminlogin` (ADMDUMMY / 123).
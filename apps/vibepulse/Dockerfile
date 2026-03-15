# ── Build stage: compile SvelteKit frontend ──────────────────────────────────
FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY svelte.config.js vite.config.ts tsconfig.json tailwind.config.js postcss.config.js ./
COPY src/ ./src/
COPY static/ ./static/

RUN npm run build

# ── Build stage: compile Rust backend (without Tauri UI for CI/Docker) ────────
FROM rust:1.93-slim-bookworm AS rust-builder

WORKDIR /build

RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

COPY src-tauri/Cargo.toml src-tauri/Cargo.lock* ./
COPY src-tauri/build.rs ./
COPY src-tauri/src/ ./src/

# Build library tests (no Tauri UI dependency needed)
RUN cargo test --lib --no-default-features

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

WORKDIR /app

# Copy SvelteKit build output
COPY --from=frontend-builder /app/build ./build
COPY --from=frontend-builder /app/package.json ./

# Copy config files
COPY config/ ./config/

# Install minimal runtime deps
RUN npm ci --omit=dev --ignore-scripts

EXPOSE 1420

LABEL org.opencontainers.image.title="Vibepulse GSD"
LABEL org.opencontainers.image.description="Interactive CLI learning desktop app for Get-Shit-Done"
LABEL org.opencontainers.image.version="0.1.0"

CMD ["node", "-e", "require('http').createServer((req,res)=>{const fs=require('fs'),path=require('path');const file=path.join('./build',req.url==='/'?'index.html':req.url);try{res.end(fs.readFileSync(file));}catch{res.end(fs.readFileSync('./build/index.html'));}}).listen(1420,()=>console.log('Vibepulse GSD dev server on http://localhost:1420'))"]

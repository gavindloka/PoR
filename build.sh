#!/bin/bash
set -ex

export RUSTFLAGS=$RUSTFLAGS' -C target-feature=+simd128'
cargo build --release --target=wasm32-wasi
wasi2ic ./target/wasm32-wasi/release/backend_ai.wasm ./target/wasm32-wasi/release/backend_ai-ic.wasm
wasm-opt -Os --enable-simd --enable-bulk-memory   -o ./target/wasm32-wasi/release/backend_ai-ic.wasm \
        ./target/wasm32-wasi/release/backend_ai-ic.wasm

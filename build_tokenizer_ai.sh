#!/bin/bash
set -ex

cd tokenizer_ai/

export RUSTFLAGS=$RUSTFLAGS' -C target-feature=+simd128'
cargo build --release --target=wasm32-wasip1
wasi2ic ./target/wasm32-wasip1/release/tokenizer_ai.wasm ./target/wasm32-wasip1/release/tokenizer_ai-ic.wasm
wasm-opt -Os --enable-simd --enable-bulk-memory   -o ./target/wasm32-wasip1/release/tokenizer_ai-ic.wasm \
        ./target/wasm32-wasip1/release/tokenizer_ai-ic.wasm
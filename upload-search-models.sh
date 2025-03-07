#!/bin/bash
set -e

dfx canister call tokenizer_ai clear_tokenizer_json_bytes
dfx canister call word_ai clear_word_vector_model_bytes
ic-file-uploader tokenizer_ai append_tokenizer_json_bytes tokenizer.json
ic-file-uploader word_ai append_word_vector_model_bytes model.onnx

dfx canister call tokenizer_ai setup_models
dfx canister call word_ai setup_models


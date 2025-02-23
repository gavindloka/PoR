#!/bin/bash
set -e

dfx canister call backend_ai clear_face_detection_model_bytes
dfx canister call backend_ai clear_face_recognition_model_bytes
ic-file-uploader backend_ai append_face_detection_model_bytes version-RFB-320.onnx
ic-file-uploader backend_ai append_face_recognition_model_bytes face-recognition.onnx
dfx canister call backend_ai setup_models

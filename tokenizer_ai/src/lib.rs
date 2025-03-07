use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager},
    DefaultMemoryImpl,
};

use std::cell::RefCell;
use tokenizer::{setup_tokenizer, tokenize, TokenizerResult, TOKENIZER_JSON_FILE};

mod storage;
mod tokenizer;

// WASI polyfill requires a virtual stable memory to store the file system.
// You can replace `0` with any index up to `254`.
const WASI_MEMORY_ID: MemoryId = MemoryId::new(0);

thread_local! {
    // The memory manager is used for simulating multiple memories.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
}

/// Appends the given chunk to the tokenizer json file.
/// This is used for incremental chunk uploading of large files.
#[ic_cdk::update]
fn append_tokenizer_json_bytes(bytes: Vec<u8>) {
    storage::append_bytes(TOKENIZER_JSON_FILE, bytes);
}

/// Clears the tokenizer json file.
/// This is used for incremental chunk uploading of large files.
#[ic_cdk::update]
fn clear_tokenizer_json_bytes() {
    storage::clear_bytes(TOKENIZER_JSON_FILE);
}

/// Once the model files have been incrementally uploaded,
/// this function loads them into in-memory models.
#[ic_cdk::update]
fn setup_models() -> Result<(), String> {
    setup_tokenizer(storage::bytes(TOKENIZER_JSON_FILE))
        .map_err(|err| format!("Failed to setup model: {}", err))
}

/// Tokenizes the input string
#[ic_cdk::update]
fn try_tokenizer(text: String) -> TokenizerResult {
    tokenize(text)
}

#[ic_cdk::init]
fn init() {
    let wasi_memory = MEMORY_MANAGER.with(|m| m.borrow().get(WASI_MEMORY_ID));
    ic_wasi_polyfill::init_with_memory(&[0u8; 32], &[], wasi_memory);
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    let wasi_memory = MEMORY_MANAGER.with(|m| m.borrow().get(WASI_MEMORY_ID));
    ic_wasi_polyfill::init_with_memory(&[0u8; 32], &[], wasi_memory);
}

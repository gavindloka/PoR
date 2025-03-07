use anyhow::Result;
use candid::{CandidType, Deserialize};
use embedding::{
    internal_add_token, internal_search_closest, setup, TokenizerEncoding, WORD_VECTOR_MODEL,
};
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager},
    DefaultMemoryImpl,
};

use std::cell::RefCell;

mod embedding;
mod storage;

// WASI polyfill requires a virtual stable memory to store the file system.
// You can replace `0` with any index up to `254`.
const WASI_MEMORY_ID: MemoryId = MemoryId::new(0);

thread_local! {
    // The memory manager is used for simulating multiple memories.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
}

/// Appends the given chunk to the word vector model.
/// This is used for incremental chunk uploading of large files.
#[ic_cdk::update]
fn append_word_vector_model_bytes(bytes: Vec<u8>) {
    storage::append_bytes(WORD_VECTOR_MODEL, bytes);
}

/// Clears the word vector model.
/// This is used for incremental chunk uploading of large files.
#[ic_cdk::update]
fn clear_word_vector_model_bytes() {
    storage::clear_bytes(WORD_VECTOR_MODEL);
}

/// Once the model files have been incrementally uploaded,
/// this function loads them into in-memory models.
#[ic_cdk::update]
fn setup_models() -> Result<String, String> {
    setup(storage::bytes(WORD_VECTOR_MODEL))
        .map_err(|err| format!("Failed to setup model: {}", err))
}

#[ic_cdk::update]
pub fn add_token(id: String, encoding: TokenizerEncoding) -> Result<(), String> {
    internal_add_token(id, encoding).map_err(|e| e.to_string())?;
    Ok(())
}

#[ic_cdk::update]
pub fn search_closest(encoding: TokenizerEncoding) -> Result<String, String> {
    internal_search_closest(encoding).map_err(|e| e.to_string())
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

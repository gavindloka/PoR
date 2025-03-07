use std::cell::RefCell;

use anyhow::Result;
use bytes::Bytes;
use candid::CandidType;
use serde::Deserialize;
use tokenizers::Tokenizer;

pub const TOKENIZER_JSON_FILE: &str = "tokenizer.json";

thread_local! {
    static TOKENIZER: RefCell<Option<Tokenizer>> = RefCell::new(None);
}

#[derive(CandidType, Deserialize)]
pub struct TokenizerEncoding {
    pub tokens: Vec<String>,
    pub input_ids: Vec<i64>,     
    pub attention_mask: Vec<i64>, 
}

#[derive(CandidType, Deserialize)]
pub enum TokenizerResult {
    Ok(TokenizerEncoding),
    Err(String),
}

#[derive(CandidType, Deserialize)]
pub enum DecodingResult {
    Ok(Vec<String>),
    Err(String),
}

pub fn setup_tokenizer(bytes: Bytes) -> Result<()> {
    let result = Tokenizer::from_bytes(bytes).map_err(|e| anyhow::Error::msg(e.to_string()))?;
    TOKENIZER.with_borrow_mut(|m| {
        *m = Some(result);
    });
    Ok(())
}

pub fn tokenize(input_text: String) -> TokenizerResult {
    TOKENIZER.with(|t| {
        let tokenizer = t.borrow();
        let tokenizer = match tokenizer.as_ref() {
            Some(t) => t,
            None => return TokenizerResult::Err("Tokenizer not initialized".to_string()),
        };

        match tokenizer.encode(input_text, true) {
            Ok(encoding) => {
                let input_ids: Vec<i64> = encoding.get_ids().iter().map(|&id| id as i64).collect();
                let attention_mask: Vec<i64> = vec![1; input_ids.len()]; // Masking real tokens

                TokenizerResult::Ok(TokenizerEncoding {
                    tokens: encoding.get_tokens().to_vec(),
                    input_ids,
                    attention_mask,
                })
            }
            Err(e) => TokenizerResult::Err(format!("Tokenizer error: {}", e)),
        }
    })
}
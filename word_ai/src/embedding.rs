use anyhow::anyhow;
use bytes::Bytes;
use candid::CandidType;
use prost::Message;
use serde::Deserialize;
use std::{cell::RefCell, collections::HashMap};
use tract_ndarray::s;
use tract_onnx::prelude::*;

use anyhow::Result;
use tract_onnx::prelude::{Graph, SimplePlan, TypedFact, TypedOp};

pub const WORD_VECTOR_MODEL: &str = "word-vector-model.onnx";

type Model = SimplePlan<TypedFact, Box<dyn TypedOp>, Graph<TypedFact, Box<dyn TypedOp>>>;

#[derive(CandidType, Deserialize)]
pub struct TokenizerEncoding {
    pub tokens: Vec<String>,
    pub input_ids: Vec<i64>,
    pub attention_mask: Vec<i64>,
}

thread_local! {
    static WORD: RefCell<Option<Model>> = RefCell::new(None);
    static EMBEDDINGS: RefCell<HashMap<String, Vec<f32>>> = RefCell::new(HashMap::new());
}

pub fn setup(word: Bytes) -> Result<String> {
    setup_word_vector(word)
}

fn get_model_inputs(_model: &&Graph<TypedFact, Box<dyn TypedOp>>) -> String {
    let inputs_info = String::new();
    // for (i, input) in model.input_outlets().iter().enumerate() {
    //     if let Some(fact) = model.node(input.node).op().downcast_ref::<TypedFact>() {
    //         inputs_info.push_str(&format!("Input {}: {:?}\n", i, fact));
    //     }
    // }
    inputs_info
}

fn setup_word_vector(bytes: Bytes) -> Result<String> {
    let proto: tract_onnx::pb::ModelProto = tract_onnx::pb::ModelProto::decode(bytes)?;
    let word = tract_onnx::onnx()
        .model_for_proto_model(&proto)?
        .into_optimized()?
        .into_runnable()?;
    let model: &&Graph<TypedFact, Box<dyn TypedOp>> = &word.model();
    // let input_info = get_model_inputs(word.model());

    WORD.with_borrow_mut(|m| {
        *m = Some(word);
    });

    Ok("".to_owned()) 
}

pub fn internal_add_token(id: String, encoding: TokenizerEncoding) -> Result<()> {
    // Convert token_ids to i64
    let input_ids: Vec<i64> = encoding.input_ids.iter().map(|&id| id as i64).collect();
    let attention_mask: Vec<i64> = vec![1; input_ids.len()];

    // Convert to tensor
    let input_tensor = Tensor::from_shape(&[1, input_ids.len()], &input_ids)?;
    let mask_tensor = Tensor::from_shape(&[1, input_ids.len()], &attention_mask)?;

    // Run model
    let embedding = run_model(input_tensor, mask_tensor)?;

    // Store the embedding
    EMBEDDINGS.with(|store| {
        store.borrow_mut().insert(id, embedding);
    });

    Ok(())
}

fn run_model(input_tensor: Tensor, attention_mask: Tensor) -> Result<Vec<f32>> {
    WORD.with(|model| {
        let model = model.borrow();
        let model = model.as_ref().ok_or_else(|| anyhow!("Model not loaded"))?;

        let result = model.run(tvec!(input_tensor.into(), attention_mask.into()))?;
        let output_tensor = result[0].to_array_view::<f32>()?;

        // Extract CLS token (first vector)
        let cls_embedding = output_tensor.slice(s![0, ..]).to_vec();
        Ok(cls_embedding)
    })
}

pub fn internal_search_closest(encoding: TokenizerEncoding) -> Result<String> {
    let input_ids: Vec<i64> = encoding.input_ids.iter().map(|&id| id as i64).collect();
    let attention_mask: Vec<i64> = vec![1; input_ids.len()];

    let input_tensor = Tensor::from_shape(&[1, input_ids.len()], &input_ids)?;
    let mask_tensor = Tensor::from_shape(&[1, input_ids.len()], &attention_mask)?;
    let query_embedding = run_model(input_tensor, mask_tensor)?;

    // Find the closest match
    EMBEDDINGS.with(|store| {
        let embeddings = store.borrow();
        let (best_id, _) = embeddings
            .iter()
            .map(|(id, emb)| (id, cosine_similarity(&query_embedding, emb)))
            .max_by(|a, b| a.1.partial_cmp(&b.1).unwrap())
            .ok_or_else(|| anyhow!("No embeddings stored"))?;

        Ok(best_id.clone())
    })
}

fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
    let dot_product: f32 = a.iter().zip(b).map(|(x, y)| x * y).sum();
    let norm_a: f32 = a.iter().map(|x| x.powi(2)).sum::<f32>().sqrt();
    let norm_b: f32 = b.iter().map(|x| x.powi(2)).sum::<f32>().sqrt();
    dot_product / (norm_a * norm_b)
}

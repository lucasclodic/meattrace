"use strict";

function grams(text) {
  const normalized = " " + text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() + " ";
  const grams = [];
  for (let size = 3; size <= 5; size++) {
    for (let start = 0; start <= normalized.length - size; start++) {
      grams.push(normalized.slice(start, start + size));
    }
  }
  return grams;
}

function features(text, model) {
  const ids = [...new Set(grams(text))]
    .filter(gram => Object.hasOwn(model.vocab, gram))
    .map(gram => model.vocab[gram]);
  const weight = 1 / Math.sqrt(Math.max(ids.length, 1));
  return ids.map(id => [id, weight]);
}

function infer(xs, model) {
  const hidden = model.w1.map((row, i) =>
    Math.tanh(xs.reduce((sum, [id, value]) => sum + row[id] * value, model.b1[i])));
  const logits = model.w2.map((row, i) =>
    hidden.reduce((sum, value, j) => sum + row[j] * value, model.b2[i]));
  const offset = Math.max(...logits);
  const exps = logits.map(value => Math.exp(value - offset));
  const total = exps.reduce((sum, x) => sum + x, 0);
  return { hidden, probabilities: exps.map(x => x / total) };
}

function route(text, model) {
  const xs = features(text, model);
  const { probabilities } = infer(xs, model);
  const [best, next] = [0, 1, 2].sort((a, b) => probabilities[b] - probabilities[a]);
  const score = probabilities[best];
  const unreliable = xs.length < 10 || score < 0.66 || score - probabilities[next] < 0.18;
  return { best, label: unreliable ? -1 : best, score };
}

function keyword(text) {
  if (/\b(horse|horsemeat|equine|species mismatch|substitution|pork)\b/i.test(text)) return 0;
  if (/\b(missing|unlinked|no lot|unknown origin|no signature)\b/i.test(text)) return 1;
  return 2;
}

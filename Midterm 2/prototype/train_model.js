"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const dir = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(dir, "incident_examples.json"), "utf8"));
const inference = fs.readFileSync(path.join(dir, "inference.js"), "utf8");
const { grams, features, infer, keyword, route } = vm.runInNewContext(inference + "\n({grams, features, infer, keyword, route})");
const examples = data.train.flatMap((rows, label) => rows.map(text => ({ text, label })));
const counts = new Map();
for (const row of examples) {
  for (const gram of new Set(grams(row.text))) counts.set(gram, (counts.get(gram) || 0) + 1);
}
const terms = [...counts.entries()].filter(([, count]) => count >= 2).map(([gram]) => gram).sort();
const vocab = Object.fromEntries(terms.map((term, index) => [term, index]));
let seed = 511;
function random() {
  seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
  return seed / 4294967296;
}
const hiddenSize = 12;
const weights = (rows, cols, scale) => Array.from({length:rows}, () =>
  Array.from({length:cols}, () => (random() * 2 - 1) * scale));
const model = {
  labels: data.labels, vocab,
  w1: weights(hiddenSize, terms.length, 0.04), b1: Array(hiddenSize).fill(0),
  w2: weights(3, hiddenSize, 0.16), b2: Array(3).fill(0)
};
const train = examples.map(row => ({ ...row, xs: features(row.text, model) }));
const order = train.map((_, index) => index);
for (let epoch = 0; epoch < 100; epoch++) {
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const rate = 0.14 / (1 + epoch / 65);
  for (const index of order) {
    const {xs, label} = train[index];
    const { hidden, probabilities } = infer(xs, model);
    const error = probabilities.map((p, i) => p - Number(i === label));
    const back = hidden.map((h, j) => (1 - h * h) *
      error.reduce((sum, e, i) => sum + e * model.w2[i][j], 0));
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < hiddenSize; j++) model.w2[i][j] -= rate * error[i] * hidden[j];
      model.b2[i] -= rate * error[i];
    }
    for (let j = 0; j < hiddenSize; j++) {
      for (const [k, value] of xs) model.w1[j][k] -= rate * back[j] * value;
      model.b1[j] -= rate * back[j];
    }
  }
}
for (const key of ["w1", "w2"]) model[key] = model[key].map(row => row.map(x => +x.toFixed(7)));
for (const key of ["b1", "b2"]) model[key] = model[key].map(x => +x.toFixed(7));

const rows = data.test.flatMap((notes, expected) => notes.map(text => {
  const result = route(text, model);
  return { text, expected, keyword: keyword(text), neural: result.best, routed: result.label };
}));
const confusion = key => data.labels.map((_, actual) => [0, 1, 2, -1].map(predicted =>
  rows.filter(row => row.expected === actual && row[key] === predicted).length));
const metrics = {
  train: train.length, test: rows.length, vocabulary: terms.length,
  keywordCorrect: rows.filter(row => row.expected === row.keyword).length,
  neuralCorrect: rows.filter(row => row.expected === row.neural).length,
  routed: rows.filter(row => row.routed !== -1).length,
  routedCorrect: rows.filter(row => row.expected === row.routed).length,
  keywordConfusion: confusion("keyword"), neuralConfusion: confusion("neural"),
  routedConfusion: confusion("routed"), rows,
  challenge: data.challenge.map(text => ({ text, ...route(text, model) }))
};
fs.writeFileSync(path.join(dir, "model.json"), JSON.stringify(model));
fs.writeFileSync(path.join(dir, "evaluation.json"), JSON.stringify(metrics, null, 2) + "\n");
console.log(JSON.stringify({...metrics, rows: undefined}, null, 2));

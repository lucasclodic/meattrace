"use strict";
const fs = require("node:fs");
const path = require("node:path");
const read = name => fs.readFileSync(path.join(__dirname, name), "utf8");
const embed = name => JSON.stringify(JSON.parse(read(name))).replaceAll("<", "\\u003c");
const scripts = [
  "const DATA = " + embed("cases.json") + ";",
  "const MODEL = " + embed("model.json") + ";",
  read("inference.js"), read("workflow.js"), read("ui.js")
].join("\n");
const template = read("index.template.html");
const output = process.argv[2] || path.join(__dirname, "MeatTrace_Prototype.html");
fs.writeFileSync(output, template.replace("/*__SCRIPTS__*/", () => scripts));

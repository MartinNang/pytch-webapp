import * as fs from "fs";
import { zPytchProgram } from "../src/model/pytch-program";

const input = fs.readFileSync(0, "utf-8");

let jsonData: unknown;
try {
  jsonData = JSON.parse(input);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.log(`JSON parse error: ${message}`);
  process.exit(1);
}

const result = zPytchProgram.safeParse(jsonData);

if (result.success) {
  console.log("OK");
  process.exit(0);
} else {
  console.log(result.error);
  process.exit(1);
}

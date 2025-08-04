import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createDocFromSnapshot, decodeSnapshotV2, Doc } from "yjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Function to ignore unused variables and avoid eslint rule.
 * @param _variables variables to ignore
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ignore(..._variables: unknown[]) {
  /* ignore all the variables. */
}

// Conver base64 string to Uint8Array
export function base64ToBytes(base64: string) {
  const binString = atob(base64);
  const bytes = new Uint8Array(binString.length);
  Array.from(binString).forEach((char, i) => {
    bytes[i] = char.charCodeAt(0);
  });
  return bytes;
}

// Convert Uint8Array to base64 string
export function bytesToBase64(bytes: Uint8Array) {
  let binaryString = "";
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }

  return btoa(binaryString);
}

export function snapshotToDoc(data: string, doc: Doc) {
  // doc.gc = false;
  const snapshot = decodeSnapshotV2(base64ToBytes(data));
  const newDoc = createDocFromSnapshot(doc, snapshot);
  // doc.gc = true;
  return newDoc;
}

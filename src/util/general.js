export function verifyResult(expected, result){
  return (expected || "").trim() === (result || "").trim();
}
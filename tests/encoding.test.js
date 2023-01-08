import { encodeToBase64, decodeFromBase64 } from "../utils/encoding";

describe("Encoding", () => {
  const decodedCode = "const valid = true;";
  const encodedCode = "Y29uc3QgdmFsaWQgPSB0cnVlOw==";

  test("code is encoded in base64", () => {
    expect(encodeToBase64(decodedCode)).toBe(encodedCode);
  });

  test("code is decoded in base64", () => {
    expect(decodeFromBase64(encodedCode)).toBe(decodedCode);
  });
});

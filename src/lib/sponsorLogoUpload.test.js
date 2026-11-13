import test from "node:test";
import assert from "node:assert/strict";
import { SPONSOR_LOGO_BUCKET, MAX_SPONSOR_LOGO_BYTES, validateSponsorLogo, createSponsorLogoPath, describeSponsorError } from "./sponsorLogoUpload.js";

test("logo uploads use the existing bucket and event folder, ignoring the original filename", () => {
  assert.equal(SPONSOR_LOGO_BUCKET, "sponsor-logos");
  for (const [type, extension] of [["image/png", "png"], ["image/jpeg", "jpg"], ["image/webp", "webp"]]) {
    const path = createSponsorLogoPath("event-123", { type, size: 100, name: "../../unsafe name.exe" });
    assert.match(path, new RegExp(`^event-123/[a-f0-9-]{36}\\.${extension}$`));
  }
  assert.notEqual(createSponsorLogoPath(123, { type: "image/png", size: 10 }), createSponsorLogoPath(123, { type: "image/png", size: 10 }));
});

test("validation accepts the 5 MB boundary and rejects unsupported or empty uploads", () => {
  assert.equal(validateSponsorLogo({ type: "image/png", size: MAX_SPONSOR_LOGO_BYTES }), "png");
  for (const file of [null, { type: "image/gif", size: 10 }, { type: "", size: 10 }, { type: "image/png", size: 0 }, { type: "image/png", size: NaN }, { type: "image/png", size: MAX_SPONSOR_LOGO_BYTES + 1 }]) {
    assert.throws(() => validateSponsorLogo(file));
  }
  for (const id of [null, "", "../event", "a/b", "a b"]) {
    assert.throws(() => createSponsorLogoPath(id, { type: "image/png", size: 10 }));
  }
});

test("Storage errors retain HTTP status and response code separately", () => {
  assert.equal(describeSponsorError({ message: "new row violates row-level security policy", status: 400, statusCode: "403" }), "new row violates row-level security policy (HTTP 400, code 403)");
  assert.equal(describeSponsorError({ message: "Bucket not found", status: 400, statusCode: "BucketNotFound" }), "Bucket not found (HTTP 400, code BucketNotFound)");
  assert.equal(describeSponsorError({ message: "Database denied", code: "42501" }), "Database denied (code 42501)");
  assert.equal(describeSponsorError(new Error("Failed to fetch")), "Failed to fetch");
  assert.equal(describeSponsorError(null), "Unknown error");
});

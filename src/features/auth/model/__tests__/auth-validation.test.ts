import { validateCodeField, validateConfirmPasswordField, validateEmailField, validateFullNameField, validatePasswordField } from "../auth-validation";
import { publicEnv } from "@/shared/config/public-env";

test("validates email addresses", () => {
  expect(validateEmailField("")).toBeDefined();
  expect(validateEmailField("invalid")).toBeDefined();
  expect(validateEmailField(" user@example.com ")).toBeUndefined();
});

test("enforces password length and character policy", () => {
  for (const password of ["a1", "a".repeat(72) + "1", "abcdefgh", "12345678"]) expect(validatePasswordField(password)).toBeDefined();
  expect(validatePasswordField("password1")).toBeUndefined();
  expect(validatePasswordField("a".repeat(71) + "1")).toBeUndefined();
});

test("validates confirmation, name and configured code length", () => {
  expect(validateConfirmPasswordField("password1", "different1")).toBeDefined();
  expect(validateConfirmPasswordField("password1", "password1")).toBeUndefined();
  expect(validateFullNameField(" ")).toBeDefined();
  expect(validateFullNameField("a".repeat(81))).toBeDefined();
  expect(validateFullNameField("E2E Tester")).toBeUndefined();
  expect(validateCodeField("1234567", publicEnv.otpLength)).toBeDefined();
  expect(validateCodeField("12345678", publicEnv.otpLength)).toBeUndefined();
});

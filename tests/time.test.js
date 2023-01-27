import { getDifferenceInSecs } from "../utils/time";

test("difference in secs is correct", () => {
  expect(getDifferenceInSecs(123000, 246000)).toBe("123.00");
});

test("same times return an 0.00", () => {
  expect(getDifferenceInSecs(0, 0)).toBe("0.00");
});

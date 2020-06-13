import { foo } from "../src/index"
describe("sample test", () => {
	test("should be a valid test", () => {
		foo()
		expect(true).toBe(true)
	})
})
import "wasi"
import * as token from "..";

describe("ERC20 Token Contract", () => {
    describe("Deployment", () => {
        it("Shoud initialize properly", () => {
            token.init("Test", "TST", 100);
            
            expect(token.name()).toBe("Test");
            expect(token.symbol()).toBe("TST");
            expect(token.totalSupply()).toBe("100");
        })
    })
})
/// <reference path="secondary.ts" />

namespace net.ndrei.test {
    export class TestClass {
        public run(): void {
            console.log(new SecondClass().message);
        }
    }
}

new net.ndrei.test.TestClass().run();
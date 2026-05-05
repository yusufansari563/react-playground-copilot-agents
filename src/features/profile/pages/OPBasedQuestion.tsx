import { useState, useMemo } from "react";

const questions = [
  // ─── HOISTING ───
  {
    id: 1,
    category: "Hoisting",
    code: `console.log(x);\nvar x = 5;`,
    answer: "undefined",
    explanation: "var declarations are hoisted and initialized to undefined.",
  },
  {
    id: 2,
    category: "Hoisting",
    code: `console.log(x);\nlet x = 5;`,
    answer: "ReferenceError: Cannot access 'x' before initialization",
    explanation:
      "let is hoisted but not initialized — lives in the Temporal Dead Zone.",
  },
  {
    id: 3,
    category: "Hoisting",
    code: `foo();\nfunction foo() { console.log('called'); }`,
    answer: "'called'",
    explanation: "Function declarations are fully hoisted.",
  },
  {
    id: 4,
    category: "Hoisting",
    code: `foo();\nvar foo = function() { console.log('called'); };`,
    answer: "TypeError: foo is not a function",
    explanation: "var foo is hoisted as undefined; calling undefined() throws.",
  },
  {
    id: 5,
    category: "Hoisting",
    code: `var x = 1;\nfunction test() {\n  console.log(x);\n  var x = 2;\n}\ntest();`,
    answer: "undefined",
    explanation: "var x inside function is hoisted to function scope top.",
  },
  {
    id: 6,
    category: "Hoisting",
    code: `let x = 'outer';\n{\n  console.log(x);\n  let x = 'inner';\n}`,
    answer: "ReferenceError",
    explanation: "Inner let x is in TDZ at the point of the log.",
  },
  {
    id: 7,
    category: "Hoisting",
    code: `console.log(typeof foo);\nfunction foo() {}`,
    answer: "'function'",
    explanation: "Function declarations are fully hoisted.",
  },
  {
    id: 8,
    category: "Hoisting",
    code: `console.log(typeof bar);\nvar bar = 42;`,
    answer: "'undefined'",
    explanation: "var is hoisted but uninitialized.",
  },

  // ─── CLOSURES ───
  {
    id: 9,
    category: "Closures",
    code: `function outer() {\n  let x = 10;\n  return function inner() {\n    console.log(x);\n  };\n}\nouter()();`,
    answer: "10",
    explanation: "inner() closes over x from outer's scope.",
  },
  {
    id: 10,
    category: "Closures",
    code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}`,
    answer: "3\n3\n3",
    explanation:
      "var is function-scoped; all callbacks share the same i which is 3 after loop.",
  },
  {
    id: 11,
    category: "Closures",
    code: `for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}`,
    answer: "0\n1\n2",
    explanation: "let creates a new binding per iteration.",
  },
  {
    id: 12,
    category: "Closures",
    code: `function counter() {\n  let count = 0;\n  return () => ++count;\n}\nconst c = counter();\nconsole.log(c(), c(), c());`,
    answer: "1 2 3",
    explanation: "Each call increments the same closed-over count.",
  },
  {
    id: 13,
    category: "Closures",
    code: `const fns = [];\nfor (var i = 0; i < 3; i++) {\n  fns.push((function(j){ return () => j; })(i));\n}\nconsole.log(fns[0](), fns[2]());`,
    answer: "0 2",
    explanation: "IIFE captures i by value into j each iteration.",
  },
  {
    id: 14,
    category: "Closures",
    code: `let x = 1;\nconst fn = () => x;\nx = 2;\nconsole.log(fn());`,
    answer: "2",
    explanation:
      "Closure captures the variable binding, not the value at creation time.",
  },
  {
    id: 15,
    category: "Closures",
    code: `function make(val) {\n  return { get: () => val, set: v => val = v };\n}\nconst obj = make(1);\nobj.set(5);\nconsole.log(obj.get());`,
    answer: "5",
    explanation: "Both methods close over the same val variable.",
  },

  // ─── THIS & SCOPE ───
  {
    id: 16,
    category: "this & Scope",
    code: `const obj = {\n  x: 10,\n  getX() { return this.x; }\n};\nconsole.log(obj.getX());`,
    answer: "10",
    explanation: "Method call — this is obj.",
  },
  {
    id: 17,
    category: "this & Scope",
    code: `const obj = {\n  x: 10,\n  getX: () => this.x\n};\nconsole.log(obj.getX());`,
    answer: "undefined (or window.x in browser)",
    explanation:
      "Arrow functions don't have their own this; captures outer (global) this.",
  },
  {
    id: 18,
    category: "this & Scope",
    code: `function foo() { console.log(this); }\nfoo();`,
    answer: "undefined (strict) or global object",
    explanation: "Standalone function call; this is undefined in strict mode.",
  },
  {
    id: 19,
    category: "this & Scope",
    code: `const obj = { name: 'A' };\nfunction greet() { console.log(this.name); }\ngreet.call(obj);`,
    answer: "'A'",
    explanation: "call() explicitly sets this to obj.",
  },
  {
    id: 20,
    category: "this & Scope",
    code: `function Person(name) { this.name = name; }\nconst p = new Person('Yusuf');\nconsole.log(p.name);`,
    answer: "'Yusuf'",
    explanation: "new creates a new object and binds this to it.",
  },
  {
    id: 21,
    category: "this & Scope",
    code: `const obj = {\n  val: 42,\n  getVal() {\n    const inner = () => this.val;\n    return inner();\n  }\n};\nconsole.log(obj.getVal());`,
    answer: "42",
    explanation: "Arrow inner() inherits this from getVal's this (obj).",
  },
  {
    id: 22,
    category: "this & Scope",
    code: `const a = { x: 1 };\nconst b = { x: 2 };\nfunction f() { return this.x; }\nconsole.log(f.bind(a).bind(b)());`,
    answer: "1",
    explanation: "bind() can only be applied once; second bind is ignored.",
  },
  {
    id: 23,
    category: "this & Scope",
    code: `class C {\n  constructor() { this.x = 1; }\n  getX = () => this.x;\n}\nconst { getX } = new C();\nconsole.log(getX());`,
    answer: "1",
    explanation: "Class field arrow function binds this at construction time.",
  },

  // ─── PROTOTYPES ───
  {
    id: 24,
    category: "Prototypes",
    code: `function Animal(n) { this.name = n; }\nAnimal.prototype.speak = function() { return this.name; };\nconst a = new Animal('Cat');\nconsole.log(a.speak());`,
    answer: "'Cat'",
    explanation: "speak is looked up via prototype chain.",
  },
  {
    id: 25,
    category: "Prototypes",
    code: `const obj = Object.create({ greet() { return 'hi'; } });\nconsole.log(obj.greet());`,
    answer: "'hi'",
    explanation: "Object.create sets the prototype.",
  },
  {
    id: 26,
    category: "Prototypes",
    code: `function F() {}\nconst a = new F();\nconsole.log(a instanceof F);`,
    answer: "true",
    explanation: "instanceof checks the prototype chain.",
  },
  {
    id: 27,
    category: "Prototypes",
    code: `const obj = { a: 1 };\nconst child = Object.create(obj);\nchild.b = 2;\nconsole.log(child.a, child.b);`,
    answer: "1 2",
    explanation: "a is inherited; b is own.",
  },
  {
    id: 28,
    category: "Prototypes",
    code: `function F() {}\nF.prototype = { x: 1 };\nconst a = new F();\nconsole.log(a.constructor === F);`,
    answer: "false",
    explanation: "Replacing prototype loses the constructor reference.",
  },
  {
    id: 29,
    category: "Prototypes",
    code: `class A { greet() { return 'A'; } }\nclass B extends A { greet() { return super.greet() + 'B'; } }\nconsole.log(new B().greet());`,
    answer: "'AB'",
    explanation: "super.greet() calls A's method.",
  },

  // ─── PROMISES & ASYNC ───
  {
    id: 30,
    category: "Promises & Async",
    code: `console.log(1);\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);`,
    answer: "1\n3\n2",
    explanation:
      "Promise callbacks are microtasks; they run after synchronous code.",
  },
  {
    id: 31,
    category: "Promises & Async",
    code: `console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);`,
    answer: "1\n4\n3\n2",
    explanation: "Microtasks (Promise) run before macrotasks (setTimeout).",
  },
  {
    id: 32,
    category: "Promises & Async",
    code: `async function foo() {\n  return 1;\n}\nfoo().then(console.log);`,
    answer: "1",
    explanation: "async functions always return a Promise.",
  },
  {
    id: 33,
    category: "Promises & Async",
    code: `async function foo() {\n  console.log(1);\n  await Promise.resolve();\n  console.log(2);\n}\nfoo();\nconsole.log(3);`,
    answer: "1\n3\n2",
    explanation: "await yields control; 3 runs before 2 resumes.",
  },
  {
    id: 34,
    category: "Promises & Async",
    code: `Promise.resolve(1)\n  .then(x => x + 1)\n  .then(x => { throw x; })\n  .catch(e => console.log(e));`,
    answer: "2",
    explanation: "Error thrown in then is caught by catch.",
  },
  {
    id: 35,
    category: "Promises & Async",
    code: `async function foo() {\n  try {\n    await Promise.reject('err');\n  } catch(e) {\n    console.log(e);\n  }\n}\nfoo();`,
    answer: "'err'",
    explanation: "try/catch works with await.",
  },
  {
    id: 36,
    category: "Promises & Async",
    code: `Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])\n  .then(console.log);`,
    answer: "[1, 2, 3]",
    explanation: "Promise.all resolves with array of all values.",
  },
  {
    id: 37,
    category: "Promises & Async",
    code: `Promise.race([new Promise(r => setTimeout(() => r(1), 100)), Promise.resolve(2)])\n  .then(console.log);`,
    answer: "2",
    explanation: "Promise.race resolves with the first settled promise.",
  },
  {
    id: 38,
    category: "Promises & Async",
    code: `async function foo() {\n  const a = await Promise.resolve(1);\n  const b = await Promise.resolve(2);\n  return a + b;\n}\nfoo().then(console.log);`,
    answer: "3",
    explanation: "Awaited values are summed and returned.",
  },
  {
    id: 39,
    category: "Promises & Async",
    code: `console.log(1);\nqueueMicrotask(() => console.log(2));\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);`,
    answer: "1\n4\n2\n3",
    explanation:
      "queueMicrotask and Promise.then are both microtasks in FIFO order.",
  },
  {
    id: 40,
    category: "Promises & Async",
    code: `async function a() { return 1; }\nasync function b() { return a(); }\nb().then(console.log);`,
    answer: "1",
    explanation: "Returning a Promise from async auto-unwraps it.",
  },

  // ─── EVENT LOOP ───
  {
    id: 41,
    category: "Event Loop",
    code: `setTimeout(() => console.log('A'), 0);\nsetImmediate(() => console.log('B'));\nconsole.log('C');`,
    answer: "C\nB\nA (Node.js) or C\nA\nB (browser)",
    explanation:
      "In Node, setImmediate fires before setTimeout(0) in same event loop turn.",
  },
  {
    id: 42,
    category: "Event Loop",
    code: `process.nextTick(() => console.log(1));\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);`,
    answer: "3\n1\n2",
    explanation: "process.nextTick runs before Promise microtasks in Node.",
  },
  {
    id: 43,
    category: "Event Loop",
    code: `setTimeout(() => console.log('timer'));\nprocess.nextTick(() => console.log('nextTick'));\nPromise.resolve().then(() => console.log('promise'));`,
    answer: "nextTick\npromise\ntimer",
    explanation: "nextTick > promise microtask > timer (macrotask).",
  },
  {
    id: 44,
    category: "Event Loop",
    code: `console.log('start');\nsetTimeout(() => console.log('timeout'), 0);\nconsole.log('end');`,
    answer: "start\nend\ntimeout",
    explanation: "setTimeout is async; runs after current call stack.",
  },
  {
    id: 45,
    category: "Event Loop",
    code: `setInterval(() => { console.log('x'); clearInterval(this); }, 100);`,
    answer: "Logs 'x' indefinitely",
    explanation:
      "this in setInterval callback is not the interval ID; clearInterval(undefined) is a no-op.",
  },

  // ─── TYPE COERCION ───
  {
    id: 46,
    category: "Type Coercion",
    code: `console.log(1 + '2');`,
    answer: "'12'",
    explanation: "Number + String triggers string concatenation.",
  },
  {
    id: 47,
    category: "Type Coercion",
    code: `console.log(+'3' + 3);`,
    answer: "6",
    explanation: "Unary + converts '3' to 3.",
  },
  {
    id: 48,
    category: "Type Coercion",
    code: `console.log([] + []);`,
    answer: "''",
    explanation: "Both arrays coerce to empty strings.",
  },
  {
    id: 49,
    category: "Type Coercion",
    code: `console.log({} + []);`,
    answer: "0 or '[object Object]'",
    explanation:
      "As statement {} is empty block, +[] is 0. As expression, it's '[object Object]'.",
  },
  {
    id: 50,
    category: "Type Coercion",
    code: `console.log([] == false);`,
    answer: "true",
    explanation: "[] coerces to '' which coerces to 0; false coerces to 0.",
  },
  {
    id: 51,
    category: "Type Coercion",
    code: `console.log(null == undefined);`,
    answer: "true",
    explanation: "null and undefined are only == to each other.",
  },
  {
    id: 52,
    category: "Type Coercion",
    code: `console.log(null === undefined);`,
    answer: "false",
    explanation: "=== checks type; they are different types.",
  },
  {
    id: 53,
    category: "Type Coercion",
    code: `console.log(typeof NaN);`,
    answer: "'number'",
    explanation: "NaN is ironically of type 'number'.",
  },
  {
    id: 54,
    category: "Type Coercion",
    code: `console.log(NaN === NaN);`,
    answer: "false",
    explanation: "NaN is the only value not equal to itself.",
  },
  {
    id: 55,
    category: "Type Coercion",
    code: `console.log(0.1 + 0.2 === 0.3);`,
    answer: "false",
    explanation: "Floating point precision issue.",
  },
  {
    id: 56,
    category: "Type Coercion",
    code: `console.log(Boolean(''));`,
    answer: "false",
    explanation: "Empty string is falsy.",
  },
  {
    id: 57,
    category: "Type Coercion",
    code: `console.log(Boolean('0'));`,
    answer: "true",
    explanation: "Non-empty string is truthy, even '0'.",
  },
  {
    id: 58,
    category: "Type Coercion",
    code: `console.log('' == false);`,
    answer: "true",
    explanation: "Both coerce to 0 in abstract equality.",
  },
  {
    id: 59,
    category: "Type Coercion",
    code: `console.log('' === false);`,
    answer: "false",
    explanation: "Different types: string vs boolean.",
  },
  {
    id: 60,
    category: "Type Coercion",
    code: `console.log(1 == '1');`,
    answer: "true",
    explanation: "Abstract equality coerces '1' to 1.",
  },

  // ─── DESTRUCTURING & SPREAD ───
  {
    id: 61,
    category: "Destructuring & Spread",
    code: `const [a, , b] = [1, 2, 3];\nconsole.log(a, b);`,
    answer: "1 3",
    explanation: "Skip element with empty slot.",
  },
  {
    id: 62,
    category: "Destructuring & Spread",
    code: `const { x: y } = { x: 10 };\nconsole.log(y);`,
    answer: "10",
    explanation: "Rename x to y in destructuring.",
  },
  {
    id: 63,
    category: "Destructuring & Spread",
    code: `const [a = 5, b = 7] = [1];\nconsole.log(a, b);`,
    answer: "1 7",
    explanation: "Default used only when value is undefined.",
  },
  {
    id: 64,
    category: "Destructuring & Spread",
    code: `const arr = [1, 2, 3];\nconst [first, ...rest] = arr;\nconsole.log(rest);`,
    answer: "[2, 3]",
    explanation: "Rest collects remaining elements.",
  },
  {
    id: 65,
    category: "Destructuring & Spread",
    code: `const a = [1, 2];\nconst b = [3, 4];\nconsole.log([...a, ...b]);`,
    answer: "[1, 2, 3, 4]",
    explanation: "Spread flattens arrays into a new one.",
  },
  {
    id: 66,
    category: "Destructuring & Spread",
    code: `const obj = { a: 1 };\nconst copy = { ...obj, b: 2 };\nconsole.log(copy);`,
    answer: "{ a: 1, b: 2 }",
    explanation: "Spread copies own enumerable properties.",
  },
  {
    id: 67,
    category: "Destructuring & Spread",
    code: `const { a, ...rest } = { a: 1, b: 2, c: 3 };\nconsole.log(rest);`,
    answer: "{ b: 2, c: 3 }",
    explanation: "Object rest collects remaining properties.",
  },

  // ─── ARRAYS ───
  {
    id: 68,
    category: "Arrays",
    code: `console.log([1,2,3].map(x => x * 2));`,
    answer: "[2, 4, 6]",
    explanation: "map returns a new array.",
  },
  {
    id: 69,
    category: "Arrays",
    code: `console.log([1,2,3,4].filter(x => x % 2 === 0));`,
    answer: "[2, 4]",
    explanation: "filter keeps truthy results.",
  },
  {
    id: 70,
    category: "Arrays",
    code: `console.log([1,2,3].reduce((acc, x) => acc + x, 0));`,
    answer: "6",
    explanation: "reduce accumulates.",
  },
  {
    id: 71,
    category: "Arrays",
    code: `console.log([1,[2,[3]]].flat(Infinity));`,
    answer: "[1, 2, 3]",
    explanation: "flat(Infinity) deep-flattens.",
  },
  {
    id: 72,
    category: "Arrays",
    code: `console.log([1,2,3].find(x => x > 1));`,
    answer: "2",
    explanation: "find returns first match.",
  },
  {
    id: 73,
    category: "Arrays",
    code: `console.log([1,2,3].findIndex(x => x > 1));`,
    answer: "1",
    explanation: "findIndex returns index of first match.",
  },
  {
    id: 74,
    category: "Arrays",
    code: `console.log([1,2,3].every(x => x > 0));`,
    answer: "true",
    explanation: "every returns true if all pass.",
  },
  {
    id: 75,
    category: "Arrays",
    code: `console.log([1,-1,2].some(x => x < 0));`,
    answer: "true",
    explanation: "some returns true if any pass.",
  },
  {
    id: 76,
    category: "Arrays",
    code: `const a = [1,2,3];\na.splice(1, 1);\nconsole.log(a);`,
    answer: "[1, 3]",
    explanation: "splice mutates the array.",
  },
  {
    id: 77,
    category: "Arrays",
    code: `console.log([1,2,3].slice(1));`,
    answer: "[2, 3]",
    explanation: "slice doesn't mutate; returns new array.",
  },
  {
    id: 78,
    category: "Arrays",
    code: `console.log(Array.from('hello'));`,
    answer: "['h','e','l','l','o']",
    explanation: "Array.from works on iterables.",
  },
  {
    id: 79,
    category: "Arrays",
    code: `console.log([3,1,2].sort());`,
    answer: "[1, 2, 3]",
    explanation:
      "sort() with no comparator sorts as strings but works for single digits.",
  },
  {
    id: 80,
    category: "Arrays",
    code: `console.log([10,9,2,1,100].sort());`,
    answer: "[1, 10, 100, 2, 9]",
    explanation: "Default sort is lexicographic — use comparator for numbers.",
  },
  {
    id: 81,
    category: "Arrays",
    code: `const a = [1,2,3];\nconsole.log(a.includes(2));`,
    answer: "true",
    explanation: "includes checks for value.",
  },
  {
    id: 82,
    category: "Arrays",
    code: `console.log([1,2,3].flatMap(x => [x, x * 2]));`,
    answer: "[1, 2, 2, 4, 3, 6]",
    explanation: "flatMap maps then flattens one level.",
  },

  // ─── OBJECTS ───
  {
    id: 83,
    category: "Objects",
    code: `const obj = { a: 1 };\nObject.freeze(obj);\nobj.a = 2;\nconsole.log(obj.a);`,
    answer: "1",
    explanation: "freeze prevents mutation.",
  },
  {
    id: 84,
    category: "Objects",
    code: `const obj = { a: 1, b: 2 };\nconsole.log(Object.keys(obj));`,
    answer: "['a', 'b']",
    explanation: "Object.keys returns own enumerable keys.",
  },
  {
    id: 85,
    category: "Objects",
    code: `const obj = { a: 1, b: 2 };\nconsole.log(Object.values(obj));`,
    answer: "[1, 2]",
    explanation: "Object.values returns own enumerable values.",
  },
  {
    id: 86,
    category: "Objects",
    code: `const o1 = { a: 1 };\nconst o2 = Object.assign({}, o1, { b: 2 });\nconsole.log(o2);`,
    answer: "{ a: 1, b: 2 }",
    explanation: "Object.assign merges into target.",
  },
  {
    id: 87,
    category: "Objects",
    code: `const obj = { a: 1 };\nconsole.log('a' in obj, 'b' in obj);`,
    answer: "true false",
    explanation: "in checks own and prototype chain.",
  },
  {
    id: 88,
    category: "Objects",
    code: `const obj = { a: 1 };\nconsole.log(obj.hasOwnProperty('a'));`,
    answer: "true",
    explanation: "hasOwnProperty only checks own properties.",
  },
  {
    id: 89,
    category: "Objects",
    code: `const key = 'name';\nconst obj = { [key]: 'Yusuf' };\nconsole.log(obj.name);`,
    answer: "'Yusuf'",
    explanation: "Computed property names use [ ].",
  },
  {
    id: 90,
    category: "Objects",
    code: `const a = {};\nconst b = {};\nconsole.log(a === b);`,
    answer: "false",
    explanation: "Objects are compared by reference.",
  },

  // ─── CLASSES ───
  {
    id: 91,
    category: "Classes",
    code: `class A {\n  #x = 10;\n  getX() { return this.#x; }\n}\nconsole.log(new A().getX());`,
    answer: "10",
    explanation: "Private class fields with #.",
  },
  {
    id: 92,
    category: "Classes",
    code: `class A {\n  static count = 0;\n  constructor() { A.count++; }\n}\nnew A(); new A();\nconsole.log(A.count);`,
    answer: "2",
    explanation: "Static fields belong to the class.",
  },
  {
    id: 93,
    category: "Classes",
    code: `class Animal {\n  constructor(n) { this.name = n; }\n}\nclass Dog extends Animal {\n  constructor(n) { super(n); }\n  bark() { return this.name + ' barks'; }\n}\nconsole.log(new Dog('Rex').bark());`,
    answer: "'Rex barks'",
    explanation: "super() calls parent constructor.",
  },
  {
    id: 94,
    category: "Classes",
    code: `class A {\n  greet() { return 'A'; }\n}\nclass B extends A {\n  greet() { return super.greet() + '+B'; }\n}\nconsole.log(new B().greet());`,
    answer: "'A+B'",
    explanation: "super.greet() calls parent method.",
  },
  {
    id: 95,
    category: "Classes",
    code: `class C {\n  get value() { return 42; }\n}\nconsole.log(new C().value);`,
    answer: "42",
    explanation: "get accessor looks like a property.",
  },

  // ─── GENERATORS & ITERATORS ───
  {
    id: 96,
    category: "Generators",
    code: `function* gen() {\n  yield 1;\n  yield 2;\n}\nconst g = gen();\nconsole.log(g.next(), g.next(), g.next());`,
    answer:
      "{value:1,done:false} {value:2,done:false} {value:undefined,done:true}",
    explanation: "Generators yield values one at a time.",
  },
  {
    id: 97,
    category: "Generators",
    code: `function* counter(start = 0) {\n  while(true) yield start++;\n}\nconst c = counter(5);\nconsole.log(c.next().value, c.next().value);`,
    answer: "5 6",
    explanation: "Infinite generator; next() advances it.",
  },
  {
    id: 98,
    category: "Generators",
    code: `function* gen() { return 99; }\nconst g = gen();\nconsole.log(g.next());`,
    answer: "{value: 99, done: true}",
    explanation: "return in a generator sets value in final next().",
  },
  {
    id: 99,
    category: "Generators",
    code: `function* range(n) {\n  for(let i = 0; i < n; i++) yield i;\n}\nconsole.log([...range(3)]);`,
    answer: "[0, 1, 2]",
    explanation: "Generators are iterable; spread works.",
  },

  // ─── SYMBOLS & WEAKMAP ───
  {
    id: 100,
    category: "Symbols & WeakMap",
    code: `const s1 = Symbol('x');\nconst s2 = Symbol('x');\nconsole.log(s1 === s2);`,
    answer: "false",
    explanation: "Symbols are always unique.",
  },
  {
    id: 101,
    category: "Symbols & WeakMap",
    code: `const id = Symbol('id');\nconst obj = { [id]: 123 };\nconsole.log(Object.keys(obj).length);`,
    answer: "0",
    explanation: "Symbol keys are not returned by Object.keys.",
  },
  {
    id: 102,
    category: "Symbols & WeakMap",
    code: `const wm = new WeakMap();\nlet key = {};\nwm.set(key, 'val');\nconsole.log(wm.get(key));`,
    answer: "'val'",
    explanation: "WeakMap stores key-value with weak key reference.",
  },

  // ─── FUNCTIONAL PROGRAMMING ───
  {
    id: 103,
    category: "Functional",
    code: `const double = x => x * 2;\nconst addOne = x => x + 1;\nconst transform = x => addOne(double(x));\nconsole.log(transform(3));`,
    answer: "7",
    explanation: "Function composition: double(3)=6, addOne(6)=7.",
  },
  {
    id: 104,
    category: "Functional",
    code: `const curry = a => b => a + b;\nconsole.log(curry(1)(2));`,
    answer: "3",
    explanation: "Curried function applied step by step.",
  },
  {
    id: 105,
    category: "Functional",
    code: `const arr = [1,2,3,4,5];\nconst result = arr\n  .filter(x => x % 2 !== 0)\n  .map(x => x ** 2);\nconsole.log(result);`,
    answer: "[1, 9, 25]",
    explanation: "Filter odds then square.",
  },
  {
    id: 106,
    category: "Functional",
    code: `function memoize(fn) {\n  const cache = {};\n  return x => cache[x] ?? (cache[x] = fn(x));\n}\nconst sq = memoize(x => x * x);\nconsole.log(sq(4), sq(4));`,
    answer: "16 16",
    explanation: "Second call uses cached value.",
  },

  // ─── ERROR HANDLING ───
  {
    id: 107,
    category: "Error Handling",
    code: `try {\n  null.x;\n} catch(e) {\n  console.log(e instanceof TypeError);\n}`,
    answer: "true",
    explanation: "Accessing property of null throws TypeError.",
  },
  {
    id: 108,
    category: "Error Handling",
    code: `function fail() { throw new Error('oops'); }\ntry {\n  fail();\n} finally {\n  console.log('finally');\n}`,
    answer: "'finally' then Error propagates",
    explanation: "finally always runs even if error not caught.",
  },
  {
    id: 109,
    category: "Error Handling",
    code: `try {\n  try { throw 1; }\n  finally { console.log('inner finally'); }\n} catch(e) {\n  console.log('outer catch', e);\n}`,
    answer: "inner finally\nouter catch 1",
    explanation: "finally runs before propagation to outer catch.",
  },
  {
    id: 110,
    category: "Error Handling",
    code: `async function f() {\n  throw new Error('fail');\n}\nf().catch(e => console.log(e.message));`,
    answer: "'fail'",
    explanation: "Async errors become rejected promises.",
  },

  // ─── NODE.JS SPECIFIC ───
  {
    id: 111,
    category: "Node.js Core",
    code: `// In Node.js\nconsole.log(typeof global);`,
    answer: "'object'",
    explanation: "global is the global object in Node.",
  },
  {
    id: 112,
    category: "Node.js Core",
    code: `// In Node.js\nconsole.log(typeof window);`,
    answer: "'undefined'",
    explanation: "window doesn't exist in Node.js.",
  },
  {
    id: 113,
    category: "Node.js Core",
    code: `// In Node.js\nconst { EventEmitter } = require('events');\nconst ee = new EventEmitter();\nee.on('data', x => console.log(x));\nee.emit('data', 42);`,
    answer: "42",
    explanation: "EventEmitter: emit triggers listeners.",
  },
  {
    id: 114,
    category: "Node.js Core",
    code: `const ee = new (require('events').EventEmitter)();\nee.once('click', () => console.log('once'));\nee.emit('click');\nee.emit('click');`,
    answer: "'once' (only once)",
    explanation: "once() listener fires only first time.",
  },
  {
    id: 115,
    category: "Node.js Core",
    code: `// Node.js\nconst buf = Buffer.from('hello');\nconsole.log(buf.toString('hex'));`,
    answer: "68656c6c6f",
    explanation: "Buffer stores binary data; hex encoding.",
  },
  {
    id: 116,
    category: "Node.js Core",
    code: `// Node.js\nconst path = require('path');\nconsole.log(path.extname('file.test.js'));`,
    answer: "'.js'",
    explanation: "extname returns file extension.",
  },
  {
    id: 117,
    category: "Node.js Core",
    code: `// Node.js\nconst path = require('path');\nconsole.log(path.basename('/foo/bar/baz.html'));`,
    answer: "'baz.html'",
    explanation: "basename returns final portion of path.",
  },
  {
    id: 118,
    category: "Node.js Core",
    code: `// Node.js\nconsole.log(process.argv[0]);`,
    answer: "path to node executable",
    explanation: "argv[0] is always the node binary path.",
  },

  // ─── STREAMS ───
  {
    id: 119,
    category: "Streams",
    code: `// Node.js\nconst { Readable } = require('stream');\nconst r = Readable.from([1,2,3]);\nconst chunks = [];\nr.on('data', c => chunks.push(c));\nr.on('end', () => console.log(chunks));`,
    answer: "[1, 2, 3]",
    explanation: "Readable.from creates stream from iterable.",
  },
  {
    id: 120,
    category: "Streams",
    code: `// Node.js\nconst { PassThrough } = require('stream');\nconst pt = new PassThrough();\npt.write('a');\npt.write('b');\npt.end();\nconst chunks = [];\npt.on('data', d => chunks.push(d.toString()));\npt.on('end', () => console.log(chunks.join('')));`,
    answer: "'ab'",
    explanation: "PassThrough passes data through unchanged.",
  },

  // ─── MODULES ───
  {
    id: 121,
    category: "Modules",
    code: `// CJS\nmodule.exports = { x: 1 };\n// import:\nconst mod = require('./mod');\nconsole.log(mod.x);`,
    answer: "1",
    explanation: "CJS module.exports and require.",
  },
  {
    id: 122,
    category: "Modules",
    code: `// ESM: named export\nexport const x = 1;\n// import:\nimport { x } from './mod.mjs';\nconsole.log(x);`,
    answer: "1",
    explanation: "ESM named export/import.",
  },
  {
    id: 123,
    category: "Modules",
    code: `// What does require() return for circular dependencies?\n// a.js requires b.js, b.js requires a.js`,
    answer: "Partial (incomplete) export object",
    explanation:
      "Node breaks circular deps by returning what's exported so far.",
  },

  // ─── MAP & SET ───
  {
    id: 124,
    category: "Map & Set",
    code: `const m = new Map();\nm.set('a', 1);\nm.set('b', 2);\nconsole.log(m.size, m.get('a'));`,
    answer: "2 1",
    explanation: "Map tracks size and retrieves by key.",
  },
  {
    id: 125,
    category: "Map & Set",
    code: `const s = new Set([1,2,2,3,3]);\nconsole.log(s.size);`,
    answer: "3",
    explanation: "Set stores only unique values.",
  },
  {
    id: 126,
    category: "Map & Set",
    code: `const s = new Set([1,2,3]);\nconst arr = [...s];\nconsole.log(arr);`,
    answer: "[1, 2, 3]",
    explanation: "Set is iterable; spread to array.",
  },
  {
    id: 127,
    category: "Map & Set",
    code: `const m = new Map([[1,'a'],[2,'b']]);\nfor(const [k,v] of m) console.log(k,v);`,
    answer: "1 'a'\n2 'b'",
    explanation: "Map iteration preserves insertion order.",
  },

  // ─── REGEX ───
  {
    id: 128,
    category: "Regex",
    code: `console.log('hello world'.match(/\\w+/g));`,
    answer: "['hello', 'world']",
    explanation: "\\w+ matches word characters, /g finds all.",
  },
  {
    id: 129,
    category: "Regex",
    code: `console.log('abc123'.replace(/[a-z]+/, 'X'));`,
    answer: "'X123'",
    explanation: "Replaces first match of lowercase letters.",
  },
  {
    id: 130,
    category: "Regex",
    code: `const re = /^\\d+$/;\nconsole.log(re.test('123'), re.test('12a'));`,
    answer: "true false",
    explanation: "^ and $ anchor to start and end.",
  },

  // ─── ADVANCED JS ───
  {
    id: 131,
    category: "Advanced JS",
    code: `const handler = {\n  get(t, p) { return p in t ? t[p] : 37; }\n};\nconst p = new Proxy({}, handler);\np.a = 1;\nconsole.log(p.a, p.b);`,
    answer: "1 37",
    explanation: "Proxy get trap intercepts property access.",
  },
  {
    id: 132,
    category: "Advanced JS",
    code: `const obj = {};\nObject.defineProperty(obj, 'x', { value: 42, writable: false });\nobj.x = 99;\nconsole.log(obj.x);`,
    answer: "42",
    explanation:
      "Non-writable property silently ignores assignment (strict throws).",
  },
  {
    id: 133,
    category: "Advanced JS",
    code: `console.log(typeof null);`,
    answer: "'object'",
    explanation: "typeof null === 'object' is a known JS quirk.",
  },
  {
    id: 134,
    category: "Advanced JS",
    code: `console.log(typeof undefined);`,
    answer: "'undefined'",
    explanation: "typeof undefined is 'undefined'.",
  },
  {
    id: 135,
    category: "Advanced JS",
    code: `console.log(typeof function(){});`,
    answer: "'function'",
    explanation: "Functions have their own typeof.",
  },
  {
    id: 136,
    category: "Advanced JS",
    code: `const a = [1,2,3];\nconsole.log(typeof a, Array.isArray(a));`,
    answer: "'object' true",
    explanation: "Arrays are objects; use Array.isArray to check.",
  },
  {
    id: 137,
    category: "Advanced JS",
    code: `let a = { x: 1 };\nlet b = a;\nb.x = 2;\nconsole.log(a.x);`,
    answer: "2",
    explanation: "Objects are passed by reference.",
  },
  {
    id: 138,
    category: "Advanced JS",
    code: `let a = 1;\nlet b = a;\nb = 2;\nconsole.log(a);`,
    answer: "1",
    explanation: "Primitives are copied by value.",
  },
  {
    id: 139,
    category: "Advanced JS",
    code: `console.log(2 ** 3);`,
    answer: "8",
    explanation: "** is the exponentiation operator.",
  },
  {
    id: 140,
    category: "Advanced JS",
    code: `console.log(5 >> 1);`,
    answer: "2",
    explanation: "Right bitwise shift divides by 2.",
  },

  // ─── OPTIONAL CHAINING & NULLISH ───
  {
    id: 141,
    category: "Optional Chaining",
    code: `const obj = null;\nconsole.log(obj?.x);`,
    answer: "undefined",
    explanation: "Optional chaining returns undefined instead of throwing.",
  },
  {
    id: 142,
    category: "Optional Chaining",
    code: `const obj = { fn: () => 42 };\nconsole.log(obj.fn?.());`,
    answer: "42",
    explanation: "Optional call ?.() checks before calling.",
  },
  {
    id: 143,
    category: "Optional Chaining",
    code: `const arr = null;\nconsole.log(arr?.[0]);`,
    answer: "undefined",
    explanation: "Optional chaining with bracket notation.",
  },
  {
    id: 144,
    category: "Optional Chaining",
    code: `let x = null;\nconsole.log(x ?? 'default');`,
    answer: "'default'",
    explanation: "?? returns right side if left is null/undefined.",
  },
  {
    id: 145,
    category: "Optional Chaining",
    code: `let x = 0;\nconsole.log(x ?? 'default');`,
    answer: "0",
    explanation: "?? treats 0 as a valid value unlike ||.",
  },
  {
    id: 146,
    category: "Optional Chaining",
    code: `let x = 0;\nconsole.log(x || 'default');`,
    answer: "'default'",
    explanation: "|| treats 0 as falsy.",
  },

  // ─── TAGGED TEMPLATES ───
  {
    id: 147,
    category: "Template Literals",
    code: `const name = 'World';\nconsole.log(\`Hello \${name}!\`);`,
    answer: "'Hello World!'",
    explanation: "Template literal interpolation.",
  },
  {
    id: 148,
    category: "Template Literals",
    code: `function tag(strings, val) {\n  return strings[0] + val.toUpperCase();\n}\nconsole.log(tag\`Hello \${'world'}\`);`,
    answer: "'Hello WORLD'",
    explanation: "Tagged template receives strings array and values.",
  },

  // ─── DEEP DIVE TRICKS ───
  {
    id: 149,
    category: "Tricky Output",
    code: `console.log(0.1 + 0.2);`,
    answer: "0.30000000000000004",
    explanation: "IEEE 754 floating point precision.",
  },
  {
    id: 150,
    category: "Tricky Output",
    code: `console.log(+true, +false, +null, +undefined);`,
    answer: "1 0 0 NaN",
    explanation: "Unary + coerces values to numbers.",
  },
  {
    id: 151,
    category: "Tricky Output",
    code: `console.log([] == ![]);`,
    answer: "true",
    explanation: "![] is false; [] coerces to 0; false is 0. So 0 == 0.",
  },
  {
    id: 152,
    category: "Tricky Output",
    code: `console.log(typeof class {});`,
    answer: "'function'",
    explanation: "Classes are syntactic sugar over functions.",
  },
  {
    id: 153,
    category: "Tricky Output",
    code: `console.log(1 < 2 < 3);`,
    answer: "true",
    explanation: "1<2 is true (1), then 1<3 is true.",
  },
  {
    id: 154,
    category: "Tricky Output",
    code: `console.log(3 > 2 > 1);`,
    answer: "false",
    explanation: "3>2 is true (1), then 1>1 is false.",
  },
  {
    id: 155,
    category: "Tricky Output",
    code: `console.log(null + 1);`,
    answer: "1",
    explanation: "null coerces to 0 in numeric context.",
  },
  {
    id: 156,
    category: "Tricky Output",
    code: `console.log(undefined + 1);`,
    answer: "NaN",
    explanation: "undefined coerces to NaN.",
  },
  {
    id: 157,
    category: "Tricky Output",
    code: `const obj = { toString: () => 'x' };\nconsole.log(obj + '!');`,
    answer: "'x!'",
    explanation: "toString is called in string coercion.",
  },
  {
    id: 158,
    category: "Tricky Output",
    code: `console.log(!!null, !!undefined, !!0, !!'', !!NaN);`,
    answer: "false false false false false",
    explanation: "All falsy values are false when double-negated.",
  },

  // ─── NODE.JS ASYNC PATTERNS ───
  {
    id: 159,
    category: "Node.js Async",
    code: `const fs = require('fs/promises');\nasync function read() {\n  try {\n    await fs.readFile('nonexistent.txt');\n  } catch(e) {\n    console.log(e.code);\n  }\n}\nread();`,
    answer: "'ENOENT'",
    explanation: "File not found error code in Node.",
  },
  {
    id: 160,
    category: "Node.js Async",
    code: `const { promisify } = require('util');\nconst sleep = promisify(setTimeout);\nasync function main() {\n  await sleep(100);\n  console.log('done');\n}\nmain();`,
    answer: "'done' (after 100ms)",
    explanation: "promisify converts callback to promise.",
  },
  {
    id: 161,
    category: "Node.js Async",
    code: `// Node.js\nconst { pipeline } = require('stream/promises');\n// pipeline resolves when stream finishes or rejects on error`,
    answer: "Promise-based pipeline",
    explanation: "stream/promises provides promisified stream utilities.",
  },

  // ─── MORE ASYNC ───
  {
    id: 162,
    category: "Promises & Async",
    code: `async function foo() {\n  return await 1;\n}\nfoo().then(console.log);`,
    answer: "1",
    explanation: "await on a non-promise just resolves immediately.",
  },
  {
    id: 163,
    category: "Promises & Async",
    code: `const p = new Promise((res, rej) => {\n  res(1);\n  rej(2);\n});\np.then(console.log).catch(console.log);`,
    answer: "1",
    explanation: "Once resolved, a Promise can't be rejected.",
  },
  {
    id: 164,
    category: "Promises & Async",
    code: `Promise.allSettled([\n  Promise.resolve(1),\n  Promise.reject('err')\n]).then(console.log);`,
    answer: "[{status:'fulfilled',value:1},{status:'rejected',reason:'err'}]",
    explanation: "allSettled never rejects; returns all results.",
  },
  {
    id: 165,
    category: "Promises & Async",
    code: `Promise.any([\n  Promise.reject('a'),\n  Promise.resolve('b'),\n  Promise.resolve('c')\n]).then(console.log);`,
    answer: "'b'",
    explanation: "Promise.any resolves with first fulfilled.",
  },

  // ─── CLASSES ADVANCED ───
  {
    id: 166,
    category: "Classes",
    code: `class A {}\nclass B extends A {}\nconsole.log(B.prototype instanceof A);`,
    answer: "true",
    explanation: "B's prototype is an A instance.",
  },
  {
    id: 167,
    category: "Classes",
    code: `class C {\n  constructor() { this.x = 1; }\n}\nconst obj = Object.create(C.prototype);\nconsole.log(obj.x);`,
    answer: "undefined",
    explanation: "Object.create doesn't call constructor.",
  },

  // ─── CLOSURES ADVANCED ───
  {
    id: 168,
    category: "Closures",
    code: `function outer(x) {\n  return function(y) {\n    return function(z) {\n      return x + y + z;\n    };\n  };\n}\nconsole.log(outer(1)(2)(3));`,
    answer: "6",
    explanation: "Triple closure — each level captures outer vars.",
  },
  {
    id: 169,
    category: "Closures",
    code: `let count = 0;\nconst inc = () => count++;\nconst dec = () => count--;\ninc(); inc(); dec();\nconsole.log(count);`,
    answer: "1",
    explanation: "Both functions share the same count binding.",
  },

  // ─── NODE.JS ADVANCED ───
  {
    id: 170,
    category: "Node.js Core",
    code: `// Node.js\nconst cluster = require('cluster');\nconsole.log(cluster.isMaster || cluster.isPrimary);`,
    answer: "true (in main process)",
    explanation: "Primary process runs the original script.",
  },
  {
    id: 171,
    category: "Node.js Core",
    code: `// Node.js\nprocess.on('uncaughtException', (e) => {\n  console.log('caught:', e.message);\n});\nthrow new Error('boom');`,
    answer: "'caught: boom'",
    explanation: "uncaughtException handler catches unhandled throws.",
  },
  {
    id: 172,
    category: "Node.js Core",
    code: `// Node.js\nprocess.on('unhandledRejection', (reason) => {\n  console.log('unhandled:', reason);\n});\nPromise.reject('fail');`,
    answer: "'unhandled: fail'",
    explanation: "unhandledRejection catches uncaught promise rejections.",
  },
  {
    id: 173,
    category: "Node.js Core",
    code: `// Node.js\nconsole.log(process.env.NODE_ENV);`,
    answer: "undefined (unless set)",
    explanation: "NODE_ENV must be explicitly set in environment.",
  },

  // ─── MISC / INTERVIEW FAVORITES ───
  {
    id: 174,
    category: "Tricky Output",
    code: `const obj = {\n  0: 'a', 1: 'b', 2: 'c',\n  length: 3,\n  [Symbol.iterator]: Array.prototype[Symbol.iterator]\n};\nconsole.log([...obj]);`,
    answer: "['a', 'b', 'c']",
    explanation: "Custom iterator makes any object spreadable.",
  },
  {
    id: 175,
    category: "Tricky Output",
    code: `console.log(+'');`,
    answer: "0",
    explanation: "Empty string coerces to 0.",
  },
  {
    id: 176,
    category: "Tricky Output",
    code: `console.log(+' ');`,
    answer: "0",
    explanation: "Whitespace string coerces to 0.",
  },
  {
    id: 177,
    category: "Tricky Output",
    code: `console.log(+'abc');`,
    answer: "NaN",
    explanation: "Non-numeric string coerces to NaN.",
  },
  {
    id: 178,
    category: "Tricky Output",
    code: `console.log([] + {});`,
    answer: "'[object Object]'",
    explanation: "[] becomes '', {} becomes '[object Object]'.",
  },
  {
    id: 179,
    category: "Tricky Output",
    code: `console.log({} + []);`,
    answer: "0 (as statement) or '[object Object]' (as expression)",
    explanation: "As statement, {} is empty block and +[] is 0.",
  },
  {
    id: 180,
    category: "Tricky Output",
    code: `var a = 1;\n(function() {\n  console.log(a);\n  var a = 2;\n})();`,
    answer: "undefined",
    explanation: "var a inside IIFE is hoisted; shadows outer a.",
  },
  {
    id: 181,
    category: "Tricky Output",
    code: `function foo(a, b = a * 2) {\n  return b;\n}\nconsole.log(foo(3));`,
    answer: "6",
    explanation: "Default parameter can reference earlier params.",
  },
  {
    id: 182,
    category: "Tricky Output",
    code: `const obj = { a: 1 };\nconst { a: b = 5 } = obj;\nconsole.log(b);`,
    answer: "1",
    explanation: "Rename a to b with default 5 (unused since a=1).",
  },
  {
    id: 183,
    category: "Tricky Output",
    code: `const obj = { a: undefined };\nconst { a = 5 } = obj;\nconsole.log(a);`,
    answer: "5",
    explanation: "Default used when value is undefined.",
  },
  {
    id: 184,
    category: "Tricky Output",
    code: `const a = [1, 2, 3];\nconst b = a;\nb.push(4);\nconsole.log(a);`,
    answer: "[1, 2, 3, 4]",
    explanation: "Arrays are reference types.",
  },
  {
    id: 185,
    category: "Tricky Output",
    code: `const obj = Object.freeze({ nested: { x: 1 } });\nobj.nested.x = 2;\nconsole.log(obj.nested.x);`,
    answer: "2",
    explanation: "freeze is shallow — nested objects are still mutable.",
  },
  {
    id: 186,
    category: "Tricky Output",
    code: `console.log([1,2,3] == [1,2,3]);`,
    answer: "false",
    explanation: "Arrays are objects; different references.",
  },
  {
    id: 187,
    category: "Tricky Output",
    code: `console.log(typeof (() => {}));`,
    answer: "'function'",
    explanation: "Arrow functions are still functions.",
  },
  {
    id: 188,
    category: "Tricky Output",
    code: `const fn = function named() {};\nconsole.log(fn.name);`,
    answer: "'named'",
    explanation: "Named function expressions have a .name.",
  },
  {
    id: 189,
    category: "Tricky Output",
    code: `const fn = () => {};\nconsole.log(fn.name);`,
    answer: "'fn'",
    explanation: "Arrow function infers name from variable.",
  },
  {
    id: 190,
    category: "Tricky Output",
    code: `console.log((function(){}).name);`,
    answer: "''",
    explanation: "Anonymous function expression has empty name.",
  },
  {
    id: 191,
    category: "Tricky Output",
    code: `const a = 'a', b = 'b';\nconsole.log(\`\${a}\${b}\` === 'ab');`,
    answer: "true",
    explanation: "Template literal builds 'ab'.",
  },
  {
    id: 192,
    category: "Tricky Output",
    code: `const p = Promise.resolve(42);\np.then(v => console.log(v + 1));\nconsole.log('sync');`,
    answer: "sync\n43",
    explanation: "Promise callback is async; sync runs first.",
  },
  {
    id: 193,
    category: "Node.js Core",
    code: `// Node.js\nconst os = require('os');\nconsole.log(typeof os.cpus());`,
    answer: "'object'",
    explanation: "os.cpus() returns an array of CPU info objects.",
  },
  {
    id: 194,
    category: "Node.js Core",
    code: `// Node.js\nconst { Worker } = require('worker_threads');\nconsole.log(typeof Worker);`,
    answer: "'function'",
    explanation: "Worker is a constructor class.",
  },
  {
    id: 195,
    category: "Advanced JS",
    code: `function* fibonacci() {\n  let [a, b] = [0, 1];\n  while(true) { yield a; [a, b] = [b, a+b]; }\n}\nconst fib = fibonacci();\nconsole.log(fib.next().value, fib.next().value, fib.next().value);`,
    answer: "0 1 1",
    explanation: "Generator lazily produces Fibonacci numbers.",
  },
  {
    id: 196,
    category: "Advanced JS",
    code: `const iter = {\n  [Symbol.iterator]() {\n    let n = 0;\n    return { next: () => n < 3 ? {value: n++, done: false} : {done: true} };\n  }\n};\nconsole.log([...iter]);`,
    answer: "[0, 1, 2]",
    explanation: "Custom iterable via Symbol.iterator.",
  },
  {
    id: 197,
    category: "Advanced JS",
    code: `console.log(Object.is(NaN, NaN));`,
    answer: "true",
    explanation: "Object.is handles NaN equality correctly.",
  },
  {
    id: 198,
    category: "Advanced JS",
    code: `console.log(Object.is(0, -0));`,
    answer: "false",
    explanation: "Object.is distinguishes 0 and -0.",
  },
  {
    id: 199,
    category: "Advanced JS",
    code: `const arr = [1, 2, 3];\nconsole.log(arr.at(-1));`,
    answer: "3",
    explanation: ".at(-1) gets the last element.",
  },
  {
    id: 200,
    category: "Advanced JS",
    code: `const obj = { a: 1, b: { c: 2 } };\nconst clone = structuredClone(obj);\nclone.b.c = 99;\nconsole.log(obj.b.c);`,
    answer: "2",
    explanation: "structuredClone creates a deep copy.",
  },
  {
    id: 201,
    category: "Node.js Async",
    code: `const { setTimeout: sleep } = require('timers/promises');\nasync function main() {\n  await sleep(0);\n  console.log('after sleep');\n}\nmain();\nconsole.log('before');`,
    answer: "before\nafter sleep",
    explanation: "timers/promises provides promise-based timers.",
  },
  {
    id: 202,
    category: "Closures",
    code: `function adder(x) { return y => x + y; }\nconst add5 = adder(5);\nconsole.log(add5(3), add5(7));`,
    answer: "8 12",
    explanation: "Partial application via closure.",
  },
  {
    id: 203,
    category: "Tricky Output",
    code: `console.log('' || 'default');`,
    answer: "'default'",
    explanation: "|| returns first truthy or last value.",
  },
  {
    id: 204,
    category: "Tricky Output",
    code: `console.log('' && 'something');`,
    answer: "''",
    explanation: "&& returns first falsy or last value.",
  },
  {
    id: 205,
    category: "Tricky Output",
    code: `const x = 5;\nconsole.log(x > 3 ? 'big' : 'small');`,
    answer: "'big'",
    explanation: "Ternary operator.",
  },
  {
    id: 206,
    category: "Advanced JS",
    code: `const p = new Proxy({count:0}, {\n  set(t,k,v) { t[k] = v * 2; return true; }\n});\np.count = 5;\nconsole.log(p.count);`,
    answer: "10",
    explanation: "Proxy set trap doubles assigned value.",
  },
  {
    id: 207,
    category: "Node.js Core",
    code: `// Node.js\nconst { createHash } = require('crypto');\nconst hash = createHash('sha256').update('hello').digest('hex');\nconsole.log(hash.length);`,
    answer: "64",
    explanation: "SHA-256 produces 64 hex characters.",
  },
  {
    id: 208,
    category: "Error Handling",
    code: `class CustomError extends Error {\n  constructor(msg) {\n    super(msg);\n    this.name = 'CustomError';\n  }\n}\ntry {\n  throw new CustomError('test');\n} catch(e) {\n  console.log(e.name, e.message);\n}`,
    answer: "'CustomError' 'test'",
    explanation: "Custom error classes extend Error.",
  },
  {
    id: 209,
    category: "Generators",
    code: `function* gen() {\n  const x = yield 1;\n  yield x + 10;\n}\nconst g = gen();\ng.next();\nconsole.log(g.next(5).value);`,
    answer: "15",
    explanation: "Value passed to next() becomes result of yield.",
  },
  {
    id: 210,
    category: "Advanced JS",
    code: `const map = new Map();\nmap.set(NaN, 'found');\nconsole.log(map.get(NaN));`,
    answer: "'found'",
    explanation: "Map uses SameValueZero; NaN === NaN for Map keys.",
  },
];

const CATEGORIES = ["All", ...new Set(questions.map((q) => q.category))];

export default function OPBasedQuestion() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState({});
  const [revealAll, setRevealAll] = useState(false);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchCat = selectedCat === "All" || q.category === selectedCat;
      const matchSearch =
        !search ||
        q.code.toLowerCase().includes(search.toLowerCase()) ||
        q.answer.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCat, search]);

  const toggle = (id: any) => setRevealed((r) => ({ ...r, [id]: !r[id] }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        fontFamily: "'Courier New', monospace",
        color: "#e2e2e2",
        padding: "0 0 60px 0",
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          padding: "40px 24px 32px",
          borderBottom: "2px solid #00ff88",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 11,
                letterSpacing: 4,
                color: "#00ff88",
                textTransform: "uppercase",
              }}
            >
              Interview Prep
            </span>
            <span style={{ fontSize: 11, color: "#555" }}>v2025</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: 900,
              margin: "0 0 4px",
              color: "#fff",
              letterSpacing: -1,
            }}
          >
            JS & Node.js <span style={{ color: "#00ff88" }}>Output</span>{" "}
            Questions
          </h1>
          <p style={{ margin: "0 0 20px", color: "#888", fontSize: 13 }}>
            {questions.length} questions · {CATEGORIES.length - 1} categories ·
            Click answer to reveal
          </p>
          {/* Search */}
          <input
            placeholder="Search code or answer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 400,
              background: "#111",
              border: "1px solid #333",
              borderRadius: 6,
              padding: "8px 14px",
              color: "#e2e2e2",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        {/* Category Filter */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            padding: "20px 0 16px",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                background: selectedCat === cat ? "#00ff88" : "#1a1a1a",
                color: selectedCat === cat ? "#000" : "#aaa",
                border:
                  "1px solid " + (selectedCat === cat ? "#00ff88" : "#333"),
                borderRadius: 20,
                padding: "5px 14px",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: selectedCat === cat ? 700 : 400,
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setRevealAll((r) => !r)}
            style={{
              marginLeft: "auto",
              background: revealAll ? "#ff4444" : "#222",
              color: revealAll ? "#fff" : "#aaa",
              border: "1px solid #444",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {revealAll ? "Hide All" : "Reveal All"}
          </button>
        </div>

        <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>
          Showing {filtered.length} of {questions.length} questions
        </div>

        {/* Questions */}
        {filtered.map((q: { id: any }, i: any) => {
          const isRevealed = revealAll || revealed[q.id];
          return (
            <div
              key={q.id}
              style={{
                background: "#111",
                border: "1px solid #222",
                borderRadius: 10,
                marginBottom: 14,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#333")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#222")}
            >
              {/* Question Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px 0",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#555",
                      minWidth: 28,
                    }}
                  >
                    #{q.id}
                  </span>
                  <span
                    style={{
                      background: "#1a2a1a",
                      color: "#00cc66",
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 10,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {q.category}
                  </span>
                </div>
              </div>

              {/* Code Block */}
              <div style={{ padding: "10px 16px 8px" }}>
                <pre
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1e1e1e",
                    borderRadius: 6,
                    padding: "12px 14px",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#c9d1d9",
                    overflowX: "auto",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  <code>{q.code}</code>
                </pre>
              </div>

              {/* Answer Toggle */}
              <div style={{ padding: "0 16px 14px" }}>
                <button
                  onClick={() => toggle(q.id)}
                  style={{
                    background: isRevealed ? "#0a1f0a" : "#1a1a1a",
                    border: "1px solid " + (isRevealed ? "#00ff88" : "#333"),
                    borderRadius: 6,
                    padding: "8px 14px",
                    color: isRevealed ? "#00ff88" : "#666",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    width: "100%",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  {isRevealed ? (
                    <div>
                      <div
                        style={{
                          marginBottom: 4,
                          fontSize: 10,
                          color: "#555",
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        Output
                      </div>
                      <code style={{ color: "#00ff88", fontSize: 13 }}>
                        {q.answer}
                      </code>
                      <div
                        style={{ marginTop: 6, color: "#888", fontSize: 12 }}
                      >
                        💡 {q.explanation}
                      </div>
                    </div>
                  ) : (
                    <span>▶ Show Answer</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#444" }}>
            No questions match your filter.
          </div>
        )}
      </div>
    </div>
  );
}

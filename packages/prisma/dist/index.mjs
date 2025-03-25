var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/index.ts
var { PrismaClient } = __require("@prisma/client/default");
var prisma = new PrismaClient();
var index_default = prisma;
export {
  PrismaClient,
  index_default as default,
  prisma
};

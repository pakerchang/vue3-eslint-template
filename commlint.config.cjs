// commit structure: type(scope): subject
// Example: feat(components): Add custom component.
module.export = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "docs", "refactor"]],
    "type-empty": [2, "never"],
    "scope-enum": [2, "always", ["documents", "components"]],
    "scope-empty": [2, "never"],
    "subject-empty": [2, "never"],
  },
};

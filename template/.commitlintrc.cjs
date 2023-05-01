const CommitRules = {
  typeEnums: ["feat", "chore", "docs", "fix", "ref", "style"],
  scopeEnums: ["component", "document", "deps"],
};

module.exports = {
  root: true,
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", CommitRules.typeEnums],
    "type-case": [1, "always", "lower-case"],
    "type-empty": [2, "never"],
    // "scope-enum": [2, "always", CommitRules.scopeEnums],
    // "scope-empty": [2, "never"],
    "subject-case": [1, "always", "sentence-case"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", ""],
  },
};

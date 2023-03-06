const Rules = {
  "*": ["echo 'execute by .lintstaged.pre-push'", "prettier --write"],
};

export default Rules;

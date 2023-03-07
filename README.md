# 專案管理自動化工具

---

此篇僅示意透過 git hooks 搭配部分 cli 管理專案的建制、安裝、使用方式

1. husky
2. lint-staged
3. commitlint
4. eslint

# Usage:

---

確保 git 已經初始化後執行

```zsh
npm install
```

專案若沒有 `.husky` 資料夾則執行

```zsh
npm run lint:init
```

### Example 說明

> 目前設立的攔截點在 `pre-commit`, `commit-msg`, `pre-push`，當檢查結束後在 terminal 看到 `Pre commit / Commit msg / Pre push 階段結束` 的字樣

#### pre-commit:

專案的 ESLint 設定了簡單的驗證如：強制使用雙引號，可以在任意一支 `vue`, `js` 內編輯做測試

```html
// App.vue
<script setup>
  // ... code
  const newString = 'string';
</script>
```

在`App.vue`編輯或自行新增的檔案有在 `staged changes` 時，執行 `git commit -m` 會報錯，需要符合 ESLint 規範之後才能通過 `pre-commit` 的檢查， commit 才能正常寫入 `git repository`

#### commit-msg:

`commit-msg` 透過 `commitlint` 對 commit 內容進行規則驗證

```json
// type(scope): subject
{
  "type": {
    "enum": ["feat", "chore", "docs", "fix", "ref", "style"],
    "required": true
  },
  "scope": {
    "enum": ["component", "document"],
    "required": true
  },
  "subject": {
    "required": true
  }
}
```

```zsh
  git commit -m 'testing' // fail
  git commit -m 'feat(components): add custom component' // success
```

### 設置檔案:

相關設定的檔案可以參照 `.lintstaged.pre-commit.js`, `.lintstaged.pre-push.js`, `.eslintrc.json`, `.commitlintrc.json` 以及 `.husky` 資料夾底下的檔案

# 安裝與專案設置:

---

## Install deps

```zsh
npm install husky
npm install lint-staged
npm install @commitlint/cli
```

### 設置 `package.json`

```json
{
  // ... package.json
  "scripts": {
    // ... scripts
    "lint:pre-commit": "npx husky add .husky/pre-commit 'npx lint-staged --config .lintstaged.pre-commit.js'",
    "lint:commit-msg": "npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1} --config .commitlintrc.json'",
    "lint:pre-push": "npx husky add .husky/pre-push 'npx lint-staged --config .lintstaged.pre-push.js'",
    "lint:init": "npx husky install && npm run lint:pre-commit && npm run lint:pre-push && npm run lint:commit-msg"
  }
}
```

## `lint-staged` 設置

```js
{
  // .lintstaged.pre-commit.js
  const Rules = {
    '*.{js,vue}': ['eslint', 'prettier --write'],
  };

  export default Rules;
}
```

可宣告檔案類型，並在 pre-commit 環節分別對定義的檔案執行不同的指令檢查

> 範例中 `*.{fileType}` 是利用 `node compiler` 處理多檔案類型的語法糖，新增時需注意類型以 `,` 區隔且不帶任何`空格`

# 套件說明

## husky:

---

在一般團隊協作狀況下，開發人員並不會將 .git 提交到 repository，以至於 git-hooks 的設定很難在協作專案中擴散並統一管理
此時 `husky` 可以更好的輔助團隊透過 `git hooks` 操作管理的協作並隨時更新專案提交流程。  
比較常用的介入點：

- pre-commit
- commit-msg
- pre-push
  > 其餘 hook 可以在 `.git/hooks` 資料夾中查到

通常在這些階段會用於執行 `eslint`, `Code Formatter`, `Unit Test`, `提交人權限認證` ... 等  
確保每次提交的 Code 都會經過一定限度的 Review 以維護專案健康

## lint-staged:

---

與 `husky` 是共生套件，主要功能在於針對 `git staged (暫存區)` 區域內的檔案，並允許針對個別檔案類型進行對應操作。

檔案設置對應可在 `package.json`,或透過 `.lintstagedrc`, 定義，檔案類型支援有：`yaml`, `json`, `cjs`, `js`
Example:

```json
{
  // ... package.json
  "lint-staged": {
    "*": "cmd"
  }
  // ...
}
```

```js
{
  // .lintstagedrc.cjs
  module.export = {
    '*': 'cmd',
    '*2': ['cmd-1', 'cmd-2'],
  };
}
```

> 當需要執行多項指令時，可以使用 `string array` 的方式來概括指令

## commitlint:

---

針對 `git commit` 提交內容規範驗證的正則套件，將 commit 在 [AngularJS Git Commit](https://gist.github.com/stephenparish/9941e89d80e2bc58a153#format-of-the-commit-message) 拆分成核心的三個區塊 `type`, `scope`, `subject`
一般參照的基本定義：
**Types:**

```js
types: [
  { value: 'feat', name: 'feat: 增加' },
  { value: 'fix', name: 'fix: bug fix' },
  { value: 'style', name: 'style: 樣式修改(不影響)' },
  { value: 'docs', name: 'docs: 修改文件' },
  { value: 'test', name: 'test: 新增或修改現有的測試' },
  { value: 'deploy', name: 'deploy: 部署' },
  { value: 'release', name: 'release: 發布' },
  { value: 'ref', name: 'refactor: 重構' },
  {
    value: 'chore',
    name: 'chore: 修改建置流程、library 管理、構建過程或輔助工具的變動',
  },
  { value: 'revert', name: 'revert: 版本回退' },
  { value: 'del', name: 'del: 刪除' },
];
```

**Scope:**

```js
scopes: [
  { name: 'Components' },
  { name: 'Styles(CSS)' },
  { name: 'Deps' },
  { name: 'Documents' },
  { name: 'Other' },
];
```

**Subject:**

```
description // 基於前面的分類後，簡述此次改動的核心功能
```

> 實際規範仍然可以依照團隊需求作細部改動，包括 types 的新增或定義變更

**Commit 自動化工具:**
[cz-cli](https://github.com/commitizen/cz-cli)

[git-cz](https://github.com/streamich/git-cz)

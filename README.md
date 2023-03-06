# **Project management tools example**

---

此篇僅示意透過 git hooks 搭配部分 cli 管理專案的建制、安裝方式

1. husky
2. lint-staged

# **Usage**

---

確保 git 已經初始化後執行

```zsh
npm install
```

專案內部檔案在 `main.js`, `vite.config.js`, `App.vue` 留下未遵照 ESLint 規範的程式碼，在操作 `git commit -m` 時會將會報錯

> 區塊有上述檔案時，或自行新增的檔案有在`git staged`時

需要修正才能通過檢查，目前設立的攔截點在 `commit` 與 `git push` 執行前，當檢查結束後在 terminal 看到 `Pre commit / Pre push 階段結束` 的字樣

```shell
  git commit -m 'testing'
  git push
```

請不要將 ESLint 修正結果 push 上去
可以透過下列指令跳過檢查

```shell
  git commit -m 'commit example' --no-verify
```

# **安裝與專案設置**

---

## Install deps

```zsh
npm install husky
npm install lint-staged
```

### **設置 `package.json`**

```json
{
  // ... package.json
  "scripts": {
    // ... scripts
    "lint:pre-commit": "npx husky add .husky/pre-commit 'npx lint-staged --config .lintstaged.pre-commit.js'",
    "lint:pre-push": "npx husky add .husky/pre-push 'npx lint-staged --config .lintstaged.pre-push.js'",
    "prepare": "npx husky install && npm run lint:pre-commit && npm run lint:pre-push"
  }
}
```

`prepare` 的設定將在後續使用此專案第一次建立環境使用 `npm install` 時自動執行

## **`lint-staged` 設置**

```js
{
  // .lintstaged.pre-commit.js
  const Rules = {
    "*.{js,vue}": ["eslint", "prettier --write"],
  };

  export default Rules;
}
```

可宣告檔案類型，並在 pre-commit 環節分別對定義的檔案執行不同的指令檢查

> 範例中 `*.{fileType}` 是利用 `node compiler` 處理多檔案類型的語法糖，新增時需注意類型以 `,` 區隔且不帶任何`空格`

# **套件說明**

## **husky**

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

## **lint-staged**

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
    "*": "cmd",
    "*2": ["cmd-1", "cmd-2"],
  };
}
```

> 當需要執行多項指令時，可以使用 `string array` 的方式來概括指令

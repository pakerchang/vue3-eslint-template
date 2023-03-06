# **Project management tools example**

---

此篇僅示意透過 git hooks 搭配部分 cli 管理專案的建制、安裝方式

1. husky
2. lint-staged

# **Usage**

---

```zsh
npm install
npm run prepare
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
    "prepare": "npx husky install && npm run lint:pre-commit && npm run lint:commit-msg && npm run lint:pre-push"
  }
}
```

關於 `prepare` 所定義的行為基本分為兩個階段

#### **初始化 husky**

執行結束後會專案目錄下生成出一個名為 `.husky` 的資料夾

#### **執行 husky**

透過 husky 指令在 `.husky` 路徑下生成一個 `pre-commit` 的檔案，並指向 `git hook pre-commit`  
同時定義執行指令 `npx lint-staged`

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

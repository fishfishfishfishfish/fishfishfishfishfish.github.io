---
layout: post
title: "GitHub 使用小技巧集合"
subtitle: "提升效率的实用技巧"
date: 2026-06-11 09:36:26
author: ""
header-img: "img/post/post-bg-2026-06.jpg"
tags:
    - GitHub
    - 效率工具
---

# GitHub 使用小技巧集合

提升效率的实用技巧

## 1. 快捷键

GitHub 提供了丰富的键盘快捷键，按下 `?` 可以查看所有可用快捷键。

### 常用快捷键
- `t`：在仓库中打开文件搜索
- `w`：切换分支/标签搜索
- `l`：在 Issue 或 PR 中添加标签
- `c`：在 Issue 或 PR 中添加标签
- `s`：聚焦搜索框
- `g i`：前往 Inbox
- `g p`：前往 Pull Requests
- `g i`：前往 Issues

## 2. 命令面板

在仓库页面按下 `.` 键，可以打开基于 VS Code 的命令面板，无需本地安装任何工具即可获得完整的编辑器体验。

## 3. URL 技巧

### 3.1 快速引用代码
在任意代码页面，按下 `y` 键可以将 URL 永久化为当前版本的链接，避免分支更新后链接失效。

### 3.2 跳转指定行
在代码页面的 URL 中添加 `#L行号`，可以直接跳转到指定行。例如：
```
github.com/user/repo/blob/main/file.py#L42
```

### 3.3 高亮代码范围
使用 `#L开始行-L结束行` 可以高亮多行代码：
```
github.com/user/repo/blob/main/file.py#L10-L20
```

## 4. Git 技巧

### 4.1 撤销最后一次提交
```bash
# 撤销提交但保留修改
git reset --soft HEAD~1

# 撤销提交并删除修改
git reset --hard HEAD~1
```

### 4.2 修改最后一次提交信息
```bash
git commit --amend
```

### 4.3 暂存特定文件的修改
```bash
# 暂存单个文件
git add file.txt

# 暂存所有修改
git add -A

# 交互式暂存
git add -p
```

### 4.4 储藏工作区
```bash
# 储藏当前修改
git stash

# 储藏并添加消息
git stash save "工作描述"

# 查看储藏列表
git stash list

# 恢复最新储藏
git stash pop

# 恢复指定储藏
git stash apply stash@{0}
```

### 4.5 创建干净的工作区
```bash
# 删除所有未跟踪的文件
git clean -fd

# 预览删除的文件（不实际删除）
git clean -n
```

## 5. Issue 和 PR 技巧

### 5.1 关闭 Issue
在 commit message 中添加 `Fix #123`，提交后会自动关闭 Issue #123。

### 5.2 代码审查建议
在 PR 评论中使用 `suggest:` 语法可以提出代码修改建议：
```
```suggestion
const newVariable = 'value';
```
```

### 5.3 模板功能
在仓库根目录创建 `.github/ISSUE_TEMPLATE/` 目录，可以为 Issue 和 PR 添加模板。

## 6. GitHub Actions 技巧

### 6.1 工作流模板
在 `.github/workflows/` 目录中创建工作流文件，可以使用社区分享的模板。

### 6.2 手动触发
在 workflow 文件中添加 `workflow_dispatch` 触发器，可以在 GitHub 网页上手动运行 Actions：
```yaml
on:
  workflow_dispatch:
```

## 7. 搜索技巧

### 7.1 高级搜索
使用 `user:username` 限定用户，`repo:username/repo` 限定仓库。

### 7.2 搜索范围
- `in:title`：仅搜索标题
- `in:body`：仅搜索正文
- `language:python`：指定语言
- `stars:>100`：指定星标数

### 7.3 搜索运算符
```search
is:pr is:open author:username   # 搜索某人开启的PR
is:issue closed>2024-01-01       # 搜索特定日期后关闭的Issue
```

## 8. GitHub CLI

### 8.1 安装
```bash
gh repo clone user/repo
```

### 8.2 常用命令
```bash
# 创建 PR
gh pr create --title "PR标题" --body "PR描述"

# 审核 PR
gh pr review PR编号 --approve

# 合并 PR
gh pr merge PR编号

# 创建 Issue
gh issue create --title "问题标题" --body "问题描述"

# 查看状态
gh status
```

## 9. 项目管理技巧

### 9.1 Projects
使用 GitHub Projects 创建看板式任务管理，支持自动化工作流。

### 9.2 Milestones
创建里程碑来跟踪 Issue 和 PR 的进度。

### 9.3 标签管理
合理使用标签（Bug、Enhancement、Help Wanted 等）来组织工作。

## 10. 保护分支

在仓库设置中启用分支保护规则：
- Require pull request reviews before merging
- Require status checks to pass before merging
- Include administrators
- Do not allow bypassing the above settings


## 11. 空目录
> From 知乎-最后的绅士 https://zhuanlan.zhihu.com/p/2047319795494826610

在空目录里放一个 .gitignore 文件，里面写两行。
```
*
!.gitignore
```
第一行忽略目录下所有文件，第二行把 .gitignore 自己放出来。不需要改根目录的 .gitignore。不需要发明一个 Git 不认识的 .gitkeep。不需要两个文件来回改。一个文件，两行配置，自包含，目录改名也不用管。



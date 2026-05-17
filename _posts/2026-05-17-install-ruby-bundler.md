---
layout: post
title: "安装 Ruby + Bundler"
subtitle: "简易教程"
date: 2026-05-17
author: "Hux"
header-img: "img/post-bg-2015.jpg"
tags: [Ruby, Bundler]
---

在 Windows 系统中安装 Ruby 并配置 Bundler 可按以下步骤操作，全程优先选择官方/稳定渠道，避免环境冲突：

### 一、安装 Ruby（推荐使用 RubyInstaller）
RubyInstaller 是 Windows 下最便捷的 Ruby 安装方式，内置了 Ruby 解释器、DevKit（编译本地扩展必需）等依赖。

#### 步骤 1：下载 RubyInstaller
1. 访问 RubyInstaller 官方下载页：[RubyInstaller for Windows](https://rubyinstaller.org/)
2. 选择 **Ruby+Devkit** 版本（推荐稳定版，如 3.2.x），根据系统位数（64 位选 `x64`，32 位选 `x86`）下载对应安装包。
   > 注意：避免下载“Lite”版本（缺少 DevKit，后续安装 Bundler 或 gem 可能报错）。

#### 步骤 2：运行安装程序
1. 双击下载的安装包，勾选以下关键选项（其余可默认）：
   - ✅ **Add Ruby executables to your PATH**（将 Ruby 加入系统环境变量，必选）
   - ✅ **Associate .rb and .rbw files with this Ruby installation**（可选，关联 Ruby 文件）
2. 点击“Install”开始安装，安装完成后会弹出 **“ridk install”** 窗口（DevKit 配置），选择：
   - 按提示输入 `1`（安装 MSYS2 base 组件）→ 回车，等待依赖安装完成。
   - 安装完成后关闭窗口即可。

#### 步骤 3：验证 Ruby 安装
1. 按下 `Win + R`，输入 `cmd` 打开命令提示符（或用 PowerShell）。
2. 执行以下命令，若输出版本号则安装成功：
   ```bash
   ruby -v
   # 示例输出：ruby 3.2.2 (2023-03-30 revision e51014f9c0) [x64-mingw-ucrt]

   gem -v
   # 示例输出：3.4.10（gem 是 Ruby 的包管理器，随 Ruby 自带）
   ```

### 二、安装 Bundler
Bundler 是 Ruby 的依赖管理工具，通过 `gem` 命令即可安装。

#### 步骤 1：（可选）更换 gem 源（解决国内下载慢）
默认 RubyGems 源在国外，国内访问慢，建议替换为淘宝镜像（或 Ruby China 源）：
```bash
# 移除默认源
gem sources --remove https://rubygems.org/

# 添加国内源（Ruby China）
gem sources --add https://gems.ruby-china.com/

# 验证源是否正确（仅保留 gems.ruby-china.com 即可）
gem sources -l
```

#### 步骤 2：安装 Bundler
执行以下命令安装最新版 Bundler：
```bash
gem install bundler
```

#### 步骤 3：验证 Bundler 安装
执行命令查看版本，输出版本号即成功：
```bash
bundle -v
# 示例输出：Bundler version 2.4.10
```

### 三、常见问题解决
1. **安装 gem 时报“缺少编译器”**：
   安装 Ruby 时未选 DevKit，可重新运行 RubyInstaller，选择“Add DevKit to PATH”或单独安装 MSYS2。

2. **环境变量未生效**：
   关闭所有 cmd/PowerShell 窗口重新打开，或手动将 Ruby 安装目录（如 `C:\Ruby32-x64\bin`）添加到系统环境变量 `PATH`。

3. **Bundler 命令提示“找不到”**：
   确认 `gem install bundler` 执行无报错，且 Ruby 的 `bin` 目录在 `PATH` 中，重启终端重试。

### 四、基础使用（可选）
在 Ruby 项目目录下，通过 Bundler 管理依赖：
```bash
# 初始化 Gemfile（项目依赖描述文件）
bundle init

# 安装 Gemfile 中的依赖
bundle install

# 执行 Ruby 脚本时使用 Bundler 加载依赖
bundle exec ruby your_script.rb
```
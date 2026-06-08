---
layout: post
title: "Rust 生命周期 (Lifetime)"
subtitle: "生命周期是 Rust 用来 确保引用始终有效 的机制，防止'悬空指针'（dangling reference）。"
date: 2026-06-08 09:57:30
author: ""
header-img: "img/post/post-bg-2026-06.jpg"
tags:
    - 
---
## Rust 生命周期 (Lifetime)

生命周期是 Rust 用来**确保引用始终有效**的机制，防止"悬空指针"（dangling reference）。

---

### 核心问题

```rust
fn main() {
    let r;
    {
        let x = 5;
        r = &x;  // ❌ x 在这里被 drop，r 变成悬空引用
    }
    println!("{}", r);  // 使用已失效的引用
}
```

---

### 生命周期 `'a` 的作用

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

`'a` 表示：**返回的引用和输入的引用活得一样久**。

---

### `'a` 语义解释

```
'a 的实际含义 = "某个作用域的存活时间"
```

| 标记 | 含义 |
|------|------|
| `&'a str` | 字符串切片的引用，它至少存活 `'a` 这么久 |
| `'static` | 整个程序运行期间都有效（如常量字符串） |
| `'a: 'b` | `'a` 至少和 `'b` 一样长 |

---

### 代码中的 `'a`

```rust
fn evaluate_executor<'a>(
    state: &'a AppState,
) -> ToolFuture<'a> { ... }
```

| 参数/返回 | 含义 |
|-----------|------|
| `state: &'a AppState` | 引用至少存活 `'a` |
| `-> ToolFuture<'a>` | 返回的 Future 内部引用的生命周期不超过 `'a` |

**保证**：Future 执行期间，`state` 始终有效，不会被 drop。

---

### 对比：没有生命周期 vs 有生命周期

```rust
// ❌ 编译器无法确定返回的 &str 来自哪里
fn longest(x: &str, y: &str) -> &str { ... }

// ✅ 编译器知道返回的 &str 和输入的 &str 一样久
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str { ... }
```

---

### 省略规则

Rust 会在简单情况下自动推断生命周期：

```rust
// 编译器自动推断为：
fn foo(x: &str) -> &str  ===  fn foo<'a>(x: &'a str) -> &'a str
```

---

### 一句话总结

> **生命周期 `'a` = 告诉编译器"这个引用在什么范围内有效"的标签**
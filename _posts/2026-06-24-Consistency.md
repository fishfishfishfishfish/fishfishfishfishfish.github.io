---
layout: post
title: "Consistency"
subtitle: "数据库consistency级别"
date: 2026-06-24
author: "Sinyo"
header-img: "img/post/post-bg-2026-06.jpg"
tags:
    - Database
    - Consistency
    - Distributed System
    - 数据库
---

有的。书中[1]涉及了多个 consistency 级别，按一致性强度从强到弱排列：

### 1. **Linearizability（线性化一致性）**
- 书中定义在第 1121 页（23.4.1 节）：所有 read/write 操作必须满足一个线性顺序，每个 read 看到的是最近一次 write 的值；如果操作 o1 在 o2 开始前结束，则 o1 必须在顺序中排在 o2 之前。
- 这是**最强**的副本一致性保证，也是分布式系统里最常用的高标准。

### 2. **External Consistency（外部一致性）**
- 第 1131 页（23.5.1 节）提到：事务的串行化顺序与真实时间顺序一致。Google Spanner 通过 commit-wait 机制实现。

### 3. **Eventual Consistency（最终一致性）**
- 第 1016 页定义：用持久消息异步传播更新，所有副本**最终**会收敛到一致状态，但中间可能有延迟，部分副本可能暂时落后。
- 第 1139 页将其作为弱一致性场景（BASE 系统）的第三步要求。

### 4. **Weak Consistency（弱一致性）**
- 第 1135 页（BASE 属性一节）隐含提及：系统允许副本在网络分区期间保持不一致状态。

---

这两个维度之外，书中还详细对比了两个整体设计哲学：

| 维度 | ACID | BASE |
|---|---|---|
| 代表特性 | Atomic, Consistent, Isolated, Durable | Basically Available, Soft state, Eventually consistent |
| 一致性 | 强一致 | 弱一致（牺牲一致性换可用性） |
| 典型系统 | 银行、传统关系型数据库 | 社交网络、NoSQL 分布式存储 |

此外书中还涉及 **synchronous replication（同步复制）** vs **asynchronous replication（异步复制）** 的区别，前者要求所有副本同步完成后事务才能提交（更强一致性但延迟高），后者允许主节点先提交再异步传播（对应 eventual consistency，延迟低但可能出现 stale read）。

[1] Database system concepts, seventh edition, 2020
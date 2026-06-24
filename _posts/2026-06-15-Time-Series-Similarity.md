---
layout: post
title: "时间序列相似性计算方法"
subtitle: "DTW与PLR算法详解"
date: 2026-06-15
author: "Sinyo"
header-img: "img/post/post-bg-2026-06.jpg"
tags:
    - 算法
    - 数据分析
    - 时间序列
    - Time Series
---

# 时间序列相似性计算方法
> From: 源计划-知乎 https://zhuanlan.zhihu.com/p/69170491
DTW与PLR算法详解

## 引言

时间序列相似性属于曲线相似性/曲线匹配(curve matching)领域的内容。在这一领域，有许多有用的方法，但是国内的博客上鲜有这方面的内容，因此本文选取了几种常用的方法进行综述性阐述。

衡量相似性之前，我们首先定义"相似"。

![相似性示例](img\time-series-similarity-example.jpg)

正常情况下，我们认为x、y、z是**形状相似**的，在这三条曲线中，我们认为y和z是最**相似**的两条曲线（因为y、z的距离最近）。

本文主要详细介绍时间序列相似度计算的**DTW算法**和**PLR算法**。

## 一、欧式距离

要衡量距离与形状，显然欧式距离是一个天然完美的指标。我们正是基于欧式距离认为y与z是最相似的。欧式距离在诸多算法中都有广泛的应用。

### 1.1 Whole Matching

对于长度相同的序列，计算每两点之间的距离然后求和，距离越小相似度越高。

```python
import numpy as np

def euclidean_distance(seq1, seq2):
    """计算两个等长序列的欧式距离"""
    return np.sqrt(np.sum((seq1 - seq2) ** 2))
```

### 1.2 不同长度序列

对于不同长度的序列，直接使用欧式距离并不合适，需要先进行对齐操作。

### 1.3 欧式距离的局限性

欧式距离存在以下局限性：
- **对噪声敏感**：单个点的偏移会显著影响距离
- **无法处理时间轴缩放**：不同速度的时间序列可能距离很大
- **对齐问题**：需要预先对齐才能比较

## 二、DTW算法（Dynamic Time Warping）

### 2.1 算法思想

DTW算法是一种动态规划算法，用于衡量两个不同长度序列的相似性。它允许序列在时间轴上进行非线性对齐，从而解决欧式距离无法处理的问题。

**核心思想**：通过动态规划找到一条最优路径，使得两序列对齐后的距离最小。

### 2.2 算法原理

给定两个序列：
- $Q = q_1, q_2, ..., q_n$（长度为n）
- $C = c_1, c_2, ..., c_m$（长度为m）

构建一个 $n\times m$ 的矩阵，矩阵元素 $(i, j)$ 表示 $q_i$ 和 $c_j$ 之间的距离。

找到一条从 $(1,1)$ 到 $(n,m)$ 的路径，使得路径上所有距离之和最小。

路径约束：
1. **边界条件**：路径必须从左下角到右上角
2. **连续性**：路径只能向右、向上或向右上方移动
3. **单调性**：保证时间顺序

递推公式：
$$
\textsf{DTW}(i, j) = d(q_i, c_j) + min(\textsf{DTW}(i-1, j), \textsf{DTW}(i, j-1), \textsf{DTW}(i-1, j-1))
$$

其中 $d(q_i, c_j)$ 是两点之间的距离（如欧式距离）。

### 2.3 算法实现

```python
import numpy as np

def dtw(seq1, seq2, dist='euclidean'):
    """
    动态时间规整算法
    
    参数:
        seq1: 第一个序列
        seq2: 第二个序列
        dist: 距离度量方式
    
    返回:
        dtw距离
    """
    n = len(seq1)
    m = len(seq2)
    
    # 创建距离矩阵
    dtw_matrix = np.full((n + 1, m + 1), np.inf)
    dtw_matrix[0, 0] = 0
    
    # 填充距离矩阵
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if dist == 'euclidean':
                cost = (seq1[i-1] - seq2[j-1]) ** 2
            else:
                cost = abs(seq1[i-1] - seq2[j-1])
            
            dtw_matrix[i, j] = cost + min(
                dtw_matrix[i-1, j],      # 插入
                dtw_matrix[i, j-1],      # 删除
                dtw_matrix[i-1, j-1]     # 匹配
            )
    
    return np.sqrt(dtw_matrix[n, m])
```

### 2.4 可视化DTW路径

```python
import matplotlib.pyplot as plt

def plot_dtw_path(seq1, seq2, path):
    """绘制DTW对齐路径"""
    plt.figure(figsize=(12, 8))
    
    # 绘制矩阵热力图
    plt.imshow(dtw_matrix[1:, 1:], cmap='Greys', origin='lower')
    plt.colorbar(label='DTW Distance')
    
    # 绘制路径
    path_x = [p[0] - 1 for p in path]
    path_y = [p[1] - 1 for p in path]
    plt.plot(path_y, path_x, color='red', linewidth=2, marker='o')
    
    plt.xlabel('Sequence 2 Index')
    plt.ylabel('Sequence 1 Index')
    plt.title('DTW Alignment Path')
    plt.show()
```

### 2.5 DTW算法的优点

1. **允许时间轴非线性对齐**：可以处理说话速度变化、动作节奏不同等情况
2. **处理不同长度的序列**：无需预处理对齐
3. **对噪声有一定的鲁棒性**：通过对齐可以平滑噪声影响
4. **可以与多种距离度量结合**：欧式距离、曼哈顿距离、马氏距离等

### 2.6 DTW算法的局限性

1. **时间复杂度高**：O(n×m)，不适合长序列
2. **无法处理维度变化**：序列维度必须相同
3. **边界效应**：序列开头和结尾的匹配可能不准确
4. **不是真正的度量**：不满足三角不等式

### 2.7 加速方法

#### 2.7.1 约束窗口

只允许路径在主对角线附近搜索：
```python
def dtw_constrained(seq1, seq2, window_size=10):
    """带窗口约束的DTW"""
    n, m = len(seq1), len(seq2)
    w = max(window_size, abs(n - m))
    
    dtw_matrix = np.full((n + 1, m + 1), np.inf)
    dtw_matrix[0, 0] = 0
    
    for i in range(1, n + 1):
        for j in range(max(1, i - w), min(m + 1, i + w)):
            cost = (seq1[i-1] - seq2[j-1]) ** 2
            dtw_matrix[i, j] = cost + min(
                dtw_matrix[i-1, j],
                dtw_matrix[i, j-1],
                dtw_matrix[i-1, j-1]
            )
    
    return np.sqrt(dtw_matrix[n, m])
```

#### 2.7.2 下界函数

使用下界函数快速剪枝：
```python
def lb_keogh(seq1, seq2, r=5):
    """Keogh下界"""
    u = np.maximum.accumulate(seq1) + r
    l = np.minimum.accumulate(seq1) - r
    
    lb = np.sum([
        (c - u[i])**2 if c > u[i] 
        else (l[i] - c)**2 if c < l[i] 
        else 0
        for i, c in enumerate(seq2)
    ])
    
    return np.sqrt(lb)
```

## 三、PLR算法（Piecewise Linear Representation）

### 3.1 算法思想

PLR算法将时间序列转换为一系列线段，通过线段来表示序列的主要特征，从而实现降维和相似性计算。

**核心思想**：将连续的曲线近似为离散的线段集合。

### 3.2 算法原理

1. **分段**：将序列划分为若干段
2. **线性拟合**：每段用一条直线近似
3. **特征提取**：提取每段的关键特征（斜率、截距、起止点）

分段方法：
- **等宽分段**：每段包含相同数量的点
- **等面积分段**：每段覆盖相同的数据范围
- **自底向上**：从最小分段开始，逐步合并
- **自顶向下**：从完整序列开始，逐步分裂

### 3.3 算法实现

```python
import numpy as np

def plr(seq, num_segments):
    """
    分段线性表示算法
    
    参数:
        seq: 输入序列
        num_segments: 分段数量
    
    返回:
        线段列表，每段包含(起点, 终点, 斜率)
    """
    n = len(seq)
    segment_length = n // num_segments
    
    segments = []
    for i in range(num_segments):
        start_idx = i * segment_length
        end_idx = start_idx + segment_length if i < num_segments - 1 else n
        
        # 获取当前段
        segment = seq[start_idx:end_idx]
        
        # 拟合直线（最小二乘法）
        x = np.arange(len(segment))
        coeffs = np.polyfit(x, segment, 1)
        slope = coeffs[0]
        intercept = coeffs[1]
        
        segments.append({
            'start_idx': start_idx,
            'end_idx': end_idx,
            'start_value': segment[0],
            'end_value': segment[-1],
            'slope': slope,
            'intercept': intercept
        })
    
    return segments
```

### 3.4 PLR距离计算

```python
def plr_distance(segments1, segments2):
    """计算两个PLR表示之间的距离"""
    if len(segments1) != len(segments2):
        raise ValueError("分段数量必须相同")
    
    total_distance = 0
    for s1, s2 in zip(segments1, segments2):
        # 方法1：基于端点距离
        point_dist = abs(s1['end_value'] - s2['end_value'])
        
        # 方法2：基于斜率距离
        slope_dist = abs(s1['slope'] - s2['slope'])
        
        # 综合距离
        total_distance += point_dist + 0.5 * slope_dist
    
    return total_distance
```

### 3.5 PLA算法（Piecewise Aggregate Approximation）

PLA是PLR的一种变体，要求每段长度相等：

```python
def paa(seq, num_segments):
    """
    分段聚合近似算法
    
    参数:
        seq: 输入序列
        num_segments: 分段数量
    
    返回:
        每段的平均值序列
    """
    n = len(seq)
    segment_size = n // num_segments
    
    paa_representation = []
    for i in range(num_segments):
        start = i * segment_size
        end = start + segment_size if i < num_segments - 1 else n
        segment_mean = np.mean(seq[start:end])
        paa_representation.append(segment_mean)
    
    return np.array(paa_representation)
```

### 3.6 PLR算法的优点

1. **降维效果好**：大大减少数据存储量
2. **计算效率高**：线段比较比点比较更快
3. **对噪声鲁棒**：线性拟合平滑噪声
4. **直观易懂**：线段表示易于理解和可视化

### 3.7 PLR算法的局限性

1. **分段数量难以确定**：需要预先指定
2. **可能丢失细节**：过度简化可能丢失重要信息
3. **不保留时间信息**：时间信息被压缩

## 四、DTW与PLR的结合

### 4.1 PLR-DTW

先用PLR降维，再用DTW计算相似性：

```python
def plr_dtw(seq1, seq2, num_segments=10):
    """PLR降维后的DTW距离"""
    # PLR降维
    seg1 = plr(seq1, num_segments)
    seg2 = plr(seq2, num_segments)
    
    # 提取端点值作为新序列
    reduced_seq1 = np.array([s['end_value'] for s in seg1])
    reduced_seq2 = np.array([s['end_value'] for s in seg2])
    
    # DTW计算
    return dtw(reduced_seq1, reduced_seq2)
```

### 4.2 对比分析

| 特性 | DTW | PLR |
|------|-----|-----|
| 相似度度量 | 点对点对齐 | 线段特征比较 |
| 时间复杂度 | O(n×m) | O(n) |
| 降维能力 | 无 | 强 |
| 对噪声鲁棒性 | 中等 | 强 |
| 适用场景 | 短序列 | 长序列 |

## 五、应用场景

### 5.1 语音识别
- 说话人识别
- 语音命令匹配
- 语音合成评估

### 5.2 手势识别
- 动作序列匹配
- 手语识别
- 人体姿态识别

### 5.3 金融分析
- 股票走势相似性
- 交易模式识别
- 异常检测

### 5.4 医疗数据
- 心电图(ECG)匹配
- 脑电图(EEG)分析
- 运动数据分析

### 5.5 推荐系统
- 用户行为序列分析
- 点击流分析
- 购买模式挖掘

## 六、实战案例

### 6.1 手势识别

```python
import numpy as np

# 模拟手势数据
gesture1 = np.array([0, 1, 2, 3, 4, 5, 4, 3, 2, 1])
gesture2 = np.array([0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 4.5, 3.5, 2.5, 1.5])

# 计算DTW距离
dtw_dist = dtw(gesture1, gesture2)
print(f"DTW距离: {dtw_dist}")

# 快速筛选（使用下界）
lb = lb_keogh(gesture1, gesture2)
print(f"Keogh下界: {lb}")
```

### 6.2 股票相似性搜索

```python
# 提取股票价格序列
stock1 = np.random.randn(100).cumsum()
stock2 = np.random.randn(100).cumsum()

# 使用PLR降维
num_segments = 10
seg1 = plr(stock1, num_segments)
seg2 = plr(stock2, num_segments)

# 计算相似性
plr_dist = plr_distance(seg1, seg2)
print(f"PLR距离: {plr_dist}")
```

## 七、性能优化技巧

### 7.1 数据预处理

```python
def preprocess_sequence(seq, normalize=True, smooth=True):
    """序列预处理"""
    processed = seq.copy()
    
    # 归一化
    if normalize:
        processed = (processed - np.mean(processed)) / np.std(processed)
    
    # 平滑
    if smooth:
        from scipy.ndimage import uniform_filter1d
        processed = uniform_filter1d(processed, size=3)
    
    return processed
```

### 7.2 早期放弃

```python
def dtw_with_early_abandon(seq1, seq2, threshold):
    """带早期放弃的DTW"""
    n, m = len(seq1), len(seq2)
    accumulated = np.zeros(n + 1)
    
    for j in range(1, m + 1):
        new_accumulated = np.full(n + 1, np.inf)
        for i in range(1, n + 1):
            cost = abs(seq1[i-1] - seq2[j-1])
            new_accumulated[i] = cost + min(
                accumulated[i],
                new_accumulated[i-1],
                accumulated[i-1]
            )
        
        # 早期放弃
        if np.min(new_accumulated) > threshold:
            return np.inf
        
        accumulated = new_accumulated
    
    return accumulated[n]
```

### 7.3 并行计算

```python
from multiprocessing import Pool

def batch_dtw(query, sequences):
    """批量计算DTW距离"""
    with Pool() as pool:
        distances = pool.starmap(
            dtw,
            [(query, seq) for seq in sequences]
        )
    return distances
```

## 八、常见问题

### Q1: 如何选择DTW的窗口大小？

窗口大小直接影响计算速度和匹配精度：
- **小窗口**：计算快，但可能错过正确的对齐
- **大窗口**：精度高，但计算慢
- **建议**：从窗口大小为序列长度的10%开始尝试

### Q2: DTW和欧式距离哪个更好？

取决于具体应用：
- **欧式距离**：适合长度相同、对齐良好的序列
- **DTW**：适合长度不同、需要时间对齐的序列
- **建议**：先尝试欧式距离，如果效果不好再用DTW

### Q3: 如何处理高维时间序列？

1. **降维**：使用PCA、LDA等方法
2. **特征提取**：提取统计特征、频域特征
3. **分而治之**：对每个维度分别计算DTW，然后加权求和

### Q4: PLR的分段数量如何确定？

1. **经验法则**：序列长度的平方根
2. **交叉验证**：尝试不同的分段数量，选择最优
3. **信息准则**：AIC、BIC等准则

## 九、总结

### 核心要点

1. **欧式距离**是最基础的距离度量，适用于长度相同的序列
2. **DTW算法**通过动态规划实现时间对齐，适用于不同长度的序列
3. **PLR算法**通过分段线性表示实现降维，提高计算效率
4. **结合使用**：PLR降维 + DTW相似性计算是处理长序列的有效方法

### 算法选择指南

| 场景 | 推荐算法 |
|------|----------|
| 短序列，等长 | 欧式距离 |
| 短序列，不等长 | DTW |
| 长序列 | PLR + DTW |
| 实时应用 | 约束DTW + 下界剪枝 |
| 噪声数据 | PLR |

### 学习资源

1. **经典论文**：
   - "Dynamic Time Warping" by Meinard Müller
   - "Scaling FTW" for fast DTW

2. **Python库**：
   - `fastdtw`：快速DTW实现
   - `tslearn`：时间序列机器学习库
   - `dtaidistance`：专门的时间序列距离库

3. **在线工具**：
   - [UCR Time Series Classification Archive](http://www.cs.ucr.edu/~eamonn/time_series_data/)
   - DTW算法可视化工具

# 个人知识库

这是我的个人知识库GitHub Pages项目，包含各种技术笔记、算法实现和数据可视化内容。

## 📁 项目结构

```
├── html/              # HTML演示和可视化项目
│   ├── optimization-algorithm.html    # 优化算法实现与可视化
│   └── data-visualization.html        # 数据可视化项目
├── notes/             # 命令行和技术笔记
│   ├── linux命令笔记.md               # Linux命令使用笔记
│   └── windows命令行笔记.md           # Windows命令行使用笔记
├── README.md          # 项目说明文档
└── _config.yml        # Jekyll配置文件
```

## 🚀 内容介绍

### 优化算法 (optimization-algorithm.html)
包含数值优化算法的实现，使用牛顿法和拟牛顿法寻找函数最小值，并通过热力图和迭代过程可视化算法效果。

### 数据可视化 (data-visualization.html)
数据可视化项目，展示如何使用Python和Matplotlib进行数据探索和可视化。

### 命令行笔记
- **Linux命令笔记**: 常用Linux命令的详细说明和使用示例
- **Windows命令行笔记**: Windows命令提示符和PowerShell的使用技巧

## 🔗 相关链接

- [非负矩阵分解社区检测](https://fishfishfishfishfish.github.io/Community-Detection-with-2NMF/)
- [斯坦福课程](https://fishfishfishfishfish.github.io/stanford_courses/)

## 🛠️ 技术栈

- **GitHub Pages**: 静态网站托管
- **Jekyll**: 静态网站生成器
- **Python**: 算法实现和数据处理
- **HTML/CSS/JavaScript**: 前端展示
- **Matplotlib/NumPy**: 数据可视化和数值计算

## 📄 许可证

MIT License - 详见项目根目录的LICENSE文件（如果存在）

## 🚀 本地运行

如果你想在本地预览和测试项目，可以按照以下步骤操作：

### 方法一：使用Python内置服务器
```bash
# 进入项目目录
cd fishfishfishfishfish.github.io

# 启动HTTP服务器（Python 3）
python -m http.server 8000

# 或者使用Python 2
python -m SimpleHTTPServer 8000
```

### 方法二：使用Jekyll（推荐，完全模拟GitHub Pages环境）
```bash
# 确保已安装Ruby和Jekyll
# 安装依赖
bundle install

# 启动本地服务器
jekyll serve
```

### 访问方式
启动服务器后，在浏览器中访问：
```
http://localhost:8000  # Python服务器
# 或
http://localhost:4000  # Jekyll服务器
```

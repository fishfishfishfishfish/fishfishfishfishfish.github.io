---
layout: post
title: "Docker 配置镜像加速"
subtitle: "国内镜像源配置与优化"
date: 2026-06-11
author: "Sinyo"
header-img: "img/post/post-bg-2026-06.jpg"
tags:
    - Docker
    - DevOps
    - 效率工具
---

# Docker 配置镜像加速

国内镜像源配置与优化

## 引言

在国内使用Docker时，由于网络原因，从Docker Hub拉取镜像往往速度很慢甚至无法访问。配置镜像加速器可以显著提升镜像拉取速度。本文介绍如何配置Docker镜像加速器。

## 一、为什么需要镜像加速

### 1.1 网络问题
- Docker Hub服务器位于海外
- 国内网络访问海外资源速度慢
- 经常出现连接超时、下载失败等问题

### 1.2 镜像加速的优势
- 提升拉取速度（可达数十倍提升）
- 稳定性更高
- 支持更多的镜像资源

## 二、国内常用镜像加速器

### 2.1 官方加速器

#### 阿里云镜像加速器
```bash
# 登录阿里云容器镜像服务
# 获取专属加速地址：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

# 配置Docker daemon
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me",
    "https://dockerproxy.com"
  ]
}
EOF

# 重启Docker服务
sudo systemctl daemon-reload
sudo systemctl restart docker
sudo docker info  # 查看配置
```

> 说明：上面列出了当前（2026年4月）社区反馈最稳定的几个公共镜像源。其中：
> docker.m.daocloud.io (DaoCloud) 依然保持良好服务。
> docker.1ms.run (毫秒镜像) 和 docker.xuanyuan.me (轩辕镜像) 是近两年涌现的、专门为解决此问题而生的服务，速度和稳定性俱佳。
> dockerproxy.com 也是一个广泛使用的代理服务。
> From: [jack.yang-腾讯云开发者社区](https://cloud.tencent.com/developer/article/2660254)


## 三、Windows配置方法

### 3.1 Docker Desktop

1. 打开Docker Desktop
2. 点击设置图标（⚙️）
3. 左侧菜单选择"Docker Engine"
4. 在编辑器中添加或修改配置：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

5. 点击"Apply & Restart"保存并重启

### 3.2 验证配置

打开PowerShell执行：

```powershell
docker info
```

在输出中查找：

```
Registry Mirrors:
 https://docker.mirrors.ustc.edu.cn/
 https://hub-mirror.c.163.com/
```

## 四、macOS配置方法

### 4.1 Docker Desktop

1. 打开Docker Desktop
2. 点击设置图标（⚙️）或Preferences
3. 选择"Docker Engine"标签
4. 添加镜像配置：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

5. 点击"Apply & Restart"

## 五、Linux配置方法

### 5.1 Ubuntu/Debian

```bash
# 创建或编辑daemon配置文件
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
EOF

# 重启Docker服务
sudo systemctl daemon-reload
sudo systemctl restart docker

# 验证配置
sudo docker info | grep "Registry Mirrors"
```

### 5.2 CentOS/RHEL

```bash
# 编辑或创建daemon配置文件
sudo mkdir -p /etc/docker
sudo vim /etc/docker/daemon.json

# 添加以下内容
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}

# 保存并退出，重启Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 六、Docker Compose配置

如果使用Docker Compose，也可以在compose文件中指定镜像源：

```yaml
version: '3.8'

services:
  app:
    image: nginx:latest
    # 指定镜像源
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - REGISTRY_MIRROR=https://docker.mirrors.ustc.edu.cn
```

## 七、常见问题

### 7.1 配置后不生效

检查方法：

```bash
# 1. 检查daemon.json格式是否正确
cat /etc/docker/daemon.json | python -m json.tool

# 2. 检查Docker服务状态
sudo systemctl status docker

# 3. 查看Docker日志
sudo journalctl -u docker -f

# 4. 重启后再次验证
sudo systemctl restart docker
docker info
```

### 7.2 镜像拉取仍然慢

尝试以下方法：

1. 检查网络连接
2. 尝试不同的镜像源
3. 使用代理（如有）
4. 手动拉取大镜像分步进行

### 7.3 镜像标签不存在

某些镜像可能在镜像源中没有同步：

```bash
# 查看镜像标签
docker search <image_name>

# 或直接指定官方源拉取
docker pull library/nginx:latest
```

## 八、高级配置

### 8.1 配置代理（可选）

如果公司网络需要代理：

```json
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"],
  "proxies": {
    "default": {
      "httpProxy": "http://proxy.example.com:8080",
      "httpsProxy": "http://proxy.example.com:8080",
      "noProxy": "localhost,127.0.0.1"
    }
  }
}
```

### 8.2 镜像仓库认证

访问私有镜像仓库时需要登录：

```bash
# 登录Docker Hub
docker login

# 登录私有仓库
docker login registry.example.com

# 登出
docker logout
```

## 九、性能对比

### 测试方法

```bash
# 测试拉取速度
time docker pull ubuntu:latest

# 对比不同镜像源
docker pull nginx:latest  # 官方源
docker pull docker.mirrors.ustc.edu.cn/library/nginx:latest  # 中科大
```

### 典型提升

| 场景 | 官方源 | 镜像加速 |
|------|--------|----------|
| 首次拉取Ubuntu | 30分钟+ | 1-3分钟 |
| 拉取Python镜像 | 20分钟+ | 1-2分钟 |
| 拉取Node镜像 | 15分钟+ | 1-2分钟 |

## 十、最佳实践

1. **优先使用官方配置**：阿里云等服务商提供的加速器通常最稳定
2. **配置多个镜像源**：提高容错性，一个不可用时可以自动切换
3. **定期检查配置**：镜像源可能有变化，需要及时更新
4. **关注官方通知**：镜像源服务调整时会有公告
5. **本地缓存**：常用镜像可以先拉取到本地

## 总结

配置Docker镜像加速是提升开发效率的重要手段。建议配置2-3个可用的镜像源，确保稳定性和速度。在国内网络环境下，合理配置镜像加速可以将镜像拉取速度提升数十倍，显著改善开发体验。

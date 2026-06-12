#!/bin/bash

# 检查参数
if [ $# -eq 0 ]; then
    echo "用法: $0 title="文章标题" [subtitle="副标题"]"
    exit 1
fi

# 解析参数
TITLE=""
SUBTITLE=""
for arg in "$@"
do
    case $arg in
        title=*)
        TITLE="${arg#*=}"
        shift
        ;;
        subtitle=*)
        SUBTITLE="${arg#*=}"
        shift
        ;;
        *)
        echo "未知参数: $arg"
        exit 1
        ;;
    esac
done

# 检查标题是否为空
if [ -z "$TITLE" ]; then
    echo "错误: 必须提供标题参数"
    exit 1
fi

# 生成日期
DATE=$(date +"%Y-%m-%d")
TIME=$(date +"%H:%M:%S")

# 生成文件名
# 将标题中的特殊字符替换为短横线
SAFE_TITLE=$(echo "$TITLE" | sed -e 's/[^a-zA-Z0-9]/-/g' -e 's/--*/-/g' -e 's/^-//' -e 's/-$//')
FILENAME="${DATE}-${SAFE_TITLE}.md"
POST_PATH="_posts/${FILENAME}"

# 检查文件是否已存在
if [ -f "$POST_PATH" ]; then
    echo "错误: 文件 $POST_PATH 已存在"
    exit 1
fi

# 生成文章内容
cat > "$POST_PATH" <<EOF
---
layout: post
title: "$TITLE"
subtitle: "$SUBTITLE"
date: $DATE
author: "Sinyo"
header-img: "img/post/post-bg-${DATE:0:7}.jpg"
tags:
    - 
---

# $TITLE

$SUBTITLE

EOF

# 输出结果
echo "✅ 文章已成功生成: $POST_PATH"

# 如果有git，检查是否需要添加到版本控制
if command -v git &> /dev/null; then
    git add "$POST_PATH"
    echo "📝 文件已添加到Git暂存区"
fi
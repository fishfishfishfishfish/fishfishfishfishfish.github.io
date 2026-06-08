<#
.SYNOPSIS
创建新的Jekyll文章，替代Rake功能
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Title,
    
    [string]$Subtitle = ""
)

# 生成日期
$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HH:mm:ss"
$yearMonth = $date.Substring(0,7)

# 生成安全的文件名
$safeTitle = $Title -replace '[^a-zA-Z0-9\u4e00-\u9fa5]', '-' -replace '-+', '-' -replace '^-|-$', ''
$filename = "${date}-${safeTitle}.md"
$postPath = Join-Path "_posts" $filename

# 检查文件是否已存在
if (Test-Path $postPath) {
    Write-Error "Error: File $postPath already exists"
    exit 1
}

# 确保_posts目录存在
if (-not (Test-Path "_posts")) {
    New-Item -ItemType Directory -Path "_posts" | Out-Null
}

# 逐行写入文件
$writer = New-Object System.IO.StreamWriter($postPath, $false, [System.Text.Encoding]::UTF8)

# 写入YAML头部
$writer.WriteLine("---")
$writer.WriteLine("layout: post")
$writer.WriteLine("title: `"$Title`"")
$writer.WriteLine("subtitle: `"$Subtitle`"")
$writer.WriteLine("date: $date $time")
$writer.WriteLine("author: `"`"")
$writer.WriteLine("header-img: `"img/post/post-bg-$yearMonth.jpg`"")
$writer.WriteLine("tags:")
$writer.WriteLine("    - ")
$writer.WriteLine("---")
$writer.WriteLine()
$writer.WriteLine("# $Title")
$writer.WriteLine()
if ($Subtitle) {
    $writer.WriteLine($Subtitle)
    $writer.WriteLine()
}

# 关闭写入器
$writer.Flush()
$writer.Close()
$writer.Dispose()

# 输出结果
Write-Host "Success: Post created at $postPath" -ForegroundColor Green

# 如果有git，检查是否需要添加到版本控制
if (Get-Command git -ErrorAction SilentlyContinue) {
    git add $postPath
    Write-Host "Info: File added to git staging area" -ForegroundColor Cyan
}
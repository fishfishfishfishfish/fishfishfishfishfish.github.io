
// 自动文字颜色 - 根据背景亮度切换黑白文字
(function() {
    'use strict';

    // 检测元素背景亮度
    function getBackgroundBrightness(element) {
        // 创建临时canvas用于分析
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // 获取元素位置和尺寸
        const rect = element.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        
        if (width <= 0 || height <= 0) {
            return 128; // 默认中等亮度
        }
        
        // 设置canvas尺寸
        canvas.width = width;
        canvas.height = height;
        
        try {
            // 绘制元素到canvas
            context.drawWindow(window, rect.left, rect.top, width, height, 'rgb(255,255,255)');
            
            // 获取像素数据
            const imageData = context.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            // 计算平均亮度
            let totalBrightness = 0;
            let pixelCount = 0;
            
            // 采样（每10个像素采样一次，提高性能）
            for (let i = 0; i < data.length; i += 4 * 10) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // 使用ITU-R BT.601亮度公式
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                totalBrightness += brightness;
                pixelCount++;
            }
            
            return pixelCount > 0 ? totalBrightness / pixelCount : 128;
        } catch (e) {
            // 跨域或安全限制时返回默认值
            console.warn('无法分析背景图像:', e);
            return 128;
        }
    }
    
    // 设置文字颜色
    function setTextColorBasedOnBackground(element, textElements) {
        const brightness = getBackgroundBrightness(element);
        const isDark = brightness < 128; // 128是中等亮度阈值
        
        textElements.forEach(textElement => {
            if (textElement) {
                if (isDark) {
                    textElement.style.color = '#ffffff';
                    textElement.style.textShadow = '0 1px 3px rgba(0,0,0,0.5)';
                } else {
                    textElement.style.color = '#2c3e50';
                    textElement.style.textShadow = 'none';
                }
            }
        });
    }
    
    // 初始化
    function initAutoTextColor() {
        // 处理首页标题
        const introHeader = document.querySelector('.intro-header');
        if (introHeader) {
            const siteHeading = document.querySelector('.site-heading h1');
            const siteSubheading = document.querySelector('.site-heading .subheading');
            
            if (siteHeading) {
                setTextColorBasedOnBackground(introHeader, [siteHeading, siteSubheading]);
            }
        }
        
        // 处理文章标题
        const postHeader = document.querySelector('.intro-header.post-heading');
        if (postHeader) {
            const postTitle = document.querySelector('.post-heading h1');
            const postSubtitle = document.querySelector('.post-heading .subheading');
            const postMeta = document.querySelector('.post-heading .meta');
            
            if (postTitle) {
                setTextColorBasedOnBackground(postHeader, [postTitle, postSubtitle, postMeta]);
            }
        }
        
        // 导航栏智能变色
        setupNavbarColor();
    }
    
    // 导航栏颜色设置
    function setupNavbarColor() {
        const navbar = document.querySelector('.navbar-custom');
        const navbarBrand = document.querySelector('.navbar-custom .navbar-brand');
        const navbarLinks = document.querySelectorAll('.navbar-custom .nav li a');
        
        // 获取导航栏高度
        const navbarHeight = navbar ? navbar.offsetHeight : 56;
        
        // 设置导航栏文字颜色的函数
        function setNavbarTextColor(isDark) {
            if (!navbarBrand) return;
            
            if (isDark) {
                // 深色背景 - 使用白色文字
                navbarBrand.style.color = '#ffffff';
                navbarBrand.style.textShadow = '0 1px 3px rgba(0,0,0,0.5)';
                navbarLinks.forEach(link => {
                    link.style.color = 'rgba(255, 255, 255, 0.9)';
                    link.style.textShadow = '0 1px 3px rgba(0,0,0,0.5)';
                });
            } else {
                // 浅色背景 - 使用深色文字
                navbarBrand.style.color = '#2c3e50';
                navbarBrand.style.textShadow = 'none';
                navbarLinks.forEach(link => {
                    link.style.color = '#2c3e50';
                    link.style.textShadow = 'none';
                });
            }
        }
        
        // 根据页面顶部背景图检测亮度
        function detectTopBackgroundBrightness() {
            const headerBg = document.querySelector('.intro-header');
            if (headerBg) {
                const brightness = getBackgroundBrightness(headerBg);
                const isDark = brightness < 128;
                setNavbarTextColor(isDark);
                return isDark;
            }
            // 默认返回深色（白色文字）
            setNavbarTextColor(true);
            return true;
        }
        
        // 页面加载时设置初始颜色
        detectTopBackgroundBrightness();
        
        // 监听滚动事件
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY || window.pageYOffset;
            
            // 如果滚动距离小于导航栏高度，使用顶部背景检测
            if (scrollY < navbarHeight) {
                detectTopBackgroundBrightness();
            } else {
                // 滚动过导航栏后，使用默认的深色背景
                setNavbarTextColor(false);
            }
        });
        
        // 监听页面加载完成（确保所有资源加载）
        window.addEventListener('load', function() {
            detectTopBackgroundBrightness();
        });
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoTextColor);
    } else {
        initAutoTextColor();
    }
})();

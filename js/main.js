// ===== 性能优化的主 JavaScript 文件 =====
// 使用现代 JavaScript 特性，优化性能，减少重绘重排

class PerformanceOptimizedWebsite {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 网站初始化 - 性能优化版');
        
        // 使用 requestIdleCallback 或 setTimeout 延迟非关键初始化
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => this.initializeNonCritical());
        } else {
            setTimeout(() => this.initializeNonCritical(), 1000);
        }
        
        // 立即初始化关键功能
        this.initializeCritical();
        
        // 性能监控
        this.setupPerformanceMonitoring();
    }

    // 1. 关键功能立即初始化
    initializeCritical() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupBackToTop();
        this.setupScrollEffects();
        this.setupFormValidation();
    }

    // 2. 非关键功能延迟初始化
    initializeNonCritical() {
        this.setupLazyLoading();
        this.setupIntersectionObservers();
        this.setupSkillAnimations();
        this.setupHoverEffects();
        this.setupNotifications();
    }

    // 3. 移动端菜单（性能优化版）
    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!menuToggle || !navMenu) return;
        
        // 使用事件委托，减少事件监听器数量
        document.addEventListener('click', (e) => {
            if (e.target.closest('.menu-toggle')) {
                this.toggleMobileMenu(menuToggle, navMenu);
            }
            
            if (e.target.closest('.nav-link')) {
                this.closeMobileMenu(menuToggle, navMenu);
            }
        });
        
        // 触摸事件支持
        menuToggle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleMobileMenu(menuToggle, navMenu);
        }, { passive: false });
    }

    toggleMobileMenu(menuToggle, navMenu) {
        const isActive = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // 使用 classList 而不是直接操作 style
        const bars = menuToggle.querySelectorAll('.bar');
        if (isActive) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            document.body.classList.add('no-scroll');
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
            document.body.classList.remove('no-scroll');
        }
    }

    closeMobileMenu(menuToggle, navMenu) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        const bars = menuToggle.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
        document.body.classList.remove('no-scroll');
    }

    // 4. 平滑滚动（节流优化）
    setupSmoothScroll() {
        let scrollTimeout;
        
        // 使用事件委托处理所有锚点链接
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor || anchor.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 使用现代滚动API
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 更新导航链接激活状态
                this.updateActiveNavLink(targetId);
            }
        });
        
        // 节流滚动事件
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = requestAnimationFrame(() => {
                this.handleScroll();
            });
        }, { passive: true });
    }

    // 5. 滚动处理
    handleScroll() {
        // 导航栏滚动效果
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // 返回顶部按钮
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        // 更新活动导航链接
        this.updateActiveSection();
    }

    // 6. 更新活动导航链接
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        this.updateActiveNavLink('#' + currentSection);
    }

    updateActiveNavLink(targetId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // 7. 返回顶部按钮
    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 8. 图片懒加载
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('.lazy-load');
            if (lazyImages.length === 0) return;
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // 加载图片
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        
                        // 加载完成后添加class
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        }, { once: true });
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // 9. IntersectionObserver 动画
    setupIntersectionObservers() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        // 观察技能卡片
        const skillCards = document.querySelectorAll('.skill-category');
        if (skillCards.length > 0) {
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        cardObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            skillCards.forEach(card => cardObserver.observe(card));
        }
        
        // 观察项目卡片
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length > 0) {
            const projectObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(20px)';
                        
                        requestAnimationFrame(() => {
                            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        });
                        
                        projectObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            projectCards.forEach(card => projectObserver.observe(card));
        }
    }

    // 10. 技能条动画
    setupSkillAnimations() {
        const skillItems = document.querySelectorAll('.skill-list li');
        if (skillItems.length === 0) return;
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateX(-20px)';
                    
                    // 使用 requestAnimationFrame 确保动画流畅
                    requestAnimationFrame(() => {
                        entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease, padding-left 0.3s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    });
                    
                    skillObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });
        
        skillItems.forEach(item => skillObserver.observe(item));
    }

    // 11. 悬停效果优化
    setupHoverEffects() {
        // 为卡片添加悬停效果
        const hoverElements = document.querySelectorAll('.project-card, .skill-category, .stat-item');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.zIndex = '10';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.zIndex = '';
            });
        });
    }

    // 12. 表单验证优化
    setupFormValidation() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;
        
        // 延迟加载表单验证
        setTimeout(() => {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // 显示加载状态
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
                submitBtn.disabled = true;
                
                try {
                    // 模拟表单提交
                    await this.submitForm(contactForm);
                    this.showNotification('消息发送成功！我会尽快回复您。', 'success');
                    contactForm.reset();
                } catch (error) {
                    this.showNotification('发送失败，请稍后重试。', 'error');
                } finally {
                    // 恢复按钮状态
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        }, 2000);
    }

    // 13. 表单提交
    async submitForm(form) {
        // 这里可以替换为真实的表单提交逻辑
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('表单提交:', new FormData(form));
                resolve();
            }, 1500);
        });
    }

    // 14. 通知系统
    setupNotifications() {
        // 创建通知容器
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notificationContainer);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // 添加样式
        notification.style.cssText = `
            background: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            max-width: 400px;
            border-left: 4px solid #2563eb;
        `;
        
        if (type === 'success') {
            notification.style.borderLeftColor = '#10b981';
        } else if (type === 'error') {
            notification.style.borderLeftColor = '#ef4444';
        }
        
        const container = document.querySelector('.notification-container');
        container.appendChild(notification);
        
        // 显示动画
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // 关闭按钮
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // 自动关闭
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(150%)';
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                }, 300);
            }
        }, 5000);
    }

    // 15. 滚动效果
    setupScrollEffects() {
        // 添加滚动时元素出现效果
        const fadeElements = document.querySelectorAll('.skill-category, .project-card, .stat-item');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // 16. 性能监控
    setupPerformanceMonitoring() {
        // 记录性能指标
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = performance.timing;
                    const perfData = {
                        dns: timing.domainLookupEnd - timing.domainLookupStart,
                        tcp: timing.connectEnd - timing.connectStart,
                        ttfb: timing.responseStart - timing.requestStart,
                        domReady: timing.domContentLoadedEventStart - timing.navigationStart,
                        pageLoad: timing.loadEventEnd - timing.navigationStart
                    };
                    
                    console.log('📊 页面性能指标:', perfData);
                    
                    // 发送到分析服务（如果需要）
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'timing_complete', perfData);
                    }
                }, 0);
            });
        }
        
        // 监控长任务
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.log('⚠️ 长任务检测:', entry);
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                console.log('长任务监控不可用');
            }
        }
        
        // 监控布局偏移
        if ('PerformanceObserver' in window) {
            try {
                let cls = 0;
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            cls += entry.value;
                            console.log('📐 布局偏移:', entry);
                        }
                    }
                });
                
                observer.observe({ type: 'layout-shift', buffered: true });
            } catch (e) {
                console.log('布局偏移监控不可用');
            }
        }
    }

    // 17. 错误处理
    setupErrorHandling() {
        // 全局错误捕获
        window.addEventListener('error', (event) => {
            console.error('❌ JavaScript错误:', event.error);
            
            // 可以发送错误到监控服务
            if (typeof Sentry !== 'undefined') {
                Sentry.captureException(event.error);
            }
        });
        
        // 未处理的Promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            console.error('❌ 未处理的Promise rejection:', event.reason);
        });
    }
}

// 18. 页面加载优化
document.addEventListener('DOMContentLoaded', () => {
    // 隐藏骨架屏
    const skeleton = document.getElementById('skeleton');
    if (skeleton) {
        setTimeout(() => {
            skeleton.style.opacity = '0';
            skeleton.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                skeleton.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    // 初始化网站
    setTimeout(() => {
        new PerformanceOptimizedWebsite();
    }, 100);
});

// 19. 服务Worker注册（可选）
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    });
}

// 20. 离线检测
window.addEventListener('online', () => {
    console.log('✅ 网络已连接');
});

window.addEventListener('offline', () => {
    console.log('⚠️ 网络已断开');
    const website = new PerformanceOptimizedWebsite();
    website.showNotification('网络连接已断开，部分功能可能不可用', 'error');
});

// 导出类以便其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizedWebsite;
}

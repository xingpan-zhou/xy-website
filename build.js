const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

async function build() {
  console.log('🚀 开始构建优化...');
  
  // 1. 确保dist目录存在
  const distDir = './dist';
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    fs.mkdirSync(path.join(distDir, 'css'), { recursive: true });
    fs.mkdirSync(path.join(distDir, 'js'), { recursive: true });
    console.log('📁 创建dist目录');
  }
  
  // 2. 压缩JavaScript
  try {
    const jsCode = fs.readFileSync('./js/main.js', 'utf8');
    const jsResult = await minify(jsCode, {
      compress: {
        drop_console: true
      }
    });
    
    fs.writeFileSync('./dist/js/main.min.js', jsResult.code);
    console.log('✅ JavaScript压缩完成');
  } catch (error) {
    console.log('⚠️ JavaScript压缩跳过，继续其他优化');
  }
  
  // 3. 压缩CSS
  try {
    const cssCode = fs.readFileSync('./css/style.css', 'utf8');
    const cssResult = new CleanCSS().minify(cssCode);
    
    fs.writeFileSync('./dist/css/style.min.css', cssResult.styles);
    console.log('✅ CSS压缩完成');
  } catch (error) {
    console.log('⚠️ CSS压缩跳过，继续其他优化');
  }
  
  // 4. 处理HTML
  try {
    let html = fs.readFileSync('./index.html', 'utf8');
    
    // 替换CSS链接为压缩版本
    html = html.replace('href="./css/style.css"', 'href="./css/style.min.css"');
    
    // 替换JS链接为压缩版本
    html = html.replace('src="./js/main.js"', 'src="./js/main.min.js"');
    
    // 添加预加载
    html = html.replace(
      '</head>',
      `<link rel="preload" href="./css/style.min.css" as="style">
       <link rel="preload" href="./js/main.min.js" as="script">
       </head>`
    );
    
    fs.writeFileSync('./dist/index.html', html);
    console.log('✅ HTML优化完成');
  } catch (error) {
    console.log('❌ HTML处理失败:', error.message);
  }
  
  // 5. 复制其他文件
  const filesToCopy = [
    { src: './favicon.ico', dest: './favicon.ico' },
    { src: './css/style.css', dest: './css/style.css' },
    { src: './js/main.js', dest: './js/main.js' }
  ];
  
  filesToCopy.forEach(file => {
    try {
      if (fs.existsSync(file.src)) {
        const destPath = path.join(distDir, file.dest);
        const destDir = path.dirname(destPath);
        
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        fs.copyFileSync(file.src, destPath);
        console.log(`📄 复制: ${file.src}`);
      }
    } catch (error) {
      console.log(`⚠️ 复制 ${file.src} 失败`);
    }
  });
  
  console.log('\n🎉 构建完成！');
  console.log('📁 优化后的文件在: dist/ 目录');
  console.log('\n下一步:');
  console.log('1. 将 dist 目录内容部署到网站');
  console.log('2. 或直接使用 dist/index.html 替换原文件');
}

// 运行构建
build().catch(console.error);

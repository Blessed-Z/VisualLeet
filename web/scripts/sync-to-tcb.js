const tcb = require('@cloudbase/node-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// 1. 初始化 TCB
const app = tcb.init({
  env: process.env.TCB_ENV_ID,
  secretId: process.env.TENCENTCLOUD_SECRET_ID,
  secretKey: process.env.TENCENTCLOUD_SECRET_KEY
});
const db = app.database();
const col = db.collection('analysis_cache');

const DATA_DIR = path.join(__dirname, '../public/data/hot100');

async function sync() {
  console.log('🚀 开始同步数据到腾讯云 TCB...');
  
  // 读取索引
  const registry = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'registry.json'), 'utf-8'));

  for (const item of registry) {
    const slug = item.slug;
    const probDir = path.join(DATA_DIR, slug);
    
    if (!fs.existsSync(probDir)) continue;

    console.log(`📦 正在处理: ${item.title} (${slug})...`);

    // 定义需要读取的文件映射
    const files = [
      { name: 'notes.md', task: 'explain' },
      { name: 'visualizer.html', task: 'visualize' },
      { name: 'tips.md', task: 'tips' },
      { name: 'fundamentals.md', task: 'fundamentals' }
    ];

    for (const f of files) {
      const filePath = path.join(probDir, f.name);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // 生成唯一的 doc ID: slug_task
        const docId = `${slug}_${f.task}`;
        
        try {
          await col.doc(docId).set({
            slug: slug,
            task: f.task,
            content: content,
            title: item.title,
            source: 'system',
            updated_at: db.serverDate()
          });
          console.log(`   ✅ 已同步: ${f.task}`);
        } catch (e) {
          console.error(`   ❌ 同步失败 [${f.task}]:`, e.message);
        }
      }
    }
  }
  console.log('\n✨ 同步完成！现在你的腾讯云数据库已包含所有内置题目数据。');
}

sync();

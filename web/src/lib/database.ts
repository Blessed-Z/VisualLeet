const tcb = require('@cloudbase/node-sdk');

/**
 * 初始化腾讯云 CloudBase
 * envId: 你的环境 ID
 */
const envId = process.env.TCB_ENV_ID || 'env-0gj9n1ly0bae52b9';

const app = tcb.init({
  env: envId
});

const db = app.database();
const collectionName = 'analysis_cache';

export async function getCachedAnalysis(hash: string, task: string) {
  try {
    // CloudBase 数据库集合查询
    const res = await db.collection(collectionName).doc(hash).get();
    
    if (res.data && res.data.length > 0) {
      const item = res.data[0];
      if (item.task === task) {
        return item.content;
      }
    }
    return null;
  } catch (e) {
    console.warn('CloudBase Cache Query (Non-critical):', e);
    return null;
  }
}

export async function saveAnalysisToCache(hash: string, task: string, content: string) {
  try {
    const col = db.collection(collectionName);
    
    // 使用 doc(hash).set 实现覆盖式写入 (Upsert)
    await col.doc(hash).set({
      task,
      content,
      updated_at: db.serverDate()
    });
  } catch (e) {
    console.error('CloudBase Cache Save Error:', e);
  }
}

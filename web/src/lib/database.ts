const tcb = require('@cloudbase/node-sdk');

/**
 * 初始化腾讯云 CloudBase
 * 增加 SecretId 和 SecretKey 支持
 */
const envId = process.env.TCB_ENV_ID || 'env-0gj9n1ly0bae52b9';
const secretId = process.env.TENCENTCLOUD_SECRET_ID;
const secretKey = process.env.TENCENTCLOUD_SECRET_KEY;

const app = tcb.init({
  env: envId,
  // 如果环境变量中有密钥，则优先使用
  ...(secretId && secretKey ? {
    secretId: secretId,
    secretKey: secretKey
  } : {})
});

const db = app.database();
const collectionName = 'analysis_cache';

export async function getCachedAnalysis(hash: string, task: string) {
  try {
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
    await col.doc(hash).set({
      task,
      content,
      updated_at: db.serverDate()
    });
  } catch (e) {
    console.error('CloudBase Cache Save Error:', e);
  }
}

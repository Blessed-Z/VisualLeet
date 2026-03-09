const tcb = require('@cloudbase/node-sdk');

// 环境变量获取并去除空格 (防止从控制台拷贝时带入多余空格)
const envId = (process.env.TCB_ENV_ID || 'env-0gj9n1ly0bae52b9').trim();
const secretId = (process.env.TENCENTCLOUD_SECRET_ID || '').trim();
const secretKey = (process.env.TENCENTCLOUD_SECRET_KEY || '').trim();

const app = tcb.init({
  env: envId,
  ...(secretId && secretKey ? {
    secretId,
    secretKey
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
        console.log(`[Cache Hit] Successfully loaded cached analysis for hash: ${hash}`);
        return item.content;
      }
    }
    return null;
  } catch (e: any) {
    // 权限或网络错误捕获
    console.warn(`[Cache Query Warning] ${e.message}`);
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
    console.log(`[Cache Saved] Hash: ${hash}`);
  } catch (e: any) {
    console.error(`[Cache Save Error] ${e.message}`);
    // 如果报 Secret ID 错误，检查控制台环境变量是否正确
    if (e.message.includes('secret id error')) {
      console.error('CRITICAL: Please check TENCENTCLOUD_SECRET_ID/KEY in your TCB Environment Variables.');
    }
  }
}

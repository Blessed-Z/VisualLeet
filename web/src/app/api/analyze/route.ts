import { NextResponse } from 'next/server';
import { generateContentStream } from '@/lib/ai';
import { AnalyzeRequest } from '@/types';
import { createHash } from 'crypto';
import { getCachedAnalysis, saveAnalysisToCache } from '@/lib/database';

export async function POST(req: Request) {
  try {
    const body = await req.json() as AnalyzeRequest;
    const { task, problemDescription, userCode, language, userMessage } = body;

    if (!problemDescription && !userCode) {
      return NextResponse.json({ error: '请至少提供题目描述或代码中的一项' }, { status: 400 });
    }

    // 1. 智能生成缓存 Key
    let cacheKeyBase = '';
    
    // 尝试从描述中提取 LeetCode 题目 Slug (例如 'two-sum')
    const slugMatch = problemDescription.match(/problems\/([\w-]+)/);
    if (slugMatch && slugMatch[1]) {
      cacheKeyBase = `slug:${slugMatch[1]}`;
    } else {
      // 如果没有 URL，则对描述进行去空格处理后做 Hash
      cacheKeyBase = `desc:${problemDescription.trim().replace(/\s+/g, ' ')}`;
    }

    // 对于 'fix' 任务，代码内容很重要；对于 'explain' 任务，题目内容更重要
    // 我们根据任务类型决定 Hash 的组成部分
    let inputString = '';
    if (task === 'explain' || task === 'tips' || task === 'complexity') {
      // 只要题目一样，讲解和复杂度通常通用
      inputString = `${cacheKeyBase}-${language}`;
    } else {
      // 代码修正和可视化需要考虑代码的变化
      inputString = `${cacheKeyBase}-${userCode.trim()}-${language}`;
    }

    const hash = createHash('md5').update(inputString).digest('hex');

    // 2. 尝试从后端缓存获取
    const cachedContent = await getCachedAnalysis(hash, task);
    if (cachedContent) {
      // 如果命中缓存，模拟一个流返回，极速体验
      return new Response(cachedContent, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // 3. 构建 Prompt
    const commonInstruction = `
      You are an expert coding assistant for KIDS. 
      You will directly provide the requested content without any introductory or concluding remarks.
      Do NOT wrap the response in markdown code blocks if not requested.
      IMPORTANT: All explanations, comments, and UI text MUST be in Chinese (Simplified).

      Persona: 
      - Target audience is a CHILD (小朋友). Use simple analogies, friendly tone, and clear metaphors.
      - Imagine you are explaining to a 10-year-old.

      Style Guide: 
      - Use Emojis to make content engaging (e.g., 💡 for insights, 🛠️ for steps, 📈 for complexity).
      - For Python code, ALWAYS include detailed Chinese comments using '#' explaining the logic in a fun way.
      - Use standard Markdown (bold, lists, code blocks) for better readability.
    `;

    let prompt = '';

    if (task === 'fix') {
      prompt = `${commonInstruction}\nTask: Fix the code for the given problem.\nProblem: ${problemDescription}\nLanguage: ${language}\nCode:\n${userCode}\n\nResponse format: Give me ONLY the complete fixed code with friendly Chinese '#' comments, followed by a '🌟 小朋友也能听懂的修改建议' at the bottom.`;
    } else if (task === 'explain') {
      prompt = `${commonInstruction}\nTask: Provide a Deep Insight and step-by-step logic explanation for a CHILD.
      Structure:
      # [Problem Title]
      ## 💡 深度解析 (像讲故事一样说明核心策略)
      ## 🛠️ 执行步骤 (每步都要有生动的比喻)
      ## 📈 复杂度分析 (用小朋友能听懂的方式说明快慢)

      Problem: ${problemDescription}\nCode:\n${userCode}`;
    } else if (task === 'visualize') {
      prompt = `${commonInstruction}\nTask: Generate a standalone HTML5 file with CSS and JavaScript to visualize this algorithm for a CHILD.
      Requirements:
      - Dark mode UI (bg: #09090b, text: #fff).
      - EXAMPLE DATA: DO NOT use trivial examples (e.g., arrays shorter than 6 elements). Use a robust, representative example that showcases edge cases or interesting patterns (e.g., duplicates, negatives, or larger values).
      - MANDATORY: Include a 'Status Message' (状态说明) div that explains exactly what is happening in simple Chinese during each step.
      - MANDATORY: Visually represent the internal data structures (e.g., if using a Hash Map, draw a table/grid labeled '记忆口袋' or '哈希表' that updates dynamically).
      - Include Step (下一步), Auto (自动播放), Reset (重置) controls.
      - Make it colorful and use smooth CSS transitions.
      Problem: ${problemDescription}\nCode:\n${userCode}`;
    }
 else if (task === 'tips') {
      prompt = `${commonInstruction}\nTask: Provide a Smart Tip or mnemonic in Chinese for a CHILD.
      Structure:
      # 💡 思路巧记
      ## 🔑 核心口诀 (像儿歌或顺口溜一样)
      ## 🌟 关键点 (1-2个最重要的知识点)

      Problem: ${problemDescription}\nCode:\n${userCode}`;
    } else if (task === 'fundamentals') {
      prompt = `${commonInstruction}\nTask: Provide Foundational Knowledge and a Variable Dictionary for a CHILD.
      Structure:
      # 📖 基础百科: [Relevant Data Structure/Algorithm Name]
      ## 💡 核心概念 (Use a simple analogy like a magic bag, a train, etc.)
      ## 📋 变量小字典 (Explain what each variable in the code represents, e.g., 'ans' is the answer box, 'dic' is the memory pocket)
      ## 📈 为什么学这个? (Explain the practical benefit in a fun way)

      Problem: ${problemDescription}\nCode:\n${userCode}`;
    } else if (task === 'complexity') {

      prompt = `${commonInstruction}\nTask: Analyze Time and Space Complexity in Chinese using '📈 复杂度分析' as header.
      Problem: ${problemDescription}\nCode:\n${userCode}`;
    } else if (task === 'chat') {
      const historyText = body.chatHistory 
        ? body.chatHistory.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
        : '';
      prompt = `${commonInstruction}\nTask: You are '助手' (Assistant). Help the user with their coding questions. Be encouraging.
      Problem: ${problemDescription}\nCode: ${userCode}\n
      --- Conversation History ---
      ${historyText}
      --- Current Question ---
      User: ${userMessage}`;
    }

    // 4. 调用 AI 流式生成
    const aiStream = await generateContentStream(prompt);

    // 5. 处理流：一边返回给前端，一边收集完整内容存入缓存
    const [clientStream, cacheStream] = aiStream.tee();
    
    // 异步保存到缓存，不阻塞客户端响应
    (async () => {
      const reader = cacheStream.getReader();
      let fullContent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += new TextDecoder().decode(value);
      }
      if (fullContent) {
        await saveAnalysisToCache(hash, task, fullContent);
      }
    })();

    return new Response(clientStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Accel-Buffering': 'no', // 禁用 Nginx 缓冲
      },
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

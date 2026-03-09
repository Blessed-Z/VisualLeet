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

    // 1. 生成唯一 Hash，作为缓存 Key
    // 我们综合考虑题目、代码和语言
    const inputString = `${problemDescription}-${userCode}-${language}-${userMessage || ''}`;
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
      You are an expert coding assistant. 
      You will directly provide the requested content without any introductory or concluding remarks.
      Do NOT wrap the response in markdown code blocks if not requested.
      IMPORTANT: All explanations, comments, and UI text MUST be in Chinese (Simplified).
    `;

    let prompt = '';
    
    if (task === 'fix') {
      prompt = `${commonInstruction}\nTask: Fix the code for the given problem.\nProblem: ${problemDescription}\nLanguage: ${language}\nCode:\n${userCode}\n\nResponse format: Give me ONLY the complete fixed code followed by a brief Chinese explanation as a comment at the bottom.`;
    } else if (task === 'explain') {
      prompt = `${commonInstruction}\nTask: Explain the code logic step-by-step in Markdown (Chinese).\nProblem: ${problemDescription}\nCode:\n${userCode}`;
    } else if (task === 'visualize') {
      prompt = `${commonInstruction}\nTask: Generate a standalone HTML5 file with CSS and JavaScript to visualize this algorithm.\nBe self-contained, use <style> and <script>. All UI text must be in Chinese. Include Step, Auto, Reset controls.\nProblem: ${problemDescription}\nCode:\n${userCode}`;
    } else if (task === 'tips') {
      prompt = `${commonInstruction}\nTask: Provide a Smart Tip or mnemonic in Chinese.\nProblem: ${problemDescription}\nCode:\n${userCode}`;
    } else if (task === 'complexity') {
      prompt = `${commonInstruction}\nTask: Analyze Time and Space Complexity in Chinese.\nProblem: ${problemDescription}\nCode:\n${userCode}`;
    } else if (task === 'chat') {
      prompt = `${commonInstruction}\nTask: Chat with the user about their code/problem. Be helpful and encouraging.\nProblem: ${problemDescription}\nCode: ${userCode}\nQuestion: ${userMessage}`;
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

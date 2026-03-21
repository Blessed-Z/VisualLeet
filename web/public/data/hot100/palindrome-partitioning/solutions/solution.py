from typing import List

class Solution:
    def partition(self, s: str) -> List[List[str]]:
        n = len(s)
        # 结果大箱子
        ans = []
        # 当前正在切的路径（餐盘）
        path = []
        
        def dfs(i):
            # 1. 终止条件：如果 i 走到了字符串末尾
            # 说明整根香肠都完美切成回文段了
            if i == n:
                # 拍张照片存进箱子
                ans.append(path.copy())
                return
            
            # 2. 尝试从 i 开始，在不同的位置 j 切一刀
            for j in range(i, n):
                # 切下来的这一段
                t = s[i:j+1]
                
                # 💡 核心检查：如果切下来的这一段是回文
                if t == t[::-1]:
                    # 放入餐盘
                    path.append(t)
                    # 带着剩下的香肠（从 j+1 开始）继续切
                    dfs(j+1)
                    # 撤销选择：换个地方切（回溯）
                    path.pop()
        
        # 从头开始切
        dfs(0)
        return ans

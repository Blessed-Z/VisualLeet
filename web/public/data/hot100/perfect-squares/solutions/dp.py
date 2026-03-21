from typing import List

class Solution:
    def numSquares(self, n: int) -> int:
        """
        利用动态规划，寻找组成数字 n 所需的完全平方数的最少数量。
        """
        # 1. 创建一个省力记账本（dp 数组）
        # 初始化为无穷大，因为我们要找最小值
        dp = [float('inf')] * (n + 1)
        # 基础记忆：和为 0 只需要 0 个平方数
        dp[0] = 0
        
        # 2. 准备积木箱子：列出所有小于等于 n 的完全平方数
        # 比如 1, 4, 9, 16...
        square = [i * i for i in range(1, int(n**0.5) + 1)]
        
        # 3. 按照规律计算：从 1 到 n
        for i in range(1, n + 1):
            # 4. 神奇的尝试：尝试箱子里的每一种平方数积木
            for s in square:
                # 如果这块积木比我们要拼的高度还大，就跳过
                if i < s:
                    break
                # 决策：
                # 当前 i 的最优解 = min(已有的方案, 减去这块积木 s 之后剩余高度的最优解 + 1)
                if dp[i - s] + 1 < dp[i]:
                    dp[i] = dp[i - s] + 1
                    
        # 5. 返回记账本最后一页的答案
        return dp[n]

from typing import List

class Solution:
    def climbStairs(self, n: int) -> int:
        """
        利用动态规划，通过维护一个数组来计算爬到第 n 级台阶的方法数。
        """
        # 如果台阶数小于等于 1，方法数直接就是 1
        if n <= 1:
            return 1
            
        # 1. 创建一个超级记账本（dp 数组）
        # dp[i] 代表爬到第 i 级台阶的方法总数
        dp = [0 for _ in range(n + 1)]
        
        # 2. 填写基础知识：第 0 级和第 1 级的方法数
        dp[0] = 1
        dp[1] = 1
        
        # 3. 按照规律计算：从第 2 级开始直到第 n 级
        # 规律：到达第 i 级的方法 = 到达 (i-1) 级的方法 + 到达 (i-2) 级的方法
        for i in range(2, n + 1):
            dp[i] = dp[i-1] + dp[i-2]
            
        # 4. 返回记账本最后一页的答案
        return dp[n]

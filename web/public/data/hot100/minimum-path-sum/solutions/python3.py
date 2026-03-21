from typing import List

class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        """
        计算从左上角到右下角的最小路径和。
        使用动态规划，时间复杂度 O(m * n)，空间复杂度 O(m * n)。
        """
        if not grid or not grid[0]:
            return 0
            
        rows = len(grid)
        cols = len(grid[0])
        
        # 创建一个和 grid 同样大小的 dp 数组
        dp = [[0 for _ in range(cols)] for _ in range(rows)]
        
        # 初始位置：起点位置的最小路径和就是它本身
        dp[0][0] = grid[0][0]
        
        # 初始化第一列：每一格只能从上面那一格走下来
        for i in range(1, rows):
            dp[i][0] = dp[i-1][0] + grid[i][0]
            
        # 初始化第一行：每一格只能从左边那一格走过来
        for j in range(1, cols):
            dp[0][j] = dp[0][j-1] + grid[0][j]
            
        # 遍历网格中间的所有格子
        for i in range(1, rows):
            for j in range(1, cols):
                # 到达当前格子的最小路径和 =
                # 从上面或左边两个格子中选一个更小的路径和 + 当前格子的值
                dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
                
        # 返回右下角格子的值，即为最小路径总和
        return dp[rows-1][cols-1]

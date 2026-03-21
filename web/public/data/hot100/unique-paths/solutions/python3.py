class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        """
        计算从左上角到右下角的不同路径数。
        使用动态规划，时间复杂度 O(m * n)，空间复杂度 O(m * n)。
        """
        # 创建一个 m x n 的二维数组来存储每个格子的路径数
        # 初始化为 0
        dp = [[0 for _ in range(n)] for _ in range(m)]
        
        # 边界初始化：第一列的所有格子路径数都是 1
        # 因为在第一列，机器人只能一直向下走，没有别的选择
        for i in range(m):
            dp[i][0] = 1
            
        # 边界初始化：第一行的所有格子路径数都是 1
        # 因为在第一行，机器人只能一直向右走，没有别的选择
        for j in range(n):
            dp[0][j] = 1
            
        # 从 (1, 1) 开始遍历剩余的格子
        for i in range(1, m):
            for j in range(1, n):
                # 到达当前格子 (i, j) 的路径数
                # 等于从上面过来的路径数 + 从左面过来的路径数
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
                
        # 返回右下角格子的值，即为总路径数
        return dp[m-1][n-1]

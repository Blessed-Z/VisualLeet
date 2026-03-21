class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        """
        计算将 word1 转换为 word2 所需的最少操作数。
        使用动态规划，时间复杂度 O(m * n)，空间复杂度 O(m * n)。
        """
        # 获取两个字符串的长度
        size1 = len(word1)
        size2 = len(word2)
        
        # 创建一个 (size1 + 1) x (size2 + 1) 的二维数组 dp
        # dp[i][j] 表示 word1 的前 i 个字符变成 word2 的前 j 个字符所需的最少操作数
        dp = [[0 for _ in range(size2 + 1)] for _ in range(size1 + 1)]
        
        # 初始化第一列：从 word1 的前 i 个字符变为空串需要 i 次删除操作
        for i in range(size1 + 1):
            dp[i][0] = i
            
        # 初始化第一行：从空串变为 word2 的前 j 个字符需要 j 次插入操作
        for j in range(size2 + 1):
            dp[0][j] = j
            
        # 遍历两个字符串的所有子串长度组合
        for i in range(1, size1 + 1):
            for j in range(1, size2 + 1):
                # 如果当前两个字符相等，说明不需要任何操作
                # 费用等于之前去掉这两个字母时的费用
                if word1[i-1] == word2[j-1]:
                    dp[i][j] = dp[i-1][j-1]
                else:
                    # 如果不相等，从三种操作中选出费用最少的那个
                    # 1. dp[i-1][j-1] + 1: 替换操作
                    # 2. dp[i-1][j] + 1: 删除操作 (删除 word1 的第 i 个字符)
                    # 3. dp[i][j-1] + 1: 插入操作 (在 word1 后面插入 word2 的第 j 个字符)
                    dp[i][j] = min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) + 1
                    
        # 返回最终转换的最少操作数
        return dp[size1][size2]

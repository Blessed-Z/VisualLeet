class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        """
        寻找两个字符串的最长公共子序列长度。
        使用动态规划，时间复杂度 O(m * n)，空间复杂度 O(m * n)。
        """
        # 获取两个字符串的长度
        size1 = len(text1)
        size2 = len(text2)
        
        # 创建一个 (size1 + 1) x (size2 + 1) 的二维数组 dp
        # 初始化为 0，因为当其中一个字符串为空时，公共子序列长度为 0
        dp = [[0 for _ in range(size2 + 1)] for _ in range(size1 + 1)]
        
        # 遍历 text1 的每个字符（从 1 到 size1）
        for i in range(1, size1 + 1):
            # 遍历 text2 的每个字符（从 1 到 size2）
            for j in range(1, size2 + 1):
                # 如果当前两个字符相等
                # 注意：由于 dp 数组的下标是从 1 开始的，所以对应的 text 字符下标要减 1
                if text1[i-1] == text2[j-1]:
                    # 在去掉这两个字符之前的最长公共子序列基础上加 1
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    # 如果字符不相等，则尝试去掉其中一个字符，看哪边剩下的部分公共子序列更长
                    # dp[i-1][j] 表示去掉 text1 当前字符后的结果
                    # dp[i][j-1] 表示去掉 text2 当前字符后的结果
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
                    
        # 返回右下角的值，即为最终的最长公共子序列长度
        return dp[size1][size2]

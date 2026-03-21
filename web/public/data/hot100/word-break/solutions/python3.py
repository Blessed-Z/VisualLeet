from typing import List

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        """
        判断字符串 s 是否可以由字典 wordDict 中的单词拼凑而成。
        使用动态规划，时间复杂度 O(n^2)，空间复杂度 O(n)。
        """
        n = len(s)
        # 把列表转换成集合 (set)，查找单词的时间复杂度从 O(m) 降到 O(1)
        word_set = set(wordDict)
        
        # dp[i] 表示字符串 s 的前 i 个字符是否可以拆分成字典中的单词
        # 初始化长度为 n+1，因为要表示 0 到 n 个字符的状态
        dp = [False] * (n + 1)
        
        # 初始状态：空字符串当然可以被“拆分”（即什么都不选）
        dp[0] = True
        
        # 遍历字符串的所有位置作为终点 i
        for i in range(1, n + 1):
            # 遍历从 0 到 i 的所有位置作为分割点 j
            for j in range(i):
                # 如果前 j 个字符能拼成 (dp[j] 为 True)
                # 且剩下的部分 s[j:i] 也在字典里
                if dp[j] and (s[j:i] in word_set):
                    # 那么前 i 个字符就能拼成啦！
                    dp[i] = True
                    # 只要找到一种方案，就可以跳出内层循环，看下一个 i 了
                    break
                    
        # 返回整个字符串是否能拼成的结果
        return dp[n]

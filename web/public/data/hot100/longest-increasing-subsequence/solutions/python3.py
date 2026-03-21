from typing import List

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        """
        寻找数组中的最长严格递增子序列。
        使用动态规划，时间复杂度 O(n^2)，空间复杂度 O(n)。
        """
        if not nums:
            return 0
            
        size = len(nums)
        # dp[i] 表示以 nums[i] 结尾的最长递增子序列的长度
        # 初始时，每个元素自身都可以看作是一个长度为 1 的递增子序列
        dp = [1] * size
        
        # 遍历每一个元素 i
        for i in range(size):
            # 遍历 i 之前的所有元素 j
            for j in range(i):
                # 如果 nums[i] 大于 nums[j]，说明 nums[i] 可以接在以 nums[j] 结尾的序列后面
                if nums[i] > nums[j]:
                    # 尝试更新 dp[i]，取原有的 dp[i] 和 (dp[j] + 1) 的最大值
                    dp[i] = max(dp[i], dp[j] + 1)
                    
        # 最终的答案是整个 dp 数组中的最大值（因为最长子序列可能以数组中的任何一个元素结尾）
        return max(dp)

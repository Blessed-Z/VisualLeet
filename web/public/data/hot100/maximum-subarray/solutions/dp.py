class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        size = len(nums)
        # dp 数组，dp[i] 表示以第 i 个数结尾的最大连续子数组和
        dp = [0 for _ in range(size)]
        
        # 初始情况：第一个数的最大和就是它自己
        dp[0] = nums[0]
        
        for i in range(1, size):
            # 关键决策点：
            # 如果之前的“能量”是负的（dp[i-1] < 0）
            # 它只会拖累当前的数字，所以我们果断抛弃它，从当前的 nums[i] 重新开始
            if dp[i-1] < 0:
                dp[i] = nums[i]
            # 如果之前的“能量”是正的，我们就把它吸纳过来，加上当前的数字
            else:
                dp[i] = dp[i-1] + nums[i]
        
        # 最后，所有结尾情况中最大的那个，就是全局最优答案
        return max(dp)

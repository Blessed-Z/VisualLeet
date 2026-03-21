from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        """
        利用动态规划，寻找不触发警报（不偷相邻房）的情况下的最高偷窃金额。
        """
        # 如果没有房子，自然偷不到钱
        if not nums:
            return 0
            
        size = len(nums)
        # 1. 创建一个决策记账本（dp 数组）
        # dp[i] 代表走到第 i 间房子时能偷到的最高金额
        dp = [0 for _ in range(size + 1)]
        
        # 2. 填写基础知识：
        # 第 0 间（没开始）是 0 元
        dp[0] = 0
        # 第 1 间只能偷这一间，金额是 nums[0]
        dp[1] = nums[0]
        
        # 3. 按照规律计算：从第 2 间开始直到最后一间
        for i in range(2, size + 1):
            # 魔法抉择：
            # 选项 A：不偷这间，那金额就跟走到“前一间”时的最高金额一样：dp[i-1]
            # 选项 B：偷这间，那前一间就不能偷，金额 = “前前一间”的最高金额 + 今天的钱：dp[i-2] + nums[i-1]
            # 取 A 和 B 中的最大值
            dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])
            
        # 4. 返回记账本最后一页的答案
        return dp[size]

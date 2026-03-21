from typing import List

class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        """
        找出乘积最大的连续子数组。
        使用动态规划，空间优化至 O(1)，时间复杂度 O(n)。
        """
        if not nums:
            return 0
            
        size = len(nums)
        # max_num 记录以当前元素结尾的最大乘积
        max_num = nums[0]
        # min_num 记录以当前元素结尾的最小乘积（负数翻盘的关键）
        min_num = nums[0]
        # ans 记录全局出现过的最大值
        ans = nums[0]
        
        for i in range(1, size):
            # 因为 max_num 在更新过程中会被修改，所以要先存一下
            temp_max = max_num
            temp_min = min_num
            
            # 核心转移方程：
            # 新的最大值可能是：
            # 1. 之前最大值乘以当前数
            # 2. 当前数自己（从头开始）
            # 3. 之前最小值乘以当前数（负负得正）
            max_num = max(temp_max * nums[i], nums[i], temp_min * nums[i])
            
            # 同理更新最小值
            min_num = min(temp_min * nums[i], nums[i], temp_max * nums[i])
            
            # 更新全局最大值
            ans = max(ans, max_num)
            
        return ans

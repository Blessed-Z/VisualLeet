from typing import List

class Solution:
    def canJump(self, nums: List[int]) -> bool:
        """
        利用贪心算法，实时维护当前能够跳到的最远覆盖范围。
        """
        # 初始化当前能到达的最远下标
        max_i = 0
        
        # 遍历数组中的每一个点
        for i, num in enumerate(nums):
            # 1. 只有当目前的最远覆盖范围能够到达当前点 i 时，我们才能继续跳
            if max_i >= i:
                # 2. 如果从当前点 i 跳跃后的距离超过了之前的最远距离
                if i + num > max_i:
                    # 更新最远覆盖范围
                    max_i = i + num
            
            # (可选) 如果最远距离已经覆盖了最后一个下标，可以提前结束
            if max_i >= len(nums) - 1:
                return True
                
        # 3. 最后看看能不能跳到或超过最后一个下标
        # 用户代码中是 max_i >= i，在循环结束后 i 是最后一个索引，逻辑也是通的
        return max_i >= len(nums) - 1

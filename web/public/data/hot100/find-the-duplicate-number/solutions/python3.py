from typing import List

class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        """
        在包含 n+1 个整数且范围为 [1, n] 的数组中寻找重复数。
        使用快慢指针法（Floyd's Cycle-Finding Algorithm）。
        时间复杂度 O(n)，空间复杂度 O(1)。
        """
        
        # 第一阶段：寻找快慢指针在环中的相遇点
        # 初始时，slow 走一步，fast 走两步
        slow = nums[0]
        fast = nums[nums[0]]
        
        # 只要没相遇，就一直走
        while slow != fast:
            slow = nums[slow]          # 乌龟走一步
            fast = nums[nums[fast]]    # 兔子走二步
            
        # 第二阶段：寻找环的入口（即重复数）
        # 将 slow 重新放回起点，fast 保持在相遇点
        slow = 0
        
        # 两人同步前进，每次各走一步
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
            
        # 再次相遇点即为重复数字
        return slow

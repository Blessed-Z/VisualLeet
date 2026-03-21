from typing import List

class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        """
        判断是否可以将数组分割成两个和相等的子集。
        使用位运算优化（Bitset），这是 Python 中效率最高的解法。
        时间复杂度 O(n)，但在内部处理上极快；空间复杂度 O(target)。
        """
        total = sum(nums)
        
        # 如果总和是奇数，肯定不能平分
        if total % 2 != 0:
            return False
            
        target = total // 2
        
        # bits 是一个位集（在 Python 中就是一个大整数）
        # 第 k 位为 1 代表重量 k 可以被凑出来
        # 初始时 bits = 1 (二进制 0...001)，代表重量 0 可以凑出来
        bits = 1
        
        for x in nums:
            # bits << x 相当于所有已有的重量都加上 x
            # 然后与原来的 bits 进行“或”运算，合并新老状态
            bits |= bits << x
            
            # (可选) 如果已经凑出了 target，可以直接提前退出
            # if (bits >> target) & 1: return True
            
        # 最后看第 target 位是否为 1
        # 即 bits 右移 target 位后，最后一位是否为 1
        return bool((bits >> target) & 1)

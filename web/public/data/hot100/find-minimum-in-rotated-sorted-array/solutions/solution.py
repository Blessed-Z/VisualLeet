from typing import List

class Solution:
    def findMin(self, nums: List[int]) -> int:
        # 1. 初始化左右边界
        left = 0
        right = len(nums) - 1
        
        # 2. 循环直到左右重合
        # 💡 使用 left < right 而不是 left <= right，是为了最后返回 nums[left]
        while left < right:
            # 取中心点
            mid = left + (right - left) // 2
            
            # 3. 核心：和右边界 nums[right] 进行比较
            # 如果中点值大于右边界值，说明“断点”（也就是最小值）一定在 mid 的右边
            if nums[mid] > nums[right]:
                # 最小值在右侧区域，由于 mid 已经比 right 大了，mid 肯定不是最小值
                left = mid + 1
            # 否则，中点值小于或等于右边界值
            else:
                # 说明从 mid 到 right 是一段单调递增的区域
                # 那么最小值要么是 mid 这里的转折点，要么在 mid 的左边
                # 所以我们收缩右边界到 mid，但不能跳过 mid
                right = mid
                
        # 4. 当 left == right 时，我们就找到了全场最小的“谷底”
        return nums[left]

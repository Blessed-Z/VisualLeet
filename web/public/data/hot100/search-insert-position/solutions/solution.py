from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        # 1. 初始化左右边界
        # 使用左闭右开区间 [left, right)，因为 target 可以在索引 len(nums) 处插入
        left, right = 0, len(nums)
        
        # 2. 当左边界小于右边界时，持续进行对折查找
        while left < right:
            # 找到当前区间的中心点 mid
            mid = left + (right - left) // 2
            
            # 3. 如果中间的值比目标值小
            if nums[mid] < target:
                # 说明插入位置一定在 mid 的右侧，缩小左边界
                # 这里使用 mid + 1 是因为 mid 已经比 target 小了，肯定不是插入点
                left = mid + 1
            else:
                # 否则，中间的值大于或等于目标值
                # 说明插入位置可能就在 mid，或者在 mid 的左侧，缩小右边界
                right = mid
                
        # 4. 当 left 和 right 相遇时，这就是我们要找的插入位置
        return left

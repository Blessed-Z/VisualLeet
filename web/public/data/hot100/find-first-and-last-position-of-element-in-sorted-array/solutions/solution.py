from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        # 定义一个内部辅助函数，用来寻找左边界或右边界
        def findBound(isFirst):
            left, right = 0, len(nums) - 1
            res = -1
            # 标准的二分查找循环
            while left <= right:
                mid = (left + right) // 2
                
                if nums[mid] < target:
                    # 如果中间值小了，说明边界一定在右边
                    left = mid + 1
                elif nums[mid] > target:
                    # 如果中间值大了，说明边界一定在左边
                    right = mid - 1
                else:
                    # 💡 核心逻辑：找到了目标值！
                    # 先把当前这个位置记录在小本本上
                    res = mid
                    if isFirst:
                        # 如果是找第一个（左边界），就继续往左边挤压
                        right = mid - 1
                    else:
                        # 如果是找最后一个（右边界），就继续往右边挤压
                        left = mid + 1
            return res
            
        # 分别调用两次查找，一次找头，一次找尾
        return [findBound(True), findBound(False)]

from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        # 1. 初始化左右边界
        left = 0
        right = len(nums) - 1
        
        # 2. 标准二分循环
        while left <= right:
            # 计算中点
            # 💡 注意：原代码中有个 (right-left)//1，应该是 //2
            mid = left + (right - left) // 2
            
            # 找到目标，直接返回
            if nums[mid] == target:
                return mid
            
            # 3. 核心逻辑：判断哪一半是有序的
            # 如果左边界值小于等于中点值，说明左半段 [left, mid] 是升序的
            if nums[left] <= nums[mid]:
                # 判断 target 是否在左半段的范围内
                if nums[left] <= target < nums[mid]:
                    # 在范围内，收缩右边界
                    right = mid - 1
                else:
                    # 不在范围内，肯定在右半段（虽然右半段可能包含旋转点）
                    left = mid + 1
            # 否则，说明右半段 [mid, right] 一定是有序的
            else:
                # 判断 target 是否在右半段的范围内
                if nums[mid] < target <= nums[right]:
                    # 在范围内，收缩左边界
                    left = mid + 1
                else:
                    # 不在范围内，回左半段找
                    right = mid - 1
                    
        # 4. 循环结束还没找到，说明不存在
        return -1

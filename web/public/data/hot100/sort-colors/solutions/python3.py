from typing import List

class Solution:
    def sortColors(self, nums: List[int]) -> None:
        """
        原地对数组进行排序，使得相同颜色的元素相邻，并按红(0)、白(1)、蓝(2)顺序排列。
        使用三指针法（荷兰国旗问题）。
        时间复杂度 O(n)，空间复杂度 O(1)。
        """
        
        # p0 是 0 的右边界（下一个 0 该放的位置）
        p0 = 0
        # p2 是 2 的左边界（下一个 2 该放的位置）
        p2 = len(nums) - 1
        # curr 是当前正在遍历的指针
        curr = 0
        
        # 只要遍历指针没撞上右边的蓝色边界，就继续
        while curr <= p2:
            if nums[curr] == 0:
                # 发现红色，换到左边
                nums[p0], nums[curr] = nums[curr], nums[p0]
                p0 += 1
                curr += 1
            elif nums[curr] == 2:
                # 发现蓝色，换到右边
                nums[p2], nums[curr] = nums[curr], nums[p2]
                # 换回来一个未知的数，可能还要换，所以 curr 不动
                p2 -= 1
            else:
                # 发现白色，不管它，直接看下一个
                curr += 1

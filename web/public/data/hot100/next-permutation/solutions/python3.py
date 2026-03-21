from typing import List

class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        """
        寻找数组的下一个字典序更大的排列。
        使用两遍扫描法，时间复杂度 O(n)，空间复杂度 O(1)。
        Do not return anything, modify nums in-place instead.
        """
        n = len(nums)
        # 第一步：从后往前找第一个“下降点” i
        # 使得 nums[i] < nums[i+1]
        i = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
            
        # 如果找到了下降点（i >= 0）
        # 如果没找到，说明数组是完全降序的，跳过交换步骤直接反转
        if i >= 0:
            # 第二步：在 i 的右侧找一个比 nums[i] 大的“最小数” j
            # 由于 i 右侧是降序的，从后往前找第一个大于 nums[i] 的数即可
            j = n - 1
            while j >= 0 and nums[j] <= nums[i]:
                j -= 1
            # 交换 i 和 j
            nums[i], nums[j] = nums[j], nums[i]
            
        # 第三步：将 i 之后的部分进行反转
        # 反转后，这一部分会从“降序”变成“升序”，从而使整体变大的幅度最小
        left, right = i + 1, n - 1
        while left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1

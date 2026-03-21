class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        # j 是“慢指针”，它就像一个“待填充位置”的标记
        # 指向当前第一个可以放“非零好朋友”的位置
        j = 0
        
        # i 是“快指针”，它跑得飞快，负责在前面扫视
        for i in range(len(nums)):
            # 如果快指针发现了一个“非零好朋友”
            if nums[i] != 0:
                # 关键一步：把好朋友和慢指针位置的东西交换一下
                # 这样非零数就跑到前面去了，零就被甩到了后面
                nums[j], nums[i] = nums[i], nums[j]
                
                # 慢指针往后移一步，等待下一个非零好朋友
                j += 1

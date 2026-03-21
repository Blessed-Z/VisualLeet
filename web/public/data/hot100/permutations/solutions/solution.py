from typing import List

class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        # 结果大箱子
        res = []
        # 当前正在排队的路径
        path = []
        
        def backtracking(nums):
            # 1. 终止条件：当路径长度等于原数组长度，说明所有人都在队里了
            if len(path) == len(nums):
                # 拍一张快照存入大箱子
                res.append(path[:])
                return
            
            # 2. 遍历每一个可选的小朋友
            for i in range(len(nums)):
                # 核心：如果这个小朋友还没在队里
                if nums[i] not in path:
                    # 让他入队
                    path.append(nums[i])
                    # 让他后面的人继续排
                    backtracking(nums)
                    # 拍完照出来，给别的小朋友腾位置（回溯）
                    path.pop()
        
        # 从头开始排
        backtracking(nums)
        return res

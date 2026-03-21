from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        res = []
        path = []
        
        def backtracking(nums, index):
            # 1. 步步皆子集：每一层递归的当前状态都是一个有效的子集
            # 即使是刚开始的空集 [] 也会被存进去
            res.append(path[:])
            
            # 2. 终止条件：如果已经看完了所有的水果
            if index >= len(nums):
                return
            
            # 3. 从 index 开始往后挑，保证不选回头路
            for i in range(index, len(nums)):
                # 把当前水果放进篮子
                path.append(nums[i])
                # 继续看后面的水果（不能再看自己了，所以是 i+1）
                backtracking(nums, i + 1)
                # 拿出来，试试不放这个水果的情况（回溯）
                path.pop()
        
        # 从第 0 个数字开始挑选
        backtracking(nums, 0)
        return res

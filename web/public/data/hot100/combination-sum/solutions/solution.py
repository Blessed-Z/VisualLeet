from typing import List

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        res = []
        path = []
        
        def backtrace(total, start_index):
            # 1. 终止条件：正好凑够了
            if total == target:
                res.append(path[:])
                return
            
            # 2. 遍历每一个候选硬币
            for i in range(start_index, len(candidates)):
                # 💡 剪枝优化：
                # 如果加上当前硬币已经超标了，那后面更大的硬币肯定也超标
                # 直接跳出循环（前提是数组已排序）
                if total + candidates[i] > target:
                    break
                
                # 做出选择：把硬币投进篮子
                total += candidates[i]
                path.append(candidates[i])
                
                # 递归：核心！传入 i 而不是 i+1，因为硬币可以重复使用
                backtrace(total, i)
                
                # 撤销选择：拿出来，试试别的硬币（回溯）
                total -= candidates[i]
                path.pop()
        
        # 先排序，这是为了能进行“剪枝”优化，极大提高速度
        candidates.sort()
        backtrace(0, 0)
        return res

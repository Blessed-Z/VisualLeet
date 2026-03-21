from typing import List

class Solution:
    def jump(self, nums: List[int]) -> int:
        """
        利用贪心思想，通过维护两级边界来寻找最少的跳跃次数。
        """
        # ans 记录跳跃次数
        ans = 0
        # cur_right 记录当前这一跳最远能到哪里
        cur_right = 0
        # nex_right 记录在当前这一跳范围内，如果再跳一步最远能到哪里
        nex_right = 0
        
        # 我们只需遍历到倒数第二个元素
        # 因为如果 i 已经到达了 len(nums)-1，说明已经在终点，不需要再跳了
        for i in range(len(nums) - 1):
            # 1. 在当前可达范围内，每一块砖都尝试看作下一跳的起跳点，更新下一次能跳的最远距离
            if nums[i] + i > nex_right:
                nex_right = nums[i] + i
            
            # 2. 当我们走到当前这一跳的边界 cur_right 时
            if i == cur_right:
                # 我们必须在此之前选好一个点跳出去了！
                # 将边界更新为刚才我们探测到的最远位置 nex_right
                cur_right = nex_right
                # 跳跃次数加 1
                ans += 1
                
        # 3. 返回最终的跳跃次数
        return ans

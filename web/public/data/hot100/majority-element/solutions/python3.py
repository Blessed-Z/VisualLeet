from typing import List

class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        """
        找出数组中的多数元素（出现次数大于 n/2）。
        使用摩尔投票法 (Boyer-Moore Voting Algorithm)。
        时间复杂度 O(n)，空间复杂度 O(1)。
        """
        
        # ans 记录当前的候选人
        ans = 0
        # cnt 记录候选人的“净票数”
        cnt = 0
        
        for x in nums:
            # 如果净票数为 0，说明之前的候选人已经被完全抵消了
            # 我们重新选一个新的候选人，即当前的数字 x
            if cnt == 0:
                ans = x
            
            # 如果当前数字和候选人一样，支持票加 1
            if ans == x:
                cnt += 1
            # 如果不一样，反对票（抵消票）加 1，也就是净票数减 1
            else:
                cnt -= 1
                
        # 由于多数元素出现次数大于 n/2，最终活下来的候选人一定是多数元素
        return ans

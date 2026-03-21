from typing import List
from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        """
        利用桶排序思想，在 O(n) 时间内找到前 k 个高频元素。
        """
        # 1. 统计每个数字出现的次数（魔法记录本）
        cnt = Counter(nums)
        
        # 2. 找到最高出现次数，用来确定桶的范围
        max_cnt = max(cnt.values())
        
        # 3. 创建桶（分层货架），索引是出现次数，值是该次数下的数字列表
        # 桶的大小为 max_cnt + 1
        buckets = [[] for _ in range(max_cnt + 1)]
        for x, c in cnt.items():
            buckets[c].append(x)
            
        # 4. 从后往前遍历桶（从最高频开始领奖）
        ans = []
        for bucket in reversed(buckets):
            # 把当前频率桶里的所有数字都加到结果中
            ans += bucket
            # 如果我们已经拿够了 k 个数字，就可以提前收工了！
            if len(ans) >= k:
                # 注意：如果桶里数字多，可能刚好超过 k，切片返回前 k 个
                return ans[:k]
                
        return ans

import heapq

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        size = len(nums)
        # Python 的 heapq 默认是小顶堆
        # 为了实现大顶堆，我们将数字取负数存储：(-nums[i], i)
        # 这样堆顶就是最小的负数，也就是最大的原数
        q = [(-nums[i], i) for i in range(k)]
        heapq.heapify(q)
        
        # 记录第一个窗口的最大值（堆顶元素的第一个值取反）
        res = [-q[0][0]]
        
        # 窗口开始向右滑动
        for i in range(k, size):
            # 将新进入窗口的元素入堆
            heapq.heappush(q, (-nums[i], i))
            
            # 关键步骤：清理“过时”的堆顶
            # 如果堆顶元素在数组中的索引已经不在当前窗口内了（索引 <= i - k）
            # 就把它弹出来，直到堆顶是窗口内的元素为止
            while q[0][1] <= i - k:
                heapq.heappop(q)
            
            # 现在的堆顶就是当前窗口最大的那个“英雄”
            res.append(-q[0][0])
            
        return res

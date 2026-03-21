import heapq

class MedianFinder:
    """
    使用双堆平衡法，在 O(log n) 时间内添加数字，O(1) 时间内查找中位数。
    """

    def __init__(self):
        # self.left 是大顶堆，存储较小的一半数字（Python 使用负值模拟大顶堆）
        self.left = []
        # self.right 是小顶堆，存储较大的一半数字
        self.right = []

    def addNum(self, num: int) -> None:
        """
        向数据流中添加一个整数。
        """
        # 为了平衡，我们始终保持：len(left) >= len(right)
        if len(self.left) == len(self.right):
            # 如果两个堆一样多，先过一遍右边（小顶堆），再把弹出的最小者压入左边（大顶堆）
            # 这样保证了 left 里的元素始终比 right 里的更小
            heapq.heappush(self.left, -heapq.heappushpop(self.right, num))
        else:
            # 如果左边比右边多一个，先过一遍左边，再把弹出的最大者压入右边
            heapq.heappush(self.right, -heapq.heappushpop(self.left, -num))

    def findMedian(self) -> float:
        """
        返回目前所有元素的中位数。
        """
        if len(self.left) > len(self.right):
            # 奇数个元素，中位数在左边大顶堆的堆顶
            return float(-self.left[0])
        else:
            # 偶数个元素，取左右两堆堆顶的平均值
            return (self.right[0] - self.left[0]) / 2.0

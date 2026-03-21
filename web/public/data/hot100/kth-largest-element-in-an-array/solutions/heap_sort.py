from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        """
        利用大顶堆找到数组中第 k 个最大的元素。
        """
        
        def heapify(nums, index, end):
            """
            维护大顶堆的性质：将 index 位置的元素下沉到正确位置。
            """
            left = index * 2 + 1   # 左孩子的索引
            right = left + 1       # 右孩子的索引
            
            while left <= end:
                max_index = index
                
                # 如果左孩子比当前大，更新最强勇士的索引
                if nums[left] > nums[max_index]:
                    max_index = left
                    
                # 如果右孩子在边界内，且比当前最强勇士还大，更新它
                if right <= end and nums[right] > nums[max_index]:
                    max_index = right
                    
                # 如果当前已经是父子三人里最强的了，停止下沉
                if max_index == index:
                    break
                    
                # 否则，和最强勇士交换位置，继续向下考察
                nums[index], nums[max_index] = nums[max_index], nums[index]
                index = max_index
                left = index * 2 + 1
                right = left + 1
                
        def buildMaxHeap(nums):
            """
            原地构建大顶堆。
            从最后一个非叶子节点开始，依次向上进行堆化。
            """
            size = len(nums)
            # (size // 2 - 1) 是最后一个有孩子的人
            for i in range(size // 2 - 1, -1, -1):
                heapify(nums, i, size - 1)
            return nums

        # 1. 先把整个数组变成一座大顶堆山
        buildMaxHeap(nums)
        
        size = len(nums)
        # 2. 我们需要找第 k 大，所以要把前 k-1 个最大的“山顶王”请出场
        for i in range(k - 1):
            # 将山顶（最大值）换到当前竞技场的最后面
            nums[0], nums[size - i - 1] = nums[size - i - 1], nums[0]
            # 缩小竞技场边界，重新调整剩下的山顶，让次大值浮上来
            heapify(nums, 0, size - i - 2)
            
        # 3. 请走了 k-1 个大王后，现在的山顶就是我们要找的第 k 大王！
        return nums[0]

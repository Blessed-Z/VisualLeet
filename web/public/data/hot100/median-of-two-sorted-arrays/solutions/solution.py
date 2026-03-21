from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        n1 = len(nums1)
        n2 = len(nums2)
        
        # 1. 确保 nums1 是较短的数组，为了让二分查找更快且 m2 计算不为负
        if n1 > n2:
            return self.findMedianSortedArrays(nums2, nums1)
            
        # 2. 计算左半部分总共需要多少个元素
        # +1 是为了同时处理奇数和偶数的情况
        k = (n1 + n2 + 1) // 2
        
        # 3. 在短数组 nums1 上做二分查找切分点
        left = 0
        right = n1
        while left < right:
            m1 = left + (right - left) // 2  # 第一个数组切 m1 个元素到左边
            m2 = k - m1                      # 第二个数组就要切 k-m1 个元素
            
            # 💡 核心检查：如果 nums1 右边的值比 nums2 左边的值还小
            # 说明 nums1 切少了，需要往右移
            if nums1[m1] < nums2[m2 - 1]:
                left = m1 + 1
            else:
                # 否则说明切得差不多或者切多了，往左收缩
                right = m1
                
        # 4. 找到完美的平衡切分点 m1 和 m2
        m1 = left
        m2 = k - m1
        
        # 5. 确定左半部分的最大值 c1
        # 小心边界：如果某边没切元素，用负无穷充当
        c1 = max(float('-inf') if m1 <= 0 else nums1[m1 - 1], 
                 float('-inf') if m2 <= 0 else nums2[m2 - 1])
        
        # 6. 如果总数是奇数，中位数就是左半部分最大的那个
        if (n1 + n2) % 2 == 1:
            return c1
            
        # 7. 如果总数是偶数，还要确定右半部分的最小值 c2
        # 小心边界：如果某边元素全在左边，用正无穷充当
        c2 = min(float('inf') if m1 >= n1 else nums1[m1], 
                 float('inf') if m2 >= n2 else nums2[m2])
        
        # 8. 返回两个中间值的平均值
        return (c1 + c2) / 2

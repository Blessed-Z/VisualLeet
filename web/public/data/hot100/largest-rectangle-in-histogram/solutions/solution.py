from typing import List

class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        # 1. 哨兵技巧：在数组末尾加一个高度为 -1 的柱子
        # 这样可以确保循环结束前，栈中所有柱子都会因为遇到 -1 而被弹出计算
        heights = heights + [-1]
        ans = 0
        # 2. 栈中预存一个 -1 作为左边界的“地基”
        stack = [-1]
        
        for right, h in enumerate(heights):
            # 💡 关键：如果当前柱子比栈顶柱子矮，说明栈顶柱子的右边界找到了
            while len(stack) > 1 and heights[stack[-1]] > h:
                # 弹出要计算面积的柱子索引
                i = stack.pop()
                # 左边界就是当前栈顶的索引
                left = stack[-1]
                # 计算面积：高度 * (右索引 - 左索引 - 1)
                ans = max(ans, (right - left - 1) * heights[i])
            
            # 将当前柱子索引压入栈，保持栈内高度单调递增
            stack.append(right)
            
        return ans

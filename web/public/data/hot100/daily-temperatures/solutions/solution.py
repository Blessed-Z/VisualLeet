from typing import List

class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        # 初始化结果数组，默认值为 0（代表之后没有更高温）
        ans = [0] * n
        # 单调栈，存储日期的下标
        stack = []
        
        # 遍历每一天的温度
        for i, t in enumerate(temperatures):
            # 💡 关键逻辑：如果栈不为空，且今天的温度比栈顶那天的温度高
            while stack and t > temperatures[stack[-1]]:
                # 弹出栈顶日期
                prev_index = stack.pop()
                # 计算天数差：今天 - 以前那天
                ans[prev_index] = i - prev_index
            
            # 把今天的日期放入栈中，等待后面更高温的救赎
            stack.append(i)
            
        return ans

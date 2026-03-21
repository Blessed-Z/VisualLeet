from typing import List

class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        """
        利用贪心算法，寻找尽可能多的满足“同一字母只能在一段”的片段。
        """
        # 1. 预处理：记录每个字符最后一次出现的索引（名录）
        last = {c: i for i, c in enumerate(s)}
        
        # start 记录当前片段的起始位置
        # end 记录当前片段应该延伸到的最远位置（边界）
        start = end = 0
        ans = []
        
        # 2. 遍历字符串，决定切割时机
        for i, c in enumerate(s):
            # 看看当前字符 c 家族里的最后一个人在哪？
            # 既然当前片段里包含了 c，那为了包住它全家，
            # 我们当前的 end 至少要延伸到 last[c]
            if last[c] > end:
                end = last[c]
            
            # 3. 当我们走到了目前预测的边界 end 时
            # 说明在 [start, end] 这一段里的所有字符，
            # 它们的家族成员都已经被包含进来了！
            if i == end:
                # 咔嚓一剪！
                ans.append(end - start + 1)
                # 开启下一个片段的起点
                start = i + 1
                
        # 4. 返回所有片段的长度列表
        return ans

from typing import List

# 建立数字到字母的映射表
MAPPING = ('', '', "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz")

class Solution: 
    def letterCombinations(self, digits: str) -> List[str]:
        # 特殊情况：如果暗号是空的
        if not digits: return []
        
        n = len(digits)
        ans = []
        # path 初始化为长度为 n 的占位列表，效率更高
        path = [''] * n
        
        def dfs(i):
            # 1. 终止条件：当 i 等于暗号长度，说明每个数字都选好字母了
            if n == i:
                # 拼成字符串存入结果
                ans.append(''.join(path))
                return
            
            # 2. 取出当前数字对应的所有字母
            digit = int(digits[i])
            for c in MAPPING[digit]:
                # 在第 i 个坑位填入字母 c
                path[i] = c
                # 填下一个坑位
                dfs(i + 1)
                # 注意：这里不需要显式 pop，因为 path[i] 会在下一次循环被直接覆盖
        
        # 从第 0 个坑位开始填
        dfs(0)
        return ans

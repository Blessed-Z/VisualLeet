from typing import List

class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        """
        利用递推构建法生成前 numRows 行的杨辉三角。
        """
        # 1. 预先创建整个金字塔，并全部填入 1（打地基）
        # 每一行 i 的长度都是 i+1
        c = [[1] * (i + 1) for i in range(numRows)]
        
        # 2. 从第 3 行开始（下标为 2），每一行都需要计算中间的数字
        for i in range(2, numRows):
            # 3. 每一行中间的数字，从第 2 个开始（下标为 1），直到倒数第 2 个（下标为 i-1）
            for j in range(1, i):
                # 4. 魔法公式：中间砖块 = 左上方砖块 + 右上方砖块
                c[i][j] = c[i-1][j-1] + c[i-1][j]
                
        # 5. 返回构建好的整个金字塔
        return c

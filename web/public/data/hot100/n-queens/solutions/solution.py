from typing import List

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        ans = []
        # queens[r] = c 表示第 r 行的皇后在第 c 列
        queens = [0] * n
        
        # 三个“雷达”标记数组
        col = [False] * n               # 列标记
        diaga1 = [False] * (2 * n - 1)  # 右上到左下斜线标记 (r + c)
        diaga2 = [False] * (2 * n - 1)  # 左上到右下斜线标记 (r - c)

        def dfs(r):
            # 1. 终止条件：如果已经成功填满了 n 行
            if n == r:
                # 将 queens 数组转化为题目要求的字符串矩阵格式
                # '.'*c + 'Q' + '.'*(n-c-1) 生成类似 "..Q." 的字符串
                ans.append(['.' * c + 'Q' + '.' * (n - c - 1) for c in queens])
                return
            
            # 2. 遍历当前行 r 的每一列 c，尝试放皇后
            for c in range(n):
                # 核心检查：列没被占，且两条斜线都没被占
                # 注意：r-c 可能为负数，在 Python 中作为索引会自动从后往前数，
                # 或者可以写成 r-c+n-1 确保为正。
                if not col[c] and not diaga1[r + c] and not diaga2[r - c]:
                    # 3. 做出选择：放下皇后，并开启雷达
                    queens[r] = c
                    col[c] = diaga1[r + c] = diaga2[r - c] = True
                    
                    # 4. 进入下一行
                    dfs(r + 1)
                    
                    # 5. 撤销选择：拿起皇后，关掉雷达（回溯）
                    col[c] = diaga1[r + c] = diaga2[r - c] = False
        
        # 从第 0 行开始搜寻
        dfs(0)
        return ans

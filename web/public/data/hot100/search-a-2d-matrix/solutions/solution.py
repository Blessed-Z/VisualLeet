from typing import List

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        # 1. 获取矩阵的维度：m 行，n 列
        m, n = len(matrix), len(matrix[0])
        
        # 2. 设定搜索的起点：右上角 (第 0 行，最后一列)
        # 这是因为在右上角，往左走数字变小，往下走数字变大
        i = 0
        j = n - 1
        
        # 3. 只要还在棋盘范围内，就继续寻找
        while i < m and j >= 0:
            # 找到啦！直接返回 True
            if matrix[i][j] == target:
                return True
            
            # 如果当前值比目标小
            if matrix[i][j] < target:
                # 说明这一行剩下的（左边）肯定也小，直接下移一行
                i += 1
            else:
                # 如果当前值比目标大
                # 说明这一列剩下的（下边）肯定也大，直接左移一列
                j -= 1
                
        # 如果走出了棋盘还没找到，说明宝藏不在这个矩阵里
        return False

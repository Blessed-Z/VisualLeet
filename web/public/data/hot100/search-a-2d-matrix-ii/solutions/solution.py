class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        # 获取矩阵的行数 m 和列数 n
        m, n = len(matrix), len(matrix[0])
        
        # 核心秘密：我们从矩阵的“右上角”出发
        # i 代表行（从 0 开始），j 代表列（从最后一列 n-1 开始）
        i, j = 0, n - 1
        
        # 只要我们还在矩阵的范围内，就继续走
        while i < m and j >= 0:
            # 找到啦！大功告成
            if matrix[i][j] == target:
                return True
            
            # 决策时刻：
            # 如果当前数字比目标小（matrix[i][j] < target）
            # 因为这一行左边的数更小，所以目标肯定不在左边。
            # 我们往下走一步（行数 +1），去更大的地方看看。
            if matrix[i][j] < target:
                i += 1
            # 如果当前数字比目标大（matrix[i][j] > target）
            # 因为这一列下面的数更大，所以目标肯定不在下面。
            # 我们往左走一步（列数 -1），去更小的地方看看。
            else:
                j -= 1
                
        # 走出了矩阵还没找到，说明目标不在这里
        return False

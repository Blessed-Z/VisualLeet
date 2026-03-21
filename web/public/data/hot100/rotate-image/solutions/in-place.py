class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        """
        原地旋转 90 度，不占用额外空间。
        """
        n = len(matrix)
        
        # 我们只需要遍历矩阵左上角的“四分之一”区域
        # 就像转魔方一样，每选中一个块，它会牵动其他三个对应位置的块
        for i in range(n // 2):
            for j in range((n + 1) // 2):
                # 四个位置大换位！
                # matrix[i][j] 是当前选中的点
                # matrix[j][n-i-1] 是它旋转 90 度后要去的地方
                # ...以此类推
                # 利用 Python 的元组解构赋值，一行代码搞定四向交换
                matrix[i][j], matrix[j][n-i-1], matrix[n-i-1][n-j-1], matrix[n-j-1][i] = \
                matrix[n-j-1][i], matrix[i][j], matrix[j][n-i-1], matrix[n-i-1][n-j-1]

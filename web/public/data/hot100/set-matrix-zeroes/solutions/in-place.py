class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        """
        这个方法非常聪明，它不使用额外的空间，
        而是借用矩阵的第一行和第一列来当做“记事本”。
        """
        m = len(matrix)
        n = len(matrix[0])
        
        # 因为第一行和第一列会被用来记事，
        # 所以我们先得用两个开关记下：第一行和第一列原本有没有零
        flag_col = any(matrix[i][0] == 0 for i in range(m))
        flag_row = any(matrix[0][j] == 0 for j in range(n))
        
        # 第一步：遍历除了第一行第一列之外的所有房间
        for i in range(1, m):
            for j in range(1, n):
                # 如果这个房间里有零（病毒）
                if matrix[i][j] == 0:
                    # 我们就在这一层的“走廊开头”和这一列的“房顶开头”画个叉（记为 0）
                    matrix[i][0] = matrix[0][j] = 0
        
        # 第二步：根据刚才画的叉，开始大扫除
        for i in range(1, m):
            for j in range(1, n):
                # 如果走廊开头或房顶开头有叉，说明这一行或这一列该清零
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0
        
        # 第三步：最后处理第一行和第一列自己
        if flag_col:
            for i in range(m): matrix[i][0] = 0
        if flag_row:
            for j in range(n): matrix[0][j] = 0

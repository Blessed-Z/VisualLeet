class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        # 定义四个边界：上、下、左、右
        up, down = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        ans = []
        
        while True:
            # 1. 从左往右走最上面那一行
            for i in range(left, right + 1):
                ans.append(matrix[up][i])
            # 走完了，上边界往下缩一格
            up += 1
            if up > down: break
            
            # 2. 从上往下走最右边那一列
            for i in range(up, down + 1):
                ans.append(matrix[i][right])
            # 走完了，右边界往左缩一格
            right -= 1
            if right < left: break
            
            # 3. 从右往左走最下面那一行
            for i in range(right, left - 1, -1):
                ans.append(matrix[down][i])
            # 走完了，下边界往上缩一格
            down -= 1
            if up > down: break
            
            # 4. 从下往上走最左边那一列
            for i in range(down, up - 1, -1):
                ans.append(matrix[i][left])
            # 走完了，左边界往右缩一格
            left += 1
            if left > right: break
            
        return ans

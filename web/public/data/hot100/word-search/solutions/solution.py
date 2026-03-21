from typing import List

class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        m = len(board)
        n = len(board[0])
        
        def dfs(i, j, k):
            """
            深度优先搜索：从网格(i,j)位置开始，匹配单词的第k个字符
            :param i: 当前网格行索引
            :param j: 当前网格列索引
            :param k: 当前需要匹配的单词字符索引
            :return: 是否能匹配成功
            """
            # 1. 检查当前格子的字母是否匹配单词的第 k 个字符
            if board[i][j] != word[k]:
                return False
            
            # 2. 如果已经匹配到了单词的最后一个字符，说明成功了！
            if k == len(word) - 1:
                return True
            
            # 3. 做出选择：为了防止回头路，暂时把当前格子变为空白
            tmp = board[i][j]
            board[i][j] = ''
            
            # 4. 尝试向四个方向探索下一个字符 (k + 1)
            for x, y in (i, j + 1), (i, j - 1), (i - 1, j), (i + 1, j):
                # 检查边界，并递归搜索
                if 0 <= x < m and 0 <= y < n:
                    if dfs(x, y, k + 1):
                        return True
            
            # 5. 撤销选择：离开当前格子时，要把它的字母还原，好让别的路径可以经过它
            board[i][j] = tmp
            return False
            
        # 地毯式搜索：尝试以网格中的每一个格子作为单词的起点
        return any(dfs(i, j, 0) for i in range(m) for j in range(n))

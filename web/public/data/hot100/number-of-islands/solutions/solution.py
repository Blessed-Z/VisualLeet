from typing import List

class Solution:
    def dfs(self, grid: List[List[str]], i: int, j: int):
        n = len(grid)
        m = len(grid[0])
        # 1. 递归终止条件：
        # - 如果行号 i 越界
        # - 如果列号 j 越界
        # - 如果当前格子是海水 '0'（也包含了已经被我们变成海水的陆地）
        if i < 0 or j < 0 or i >= n or j >= m or grid[i][j] == '0':
            return 
        
        # 2. 魔法沉岛：把当前这块陆地变成海水，当作已访问过的记号
        grid[i][j] = '0'
        
        # 3. 派出特种部队，继续向四周探索并沉岛
        self.dfs(grid, i + 1, j) # 往下走
        self.dfs(grid, i - 1, j) # 往上走
        self.dfs(grid, i, j + 1) # 往右走
        self.dfs(grid, i, j - 1) # 往左走

    def numIslands(self, grid: List[List[str]]) -> int:
        count = 0
        # 遍历地图的每一个角落
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                # 一旦发现一块陆地
                if grid[i][j] == '1':
                    # 立即启动沉岛魔法，把和它相连的整座岛都消灭掉
                    self.dfs(grid, i, j)
                    # 岛屿总数增加
                    count += 1
                    
        return count

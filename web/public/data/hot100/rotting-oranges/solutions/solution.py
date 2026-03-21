from typing import List

class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        row = len(grid)
        col = len(grid[0])
        
        # 1. 清点阵营：找出所有的初始“僵尸橘子”和“新鲜橘子”，把坐标存入集合
        rotten = {(i, j) for i in range(row) for j in range(col) if grid[i][j] == 2}
        flesh = {(i, j) for i in range(row) for j in range(col) if grid[i][j] == 1}
        
        time = 0
        
        # 2. 只要还有新鲜橘子存活，战争就继续
        while flesh:
            # 如果还有新鲜橘子，但已经没有僵尸可以动了（说明有些新鲜橘子在死角）
            if not rotten:
                return -1
                
            # 3. 僵尸出击：当前所有僵尸向四周咬人，产生“新僵尸”
            # 新僵尸的条件：在老僵尸的上下左右，且这个位置原来是新鲜橘子 (在 flesh 集合里)
            rotten = {(i+di, j+dj) for i, j in rotten for di, dj in [(0,1), (1,0), (-1,0), (0,-1)] if (i+di, j+dj) in flesh}
            
            # 4. 更新阵营：把刚才被咬的新鲜橘子从幸存者名单里剔除
            flesh -= rotten
            
            # 5. 时间流逝 1 分钟
            time += 1
            
        # 如果新鲜橘子全部死光（flesh 为空），返回消耗的总时间
        return time

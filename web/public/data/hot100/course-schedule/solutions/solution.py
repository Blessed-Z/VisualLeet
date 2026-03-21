from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        def dfs(i, adjacency, flags):
            # 如果当前节点是 -1，说明之前已经查过，这条路是安全的，直接返回 True
            if flags[i] == -1: return True
            # 如果当前节点是 1，说明我们正在查它，现在又绕回来了，发现环！返回 False
            if flags[i] == 1: return False
            
            # 将当前节点标记为 1，表示“正在探索”
            flags[i] = 1
            
            # 顺藤摸瓜，检查学完这门课能解锁的后续课程
            for j in adjacency[i]:
                if not dfs(j, adjacency, flags):
                    return False
                    
            # 这门课及其后续课程都安全查完，没有环。
            # 将状态标记为 -1，以后再也不用查它了
            flags[i] = -1
            return True

        # 建图：adjacency 存储每个节点指向的相邻节点列表
        adjacency = [[] for _ in range(numCourses)]
        flags = [0 for _ in range(numCourses)]
        
        # 填充邻接表：pre 是先修课，cur 是后续课，所以是 pre 指向 cur
        for cur, pre in prerequisites:
            adjacency[pre].append(cur)
            
        # 对每门课都进行一次安全检查
        for i in range(numCourses):
            if not dfs(i, adjacency, flags):
                # 只要有一门课陷入死循环，就无法毕业
                return False
                
        return True

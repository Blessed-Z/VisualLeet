from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        def dfs(node):
            if not node:
                return 
            
            # 1. 优先去左子树（那边有更小的数字）
            dfs(node.left)
            
            # 2. 如果已经找到答案了，就不再继续后面的操作（提前返回）
            if self.k == 0:
                return 
            
            # 3. 访问当前“根”节点，计数器减 1
            self.k -= 1
            
            # 4. 如果计数器归零，说明现在这个节点就是第 K 小！
            if self.k == 0:
                self.res = node.val
                return
            
            # 5. 最后去右子树看看
            dfs(node.right)
            
        # 把 k 存为成员变量，方便在递归中共享
        self.k = k
        self.res = None
        dfs(root)
        return self.res

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import Optional

class Solution:
    def isSymmetric(self, root: Optional['TreeNode']) -> bool:
        """
        检查二叉树是否镜像对称
        """
        if not root:
            return True
            
        def check(p: Optional['TreeNode'], q: Optional['TreeNode']) -> bool:
            # 1. 如果都为空，是对称的
            if not p and not q:
                return True
            # 2. 如果只有一个为空，或者值不同，则不对称
            if not p or not q or p.val != q.val:
                return False
            
            # 3. 镜像比较：
            # A 的左边 vs B 的右边
            # A 的右边 vs B 的左边
            return check(p.left, q.right) and check(p.right, q.left)
            
        return check(root.left, root.right)

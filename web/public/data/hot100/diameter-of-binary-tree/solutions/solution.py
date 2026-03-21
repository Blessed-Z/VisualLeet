# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import Optional

class Solution:
    def diameterOfBinaryTree(self, root: Optional['TreeNode']) -> int:
        """
        计算二叉树的直径
        """
        self.ans = 0  # 记录全局最大直径
        
        def depth(node: Optional['TreeNode']) -> int:
            if not node:
                return 0
            
            # 递归计算左子树和右子树的深度
            L = depth(node.left)
            R = depth(node.right)
            
            # 在每个节点处，更新最大直径的纪录
            # 直径 = 左深 + 右深（经过该节点的边数）
            self.ans = max(self.ans, L + R)
            
            # 向上级汇报本节点的深度
            return max(L, R) + 1
            
        depth(root)
        return self.ans

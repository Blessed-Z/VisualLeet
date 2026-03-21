# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import Optional

class Solution:
    def maxDepth(self, root: Optional['TreeNode']) -> int:
        """
        使用递归（DFS）计算二叉树的最大深度
        """
        # 如果是空树，深度为 0
        if not root:
            return 0
        
        # 递归计算左子树的深度
        left_height = self.maxDepth(root.left)
        # 递归计算右子树的深度
        right_height = self.maxDepth(root.right)
        
        # 整棵树的深度 = 左右子树中较大的那个 + 1（根节点本身）
        return max(left_height, right_height) + 1

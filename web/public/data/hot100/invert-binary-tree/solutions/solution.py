# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import Optional

class Solution:
    def invertTree(self, root: Optional['TreeNode']) -> Optional['TreeNode']:
        """
        使用递归翻转二叉树
        """
        # 如果是空节点，直接返回
        if not root:
            return None
        
        # 1. 交换当前节点的左右子树
        root.left, root.right = root.right, root.left
        
        # 2. 递归翻转左子树（现在的 root.left 是原来的 root.right）
        self.invertTree(root.left)
        
        # 3. 递归翻转右子树
        self.invertTree(root.right)
        
        # 返回翻转后的根节点
        return root

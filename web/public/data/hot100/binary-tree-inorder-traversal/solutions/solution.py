# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import Optional, List

class Solution:
    def inorderTraversal(self, root: Optional['TreeNode']) -> List[int]:
        """
        使用迭代（栈）实现二叉树的中序遍历
        """
        res = []  # 存放结果的清单
        stack = []  # 我们的备忘录栈
        curr = root  # 从根节点出发
        
        while curr or stack:
            # 1. 尽可能地往左走，把路上的节点都记录下来
            while curr:
                stack.append(curr)
                curr = curr.left
            
            # 2. 左边没路了，从栈里取出最近的一个节点
            curr = stack.pop()
            res.append(curr.val)  # 记录这个节点的值
            
            # 3. 转向右边子树
            curr = curr.right
            
        return res

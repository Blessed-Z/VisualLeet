# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from typing import Optional, List
import collections

class Solution:
    def levelOrder(self, root: Optional['TreeNode']) -> List[List[int]]:
        """
        使用队列（BFS）实现二叉树的层序遍历
        """
        if not root:
            return []
            
        res = []
        queue = collections.deque([root])  # 魔法袋子，先放根节点
        
        while queue:
            level = []  # 这一层的领糖清单
            level_size = len(queue)  # 看看现在袋子里有多少人（这一层的总人数）
            
            for _ in range(level_size):
                # 依次请出这一层的人
                node = queue.popleft()
                level.append(node.val)
                
                # 如果有孩子，叫他们去排队（下一层）
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            # 这一层发完了，记录清单
            res.append(level)
            
        return res

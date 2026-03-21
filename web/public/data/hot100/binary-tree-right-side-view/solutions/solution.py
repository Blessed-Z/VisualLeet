from typing import List, Optional
import collections

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        """
        使用层序遍历（BFS），每层只取最后一个节点
        """
        if not root:
            return []
        
        result = []
        # 使用队列进行层序遍历
        queue = collections.deque([root])
        
        while queue:
            # 当前层的节点个数
            level_size = len(queue)
            for i in range(level_size):
                node = queue.popleft()
                
                # 如果是当前层的最后一个节点，将其加入结果
                # 这就像是在每一层，我们只看最右边的那个人
                if i == level_size - 1:
                    result.append(node.val)
                
                # 将下一层的节点加入队列（先左后右）
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
                    
        return result

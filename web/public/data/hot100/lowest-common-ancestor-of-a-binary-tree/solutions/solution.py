# Definition for a binary tree node.
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # 1. 基础自救法则：如果当前节点是空，或者正好是 p 或 q
        # 直接返回自己，表示“找到了”
        if root == p or root == q or not root:
            return root
            
        # 2. 向左边和右边分头寻找
        node_left = self.lowestCommonAncestor(root.left, p, q)
        node_right = self.lowestCommonAncestor(root.right, p, q)
        
        # 3. 汇总情报
        # 如果左右两边都有收获（各找到了一个）
        if node_left and node_right:
            # 那么当前节点就是那个最近的“结合点”
            return root
        # 如果只有左边有收获，说明 LCA 在左边或者左边找到了其中之一
        elif not node_right:
            return node_left
        # 如果只有右边有收获，同理
        else:
            return node_right

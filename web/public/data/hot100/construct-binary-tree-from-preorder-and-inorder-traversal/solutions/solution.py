from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        """
        利用前序遍历找根，利用中序遍历分左右。
        """
        # 为了快速在中序遍历里找到根节点的索引
        inorder_idx_map = {val: i for i, val in enumerate(inorder)}
        
        # preorder 的指针，记录我们现在用到第几个前序值了
        self.pre_idx = 0
        
        def helper(in_left, in_right):
            # 如果没有节点可以用来构建子树了
            if in_left > in_right:
                return None
            
            # 1. 前序遍历的第一个就是根节点
            root_val = preorder[self.pre_idx]
            root = TreeNode(root_val)
            self.pre_idx += 1
            
            # 2. 在中序遍历里找到根节点的位置
            idx = inorder_idx_map[root_val]
            
            # 3. 根节点左边的就是左子树，右边的就是右子树
            # 注意：前序顺序是 根->左->右，所以先递归 build 左子树
            root.left = helper(in_left, idx - 1)
            root.right = helper(idx + 1, in_right)
            
            return root
            
        return helper(0, len(inorder) - 1)

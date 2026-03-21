# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        """
        核心思想：使用递归法，传递每个节点所属的区间限制 (lower, upper)。
        - 检查当前节点的值是否在 (lower, upper) 之间。
        - 递归左子树时，更新上限为当前节点的值。
        - 递归右子树时，更新下限为当前节点的值。
        """
        
        def validate(node, lower, upper):
            # 基础情况：如果节点为空，说明已经检查到叶子节点，返回 True
            if not node:
                return True
            
            # 检查当前节点的值是否严格大于下界且严格小于上界
            if node.val <= lower or node.val >= upper:
                return False
            
            # 递归检查左子树和右子树
            # 检查左子树：值必须在 (lower, node.val) 之间
            # 检查右子树：值必须在 (node.val, upper) 之间
            return validate(node.left, lower, node.val) and validate(node.right, node.val, upper)
            
        # 初始调用：根节点的范围是负无穷到正无穷
        return validate(root, float('-inf'), float('inf'))

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:
        """
        核心思想：取数组中间元素作为根节点，递归处理左右子数组。
        这样可以确保左右子树的节点数量之差不超过1，从而构建一棵高度平衡的树。
        """
        
        def build(left, right):
            # 基础情况：如果左边界超过右边界，说明当前区间已经没有元素了
            if left > right:
                return None
            
            # 选择中间位置的元素作为当前的根节点
            # (left + right) // 2 这样取中点，如果数组长度是偶数，会偏左边一点
            mid = (left + right) // 2
            
            # 创建根节点
            root = TreeNode(nums[mid])
            
            # 递归构建左子树：使用当前中点左边的元素
            root.left = build(left, mid - 1)
            
            # 递归构建右子树：使用当前中点右边的元素
            root.right = build(mid + 1, right)
            
            # 返回当前构建好的子树根节点
            return root
            
        # 从整个数组范围开始构建
        return build(0, len(nums) - 1)

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def flatten(self, root: Optional[TreeNode]) -> None:
        """
        原地将二叉树展开为链表。
        展开后的链表应同样使用 TreeNode 类，其中 left 子指针始终为 null，
        而 right 子指针指向链表中的下一个节点。
        展开后的顺序应与二叉树的前序遍历相同。
        """
        # 使用“反向前序遍历” (右 -> 左 -> 根)
        # 这样处理当前节点时，它的右孩子已经处理好了
        self.prev = None
        
        def traverse(node):
            if not node:
                return
            
            # 1. 先去最右边处理
            traverse(node.right)
            # 2. 再去左边处理
            traverse(node.left)
            
            # 3. 处理当前节点：
            # 把当前节点的右边指向已经处理好的 prev
            node.right = self.prev
            # 把当前节点的左边清空（因为我们要变成一根线）
            node.left = None
            # 更新 prev，让它指向自己，给它的爸爸用
            self.prev = node
            
        traverse(root)

from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def __init__(self):
        # 初始化全局最大值为负无穷，用来记录探险过程中发现的“世界纪录”
        self.ans = float('-inf')

    def dfs(self, node: Optional[TreeNode]) -> int:
        # 如果走到了空路，能提供的钱就是 0
        if not node:
            return 0
        
        # 1. 递归询问左孩子：你能给我贡献多少钱？
        # 如果是负数，我宁愿不要，取 0
        max_left = max(self.dfs(node.left), 0)
        
        # 2. 递归询问右孩子：你能给我贡献多少钱？
        # 如果是负数，同理取 0
        max_right = max(self.dfs(node.right), 0)
        
        # 3. 核心：如果就在当前节点“转弯”
        # 这一座彩虹桥的总值 = 左孩子的贡献 + 自己的值 + 右孩子的贡献
        max_cur = max_left + max_right + node.val
        
        # 4. 看看这座桥能不能打破世界纪录
        self.ans = max(self.ans, max_cur)
        
        # 5. 向爸爸汇报：我能带给你的最大单向贡献是多少？
        # 只能挑左右中更值钱的那一条路加上我自己
        return max(max_left, max_right) + node.val

    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        # 开始全树大搜寻
        self.dfs(root)
        # 返回最终的世界纪录
        return int(self.ans)

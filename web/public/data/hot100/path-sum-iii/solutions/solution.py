from collections import defaultdict
from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
        # 记录找到的路径总数
        ans = 0
        # 哈希表记录前缀和出现的次数，初始化 0 出现 1 次
        cnt = defaultdict(int)
        cnt[0] = 1
        
        def dfs(node, s):
            nonlocal ans
            # 如果节点为空，直接返回
            if node is None:
                return 
            
            # 1. 累加当前节点的值到当前前缀和 s
            s += node.val
            
            # 2. 核心逻辑：如果在账本中发现过 s - targetSum，说明找到了一段和为 targetSum 的路径
            ans += cnt[s - targetSum]
            
            # 3. 将当前的前缀和 s 存入账本
            cnt[s] += 1
            
            # 4. 继续递归左右子树
            dfs(node.left, s)
            dfs(node.right, s)
            
            # 5. 回溯：离开当前节点前，从账本中移除当前前缀和，防止干扰其他路径
            cnt[s] -= 1
            
        dfs(root, 0)
        return ans

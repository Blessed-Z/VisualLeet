from typing import List

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        """
        利用动态规划，寻找凑齐目标金额所需的最少硬币数。
        这是一道完全背包问题的变种。
        """
        # 1. 创建省钱日记本（dp 数组）
        # 我们初始化为 amount + 1，这是一个无法达到的最大值，代表“暂时无解”
        dp = [amount + 1 for _ in range(amount + 1)]
        
        # 2. 填写基础：凑齐 0 元需要 0 枚硬币
        dp[0] = 0
        
        # 3. 开始遍历：外层遍历硬币种类
        for coin in coins:
            # 4. 内层遍历金额：从当前硬币面值开始，一直到目标总额
            # 这种从小到大的遍历顺序正是“完全背包”（硬币无限拿）的特征
            for c in range(coin, amount + 1):
                # 5. 魔法决策：
                # 当前金额 c 的最少硬币数 = min(原有的方案, 减去这张硬币后的金额的最少硬币数 + 1)
                if dp[c - coin] + 1 < dp[c]:
                    dp[c] = dp[c - coin] + 1
                    
        # 6. 检查结果：
        # 如果 dp[amount] 还是最初那个很大的值，说明凑不出来
        if dp[amount] > amount:
            return -1
            
        # 否则，返回记录下来的最小值
        return dp[amount]

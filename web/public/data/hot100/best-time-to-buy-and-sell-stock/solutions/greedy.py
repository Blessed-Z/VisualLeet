from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        """
        利用贪心思想，通过一次遍历找到股票买卖的最大利润。
        """
        # 初始化一个很大的价格，表示历史最低买入价
        # 这里设置为 10010 是因为题目中价格范围在 10000 以内
        min_price = 10010
        # 初始化最大利润为 0
        max_profit = 0
        
        for price in prices:
            # 1. 看看今天的价格是不是更便宜了？
            if price < min_price:
                # 是的话，赶紧记下这个新的最低买入点
                min_price = price
            # 2. 如果今天不比最低价便宜，看看今天卖掉能不能赚更多？
            elif price - min_price > max_profit:
                # 如果当前利润比历史最高纪录大，更新最大利润
                max_profit = price - min_price
                
        # 3. 走完全程，最后存下来的就是最大的那笔利润啦
        return max_profit

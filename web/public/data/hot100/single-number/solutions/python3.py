from typing import List

class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        """
        找出数组中只出现一次的数字。
        利用异或运算 (XOR) 的性质：
        1. a ^ a = 0 (两个相同的数异或结果为 0)
        2. a ^ 0 = a (任何数与 0 异或结果为它本身)
        3. a ^ b ^ a = (a ^ a) ^ b = 0 ^ b = b (满足交换律和结合律)
        """
        
        # 初始化结果为 0
        ans = 0
        
        # 遍历数组中的每一个数字
        for x in nums:
            # 将当前数字与结果进行异或
            # 成对出现的数字会在遍历过程中由于性质 1 和 3 互相抵消
            ans ^= x
            
        # 最终剩下的 ans 就是那个只出现了一次的数字
        return ans

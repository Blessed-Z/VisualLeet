class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        size = len(nums)
        # dp 数组，最后用来存储结果
        # 初始全部设为 1（因为 1 乘以任何数都不变）
        dp = [1 for _ in range(size)]
        
        # 第一步：从左往右走
        # left 记录当前数字左边所有人的“礼物积”
        left = 1
        for i in range(size):
            # 把左边的总积给当前的格子
            dp[i] *= left
            # 更新左积，把当前格子的数也乘进去，留给下一个格子
            left *= nums[i]
            
        # 第二步：从右往左走
        # right 记录当前数字右边所有人的“礼物积”
        right = 1
        for i in range(size - 1, -1, -1):
            # 把右边的总积乘到当前的格子上
            # 此时 dp[i] 已经是左积，乘上右积就得到了“除了自己以外的所有积”
            dp[i] *= right
            # 更新右积，把当前格子的数也乘进去，留给前一个格子
            right *= nums[i]
            
        return dp

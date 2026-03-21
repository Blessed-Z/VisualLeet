class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        # 第一步：先让数字们从小到大排好队
        nums.sort()
        res = []
        n = len(nums)
        
        for i in range(n):
            # 如果最小的那个数都大于0，那三数之和肯定没戏啦
            if nums[i] > 0:
                break
            
            # 如果这个数和前面的一样，我们就不重复找了（去重）
            if i > 0 and nums[i] == nums[i-1]:
                continue
            
            # 固定一个数后，变成了“两数之和”的问题
            # L 指向 i 后面的第一个数，R 指向最后面一个数
            L, R = i + 1, n - 1
            
            while L < R:
                total = nums[i] + nums[L] + nums[R]
                
                if total == 0:
                    # 找到了！开心存下来
                    res.append([nums[i], nums[L], nums[R]])
                    
                    # 为了不找重复的，如果 L 和 R 旁边的邻居长一样，就跳过
                    while L < R and nums[L] == nums[L+1]: L += 1
                    while L < R and nums[R] == nums[R-1]: R -= 1
                    
                    # 移动到下一对可能的数
                    L += 1
                    R -= 1
                elif total < 0:
                    # 太小了，左边那个数（较小的）得往右移，变大一点
                    L += 1
                else:
                    # 太大了，右边那个数（较大的）得往左移，变小一点
                    R -= 1
                    
        return res

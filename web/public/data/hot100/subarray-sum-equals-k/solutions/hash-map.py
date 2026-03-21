from collections import defaultdict

class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        # ans: 记录找到了多少个符合要求的子数组
        # s: 当前累加的总和（前缀和）
        ans = s = 0
        # cnt: 一个魔法账本，记录每一个“前缀和”出现了多少次
        cnt = defaultdict(int)
        
        for x in nums:
            # 第一步：把加当前数字之前的“旧总和”记在账本上
            # 初始时 s=0，代表一个数都没加的情况
            cnt[s] += 1
            
            # 第二步：加上当前的数字 x，更新总和
            s += x
            
            # 第三步：关键时刻！
            # 我们想找一段和为 k 的区间。
            # 如果现在的总和是 s，我们只要看账本里有没有出现过 (s - k)
            # 因为 s - (s - k) = k，说明中间那段正好是我们要找的！
            ans += cnt[s - k]
            
        return ans

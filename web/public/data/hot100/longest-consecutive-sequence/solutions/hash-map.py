class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        # 第一步：把所有数字扔进一个“魔法口袋”（集合）
        # 集合的好处是查找一个数字在不在里面非常快，而且会自动去重
        num_set = set(nums)
        longest_streak = 0

        # 遍历口袋里的每一个数字
        for num in num_set:
            # 关键判断：这是否是一个序列的“小队长”（起点）？
            # 如果 num - 1 不在口袋里，说明前面没人了，它就是起点
            if num - 1 not in num_set:
                current_num = num
                current_streak = 1

                # 开始数数：看看后面跟着多少个连续的数字
                while current_num + 1 in num_set:
                    current_num += 1
                    current_streak += 1

                # 跟历史最高纪录比一比，谁更长
                longest_streak = max(longest_streak, current_streak)

        return longest_streak

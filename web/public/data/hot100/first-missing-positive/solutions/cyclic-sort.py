class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        size = len(nums)
        
        # 第一步：送大家回座位 (置换过程)
        for i in range(size):
            # 规则：数字 x 应该坐在索引 x-1 的位置上
            # 比如数字 1 坐 0 号位，数字 2 坐 1 号位
            # while 循环保证当前这个位置一直换，换到对的人或者换不动为止
            while 1 <= nums[i] <= size and nums[i] != nums[nums[i]-1]:
                # index1 是当前位置
                index1 = i
                # index2 是当前数字本该去的那个位置
                index2 = nums[i] - 1
                
                # 交换位置！你回你的家，我拿走原本在你家的那个人继续换
                nums[index1], nums[index2] = nums[index2], nums[index1]
        
        # 第二步：检查座位情况
        for i in range(size):
            # 如果 i 号位上坐的不是 i+1，说明 i+1 这个人丢啦！
            if nums[i] != i + 1:
                return i + 1
        
        # 如果大家都各就各位了，那丢的就是最后那个人后面的一位
        return size + 1

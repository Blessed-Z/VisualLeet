class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        """
        这个方法利用了 Python 的切片魔法，
        直接修改 nums 本身（原地修改）。
        """
        size = len(nums)
        # 第一步：计算实际需要移动的步数
        # 如果 k 比数组长度还大，比如长度是 7 移动 8 步，
        # 其实就相当于移动 8 % 7 = 1 步。
        k = k % size
        
        # 如果不需要移动，直接回家休息
        if k == 0 or size <= 1:
            return
            
        # 第二步：大挪移！
        # nums[-k:] 是数组末尾的 k 个元素（要搬到前面的“尾巴”）
        # nums[:0] 代表在数组的最开头插入内容
        nums[:0] = nums[-k:]
        
        # 第三步：扫尾工作
        # 因为刚才把尾巴插到了开头，数组变长了，
        # 我们需要把原来末尾的那段重复内容删掉
        del nums[-k:]

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # 初始化一个哈希表，用于存储遍历过的数字及其索引
        # key: 数字的值, value: 数字在数组中的索引
        hashtable = dict()
        
        # 遍历数组中的每一个数字
        for i, num in enumerate(nums):
            # 计算当前数字与目标值的差值
            complement = target - num
            
            # 检查这个差值是否已经在哈希表中（即之前是否出现过）
            if complement in hashtable:
                # 如果找到了，返回差值的索引和当前数字的索引
                return [hashtable[complement], i]
            
            # 如果没找到，将当前数字存入哈希表，供后续数字查找
            hashtable[num] = i
            
        # 如果遍历结束仍未找到（理论上本题保证有解），返回空列表
        return []

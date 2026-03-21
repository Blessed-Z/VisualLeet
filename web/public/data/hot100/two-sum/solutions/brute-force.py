class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # 获取数组的长度
        n = len(nums)
        
        # 第一层循环：枚举第一个数字，其索引为 i
        for i in range(n):
            # 第二层循环：枚举第二个数字，从 i+1 开始避免重复使用同一个元素
            for j in range(i + 1, n):
                # 检查两个数字之和是否等于目标值
                if nums[i] + nums[j] == target:
                    # 如果匹配，直接返回这两个数字的索引
                    return [i, j]
        
        # 如果遍历全量数对都没找到匹配项（理论上本题保证有解）
        return []

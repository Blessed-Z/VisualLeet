class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # 使用哈希表记录字符最后出现的位置
        # key: 字符, value: 对应的索引位置
        dic = {}
        # res 记录最长长度, i 记录窗口的左边界
        res = i = 0
        
        # j 作为窗口的右边界，不断向右移动
        for j in range(len(s)):
            # 如果当前字符已经在哈希表里了
            if s[j] in dic:
                # 关键：更新左边界 i
                # i 只能往右走，所以取当前 i 和重复字符位置+1 的最大值
                i = max(dic[s[j]], i)
            
            # 更新哈希表中当前字符的位置（存入的是 j + 1，方便直接赋给 i）
            dic[s[j]] = j + 1
            
            # 计算当前窗口的长度 j - i + 1，并尝试刷新最高纪录
            res = max(res, j - i + 1)
            
        return res

class Solution:
    def longestPalindrome(self, s: str) -> str:
        """
        寻找字符串中的最长回文子串。
        使用中心扩展法，时间复杂度 O(n^2)，空间复杂度 O(1)。
        """
        if not s or len(s) < 2:
            return s
            
        def expand(left: int, right: int) -> str:
            """
            从中心开始向两边扩展，返回找到的最长回文串。
            """
            # 只要左右指针没越界，且两个位置的字符相等，就继续往两边扩
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            # 当循环退出时，s[left] != s[right]
            # 所以我们要返回的是 left+1 到 right-1 的部分
            # Python 切片 s[a:b] 是包含 a 但不包含 b 的，所以写成 s[left+1:right]
            return s[left+1:right]
            
        res = ""
        # 遍历每一个字符，将其作为可能的中心
        for i in range(len(s)):
            # 情况1：回文串长度是奇数，中心是一个字符 i
            s1 = expand(i, i)
            # 情况2：回文串长度是偶数，中心是两个字符 i 和 i+1 之间的空隙
            s2 = expand(i, i+1)
            
            # 哪次扩出来的更长，就更新一下最终结果
            if len(s1) > len(res):
                res = s1
            if len(s2) > len(res):
                res = s2
                
        return res

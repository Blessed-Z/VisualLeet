from collections import Counter

class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:   
        ans = []
        # 目标成分：统计 p 里面每个字母出现的次数
        cnt_p = Counter(p)
        # 当前网里的成分：初始为空
        cnt_s = Counter()
        
        # right 指向网口（前端），c 是吃进来的字母
        for right, c in enumerate(s):
            # 网口吞进一个字母，成分增加
            cnt_s[c] += 1
            
            # 计算网屁股（后端）的位置
            left = right - len(p) + 1
            
            # 如果网还没撑满 p 那么长，继续往前跑
            if left < 0:
                continue
            
            # 关键：对比现在的配方和目标的配方是否一模一样
            if cnt_p == cnt_s:
                ans.append(left)
            
            # 重点：为了下一步移动，网屁股吐出一个字母，成分减少
            cnt_s[s[left]] -= 1
            
        return ans

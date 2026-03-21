from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        # cnt_s 用来记录当前窗口里每个字母攒了多少个
        cnt_s = Counter()
        # cnt_t 是我们要集齐的目标“印章”清单
        cnt_t = Counter(t)
        
        # ans_left 和 ans_right 记录我们找到的最短区间的左右边界
        ans_left = -1
        ans_right = len(s)
        
        # left 是窗口的左边界，也是我们要缩减的方向
        left = 0
        
        # right 指向窗口的右边界，不断向右伸长去寻找新的字母
        for right, c in enumerate(s):
            # 捡起一个新的字母，放进口袋
            cnt_s[c] += 1
            
            # 关键时刻：如果当前的口袋里的字母已经包含了清单 t 里的所有内容
            # 注意：Counter 对象支持 >= 比较，表示“包含且数量不低于”
            while cnt_s >= cnt_t:
                # 看看当前的这个窗口是不是比之前发现的还要短？
                if right - left < ans_right - ans_left:
                    ans_left, ans_right = left, right
                
                # 为了找更短的，我们尝试扔掉最左边的字母
                cnt_s[s[left]] -= 1
                # 尾巴缩一格
                left += 1
                
        # 如果从没找齐过，返回空；否则截取最完美的那个片段
        return '' if ans_left < 0 else s[ans_left:ans_right + 1]

class Solution:
    def maxArea(self, height: List[int]) -> int:
        # i 是“左守卫”，守在队伍开头
        i = 0
        # j 是“右守卫”，守在队伍结尾
        j = len(height) - 1
        # 用来记录我们找到的最大储水空间
        max_v = 0
        
        # 当左守卫和右守卫没有碰头时，继续寻找
        while i < j:
            # 计算当前的面积：底（j - i）乘以 高（左右守卫中较矮的那个）
            # 储水的高度取决于最短的那块木板（木桶效应）
            current_v = (j - i) * min(height[i], height[j])
            
            # 更新最高纪录
            max_v = max(max_v, current_v)
            
            # 关键决策：谁该移动？
            # 谁矮谁就往中间挪！因为保留矮的木板，面积只会越来越小
            if height[i] < height[j]:
                i += 1
            else:
                j -= 1
                
        return max_v

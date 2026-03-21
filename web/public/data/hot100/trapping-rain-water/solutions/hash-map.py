class Solution:
    def trap(self, height: List[int]) -> int:
        if not height: return 0
        
        # 左指针和右指针，分别从两头出发
        left, right = 0, len(height) - 1
        # 记录左边见过的最高墙和右边见过的最高墙
        left_max = right_max = 0
        # 总共接到的雨水
        ans = 0
        
        while left < right:
            # 更新左/右最高墙纪录
            left_max = max(left_max, height[left])
            right_max = max(right_max, height[right])
            
            # 谁的最高墙比较矮，谁就先算
            # 因为接水的高度取决于矮的那一边（木桶效应）
            if left_max < right_max:
                # 左边墙矮，水的深度 = 左边最高墙 - 当前柱子高度
                ans += left_max - height[left]
                left += 1
            else:
                # 右边墙矮，水的深度 = 右边最高墙 - 当前柱子高度
                ans += right_max - height[right]
                right -= 1
                
        return ans

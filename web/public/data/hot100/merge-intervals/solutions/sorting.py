class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        # ans 存储合并后的区间列表
        ans = []
        
        # 第一步：先按区间的“左门牌号”（开始位置）排序
        # 这样能保证我们只需要考虑当前区间和前一个区间的关系
        intervals.sort(key = lambda x: x[0])
        
        for interval in intervals:
            # 决策点：
            # 如果 ans 是空的，或者当前区间的开头大于前一个区间的结尾
            # 说明这两段区间互不理睬，中间有空隙
            if not ans or ans[-1][1] < interval[0]:
                # 直接把它作为新的独立区间加进去
                ans.append(interval)
            else:
                # 否则，说明它们有重叠部分！
                # 我们更新前一个区间的“右门牌号”（结束位置）
                # 取两者中更靠后的那个位置
                ans[-1][1] = max(ans[-1][1], interval[1])
                
        return ans

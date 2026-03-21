import collections

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        # 初始化一个特殊的“记忆口袋”（默认值为空列表的字典）
        # key: 排序后的单词（就像单词的标准证件照）, value: 属于这一组的单词列表
        ans = collections.defaultdict(list)
        
        # 遍历每一个单词
        for s in strs:
            # 关键步骤：给单词“拍个标准照”
            # 把单词里的字母排个序，比如 "eat" 变成 "aet", "tea" 也变成 "aet"
            # 这样长得一模一样的照片就代表它们是“异位词家人”
            key = "".join(sorted(s))
            
            # 把原始单词放进对应的照片分类里
            ans[key].append(s)
            
        # 返回口袋里所有分好组的列表
        return list(ans.values())

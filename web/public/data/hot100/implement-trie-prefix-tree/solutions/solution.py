class Trie:
    def __init__(self):
        # 树的根节点，用一个空字典来表示
        self.root = {}

    def insert(self, word: str) -> None:
        cur = self.root
        # 遍历单词的每一个字母
        for char in word:
            # 如果当前字母不在当前节点的字典里，就为它开辟一条新路（新字典）
            if char not in cur:
                cur[char] = {}
            # 指针顺着字母往下走一层
            cur = cur[char]
        # 单词所有的字母都走完了，在最后的位置打上一个特殊的 '#' 标记，表示这里是一个完整单词的结尾
        cur['#'] = True

    def search(self, word: str) -> bool:
        cur = self.root
        for char in word:
            # 如果找着找着发现路断了，说明字典里没有这个词
            if char not in cur:
                return False
            cur = cur[char]
        # 路走通了，但必须确认这里有没有 '#' 标记（防止只搜了前缀）
        return '#' in cur

    def startsWith(self, prefix: str) -> bool:
        cur = self.root
        for char in prefix:
            # 如果路断了，说明没有这个前缀
            if char not in cur:
                return False
            cur = cur[char]
        # 只要路没断，就算前缀匹配成功！不需要看有没有 '#' 标记
        return True

# Your Trie object will be instantiated and called as such:
# obj = Trie()
# obj.insert(word)
# param_2 = obj.search(word)
# param_3 = obj.startsWith(prefix)

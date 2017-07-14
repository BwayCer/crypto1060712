1060712 號編碼器
=======


> 版本： v1.0.0<br />
> 作者： 張本微 <bwaycer@gmail.com> (https://bwaycer.github.io/about)<br />
> 授權： [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/deed.zh_TW)



## 簡介


一個可加解密的演算法。
本程式非標準演算法， 只是一套具規則轉換方式的編碼方式，
見 [1060712 號編碼器演算法說明](docs/crypto_exposition.md) 瞭解更多。


與前一作品 1041003 號相比是非常滿意，
捨棄了大數運算（以小學生邏輯手做，效能不佳）、明文與密碼相乘除的編碼方式，
改採用 `XOR` 位元運算、加減法方式，效能快了至少 7 倍以上（猜測值）。



## 公開程式文件


> 演算法公信力評比： **不可靠**（作者自評）


關於本演算法邏輯被寫於 [1060712 號編碼器演算法說明](docs/crypto_exposition.md) 文件，
希望公開程式文件可以讓漏洞更容易被發掘，
希望倚靠大家的協助來保護我處在危險中的<span style="color: red;">提款卡密碼</span>。
（望各位大德手下留情， 感謝各位 Orz）


`2f4805ce42c0012341f9af701f3c5882716871488d96c3b4ac6393da309d828a27e1cab8d67bf4b16be10ed79f62e44f`
<br>
這是個文字長約 17， 密碼長為 4 個中文字的加密編碼結果， 期待你對我說出答案呦！



## 依賴程式庫


* [blueimp/JavaScript-MD5 - GitHub](https://github.com/blueimp/JavaScript-MD5)


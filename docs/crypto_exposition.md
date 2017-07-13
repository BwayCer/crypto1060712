1060712 號編碼器演算法說明
=======


> 2017.07.12



## 前言


從前的密碼學， 是一套規則的轉換方式， 說甲表示乙； 說乙表示丙，
這樣的古典密碼學通常必須要攜帶一張寫著編碼方式的小卡，
萬一小卡不見了， 這樣的編碼方式也就破功了。
而自從非對稱加密法被發明， 用於加密的公鑰居然可被公開的， 密碼學的價值觀也就跟著改變了。

現在優秀的密碼演算法都不吝嗇的公開加解密邏輯，
但即便如此， 想循著原邏輯逆推反解來竊取資訊也不過是徒勞無功徒勞無功而已。
基於這樣的理念， 筆者也要公開本程式所使用的演算法！
（明明就是因為網頁根本無法隱藏秘密。 ><）
而且前面說這麼多誇讚非對稱加密法， 結果還不是用古典密碼學方式。 噗～


在此也希望尋求大家的協助好不斷地去發現並彌補漏洞， 感謝各位 Orz。


`2f4805ce42c0012341f9af701f3c5882716871488d96c3b4ac6393da309d828a27e1cab8d67bf4b16be10ed79f62e44f`
<br>
這是個文字長約 17， 密碼長為 4 個中文字的加密編碼結果，
期待你對我說出答案呦！


**在撰寫本文時發現爪哇腳本已經可以運行大數運算！ 不敢再說它是被侷限的語言了。**



## 頁籤


* [簡介](#簡介)
* [明文的轉換](#明文的轉換)
* [密鑰的轉換](#密鑰的轉換)
* [明文與密鑰的第一階段編碼](#明文與密鑰的第一階段編碼)
* [明文與密鑰的第二階段編碼](#明文與密鑰的第二階段編碼)
* [密文保存在雲端資料庫的編碼](#密文保存在雲端資料庫的編碼)
* [計算解密難度及推測暴力解密方式](#計算解密難度及推測暴力解密方式)
* [引用程式庫](#引用程式庫)



## 簡介


本程式非標準演算法， 只是一套具規則轉換方式的編碼方式。

由於一個密文只會有一個持有者， 且禁止提供他人瀏覽權限， 所以沒有非得使用非對稱加密演算法的必要。


非對稱加密演算法的難度在於因數分解，
而本演算法的難度在於**「可使用非數字和英文當密碼」**。

很弱？ 沒有錯！ 完全依賴密碼的強度。
但若假設密碼難以被猜測的情況下，
只要有 4 個統一碼 Unicode（略等於 4 個字），
其長度就可達 2048 等級。（長中文語句比英文好記多了。 呵）


在基礎編碼外再增加一道可選關卡， ~~畢竟作者對自己也不相信~~ 藉此增加暴力破解的難度。


只有明文會影響密文長度，
明文長度與密文長度成正比（明文中一個字會轉換成密文的四個字），
抑制密文長度雖然可在傳遞或壓縮上得到改善，
但也怕這麼有邏輯的規則成為可鑽漏洞的切入口。



## 明文的轉換


* 以統一碼 Unicode 編碼將明文轉換為可計算的文字。


轉換演示：

```js
var txt = '妳&我|它'; // 明文

var p, len;
var txtCodeList = [];

for ( p = 0, len = txt.length; p < len ; p++ ) txtCodeList.push( txt.charCodeAt( p ) );

// txtCodeList = [ 22963, 38, 25105, 124, 23427 ]
// 轉 16 進位 [ "59b3", "26", "6211", "7c", "5b83" ]
// 轉計算明文 "59b300266211007c5b83"
```


反轉換演示：

```js
var txtCode = '59b300266211007c5b83'; // 明文

var val;
var idx = 0;
var len = txtCode.length;
var txt = '';

while ( idx < len ) {
    val = txtCode[ idx++ ]
        + txtCode[ idx++ ]
        + txtCode[ idx++ ]
        + txtCode[ idx++ ];
    txt += String.fromCharCode( parseInt( val, 16 ) );
}

// txt = "妳&我|它"
```


## 密鑰的轉換

1. 密碼以 `MD5` 雜湊逐字編碼。
2. 1. 密碼再強化編碼時， 以跳躍地混合式選取方式避免單一文字再編碼時產生可猜測的同樣字段。
   2. 以 7 碼為跳躍的距離， 可以在一個 32 位的字節內有 32 種變化。
   3. 以第 5 位數決定選取長度， 以循環的第 32 + 9 位數決定密碼強化的放大倍數。
4. 選取的長度需為奇數， 且不得為 1， 確保亂數品質。
3. 密碼達到 4 個統一碼長度時， 再強化編碼可將其放大到 2048 位數。
4. 1. 將強化編碼後的密鑰拆分兩段用於不同關卡， 並各提取其前 7 碼作為密碼驗證使用。
   2. 拆分的比例由拆分前密鑰的第 17 位數決定。


演示：

```js
var password = '中文！';

increaseKeyCode( password );
// [
//   "383b02e437744fb5",
//   [ 35369, 53601, 3499, 34067, 32224, 14154, 1043, 22308, 32280, 16140, ... ( 陣列共有 325 長度，文字共 1568 位 ) ],
//   "fdc65170fccd15c2e36b79751c044887311c54d702a9aebde50c5697288b ... ( 共 332 位 )"
// ]


function increaseKeyCode( keyCode ) {
    var p, len;
    var tem = keyCode;
    var lenKeyCode = keyCode.length;

    // `MD5` 雜湊逐字編碼
    keyCode = '';
    for ( p = 0, len = lenKeyCode; p < len ; p++ ) keyCode += md5( tem[ p ] );


    // 跳躍地混合式選取
    tem = keyCode + keyCode;

    var lenMd5KeyCode = keyCode.length;
    var jump = 32 + 7;
    var pickLength = ( parseInt( tem[ 5 ], 16 ) << 1 ) % 16 + 3;
    var multiple = parseInt( tem[ 32 + 9 ], 16 ) % 8 + 16;

    var lenPickLength, pickTxt;
    var idxJump = ~jump + 1;
    var lenActTimes = lenKeyCode * multiple;

    keyCode = '';
    while ( lenActTimes-- ) {
        pickTxt = '';
        lenPickLength = pickLength;

        while ( lenPickLength-- ) {
            idxJump += jump;
            idxJump = idxJump < lenMd5KeyCode ? idxJump : idxJump % lenMd5KeyCode;

            pickTxt
                += tem[ idxJump ]
                + tem[ idxJump + 1 ]
                + tem[ idxJump + 2 ]
                + tem[ idxJump + 3 ];
        }

        keyCode += md5( pickTxt );
    }


    // 密鑰拆分
    tem = keyCode;

    var part = tem.length / 4;
    var proportion = parseInt( tem[ 17 ], 16 ) || 1;
    var cutPoint = parseInt( part / 16 ) * proportion * 4;
    var keyA = tem.slice( 0, cutPoint );
    var keyB = tem.slice( cutPoint );

    return [
        md5( keyA.slice( 0, 16 ) + keyB.slice( 0, 16 ) ).slice( 8, 24 ),
        keyA.match( /\w{4}/g ).map( function ( val ) { return parseInt( val, 16 ) } ),
        keyB,
    ];
}
```


## 明文與密鑰的第一階段編碼


* 以 `XOR` 位元運算進行編碼。


編碼演示：

```js
var txtCodeList = [ 22963, 38, 25105, 124, 23427 ]; // 明文編碼
var keyCode = increaseKeyCode( '中文！' ); // 密鑰

encryptA( txtCodeList, keyCode[ 1 ] ); // "d39ad1476fba856f2663"


function encryptA( txtCodeList, keyCode ) {
    var idx, len;
    var lenkeyCode = keyCode.length;
    var txt = '';

    var temCode, lenTemCode, prefix;

    for ( idx = 0, len = txtCodeList.length; idx < len ; idx++ ) {
        temCode = ( txtCodeList[ idx ] ^ keyCode[ idx % lenkeyCode ] ).toString( 16 );

        var lenTemCode = 4 - temCode.length;

        if ( lenTemCode ) {
            prefix = '';
            while ( lenTemCode-- ) prefix += '0';
            temCode = prefix + temCode;
        }

        txt += temCode;
    }

    return txt;
}

```



## 明文與密鑰的第二階段編碼


1. 1. 以加剪法進行編碼。
   2. 若值超出 16 位數， 以循環的同等位代替。


編碼演示：

```js
var txtCode = 'd39ad1476fba856f2663'; // 密文編碼
var keyCode = increaseKeyCode( '中文' ); // 密鑰

encryptB(  1, 'd39ad1476fba856f2663', keyCode[ 2 ] ); // 編碼   // "c05022b75b779a2109ce"
encryptB( -1, 'c05022b75b779a2109ce', keyCode[ 2 ] ); // 反編碼 // "d39ad1476fba856f2663"


var encryptB_count16 = '0123456789abcdef0123456789abcdef0123456789abcdef';

function encryptB( numOperator, txtCode, keyCode ) {
    numOperator = numOperator === -1 ? numOperator : 1;

    var idx, len, count;
    var temCode, temKey;
    var lenkeyCode = keyCode.length;
    var encryptCode = '';

    for ( idx = 0, len = txtCode.length; idx < len ; idx++ ) {
        temCode = encryptB_count16.indexOf( txtCode[ idx ] );
        temKey  = encryptB_count16.indexOf( keyCode[ idx % lenkeyCode ] );
        count = temCode + temKey * numOperator;

        encryptCode += encryptB_count16[ count + 16 ];
    }

    return encryptCode;
}
```



## 密文保存在雲端資料庫的編碼


**待續編寫， 目前想法是使用轉換碼。**



## 計算解密難度及推測暴力解密方式


**筆者不知道 Orz**



## 依賴程式庫


* [blueimp/JavaScript-MD5 - GitHub](https://github.com/blueimp/JavaScript-MD5)


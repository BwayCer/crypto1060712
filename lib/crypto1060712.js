/*! JavaScript MD5 v2.7.0 @license: MIT - blueimp (https://github.com/blueimp) */
/*! Crypto 1060712 @license: CC-BY-4.0 - BwayCer (https://bwaycer.github.io/about/) */

/**
 * 1060712 號編碼器 Crypto 1060712
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */

"use strict";


!function ( self, classCrypto1060712, fnGetJsMd5 ) {
    var ooxx = new classCrypto1060712( typeof md5 === 'function' ? md5 : fnGetJsMd5() );

    if ( typeof define === 'function' && define.amd ) define( function () { return ooxx; } )
    else if ( typeof module === 'object' && module.exports ) module.exports = ooxx;
    else self.crypto1060712 = ooxx;
}(
this,
function crypto1060712( md5 ) {
    // if ( !md5 ) throw Error( 'Not found "md5" library.' );

    /**
     * 1060712 號編碼器
     *
     * @module crypto1060712
     */

    /**
     * 加密。
     *
     * @memberof module:crypto1060712.
     * @func encrypt
     * @param {String} txtCode - 文本代碼。 明文，需加密內容。
     * @param {String} password - 密碼。
     * @return {String} 密文。
     */
    this.encrypt = function ( txtCode, strPassword ) {
        var ansCode;
        var keyCode = _parseKeyCode( strPassword );

        ansCode = _encryptA( _parseTxtCode( txtCode ), keyCode[ 1 ] );
        ansCode = _encryptB( 1, ansCode, keyCode[ 2 ] );

        return keyCode[ 0 ] + ansCode;
    };

    /**
     * 解密。
     *
     * @memberof module:crypto1060712.
     * @func decrypt
     * @param {String} txtCode - 文本代碼。 密文，需解密內容。
     * @param {String} password - 密碼。
     * @return {String} 明文。
     */
    this.decrypt = function ( txtCode, strPassword ) {
        var verificationCode = txtCode.slice( 0, 16 );
        var keyCode = _parseKeyCode( strPassword );

        if ( verificationCode !== keyCode[ 0 ] ) return '';

        var ansCode = txtCode.slice( 16 );

        ansCode = _encryptB( -1, ansCode, keyCode[ 2 ] );
        ansCode = _encryptA( _toParseIntPre4Words( ansCode ), keyCode[ 1 ] );

        return _reverseParseTxtCode( ansCode );
    };

    /**
     * 替代密文。
     *
     * @memberof module:crypto1060712.
     * @func substitute
     * @param {Number} operator - 正負運算子， 有效值： `1`、`-1`， 用於判斷編碼、反編碼。
     * @param {String} txtCode - 文本代碼。 `0~f` 的值為有效代碼。
     * @param {String} key - 替代密鑰。
     * @return {String}
     */
    this.substitute = function ( numOperator, txtCode, strKey ) {
        var tem;
        var p, len, val, idx;
        var txt = '';

        if ( numOperator === -1 ) {
            tem = [];
            len = 16;

            while ( len-- ) tem[ parseInt( strKey[ len ], 16 ) ] = len.toString( 16 );
            strKey = tem.join( '' );
        }

        for ( p = 0, len = txtCode.length; p < len ; p++ ) {
            val = txtCode[ p ];
            idx = strKey.indexOf( val );

            if ( ~idx ) txt += idx.toString( 16 );
            else txt += val;
        }

        return txt;
    };

    /**
     * 取得替代密鑰。
     *
     * @memberof! module:crypto1060712.
     * @alias substitute.getKey
     * @func  substitute.getKey
     * @return {String}
     */
    this.substitute.getKey = function () {
        var item;
        var random = md5( Math.random() );
        var count16 = '0123456789abcdef';
        var len = 15;
        var key = '';

        while ( len-- ) {
            item = count16[ parseInt( random[ len ], 16 ) % count16.length ];
            key += item;
            count16 = count16.split( item ).join( '' );
        }

        key += count16;

        return key;
    };


    /**
     * 解析文本代碼。
     *
     * @memberof module:crypto1060712~
     * @func _parseTxtCode
     * @param {String} txtcode - 文本代碼。
     * @return {Array} 文本代碼清單。
     */
    function _parseTxtCode( txtCode ) {
        var p, len;
        var txtCodeList = [];

        for ( p = 0, len = txtCode.length; p < len ; p++ ) {
            txtCodeList.push( txtCode.charCodeAt( p ) );
        }

        return txtCodeList;
    }

    /**
     * 反解析文本代碼。
     *
     * @memberof module:crypto1060712~
     * @func _reverseParseTxtCode
     * @param {String} txtcode - 文本代碼。
     * @return {String} 明文。
     */
    function _reverseParseTxtCode( txtCode ) {
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

        return txt;
    }

    /**
     * 解析密鑰代碼。
     *
     * @memberof module:crypto1060712~
     * @func _parseKeyCode
     * @param {String} keyCode - 密鑰代碼。
     * @return {Array} 密鑰代碼。
     */
    function _parseKeyCode( keyCode ) {
        keyCode = _increaseKeyCode( keyCode );

        // 密鑰拆分
        var part = keyCode.length / 4;
        var proportion = parseInt( keyCode[ 17 ], 16 ) || 1;
        var cutPoint = parseInt( part / 16 ) * proportion * 4;
        var keyA = keyCode.slice( 0, cutPoint );
        var keyB = keyCode.slice( cutPoint );

        return [
            md5( keyA.slice( 0, 16 ) + keyB.slice( 0, 16 ) ).slice( 8, 24 ),
            _toParseIntPre4Words( keyA ),
            keyB,
        ];
    }

    /**
     * 強化密鑰代碼： 透過再編碼來強化密鑰。
     *
     * @memberof module:crypto1060712~
     * @func _increaseKeyCode
     * @param {String} keyCode - 密鑰代碼。
     * @return {String}
     */
    function _increaseKeyCode( keyCode ) {
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

        return keyCode;
    }

    /**
     * 第一階段編碼： 使用 `XOR` 位元運算， 加解密同一函式。
     *
     * @memberof module:crypto1060712~
     * @func _encryptA
     * @param {String} txtCodeList - 文本代碼清單。
     * @param {String} keyCode - 密鑰代碼。
     * @return {String}
     */
    function _encryptA( txtCodeList, keyCode ) {
        var idx, len;
        var lenkeyCode = keyCode.length;
        var txt = '';

        for ( idx = 0, len = txtCodeList.length; idx < len ; idx++ ) {
            txt += _makeup4Words( ( txtCodeList[ idx ] ^ keyCode[ idx % lenkeyCode ] ).toString( 16 ) );
        }

        return txt;
    }

    var _encryptB_count16 = '0123456789abcdef0123456789abcdef0123456789abcdef';

    /**
     * 第二階段編碼： 使用加減運算。
     *
     * @memberof module:crypto1060712~
     * @func _encryptB
     * @param {Number} operator - 正負運算子， 有效值： `1`、`-1`。
     * @param {String} txtcode - 文本代碼。
     * @param {String} keyCode - 密鑰代碼。
     * @return {String}
     *
     * @example
     * // 加減編碼說明
     * // 16 位符表示； 8 = 8; f = 15;
     *
     * // 16 位數以內相加減
     * 2 + a = 12 = c // 兩代碼相加得 c。
     * c - a = 12 = 2 // 兩代碼相減得 2。
     *
     * // 超出 16 位數相加減
     * 9 + a = 19; 19 - 15 = 4 // 兩代碼相加，並以循環判斷得 4。
     * 4 - a = -6; -6 + 15 = 9 // 兩代碼相減，並以循環判斷得 9。
     */
    function _encryptB( numOperator, txtCode, keyCode ) {
        numOperator = numOperator === -1 ? numOperator : 1;

        var idx, len;
        var count, temCode, temKey;
        var lenkeyCode = keyCode.length;
        var encryptCode = '';

        for ( idx = 0, len = txtCode.length; idx < len ; idx++ ) {
            temCode = _encryptB_count16.indexOf( txtCode[ idx ] );
            temKey  = _encryptB_count16.indexOf( keyCode[ idx % lenkeyCode ] );
            count = temCode + temKey * numOperator;

            encryptCode += _encryptB_count16[ count + 16 ];
        }

        return encryptCode;
    }

    /**
     * 每四個字就轉換成一個 16 位數值。
     *
     * @memberof module:crypto1060712~
     * @func _toParseIntPre4Words
     * @param {String} txtcode - 文本代碼。
     * @return {Array}
     */
    function _toParseIntPre4Words( txtCode ) {
        var val;
        var idx = 0;
        var len = txtCode.length;
        var ansList = [];

        while ( idx < len ) {
            val = txtCode[ idx++ ]
                + txtCode[ idx++ ]
                + txtCode[ idx++ ]
                + txtCode[ idx++ ];

            ansList.push( parseInt( val, 16 ) );
        }

        return ansList;
    }

    /**
     * 補滿四位數。
     *
     * @memberof module:crypto1060712~
     * @func _makeup4Words
     * @param {String} code - 代碼。
     * @return {String}
     */
    function _makeup4Words( strCode ) {
        var prefix, lenLack;

        lenLack = 4 - strCode.length;

        if ( lenLack ) {
            prefix = '';
            while ( lenLack-- ) prefix += '0';
            strCode = prefix + strCode;
        }

        return strCode;
    }
},
/* JavaScript MD5 v2.7.0 */
function(){
    function t(n,t){var r=(65535&n)+(65535&t),e=(n>>16)+(t>>16)+(r>>16);return e<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[(r+64>>>9<<4)+14]=r;var e,i,a,h,d,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16)i=l,a=g,h=v,d=m,l=o(l,g,v,m,n[e],7,-680876936),m=o(m,l,g,v,n[e+1],12,-389564586),v=o(v,m,l,g,n[e+2],17,606105819),g=o(g,v,m,l,n[e+3],22,-1044525330),l=o(l,g,v,m,n[e+4],7,-176418897),m=o(m,l,g,v,n[e+5],12,1200080426),v=o(v,m,l,g,n[e+6],17,-1473231341),g=o(g,v,m,l,n[e+7],22,-45705983),l=o(l,g,v,m,n[e+8],7,1770035416),m=o(m,l,g,v,n[e+9],12,-1958414417),v=o(v,m,l,g,n[e+10],17,-42063),g=o(g,v,m,l,n[e+11],22,-1990404162),l=o(l,g,v,m,n[e+12],7,1804603682),m=o(m,l,g,v,n[e+13],12,-40341101),v=o(v,m,l,g,n[e+14],17,-1502002290),g=o(g,v,m,l,n[e+15],22,1236535329),l=u(l,g,v,m,n[e+1],5,-165796510),m=u(m,l,g,v,n[e+6],9,-1069501632),v=u(v,m,l,g,n[e+11],14,643717713),g=u(g,v,m,l,n[e],20,-373897302),l=u(l,g,v,m,n[e+5],5,-701558691),m=u(m,l,g,v,n[e+10],9,38016083),v=u(v,m,l,g,n[e+15],14,-660478335),g=u(g,v,m,l,n[e+4],20,-405537848),l=u(l,g,v,m,n[e+9],5,568446438),m=u(m,l,g,v,n[e+14],9,-1019803690),v=u(v,m,l,g,n[e+3],14,-187363961),g=u(g,v,m,l,n[e+8],20,1163531501),l=u(l,g,v,m,n[e+13],5,-1444681467),m=u(m,l,g,v,n[e+2],9,-51403784),v=u(v,m,l,g,n[e+7],14,1735328473),g=u(g,v,m,l,n[e+12],20,-1926607734),l=c(l,g,v,m,n[e+5],4,-378558),m=c(m,l,g,v,n[e+8],11,-2022574463),v=c(v,m,l,g,n[e+11],16,1839030562),g=c(g,v,m,l,n[e+14],23,-35309556),l=c(l,g,v,m,n[e+1],4,-1530992060),m=c(m,l,g,v,n[e+4],11,1272893353),v=c(v,m,l,g,n[e+7],16,-155497632),g=c(g,v,m,l,n[e+10],23,-1094730640),l=c(l,g,v,m,n[e+13],4,681279174),m=c(m,l,g,v,n[e],11,-358537222),v=c(v,m,l,g,n[e+3],16,-722521979),g=c(g,v,m,l,n[e+6],23,76029189),l=c(l,g,v,m,n[e+9],4,-640364487),m=c(m,l,g,v,n[e+12],11,-421815835),v=c(v,m,l,g,n[e+15],16,530742520),g=c(g,v,m,l,n[e+2],23,-995338651),l=f(l,g,v,m,n[e],6,-198630844),m=f(m,l,g,v,n[e+7],10,1126891415),v=f(v,m,l,g,n[e+14],15,-1416354905),g=f(g,v,m,l,n[e+5],21,-57434055),l=f(l,g,v,m,n[e+12],6,1700485571),m=f(m,l,g,v,n[e+3],10,-1894986606),v=f(v,m,l,g,n[e+10],15,-1051523),g=f(g,v,m,l,n[e+1],21,-2054922799),l=f(l,g,v,m,n[e+8],6,1873313359),m=f(m,l,g,v,n[e+15],10,-30611744),v=f(v,m,l,g,n[e+6],15,-1560198380),g=f(g,v,m,l,n[e+13],21,1309151649),l=f(l,g,v,m,n[e+4],6,-145523070),m=f(m,l,g,v,n[e+11],10,-1120210379),v=f(v,m,l,g,n[e+2],15,718787259),g=f(g,v,m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,h),m=t(m,d);return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function h(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function d(n){return a(i(h(n),8*n.length))}function l(n,t){var r,e,o=h(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(h(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="0123456789abcdef",o="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),o+=e.charAt(t>>>4&15)+e.charAt(15&t);return o}function v(n){return unescape(encodeURIComponent(n))}function m(n){return d(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}
    // "function"==typeof define&&define.amd?define(function(){return A}):"object"==typeof module&&module.exports?module.exports=A:n.md5=A
    return A;
}
);

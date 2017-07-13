/***
 * 由 loop 執行 x 1,449,463 ops/sec ±0.87% (91 runs sampled)
 * 由 match regexAllow 執行 x 837,836 ops/sec ±1.04% (89 runs sampled)
 * 由 match regexAllWord 執行 x 826,926 ops/sec ±1.15% (91 runs sampled)
 * 由 replace regexAllow 執行 x 717,859 ops/sec ±1.08% (89 runs sampled)
 * 由 replace regexAllWord 執行 x 728,032 ops/sec ±1.07% (92 runs sampled)
 * 調用最快為： 由 loop 執行
 */

'use strict';

var Benchmark = require( 'benchmark' );

Benchmark.prototype.setup = function() {
    var txtList = [ '0123', '4567', '89ab', 'cdef', '1a3b', 'c5d7', '9e4f', '8aa' ];
    var txt = txtList.join( '' );

    var regexAllow = /[A-Fa-f0-9]{0,4}/g;
    var regexAllWord = /\w{0,4}/g;

    function collectItem( anyItem ) {
        collectItem.list.push( anyItem );
    }

    collectItem.list = [];

    collectItem.checkRight = function ( strName ) {
        var list = this.list;
        var len = txtList.length;

        while ( len-- ) if ( txtList[ len ] !== list[ len ] )
            console.log( '"' + strName + '" 未通過驗證。' );
    }
};

( new Benchmark.Suite )
    .add( '由 loop 執行', function () {
        var val;
        var idx = 0;
        var len = txt.length;

        collectItem.list.length = 0;

        while ( idx < len ) {
            val = ( txt[ idx++ ] || '' )
                + ( txt[ idx++ ] || '' )
                + ( txt[ idx++ ] || '' )
                + ( txt[ idx++ ] || '' );

            collectItem( val );
        }

        collectItem.checkRight( '由 loop 執行' );
    } )
    .add( '由 match regexAllow 執行', function () {
        var match = txt.match( regexAllow );

        collectItem.list.length = 0;
        for ( var p = 0, len = match.length; p < len ; p++ ) collectItem( match[ p ] );
        collectItem.checkRight( '由 match regexAllow 執行' );
    } )
    .add( '由 match regexAllWord 執行', function () {
        var match = txt.match( regexAllWord );

        collectItem.list.length = 0;
        for ( var p = 0, len = match.length; p < len ; p++ ) collectItem( match[ p ] );
        collectItem.checkRight( '由 match regexAllWord 執行' );
    } )
    .add( '由 replace regexAllow 執行', function () {
        collectItem.list.length = 0;
        txt.replace( regexAllow, function ( val ) { collectItem( val ); } );
        collectItem.checkRight( '由 replace regexAllow 執行' );
    } )
    .add( '由 replace regexAllWord 執行', function () {
        collectItem.list.length = 0;
        txt.replace( regexAllWord, function ( val ) { collectItem( val ); } );
        collectItem.checkRight( '由 replace regexAllWord 執行' );
    } )
    .on( 'cycle', function ( event ) {
          console.log( event.target.toString() );
    } )
    .on( 'complete', function () {
        console.log( '調用最快為： ' + this.filter('fastest').map('name') );
    } )
    .run()
;


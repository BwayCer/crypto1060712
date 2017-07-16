/**
 * 1060712 號公告
 *
 * @file
 */

"use strict";


!function() {
    var isPcMode = !~navigator.userAgent.indexOf( 'Mobile' );

    !function() {
        var bodyClassList = document.body.classList;

        if ( isPcMode ) bodyClassList.add( 'onPc' );
        else bodyClassList.add( 'onMobile' );
    }();


    document.querySelector( '.topLayer' ).onselectstart = function() { return false; };
    document.querySelectorAll( '.toolBox_boxIcon' ).forEach( function ( helItem ) {
        helItem.onselectstart = function() { return false; };
    } );


    if ( isPcMode ) {
        document.querySelectorAll( '.toolBox_enabledBox' )
            .forEach( function ( helItem ) {
                helItem.addEventListener( 'mouseenter', function () {
                    this.classList.add( 'onShowTitle' );
                } );

                helItem.addEventListener( 'mouseleave', function () {
                    this.classList.remove( 'onShowTitle' );
                } );
            } );
    } else {
        !function() {
            var drawId = null;

            document.getElementById( 'toolBox_squareMenu' )
                .addEventListener( 'click', function ( evt ) {
                    if ( drawId ) cancelAnimationFrame( drawId );

                    requestAnimationFrame( () => {
                        drawId = null;

                        var helRipple = this.querySelector( '.ripple' );

                        helRipple.style.top = evt.offsetY + 'px';
                        helRipple.style.left = evt.offsetX + 'px';

                        var p, len;
                        var brothers = this.parentNode.children;

                        for ( p = 0, len = brothers.length; p < len ; p++ ) {
                            brothers[ p ].classList.toggle( 'onShowTitle' );
                        }
                    } );
                } );
        }();
    }
}();


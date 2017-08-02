/**
 * 1060712 號公告
 *
 * @file
 */

"use strict";


!function () {
    var isPcMode = !~navigator.userAgent.indexOf( 'Mobile' );

    var bodyClassList = document.body.classList;

    if ( isPcMode ) bodyClassList.add( 'onPc' );
    else bodyClassList.add( 'onMobile' );


    document.querySelector( '.mainSign' ).onselectstart = function () { return false; };
    document.querySelectorAll( '.optsBtn_enabledBox > h1' ).onselectstart = function () { return false; };


    scopeScript( function () {
        if ( isPcMode ) {
            document.querySelectorAll( '.optsBtn_enabledBox' )
                .forEach( function ( helItem ) {
                    helItem.addEventListener( 'mouseenter', function () {
                        this.classList.add( 'onShowTitle' );
                    } );

                    helItem.addEventListener( 'mouseleave', function () {
                        this.classList.remove( 'onShowTitle' );
                    } );
                } );
        } else {
            document.getElementById( 'optsBtn_squareMenu' )
                .addEventListener( 'click', function ( evt ) {
                    var helRipple = this.querySelector( '.ripple' );

                    helRipple.style.top = evt.offsetY + 'px';
                    helRipple.style.left = evt.offsetX + 'px';

                    this.classList.toggle( 'onShowTitle' );

                    var p, len, val;
                    var brothers = this.parentNode.children;

                    for ( p = 0, len = brothers.length; p < len ; p++ ) {
                        val = brothers[ p ].classList;
                        if ( val.contains( 'optsBtn_enabledBox' ) ) val.toggle( 'onShowTitle' );
                    }
                } );
        }


        document.getElementById( 'optsBtn_sourceCode' ).onclick = function () {
            window.open( 'https://github.com/BwayCer/crypto1060712', '_blank' );
        };

        document.getElementById( 'optsBtn_reportProblem' ).onclick = function () {
            window.open( 'https://github.com/BwayCer/crypto1060712/issues', '_blank' );
        };
    } );


    scopeScript( function () {
        var helManagement = document.getElementById( 'management' );

        function resetPosition( helEnabledBox, fnDone ) {
            var boundingClientRect = helEnabledBox.getBoundingClientRect();
            var helBoxMain = document.getElementById( 'toolBox_main' );

            helBoxMain.style.transition = 'initial';
            helBoxMain.style.width = boundingClientRect.width + 'px';
            helBoxMain.style.height = boundingClientRect.height + 'px';
            helBoxMain.style.top =  window.scrollY + boundingClientRect.top + 'px';
            helBoxMain.style.left = window.scrollX + boundingClientRect.left + 'px';

            setTimeout( function () {
                helBoxMain.style.transition = null;
                fnDone();
            }, 32 );
        }

        function closeBoxContent( evt ) {
            var managementClassList = helManagement.classList;
            var witchItem = '';

            if ( managementClassList.contains( 'onOpen_read' ) ) witchItem = 'read';
            else if ( managementClassList.contains( 'onOpen_write' ) ) witchItem = 'write';
            else if ( managementClassList.contains( 'onOpen_history' ) ) witchItem = 'history';

            resetPosition( document.getElementById( 'optsBtn_' + witchItem ), function () {
                helManagement.classList.add( 'onClose_' + witchItem );
                helManagement.classList.remove( 'onOpen_' + witchItem );
            } );

            evt.stopPropagation();
        }

        document.getElementById( 'optsBtn_read' ).addEventListener( 'click', function () {
            resetPosition( this, function () {
                helManagement.classList.remove( 'onClose_read', 'onClose_write', 'onClose_history' );
                helManagement.classList.add( 'onOpen_read' );
            } );
        } );

        document.getElementById( 'optsBtn_write' ).addEventListener( 'click', function () {
            resetPosition( this, function () {
                helManagement.classList.remove( 'onClose_read', 'onClose_write', 'onClose_history' );
                helManagement.classList.add( 'onOpen_write' );
            } );
        } );

        document.getElementById( 'optsBtn_history' ).addEventListener( 'click', function () {
            resetPosition( this, function () {
                helManagement.classList.remove( 'onClose_read', 'onClose_write', 'onClose_history' );
                helManagement.classList.add( 'onOpen_history' );
            } );
        } );

        document.getElementById( 'toolBox' ).addEventListener( 'click', closeBoxContent );
        document.getElementById( 'toolBox_main_close' )
            .addEventListener( 'click', closeBoxContent );

        document.getElementById( 'toolBox_main' )
            .addEventListener( 'click', function ( evt ) {
                evt.stopPropagation();
            } );
    } );


    function onFocusOfMobile() {
        var helBody = document.body;

        helBody.classList.add( 'onFocus' );
        helBody.style.height = helBody.scrollHeight + 'px';
    }

    function onBlurOfMobile() {
        var helBody = document.body;

        helBody.style.height = null;
        helBody.classList.remove( 'onFocus' );
    }

    scopeScript( function () {
        var urlCarryCiphertext = location.search.match( /[?&]code=([0-9a-f]+)/ );

        if ( !urlCarryCiphertext ) return;

        var helCiphertextInput = document.getElementById( 'toolBox_read_inputCiphertextText' );
        var helInputBox = helCiphertextInput.parentNode;

        urlCarryCiphertext = urlCarryCiphertext[ 1 ];
        helInputBox.classList.add( 'onFocus', 'onCatchScrapbook' );
        helCiphertextInput.value = urlCarryCiphertext;
        helCiphertextInput.onchange
            = helCiphertextInput.onkeyup
            = function () {
                console.log(this.value, arguments);
                if ( this.value !== urlCarryCiphertext ) {
                    urlCarryCiphertext = this.onchange = this.onkeyup = null;
                    this.parentNode.classList.remove( 'onCatchScrapbook' );
                }
            };
    } );


    scopeScript( function () {
        var helBoxRead = document.getElementById( 'toolBox_read' );

        helBoxRead
            .querySelectorAll( '#toolBox_read_inputCiphertextText, #toolBox_read_inputKeyText' )
            .forEach( function ( helItem ) {
                console.log( helItem );
                helItem.addEventListener( 'focus', function () {
                    onFocusOfMobile();
                    this.parentNode.classList.add( 'onFocus' );
                } );

                helItem.addEventListener( 'blur', function () {
                    onBlurOfMobile();

                    if ( !this.value ) this.parentNode.classList.remove( 'onFocus' );
                } );
            } );

        document.getElementById( 'toolBox_read_form_submit' )
            .addEventListener( 'click', function () {
                var helCiphertextInput
                    = document.getElementById( 'toolBox_read_inputCiphertextText' );
                var helKeyInput = document.getElementById( 'toolBox_read_inputKeyText' );
                var ciphertext = helCiphertextInput.value;

                if ( !ciphertext ) {
                    alert();
                    return;
                }

                var helCryptoInfo = document.getElementById( 'cryptoInfo' );

                helCryptoInfo.className = '';

                if ( ciphertext[ 0 ] === 'U' ) {
                    helCryptoInfo.classList.add( 'onNoKey' );
                    ciphertext = ciphertext.slice( 1 );
                }

                if ( ciphertext[ 0 ] === 'G' ) {
                }

                helCryptoInfo.classList.add( 'onOpen' );
            } );
    } );


    function scopeScript( fnScript ) { fnScript(); };
}();


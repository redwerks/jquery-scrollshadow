/*!
 * Copyright © 2012 Redwerks Systems Inc. (http://redwerks.org)
 * @author Daniel Friesen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
( function( $, undefined ) {

  function onscroll( target, options ) {
    var topShadowLength    = Math.min( options.max, Math.max( 0, target.scrollTop ) ) + 'px',
        bottomShadowLength = Math.min( options.max, Math.max( 0, target.scrollHeight - target.scrollTop - target.offsetHeight ) ) + 'px',

        topShadow     = [ 0, topShadowLength, topShadowLength, '-' + topShadowLength, options.color, 'inset' ].join( ' ' ),
        bottomShadow  = [ 0, '-' + bottomShadowLength, bottomShadowLength, '-' + bottomShadowLength, options.color, 'inset' ].join( ' ' ),
        shadows       = options['bottomShadow'] === true ? [ topShadow, bottomShadow ] : [ topShadow ] ;

    $( target ).css( 'box-shadow', shadows.join( ', ' ) );
  }

  $.fn.scrollshadow = function( selector, options ) {
    if ( !options ) options = {};

    if ( typeof selector === 'string' ) options['selector'] = selector;

    options = $.extend( {
      selector: '*',
      color:    '#aaa',
      max:      20
    }, options );

    if ( document.addEventListener ) {
      // If the browser implements addEventListener use traversing events to capture the event
      this.each( function() {
        this.addEventListener( 'scroll', function( event ) {
          var e = $.event.fix( event || window.event );
          if ( !$( e.target ).is( options.selector ) ) {
            return;
          }
          return onscroll.call( this, e.target, options );
        }, true );
      } );
    } else {
      // In browsers like IE fall back to a method that doesn't work dynamically
      this.find( options.selector ).scroll( function( e ) {
        return onscroll.call( this, e.target, options );
      } );
    }

    // Fire event once to draw bottom shadow on load
    onscroll.call( this, this.find( options.selector )[0], options );

    return this;
  };

} )( jQuery );
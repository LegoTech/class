account = {}
account._hash = ""
account._search = ""
account.hashchange = function(){
    var that = this
    if( 'onhashchange' in window ) {
        window.onhashchange = function(){
            that._hash = location.hash.replace(/\#|\!/g, '')
            if ( !$('#'+that._hash).html() ) {
            	console.log("update "+that._hash)
              that.show()
            }
            return that._hash
        }
    }
}

account.show = function(){}

$(function() {
// Handler for .ready() called.

var that = account
that._hash = location.hash.replace(/\#|\!/g, '')
that._search = location.search.replace(/\?/g, '')
util.get_user_center()
that.hashchange()
util.show_navbar({id:"navbar", page:"account"})
if ( !that._hash ) {util.set_hash('consuming')}




});
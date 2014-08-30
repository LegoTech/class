admin = {}
admin._hash = ""
admin.pages = {
	authority: {
		title: "用户权限"
	},
	center: {
		title: "中心信息"
	},
  set: {
    title: "套餐信息"
  }
}
admin._hash = ""
admin.hashchange = function(){
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

admin.show = function(){}

$(function() {
// Handler for .ready() called.

var that = admin
util.get_user_center()
that.hashchange()
util.show_navbar({id:"navbar", page:"admin"})
util.show_tab({tid:"myTab", cid:"myTabContent", pages:that.pages, 
			prename:'<i class="icon-chevron-right"></i>', dosethash:true})




});
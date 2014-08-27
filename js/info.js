info = {}
info.pages = {
	students: {
		title: "学生信息"
	},
	classes: {
		title: "课程信息"
	}
}
info._hash = ""
info.hashchange = function(){
    var that = this
    if( 'onhashchange' in window ) {
        window.onhashchange = function(){
            that._hash = location.hash.replace(/\#|\!/g, '')
            if ( !$('#'+that._hash).html() ) {
            	console.log("update "+that._hash)
            }
            return that._hash
        }
    }
}
info.show = {}
info.show.students = function(_ops){
	var lists = []
	util.show_search()
}
info.show.studentsback = function(_ops){
	util.show_table()
}

$(function() {
// Handler for .ready() called.


util.get_user()
info.hashchange()
util.show_navbar({id:"navbar", page:"info"})
util.show_tab({tid:"myTab", cid:"myTabContent", pages:info.pages, 
			prename:'<i class="icon-chevron-right"></i>', dosethash:true})



});
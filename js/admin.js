admin = {}
admin._hash = ""
admin.pages = {
  center: {
    title: "中心信息"
  },
	authority: {
		title: "用户权限"
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

admin.show = function(){
  var that = this
  $('#'+that._hash).empty().html('<div class="span5" id="'+that._hash+'_table"></div><div class="span5" id="'+that._hash+'_table"></div>')
  //C#读取当前权限可以看到的所有中心的信息
  var _ops = {
    thead: ['desc', 'name'],
    tbody: [[1,'sss', 'dd'], [2,'ssss', '22']],
    page:{            //（可选）
      cur: 1,
      count: 11
    }
  }
  var trlength = _ops.tbody.length,
      value
  for (var i=0; i<trlength; i++) {
    value = _ops.tbody[i].shift()
    _ops.tbody[i].push('<a class="btn btn-primary btn-small" data-type="update" data-value="'+value+'" href="#"><i class="icon-wrench icon-white"></i> 修改</a>')
  }
  _ops.thead.push('操作')
  util.show_table({id:that._hash+'_table', thead:_ops.thead, tdata:[], tbody:_ops.tbody, sort:[]});
  $('#'+that._hash+'_table').prepend('<p style="margin-top: 5px;"><a data-type="add" href="#"><i class="icon-plus-sign opacity-5"></i> 添加'+that.pages[that._hash].title+'</a></p>')
}

admin.show_form = function(){
  
}

function forcs_refresh(){
  window.location.href = "admin.html"
}

$(function() {
// Handler for .ready() called.

var that = admin
util.get_user_center()
that.hashchange()
util.show_navbar({id:"navbar", page:"admin"})
util.show_tab({tid:"myTab", cid:"myTabContent", pages:that.pages, 
			prename:'<i class="icon-chevron-right"></i>', dosethash:true})

});

$(document).on('click', function(e){
    e = e || window.event;
    var target = e.target || e.srcElement
    var _ta = $(target)
    var that = admin
    if ( !_ta.attr('data-type') ) {
      _ta = _ta.parents('[data-type]')
    }
    var type = _ta.attr('data-type')
    if ( !type ) { return; }
    util.stopDefault(e)
    var value = _ta.attr('data-value')
    switch ( type ) {
      case 'add':
        
      break; case 'update':
        //调C#函数获取值，C#调forcs_back进行下一步操作
      break;
    }
});
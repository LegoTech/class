util = {
    pages:{
        info: {
            title: "信息",
            url: "info"
        },
        charging: {
            title: "充值",
            url: "account#charging"
        },
        consuming: {
            title: "消费",
            url: "account#consuming"
        },
        stat: {
            title: "统计",
            url: "stat"
        },
        admin: {
            title: "管理",
            url: "admin",
            admin: true
        }
    },
    user:{
        name: "Username",
        isadmin: false
    }
}

util.get_user = function(){

}

/*
_ops:{
    id:'',          //容器
    page:''         //页面
}
util.pages, util.user
*/
util.show_navbar = function(_ops){
    var rhtml = ''
    var that = this;
    rhtml = '<div class="navbar-inner">\
        <div class="container-fluid">\
          <span class="brand">lego Tech</span>\
          <div class="nav-collapse collapse">\
            <ul class="nav pull-right">\
            <li class="dropdown">'
    rhtml += '<a href="javascript:void(0)" id="uLabel" class="dropdown-toggle" data-toggle="dropdown">'
            + that.user.name +'<b class="caret"></b></a>\
                <ul class="dropdown-menu" role="menu" aria-labelledby="uLabel">\
                <li>\
                  <a>注销！</a>\
                </li>\
              </ul>\
            </li>\
            </ul>\
            <ul class="nav">'
    for ( key in that.pages ) {
        if ( that.pages[key].admin && !that.user.isadmin )  {continue;}
        if ( key === _ops.page ) {
            rhtml += '<li class="active">'
        }else{
            rhtml += '<li>'
        }
        rhtml += '<a href="'+that.pages[key].url+'.html">'+that.pages[key].title+'</a></li>'
    }
    rhtml += '</ul>\
          </div><!--/.nav-collapse -->\
        </div>\
      </div>'
    var _el = $('#'+_ops.id)
    _el.addClass('navbar navbar-inverse navbar-fixed-top')
    _el.html(rhtml)
    $('.dropdown-toggle').dropdown()
}

/*
_ops:{
    tid:'',             //tab容器
    cid:'',             //content容器
    page:''             //页面
}
*/
util.show_tab = function(_ops){

}

/*
_ops:{
	id:'',			//容器
	thead: [],
	twidth: [],
	tdata: [],		//行标志，字符串
	tbody: [],		//数据
	sort: [],
	operate: [],	//操作
	callback: function
}
*/
util.show_table = function(_ops){
	var r = '', len = '', caret = ''
    if( _ops.thead ){
        caret = ' <b class="caret"></b>'
        len = _ops.thead.length
        r = '<thead><tr>'
        for(var j=0;j<len;j++){
            if( !_ops.thead[j] ) _ops.thead[j] = ''
            r += '<th width="'+(_ops.twidth?_ops.twidth[j]:'')+'">'+_ops.thead[j]+caret+'</th>'
        }
        r += '</tr></thead>'
    }else{
        len = _ops.tbody[0].length
    }
 	if( _ops.tbody ){
        r += '<tbody>'
        for(var i=0;i<_ops.tbody.length;i++){
            r += '<tr'+(_ops.tdata?_ops.tdata[i]:'')+'>'
            for(var j=0;j<len;j++){
                if( !_ops.tbody[i][j] ) _ops.tbody[i][j] = ''
                r += '<td>'+_ops.tbody[i][j]+'</td>'
            }
            r += '</tr>'
        }
        r += '</tbody>'
    }

    var _el = $('#'+_ops.id)

    _el.html('<table class="table table-striped table-bordered table-hover '+(_ops.operate?' tr-ops':'')+(_ops.sort?' tablesort':'')+'">'+r+'</table>')

    var _table = _el.find('.tablesort')
    _ops.sort && _table.tablesorter({sortList: _ops.sort})

    if ( _ops.operate.length ){
    	
    }

    if ( _ops.callback && (typeof _ops.callback === 'function') ){
        return _ops.callback()
    }
}

/*
_ops:{
    id:'',          //容器
    operate: []     //操作
}
*/
util.Bind_tr_op = function(_ops){
    this._ops = _ops;
    this.hideop = {};
}
Bind_tr_op.prototype.mousein = function(){

}
Bind_tr_op.prototype.mouseout = function(){
    
}
Bind_tr_op.prototype.bind = function(){
    $('#'+this._ops.id).find('.tr-ops').hover(this.mousein, this.mouseout);
    
}

/*
_ops:{
	id:'',		//容器
	lists: []	//内容	
}
*/
util.show_search = function(_ops){
	var rhtml = '';
	//默认type为text，不为text另外说明，默认place=desc
	var inputs = {
		cardid: {
			desc: '卡号'
		}
	}
}
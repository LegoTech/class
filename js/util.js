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

util.set_hash = function(e){
    return location.hash = e||''
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
            document.title = that.pages[key].title
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
    pages:{},           //页面
    prename:"",         //a标签内容（可选）
    dosethash:true      //是否触发sethash
}
util.set_hash
*/
util.show_tab = function(_ops){
  if ( !_ops.tid || !_ops.cid || !_ops.pages ) return;
    var that = this
    var _tel = $('#'+_ops.tid)
    var _cel = $('#'+_ops.cid)
    _ops.prename = _ops.prename || ""
    var thtml='', chtml=''
    for ( key in _ops.pages ) {
        thtml += '<li><a href="#' + key + '" data-toggle="tab">' + 
                _ops.prename + _ops.pages[key].title + '</a></li>'
        chtml += '<div class="tab-pane" id="' + key + '"></div>'
    }
    _tel.html(thtml)
    _cel.addClass("tab-content").html(chtml)
    _tel.find('a').click(function (e) {
      $(this).tab('show')
      if (_ops.dosethash ) {
        util.set_hash(this.hash.substring(1))
      }
    });
    var af = _tel.find('a:first')
    af.tab('show')
    if (_ops.dosethash ) {
        util.set_hash(af[0].hash.substring(1))
    }
}

/*
_ops:{
	id:'',			          //容器
	thead: [],
	twidth: [],
	tdata: [],		           //行标志，字符串
	tbody: [],		           //数据
	sort: [],                  //(可选)
	operate: [],	          //操作（可选）
	callback: function        //（可选）
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
util.Bind_tr_op.prototype.mousein = function(){

}
util.Bind_tr_op.prototype.mouseout = function(){
    
}
util.Bind_tr_op.prototype.bind = function(){
    $('#'+this._ops.id).find('.tr-ops').hover(this.mousein, this.mouseout);
    
}

/*
_ops:{
	id:'',		//容器form
	lists: [],	//内容
  defaultv:{}  //默认值	
}
*/
util.show_search = function(_ops){
  if ( !_ops.id || !_ops.lists.length ) return;
  _ops.defaultv = _ops.defaultv || {} 
	var rhtml = '';
	//默认type为text，不为text另外说明，默认placeholder为desc
	var inputs = {
		CardNo: {
			 desc: '学员卡号'
		},
    StuName: {
        desc: '学生姓名'
    },
    School: {
        desc: '学校'
    },
    ClassId: {
        desc: '课程编号'
    },
    ClassName: {
        desc: '课程名'
    }
	}
  var TeacherNames = {0:"xx", 1:"yy"},   //C#获得教师id和name,状态值
      Status = {0:"开始", 1:"结束" }
  var selects = {
    TeacherName: {
        desc: '教师姓名',
        options: TeacherNames
    },
    Status: {
        desc: '状态',
        options: Status
    }
  }
  var tmp = ""
  for (var k=0; k<_ops.lists.length; k++) {
    tmp = _ops.lists[k]
    if ( inputs[tmp] ) {
      rhtml += '<div class="input-prepend">\
                  <span class="add-on">' + inputs[tmp].desc + '</span>\
                  <input class="span2" name="' + tmp + '" type="' + (inputs[tmp].type||'text') +
                  '" placeholder="' + (_ops.defaultv[tmp]||inputs[tmp].desc) + '">\
                </div>'
      continue;
    }    
    if ( selects[tmp] ) {
      rhtml += '<div class="input-prepend">\
                  <span class="add-on">' + selects[tmp].desc + '</span>\
                  <select name="' + tmp + '"><option>' + selects[tmp].desc + '</option>'
      for ( key in selects[tmp]["options"] ) {
        if ( _ops.defaultv[tmp] === key ) {
          rhtml += '<option value="' + key + '" selected="selected">' + selects[tmp]["options"][key] + '</option>'
        }else{
          rhtml += '<option value="' + key + '">' + selects[tmp]["options"][key] + '</option>'
        }      
      }
      rhtml += '</select></div>'
    }
  }
  rhtml += '<button data-type="search">搜索</button>'
  $("#"+_ops.id).empty().html(rhtml)
}
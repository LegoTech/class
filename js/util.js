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
        isadmin: true
    },
    center:{
        cur: 0,
        desc: {0: "xx店"}
    },
    autoarr:{
        StuName: [],
        ClassName: []
    }
}

util.placeholder_hack = function(){
  //Assign to those input elements that have 'placeholder' attribute
  $('input[placeholder]').each(function(){  
      var input = $(this);        
      $(input).val(input.attr('placeholder'));
                  
      $(input).focus(function(){
          if (input.val() == input.attr('placeholder')) {
             input.val('');
          }
      });
          
      $(input).blur(function(){
         if (input.val() == '' || input.val() == input.attr('placeholder')) {
             input.val(input.attr('placeholder'));
         }
      });
  });
}

util.stopDefault = function(e){ 
    //阻止默认浏览器动作(W3C) 
    if ( e && e.preventDefault ) {
        e.preventDefault(); 
    //IE中阻止函数器默认动作的方式 
    }else{
        window.event.returnValue = false; 
    }
    return false; 
}

util.get_user_center = function(){
  //C#获取user信息,center信息
}

util.get_autoarr = function(){
  //C#获取autoarr数据
}

util.set_hash = function(e){
    return location.hash = e||''
}

/*
_ops:{
    id:'',          //容器
    page:''         //页面    
}
util.pages, util.user, util.center
*/
util.show_navbar = function(_ops){
    var rhtml = '', chtml=''
    var that = this
    var ct = that.center
    chtml += '<li class="dropdown">\
                <a href="javascript:void(0)" id="cLabel" class="dropdown-toggle" data-toggle="dropdown">'
                + ct.desc[ct.cur] +'<b class="caret"></b></a>\
                <ul class="dropdown-menu" role="menu" aria-labelledby="cLabel">'
    for ( key in ct.desc ) {
      if ( key === ct.cur ) {
        chtml += '<li>\
                    <a data-type="center" data-value="' + key + '">' + ct.desc[key] + '</a>\
                  </li>'
      }else{
        chtml += '<li>\
                    <a data-type="center" data-value="' + key + '">' + ct.desc[key] + '</a>\
                  </li>'
      }
    }
    chtml += '</ul>\
            </li>'
    rhtml = '<div class="navbar-inner">\
        <div class="container-fluid">\
          <span class="brand">lego Tech</span>\
          <div class="nav-collapse collapse">\
            <ul class="nav pull-right">\
              <li class="dropdown">\
                <a href="javascript:void(0)" id="uLabel" class="dropdown-toggle" data-toggle="dropdown">'
                + that.user.name +'<b class="caret"></b></a>\
                <ul class="dropdown-menu" role="menu" aria-labelledby="uLabel">\
                  <li>\
                    <a href="#user_modal">修改密码</a>\
                  </li>\
                  <li>\
                    <a data-type="signout">注销！</a>\
                  </li>\
                </ul>\
              </li>' + chtml +
            '</ul>\
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
    _el.addClass('navbar navbar-inverse navbar-fixed-top').empty().html(rhtml)
    $('.dropdown-toggle').dropdown()
    _el.find('ul.pull-right').find('a').on('click', function(e){
      var type = $(this).attr('data-type')
      if ( !type ) return true;
      switch ( type ){
        case 'signout':
          //C#注销函数，由C#跳到login
        break; case 'center':
          var value = $(this).attr('data-value')
          if ( value === that.center.cur ) {return true;}
          //C#修改center，刷新页面forcs_refresh
          //要求每个页面都有forcs_refresh函数
        break;
      }
    });
}

/*
_ops:{
    tid:'',             //tab容器
    cid:'',             //content容器
    pages:{},           //页面
    prename:"",         //a标签内容（可选）
    dosethash:true,      //是否触发sethash
    clickback: function        //（可选）
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
    _tel.empty().html(thtml)
    _cel.addClass("tab-content").empty().html(chtml)
    _tel.find('a').click(function (e) {
      $(this).tab('show')
      if (_ops.dosethash ) {
        util.set_hash(this.hash.substring(1))
      }
      if ( _ops.clickback && (typeof _ops.clickback === 'function') ){
        return _ops.clickback(_ops)
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
	twidth: [],              //（可选）
	tdata: [],		           //行标志，字符串
	tbody: [],		           //数据
	sort: [],                  //(可选)
	operate: {},	          //操作（可选）
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

    _el.empty().html('<table class="table table-striped table-bordered table-hover '+(_ops.operate?' tr-ops':'')+(_ops.sort?' tablesort':'')+'">'+r+'</table>')

    var _table = _el.find('.tablesort')
    _ops.sort && _table.tablesorter({sortList: _ops.sort})

    if ( _ops.callback && (typeof _ops.callback === 'function') ){
        return _ops.callback(_ops)
    }
}

/*
_ops:{
  id:"", 
  cur:1,
  count:12
}
*/
util.show_pagination = function(_ops){
  var rhtml = '<div class="pagination">\
                <ul>'
  if ( _ops.cur===1 ) {
    rhtml += '<li class="disabled"><span>&laquo;</span></li>'
  }else{
    rhtml += '<li data-type="page" data-value="'+(_ops.cur-1)+'"><a href="#">&laquo;</a></li>'
  }
  for (var i=1; i<=_ops.count; i++) {
    if ( _ops.cur===i ){
      rhtml += '<li class="active"><span>'+i+'</span></li>'
    }else{
      rhtml += '<li data-type="page" data-value="'+i+'"><a href="#">'+i+'</a></li>'
    }
  }
  if ( _ops.cur===_ops.count ) {
    rhtml += '<li class="disabled"><span>&raquo;</span></li>'
  }else{
    rhtml += '<li data-type="page" data-value="'+(_ops.cur+1)+'"><a href="#">&raquo;</a></li>'
  }
  rhtml +=  '</ul>\
          </div>'
  $('#'+_ops.id).empty().html(rhtml)
}
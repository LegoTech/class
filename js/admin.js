admin = {}
admin._hash = ""
admin.pages = {
  center: {
    title: "中心信息",
    auth: ["boss"]
  },
	authority: {
		title: "用户权限",
    auth: ["boss", "master", "operator"]
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
  $('#'+that._hash).empty().html('<div class="span5" id="'+that._hash+'_table"></div><div class="span5" id="'+that._hash+'_form"></div>')
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
    _ops.tbody[i].push('<a class="btn btn-primary btn-mini" data-type="update" data-value="'+value+'" href="#"><i class="icon-wrench icon-white"></i> 修改</a>')
  }
  _ops.thead.push('操作')
  util.show_table({id:that._hash+'_table', thead:_ops.thead, tdata:[], tbody:_ops.tbody, sort:[]});
  if ( !that.pages[that._hash].bossadd || util.user.isboss ) $('#'+that._hash+'_table').prepend('<p style="margin-top: 5px;"><a data-type="add" href="#"><i class="icon-plus-sign opacity-5"></i> 添加'+that.pages[that._hash].title+'</a></p>')
}

/*_ops:{
  id:'',               //容器
  valueid: 1,            //如果是更新，读取数据
  clickback: function     //（可选）
}
*/
admin.show_form = function(_ops){
  var _el = $('#'+_ops.id)
  var that = this
  //inputs,默认type为text，不为text另外说明，默认placeholder为desc
  //autocomplete, date, spinner为bool
  var inputs = {
    cCenterId:  {desc: '中心编号',      disable:true},
    Id:         {desc: '编号',          disable:true},
    Name:       {desc: '姓名'},
    CenterName: {desc: '中心名'},
    CenterAddress: {desc: '中心地址'}
  }
  var AuthNames = {0:"xx", 1:"yy"},   //C#获得AuthNames(需验证操作用户权限)
      CenterNames = util.center.desc
  var selects = {
    AuthId: {
        desc: '权限类型',
        options: AuthNames
    },
    CenterId: {
        desc: '中心',
        options: CenterNames
    }
  }
  var title = '', lists = [], defaultv = {}
  switch ( _ops.id ) {
    case 'center_form':
      if ( _ops.valueid ) {
        title = '修改中心信息'
        lists = ['cCenterId', 'CenterName', 'CenterAddress']
        defaultv = {}   //C#查数据
      }else{
        title = '添加中心'
        lists = ['CenterName', 'CenterAddress']
      }
    break;  case 'authority_form':
      if ( _ops.valueid ) {
        title = '修改用户信息'
        lists = ['Id', 'Name', 'AuthId', 'CenterId']
        defaultv = {}   //C#查数据
      }else{
        title = '添加用户'
        lists = ['Name', 'AuthId', 'CenterId']
      }
    break; default:
      return;
    break;
  }
  
  var tmp = ''
  var valuehtml = '', rhtml = ''
  for (var k=0; k<lists.length; k++) {
    tmp = lists[k]
    if ( inputs[tmp] ) {
      if ( defaultv[tmp] ) {
        valuehtml = ' value="' + defaultv[tmp] + '"'
        if ( tmp==='AuthId' && !util.user.isboss ) {
          inputs[tmp].disable = true
        }
      }else{
        valuehtml = ""
      }
      rhtml += '<div class="control-group">\
                  <label class="control-label" for="' + _ops.id + '_' + tmp + '_input">' + inputs[tmp].desc + '</label>\
                  <div class="controls">\
                    <input id="' + _ops.id + '_' + tmp + '_input" name="' + tmp + '" type="' + (inputs[tmp].type||'text') +
                    '" placeholder="' + inputs[tmp].desc + '"' + valuehtml + (inputs[tmp].disable?' disabled':'') +
                     (inputs[tmp].slider?' readonly style="border:0; color:#f6931f; font-weight:bold;"':'') + '>\
                    <span class="help-inline"></span>\
                  </div>\
                </div>'
      if ( inputs[tmp].slider ) { rhtml += '<div id="slider-'+tmp+'-min"></div>' }
      continue;
    }    
    if ( selects[tmp] ) {
      rhtml += '<div class="control-group">\
                  <label class="control-label" for="' + _ops.id + '_' + tmp + '_select">' + selects[tmp].desc + '</label>\
                  <div class="controls">\
                    <select name="' + tmp + '" id="' + _ops.id + '_' + tmp + '_select"><option value="">' + selects[tmp].desc + '</option>'
      for ( key in selects[tmp]["options"] ) {
        if ( defaultv[tmp] === key ) {
          rhtml += '<option value="' + key + '" selected="selected">' + selects[tmp]["options"][key] + '</option>'
        }else{
          rhtml += '<option value="' + key + '">' + selects[tmp]["options"][key] + '</option>'
        }      
      }
      rhtml += '</select><span class="help-inline"></span></div></div>'
    }
  }

  var chtml = '<h3>' + title + '</h3>\
                <form class="form-horizontal">'+ rhtml +'</form>\
                <a class="btn btn-primary savechange">保存</a> \
                <span class="muted"> 新创建用户的初始密码为hello，请及时修改！</span>'
  _el.empty().html(chtml)

  $('input, textarea').placeholder();

  _el.find('a.savechange').click(function(){
    var inputs = _el.find('input')
    var selects = _el.find('select')
    var noerror = util.valid({inputs:inputs, selects:selects})
    var defaultv = {}
    noerror && (defaultv = noerror)
    var valuestring = JSON.stringify(defaultv)
    var haserror = false
    var inputtmp
    noerror && ( haserror = eval("(" + 'false' + ")") )   //C#提交valuestring，返回错误列表{key:desc}或者false
    if ( noerror && !haserror ) {
      _el.find('form').effect('drop', {}, 500, function(){
        _el.hide()
        if ( _ops.clickback && (typeof _ops.clickback === 'function') ){
          return _ops.clickback(_ops)
        }
      })     
    }else{
      for ( key in haserror ) {
        inputtmp = $('#' + _ops.id + '_' + key + '_input')
        if ( !inputtmp.length ) {
          inputtmp = $('#' + _ops.id + '_' + key + '_select')
        }
        if ( !inputtmp.length ) {
          continue;
        }
        util.show_help({$th:inputtmp, desc:haserror[key], iserror:true})
      }
      _el.find('form').effect('bounce', {}, 300)
    }
  });
}

function forcs_refresh(){
  window.location.href = "admin.html"
}

$(function() {
// Handler for .ready() called.

var that = admin
util.check_auth("admin")
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
        that.show_form({id:that._hash+'_form', clickback:that.show})     
      break; case 'update':
        that.show_form({id:that._hash+'_form', valueid:value, clickback:that.show})
      break;
    }
});
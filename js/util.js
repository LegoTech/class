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
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">'
                + ct.desc[ct.cur] +'<b class="caret"></b></a>\
                <ul class="dropdown-menu">'
    for ( key in ct.desc ) {
      if ( parseInt(key) === ct.cur ) {
        chtml += '<li class="active">\
                    <a data-type="center" data-value="' + key + '" href="#">' + ct.desc[key] + '</a>\
                  </li>'
      }else{
        chtml += '<li>\
                    <a data-type="center" data-value="' + key + '" href="#">' + ct.desc[key] + '</a>\
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
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">'
                + that.user.name +'<b class="caret"></b></a>\
                <ul class="dropdown-menu">\
                  <li>\
                    <a href="#user_modal" data-toggle="modal">修改密码</a>\
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
    console.log(rhtml)
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

/*_ops:{
  id:''               //容器
}
*/
util.show_modal = function(_ops){
  var _el = $('#'+_ops.id)
  //inputs,默认type为text，不为text另外说明，默认placeholder为desc
  var inputs = {
    CardNo: {
       desc: '学员卡号'
    },
    StuName: {
        desc: '学生姓名',
        autocomplete: true
    },
    School: {
        desc: '学校'
    },
    ClassId: {
        desc: '课程编号'
    },
    ClassName: {
        desc: '课程名',
        autocomplete: true
    }
  }
  var TeacherNames = {0:"xx", 1:"yy"},   //C#获得教师id和name,状态值
      Status = {0:"开始", 1:"结束" }
  var selects = {
    TeacherId: {
        desc: '教师姓名',
        options: TeacherNames
    },
    Status: {
        desc: '状态',
        options: Status
    }
  var title = '', lists = []
  switch ( _ops.id ) {
    case 'user_modal':
      title = '修改密码'
      lists = []
    break; case 'add_students_modal':
      title = '添加学员'
    break; case 'add_classes_modal':
      title = '添加课程'
    break; case 'update_students_modal':
      title = '修改学员信息'
    break; case 'update_classes_modal':
      title = '修改课程信息'
    break; default:
      return;
    break;
  }
  var rhtml = '<div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                <h3 id="myModalLabel">' + title + '</h3>\
              </div>\
              <div class="modal-body">\
                <form class="form-horizontal">'
  var tmp = ""
  var autos = []
  var valuehtml = ""
  for (var k=0; k<_ops.lists.length; k++) {
    tmp = _ops.lists[k]
    if ( inputs[tmp] ) {
      if ( _ops.defaultv[tmp] ) {
        valuehtml = ' value="' + _ops.defaultv[tmp] + '"'
      }else{
        valuehtml = ""
      }
      rhtml += '<div class="control-group">\
                  <label class="control-label" for="inputEmail">' + inputs[tmp].desc + '</label>\
                  <input name="' + tmp + '" type="' + (inputs[tmp].type||'text') +
                  '" placeholder="' + inputs[tmp].desc + '"' + valuehtml +'>\
                </div>'
      if ( inputs[tmp].autocomplete ) {autos.push(tmp)}
      continue;
    }    
    if ( selects[tmp] ) {
      rhtml += '<div class="control-group">\
                  <span class="add-on add-on-info">' + selects[tmp].desc + '</span>\
                  <select name="' + tmp + '"><option value="">' + selects[tmp].desc + '</option>'
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
      rhtml += '</form>\
              </div>\
              <div class="modal-footer">\
                <button class="btn" data-dismiss="modal">关闭</button>\
                <button class="btn btn-primary modal_savechange">保存</button>\
              </div>\
            </div>'
}

/*_ops:{
  id:''       //容器
}
仅限有<span class="help-inline"></spam>使用
*/
util.valid = function(_ops){
      var error_num=0;
      var sqlbad_pattern = new RegExp(/select|update|delete|exec|count|=|;|%/i);
    
    var title = undefined;
    title=$("input[name='title']").val();
    if(title!=undefined &&title.length<1){
      $('#error_info').append("<p><strong>标题错误！</strong>标题不能为空</p>");
      error_num++;
    }
    else if(title!=undefined){
      if (title.length>50) {
        $('#error_info').append("<p><strong>标题错误！</strong>标题超长</p>");
        error_num++;
      };
      if (sqlbad_pattern.test(title)) {
        $('#error_info').append("<p><strong>标题错误！</strong>请不要输入特殊字符和SQL关键字</p>");
        error_num++;
      };    
    }
    
    var content= undefined;
    content=$("textarea[name='content']").val();
    if(content!=undefined &&content.length<1){
      $('#error_info').append("<p><strong>内容错误！</strong>内容不能为空</p>");
      error_num++;
    }
    if(content!=undefined){
      if (content.length>1000) {
        $('#error_info').append("<p><strong>内容错误！</strong>内容超长</p>");
        error_num++;
      };
      if (sqlbad_pattern.test(content)) {
        $('#error_info').append("<p><strong>内容错误！</strong>请不要输入特殊字符和SQL关键字</p>");
        error_num++;
      };      
    }
    
    var username= undefined;
    username=$("input[name='username']").val();
    if(username!=undefined &&username.length<1){
      $('#error_info').append("<p><strong>用户名错误！</strong>用户名不能为空</p>");
      error_num++;
    }
    else if(username!=undefined){
      var username_pattern = new RegExp(/^[\w-.\u4e00-\u9fa5]+$/); 
      if(!username_pattern.test(username)){
        $('#error_info').append("<p><strong>用户名错误！</strong>用户名只能由中文、字母、数字、下划线、连字符、半角句点组成</p>");
        error_num++;
      }
      if (sqlbad_pattern.test(username)) {
        $('#error_info').append("<p><strong>用户名错误！</strong>请不要输入特殊字符和SQL关键字</p>");
        error_num++;
      };    
    }
    /*var repeatname=undefined;
    repeatname= $('#repeat_name').html();
    if (repeatname!=undefined){
      $('#error_info').append("<p><strong>用户名错误！</strong>此用户名已被注册</p>");
      error_num++;      
    }*/
    
    var pwd= undefined;
    pwd=$("input[name='pwd']").val();
    if(pwd!=undefined &&pwd.length<1){
      $('#error_info').append("<p><strong>密码错误！</strong>密码不能为空</p>");
      error_num++;
    }
    else if(pwd!=undefined &&pwd.length<6){
      $('#error_info').append("<p><strong>密码错误！</strong>密码至少为六位</p>");
      error_num++;
    }
    else if(pwd!=undefined){
      var pwd_pattern = new RegExp(/^[\w]+$/); 
      if(!pwd_pattern.test(pwd)){
        $('#error_info').append("<p><strong>密码错误！</strong>用户名只能由字母、数字、下划线组成</p>");
        error_num++;
      }
      if (sqlbad_pattern.test(pwd)) {
        $('#error_info').append("<p><strong>密码错误！</strong>请不要输入特殊字符和SQL关键字</p>");
        error_num++;
      };  
    }
    
    var pwd2= undefined;
    pwd2=$("input[name='pwd2']").val();
    if(pwd2!=undefined &&pwd2.length<1){
      $('#error_info').append("<p><strong>确认密码错误！</strong>确认密码不能为空</p>");
      error_num++;
    }
    else if(pwd2!=undefined &&pwd!=pwd2){
      $('#error_info').append("<p><strong>确认密码错误！</strong>确认密码与密码不相同</p>");
      error_num++;
    }
    
    var email= undefined;
    email=$("input[name='email']").val();
    if(email!=undefined &&email.length<1){
      $('#error_info').append("<p><strong>Email错误！</strong>Email不能为空</p>");
      error_num++;
    }
    else if(email!=undefined){
      var email_pattern = new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/); 
      if(!email_pattern.test(email)){
        $('#error_info').append("<p><strong>Email错误！</strong>您输入的Email错误，请重新输入</p>");
        error_num++;
      }
      if (sqlbad_pattern.test(email)) {
        $('#error_info').append("<p><strong>Email错误！</strong>请不要输入特殊字符和SQL关键字</p>");
        error_num++;
      };  
    }
    
    var tel= undefined;
    tel=$("input[name='tel']").val();
    if(tel!=undefined &&tel.length<1){
      $('#error_info').append("<p><strong>联系电话错误！</strong>联系电话不能为空</p>");
      error_num++;
    }
    else if(tel!=undefined){
      var tel_pattern = new RegExp(/^[0-9+-]+$/); 
      if(!tel_pattern.test(tel)){
        $('#error_info').append("<p><strong>联系电话错误！</strong>您输入的号码错误，请重新输入</p>");
        error_num++;
      }
    }
    
    var address= undefined;
    address=$("input[name='address']").val();
    if(address!=undefined &&address.length<1){
      $('#error_info').append("<p><strong>联系地址错误！</strong>联系地址不能为空</p>");
      error_num++;
    }
    else if(address!=undefined){
      var address_pattern = new RegExp(/^[\w\u4e00-\u9fa5]+$/); 
      if(!address_pattern.test(address)){
        $('#error_info').append("<p><strong>联系地址错误！</strong>联系地址格式错误</p>");
        error_num++;
      }
      if (sqlbad_pattern.test(address)) {
        $('#error_info').append("<p><strong>联系地址错误！</strong>请不要输入特殊字符和SQL关键字</p>");
        error_num++;
      };  
    }
    
    var limit= undefined;
    limit=$("input[name='limit']").val();
    if(limit!=undefined &&limit.length<1){
      $('#error_info').append("<p><strong>上限人数错误！</strong>上限人数不能为空</p>");
      error_num++;
    }
    else if(limit!=undefined){
      var limit_pattern = new RegExp(/^[\d]+$/); 
      if(!limit_pattern.test(limit)){
        $('#error_info').append("<p><strong>上限人数错误！</strong>上限人数只能为数字</p>");
        error_num++;
      }
      if(limit>20){
        $('#error_info').append("<p><strong>上限人数错误！</strong>上限人数不超过20</p>");
        error_num++;
      }
    }

    var url= undefined;
    url=$("input[name='url']").val();
    if(url!=undefined &&url.length>0){
      var url_pattern = new RegExp("(http[s]{0,1})://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&amp;*+?:_/=<>]*)?", "gi");
      if(!url_pattern.test(url)){
        $('#error_info').append("<p><strong>链接错误！</strong>链接地址有误</p>");
        error_num++;
      }
      if (sqlbad_pattern.test(url)) {
        $('#error_info').append("<p><strong>链接错误！</strong>请不要输入特殊字符和SQL关键字</p>");
        error_num++;
      };  
    }   
    
    var deadline= undefined;
    deadline=$("input[name='deadline']").val();
    if(deadline!=undefined &&deadline.length<1){
      $('#error_info').append("<p><strong>截止日期错误！</strong>截止日期不能为空</p>");
      error_num++;
    }
    else if(deadline!=undefined){
      var deadline_pattern = new RegExp(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/); 
      if(!deadline_pattern.test(deadline)){
        $('#error_info').append("<p><strong>截止日期错误！</strong>截止日期格式应为mm/dd/yyyy</p>");
        error_num++;
      }
    }


    var verification= undefined;
    verification=$("input[name='verification']").val();
    if(verification!=undefined &&verification.length<1){
      $('#error_info').append("<p><strong>验证码错误！</strong>验证码不能为空</p>");
      error_num++;
    }
    else if(verification!=undefined){
      val=$("#verify").html();
      if(verification!=val){
        $('#error_info').append("<p><strong>验证码错误！</strong>请输入正确的验证码</p>");
        error_num++;
      }
    }

    if(error_num!=0){
      $('#error_info').show();
      return false;
    }
    else{return true;}
}

$(function() {
// Handler for .ready() called.
var options = {show:false}
$('div.modal').modal(options)
});
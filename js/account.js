account = {}
account._hash = ""
account._search = ""
account.lastconsuming = {}
account.infos = {}
account.pages = {
  consuming: {
    title: "签到"
  },
  charging: {
    title: "充值"
  }
}
account.hashchange = function(){
    var that = this
    if( 'onhashchange' in window ) {
        window.onhashchange = function(){
            $('#'+that._hash).hide()
            that._hash = location.hash.replace(/\#|\!/g, '')
            $('#'+that._hash).show()
            util.show_navbar({id:"navbar", page:that._hash})
            if ( !$('#'+that._hash).html() ) {
              that.show()
            }
            return that._hash
        }
    }
}

account.show = function(){
  var that = this
  var rhtml = ''
  var inputs = {
    StuName:    {desc: '学生姓名',      disabled:true},
    ClassSet:   {desc: '您的套餐为',    disabled:true},
    SetCount:   {desc: '选择套餐数',    spinner:true},
    ChargingHours:{desc: '充值金额',    disabled:true},
    ChargingMoney:{desc: '充值课时',    disabled:true},
    Hours:      {desc: '课时数',        disabled:true},
    StartTime:  {desc: '开始时间',      disabled:true},
    EndTime:    {desc: '结束时间',      disabled:true},
  }
  var ClassNames = {0:"xx", 1:"yy"}   //C#获得教师id和name,状态值
  var selects = {
    ClassId: {
        desc: '课程',
        options: ClassNames
    }
  }
  var lists = []
  var defaultv = {}, iclasses = [], haslastclass = false
  if ( !that._search && !that.infos ) {
    rhtml = '<h4>'+that.pages[that._hash].title+'请刷卡</h4>'
  }else if ( $.isEmptyObject(that.infos) ){
    //调C#函数，将that._search内容传给后台，后台再调forcs_getinfo
  }else{
    switch ( that._hash ) {
      case 'consuming':
        that.infos = {
          StuId:1,
          StuName: "小分",
          classes: [
            {ClassId:1,
            ClassName:"算数",
            StartTime:"13-01-31",
            EndTime:"13-02-21",
            Hours:2
            }
          ]
        }
        lists = ['StuName', 'ClassId', 'StartTime', 'EndTime', 'Hours']
        iclasses = that.infos.classes
        if ( that.lastconsuming ) {
          for ( var j=0; j<iclasses.length; j++ ) {
            if ( iclasses[j].ClassId==that.lastconsuming.ClassId ) {haslastclass=true; break;}
          }  
        }
        if ( haslastclass ) {
          defaultv = {
            StuId: that.infos.StuId,
            StuName: that.infos.StuName,
            ClassId: iclasses[j].ClassId,
            StartTime: iclasses[j].StartTime,
            EndTime: iclasses[j].EndTime,
            Hours: iclasses[j].Hours
          }
        }else{
          defaultv = {StuName: that.infos.StuName}
        }
      break; case 'charging':
        that.infos = {
          StuId:1,
          StuName: "小分",
          ClassSet: {
            Hours: 1.5,
            Money: 12
          }
        }
        lists = ['StuName', 'ClassSet', 'SetCount', 'ChargingMoney', 'ChargingHours']
        defaultv = {
          StuId: that.infos.StuId,
          StuName: that.infos.StuName,
          SetCount: 1,
          ClassSet: that.infos.ClassSet.Money + '元 / ' + that.infos.ClassSet.Hours + '课时',
          ChargingMoney: that.infos.ClassSet.Money + '元',
          ChargingHours: that.infos.ClassSet.Hours + '课时'
        }
      break;
    }
    
    var tmp = ''
    var spinners = ''
    var valuehtml = '', rhtml = ''
    rhtml = '<form class="form-horizontal" data-value="'+defaultv.StuId+'">'
    for (var k=0; k<lists.length; k++) {
      tmp = lists[k]
      if ( inputs[tmp] ) {
        if ( defaultv[tmp] ) {
          valuehtml = ' value="' + defaultv[tmp] + '"'
        }else{
          valuehtml = ""
        }
        rhtml += '<div class="control-group">\
                    <label class="control-label" for="' + that._hash + '_' + tmp + '_input">' + inputs[tmp].desc + '</label>\
                    <div class="controls">\
                      <input id="' + that._hash + '_' + tmp + '_input" name="' + tmp + '" type="' + (inputs[tmp].type||'text') +
                      '" placeholder="' + inputs[tmp].desc + '"' + valuehtml + (inputs[tmp].disabled?' disabled':'') + '>\
                    </div>\
                  </div>'
        if ( inputs[tmp].spinner ) {spinners = tmp}
        continue;
      }    
      if ( selects[tmp] ) {
        rhtml += '<div class="control-group">\
                    <label class="control-label" for="' + that._hash + '_' + tmp + '_select">' + selects[tmp].desc + '</label>\
                    <div class="controls">\
                      <select name="' + tmp + '" id="' + that._hash + '_' + tmp + '_select"><option value="">' + selects[tmp].desc + '</option>'
        for ( key in selects[tmp]["options"] ) {
          if ( defaultv[tmp] === key ) {
            rhtml += '<option value="' + key + '" selected="selected">' + selects[tmp]["options"][key] + '</option>'
          }else{
            rhtml += '<option value="' + key + '">' + selects[tmp]["options"][key] + '</option>'
          }
        } 
      }
      rhtml += '</select><span class="help-inline"></span></div></div>'
    }  
    rhtml += '<div class="control-group">\
                <div class="controls">\
                  <a class="btn btn-large btn-primary submit">'+that.pages[that._hash].title+'</a>\
              </div></div>'
    rhtml += '</form>'
  }
  var _el = $('#'+that._hash)
  _el.empty().html(rhtml)
    
  !(function (infos){
    var iclasses = []
    $.extend(iclasses, infos.classes)

    _el.find('select').change(function(){
      var ClassId = parseInt($(this).val())
      var haslastclass = false
      for ( var j=0; j<iclasses.length; j++ ) {
        if ( iclasses[j].ClassId==ClassId ) {haslastclass=true; break;}
      } 
      _el.find('input[name="StartTime"]').val(iclasses[j].StartTime)
      _el.find('input[name="EndTime"]').val(iclasses[j].EndTime)
      _el.find('input[name="Hours"]').val(iclasses[j].Hours)
    });

    function spinnerchange(){
      var count = parseInt($(this).val())
      _el.find('input[name="ChargingMoney"]').val((parseFloat(that.infos.ClassSet.Money)*count) + '元')
      _el.find('input[name="ChargingHours"]').val((parseFloat(that.infos.ClassSet.Hours)*count) + '课时')
    }
    var spinneroption = {
      min: 1,
      step: 1,
      change: spinnerchange,
      stop: spinnerchange
    }
    spinners && _el.find('input[name="'+spinners+'"]').spinner(spinneroption);

    _el.find('a.submit').on('click', function(e){
      var that = account
      var _el = $('#'+that._hash)
      var StuId = parseInt($(this).siblings('form').attr('data-value'))
      if ( account._hash === 'consuming' ) {
        var ClassId = _el.find('select[name="ClassId"]').val()
        if ( !ClassId ) {
          util.show_help({$th:_el.find('select[name="ClassId"]'), desc:'请选择课程', iserror:true})
          _el.find('form').effect('bounce', {}, 1000, function(){});
          return;
        }
        that.lastconsuming.ClassId = ClassId
        util.show_help({$th:_el.find('select[name="ClassId"]'), iserror:false})
      }else{
        var SetCount = _el.find('input[name="SetCount"]').val()
        util.show_help({$th:_el.find('input[name="ClassId"]'), iserror:false})
      }
      //调C#函数提交
      $(this).parents('form').effect('drop', {}, 1000, function(){
        window.location.href = 'account.html#'+that._hash
        that.infos = {}
        that.show()
      });
    });
  })(that.infos);
}

/*C#调该函数将信息传给前台,两种infos见59行和91行
*/
function forcs_getinfo(){
  account.infos = {}
  account.show()
}

$(function() {
// Handler for .ready() called.

var that = account
that._hash = location.hash.replace(/\#|\!/g, '')
that._search = location.search.replace(/\?/g, '')
util.get_user_center()
that.hashchange()
if ( !that._hash ) {
  util.set_hash('consuming')
  that._hash = 'consuming'
}
util.show_navbar({id:"navbar", page:that._hash})
$('#charging').hide()
$('#consuming').hide()
$('#'+that._hash).show()
that.show()
});
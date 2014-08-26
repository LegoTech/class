util = {};

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

    if ( _ops.operate.length )}{
    	
    }

    if ( _ops.callback && (typeof _ops.callback === 'function') ){
        return _ops.callback()
    }
}

/*
_ops:{
    id:'',          //容器
    operate: [],    //操作
    callback: function
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
	lists: [],	//内容	
	callback: function
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
SirTrevor.Blocks.Columns = (function() {
  var template = '<div class="columns-row" style="overflow: auto"></div>';

  var Column = function(width, $el) {
    this.width = width;
    this.$el = $el;
    this.$plus = null;
  };

  return SirTrevor.Block.extend({
    type: "Columns",
    title: 'Columns',
    icon_name: 'columns',
    columns_config: [1,1],

    editorHTML: function() {
      return _.template('<div class="columns-row" id="<%= blockID %>-columns-row" style="overflow: auto"/>', {blockID: this.blockID})
    },

    _setBlockInner: function() {
      SirTrevor.Block.prototype._setBlockInner.apply(this, arguments);

      var self = this;
      var total_width = _.reduce(this.columns_config, function(total, width){ return total+width; }, 0);
      var $row = this.$('.columns-row');

      this._columns = [];

      _.each(this.columns_config, function(ratio, i) {
        var width = Math.round(ratio*99.0*100/total_width)/100;
        var $column = $('<div class="column" style="float: left; "></div>');
        $column.css('width', width+'%');
        $column.attr('data-index', i+1);
        $column.attr('id', self.blockID+'-column-'+(i+1));

        var _column = new Column(ratio, $column);

        var plus = new SirTrevor.FloatingBlockControls($column, self.instanceID, _column);
        self.listenTo(plus, 'showBlockControls', self.sirTrevor.showBlockControls);
        var $plus = plus.render().$el;
        _column.$plus = $plus;
        $column.prepend($plus);

        $row.append($column);

        self._columns.push(_column);
      });
    },

    toData: function() {
      var self = this;
      var dataObj = { columns: [] };
      _.each(this._columns, function(column) {
        var blocksData = [];
        column.$el.children('.st-block').each(function(){
          var block = self.sirTrevor.findBlockById(this.getAttribute('id'));
          blocksData.push(block.saveAndReturnData());
        });

        dataObj.columns.push({
          width: column.width,
          blocks: blocksData
        });
      });

      this.setData(dataObj);
    },

    loadData: function(data) {
      var columns_data = (data.columns || []);
      for (var i=0; i<columns_data.length; i++)
      {
        var $block = null;
        var _column = this._columns[i];
        for (var j=0; j<columns_data[i].blocks.length; j++) {
          var block = columns_data[i].blocks[j];
          $block = this.sirTrevor.createBlock(block.type, block.data, $block ? $block.$el : _column.$plus);
        }
      }
    }
  });
})();

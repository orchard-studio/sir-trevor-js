SirTrevor.Blocks.Columns = (function() {
  var template = '<div class="columns-row" style="overflow: auto"></div>';

  var Column = function(width, $el) {
    this.$el = $el;
    this.width = width;
    this.blocks = [];
  };

  return SirTrevor.Block.extend({
    type: "Columns",

    title: 'Columns',

    editorHTML: template,

    icon_name: 'columns',

    _columns: [],

    columns_config: [1,1],

    onBlockRender: function(data) {
      var self = this;

      var total_width = _.reduce(this.columns_config, function(total, width){ return total+width; }, 0);
      var $row = this.$('.columns-row');

      _.each(this.columns_config, function(width, i) {
        var percentage = Math.round(width*100.0*100/total_width)/100; // 2 digits precision
        var $column = $('<div class="column" style="float: left; width: {percentage}%;"></div>'.replace('{percentage}', percentage));
        $row.append($column);

        var column = new Column(width, $column);
        self._columns.push(column);

        var plus = new SirTrevor.FloatingBlockControls($column, self.instanceID, column);
        self.listenTo(plus, 'showBlockControls', self.sirTrevor.showBlockControls);
        $column.prepend(plus.render().$el);
      });
    },

    toData: function() {
      var dataObj = [];
      _.each(this._columns, function(column) {
        var blocksData = [];
        _.each(column.blocks, function(block) {
          blocksData.push(block.saveAndReturnData());
        });

        dataObj.push({
          width: column.width,
          data: blocksData
        });
      });

      this.setData(dataObj);
    },

    loadData: function(data) {
      // TODO: Implement this
    },

    // override standard function
    findBlockById: function(block_id) {
      // handle self block
      if (this.blockID == block_id) return this;
      // handle nested blocks
      for (var i=0; i<this._columns.length; i++) {
        var c = this._columns[i];
        for (var j=0; j<c.blocks.length; j++) {
          var found_block = c.blocks[j].findBlockById(block_id);
          if (found_block) return found_block;
        }
      }
    }
  });
})();

/* Our base formatters */
(function(){

  var Bold = SirTrevor.Formatter.extend({
    title: "bold",
    cmd: "bold",
    keyCode: 66,
    iconName: "bold",
    text : ""
  });

  var Italic = SirTrevor.Formatter.extend({
    title: "italic",
    cmd: "italic",
    keyCode: 73,
    iconName: "italic",
    text : ""
  });

  var Link = SirTrevor.Formatter.extend({

    title: "link",
    iconName: "link",
    cmd: "CreateLink",
    text : "",

    onClick: function() {

      var link = prompt(i18n.t("general:link")),
          link_regex = /((ftp|http|https):\/\/.)|mailto(?=\:[-\.\w]+@)/;

      if(link && link.length > 0) {

       if (!link_regex.test(link)) {
         link = "http://" + link;
       }

       document.execCommand(this.cmd, false, link);
      }
    },

    isActive: function() {
      var selection = window.getSelection(),
          node;

      if (selection.rangeCount > 0) {
        node = selection.getRangeAt(0)
                        .startContainer
                        .parentNode;
      }

      return (node && node.nodeName == "A");
    }
  });

  var UnLink = SirTrevor.Formatter.extend({
    title: "unlink",
    iconName: "unlink",
    cmd: "unlink",
    text : ""
  });

  /*
    Create our formatters and add a static reference to them
  */
  SirTrevor.Formatters.Bold = new Bold();
  SirTrevor.Formatters.Italic = new Italic();
  SirTrevor.Formatters.Link = new Link();
  SirTrevor.Formatters.Unlink = new UnLink();

})();
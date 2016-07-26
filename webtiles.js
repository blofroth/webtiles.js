// url: url to JSON in format { tiles : [[1,2,3],[3,2,1]] }
//        where tiles[x][y] = $number, such that there is a valid ".wt-$number" css class
//          [0][0] is lower left
//        all columns tiles[$i] should be equal length
// grid: id of the div to populate with tiles
function webtiles_load($, grid, url) {
  $(document).ready(function(){
      $("#" + grid).addClass("webtiles-grid");
      $.getJSON(url, function(result){
        var tiles = result.tiles;
        // console.log(result);
        for(var y=tiles[0].length - 1; y>= 0; y--){
          var row = $("<div></div>");
          row.addClass("webtiles-row");
          for(var x=0; x < tiles.length; x++){
            var tile = $("<div></div>");
            tile.addClass("webtile");
            tile.addClass("wt-" + tiles[x][y]);
            row.append(tile);
          }
          $("#grid").append(row);
        }
      });
  });
}

function webtiles_generate_tileset_css($, output_css_pre_id, output_html_pre_id, image_ids, tile_width, tile_height) {
  // window load to wait for images to load
  $(window).on("load", function(){
    var out_css = $("#" + output_css_pre_id);
    var out_html = $("#" + output_html_pre_id);

    // css prelude
    out_css.append(".webtiles-grid div {\n");
    out_css.append(" min-width: 32px;\n");
    out_css.append(" width: 32px;\n");
    out_css.append(" height: 32px;\n");
    out_css.append("}\n");

    out_css.append("\n");

    out_css.append(".webtile {\n");
    out_css.append("  line-height: 32px;\n");
    out_css.append("}\n");

    function output_tile(i,x_offset,y_offset,img_url) {
      //background: url(house.png);
      //background-position: -32px -128px;
      out_css.append(".wt-" + i + " {\n");
      out_css.append("  background: url(" + img_url + ") " + x_offset + "px " + y_offset + "px;\n");
      out_css.append("}\n");

      out_html.append(document.createTextNode(" <div class=\"webtile wt-" + i +"\">" + i +"</div>\n"));
    }

    var tile_id = 0;

    $.each(image_ids, function(i, img_id) {
      var img = document.getElementById(img_id);

      var w = img.width;
      var h = img.height;
      var src = img.src;

      console.log("img id: " + img_id);
      console.log("img url: " + src);
      console.log("img width: " + w);
      console.log("img height: " + h);

      if( w == 0 || h == 0 || (w % tile_width != 0) || (h % tile_height != 0)){
        console.log("Warning: non compatible images for w=" + tile_width + " and h=" + tile_height + ": " + src);
      }


      var num_x = w / tile_width;
      var num_y = h / tile_height;
      out_html.append(document.createTextNode("<!-- img " + src + " -->\n"));
      for(var y=0; y < num_y; y++){
        out_html.append(document.createTextNode("<div class=\"webtiles-row\">\n"));
        for(var x=0; x < num_x; x++){
          var ox = -x * tile_width;
          var oy = -y * tile_height;
          out_css.append("/* " + src + " (" + x + ", " + y + ") */\n");
          output_tile(tile_id++,ox,oy,src);
        }

        out_html.append(document.createTextNode("</div>\n"));
      }
    });
  });
}


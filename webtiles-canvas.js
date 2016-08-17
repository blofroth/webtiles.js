// url: url to JSON in format { tiles : [[1,2,3],[3,2,1]] }
//        where tiles[x][y] = $number, such that there is a valid ".wt-$number" css class
//          [0][0] is lower left
//        all columns tiles[$i] should be equal length
// grid: id of the div to populate with tiles'
function webtiles_load($, canvas_id, tileset_def, url, is_debug) {
  $(document).ready(function(){
      $.getJSON(url, function(result){
        var tilez = result.tilez;
        webtiles_draw($, canvas_id, tileset_def, tilez, is_debug);
      });
  });
}

function webtiles_draw($, canvas_id, tileset_def, tilez, is_debug) {
    var tile_map = tileset_def.tile_map;
    var canvas=document.getElementById(canvas_id);
    var ctx=canvas.getContext("2d");
    var tw = tileset_def.tile_width;
    var th = tileset_def.tile_height;
    var dx_txt = tw/3;
    var dy_txt = th/3;
    ctx.font = "12px Arial";


    var h = tilez[0].length;
    var w = tilez.length;
    canvas.height = h * th;
    canvas.width = w * th;



    for(var y=0; y < h; y++){
      for(var x=0; x < w; x++){
        if(tilez[x][y]){
          //handles uneven rows
          for(var z=0; z < tilez[x][y].length; z++){
            var tile_code = tilez[x][y][z];
            var draw_y = h - y - 1;
            var tile_def = tile_map[tile_code];
            var img = document.getElementById(tile_def.img_id);
            ctx.drawImage(img,
              tile_def.dx, tile_def.dy,
              tw, th,
              x * tw, draw_y * th,
              tw, th);
            if(is_debug && z == tilez[x][y].length - 1){
              ctx.strokeStyle = "blue";
              ctx.strokeText("" + tile_code, dx_txt + x * tw, dy_txt + draw_y * tw);
            }
          }
        }

      }
    }
}

function webtiles_palette($, palette_canvas_id, palette_json_id, image_ids, tile_width, tile_height) {
  // window load to wait for images to load
  $(window).on("load", function(){
    var tile_map = {};
    var palette = [];
    var py = 0;
    // image_ids = [image_ids[0], image_ids[1]];
    var tile_id = 0;

    $.each(image_ids, function(i, img_id) {
      var img = document.getElementById(img_id);

      var w = img.naturalWidth;
      var h = img.naturalHeight;
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
      console.log("num_x: " + num_x);
      console.log("num_y: " + num_y);

      for(var y=0; y < num_y; y++){
        for(var x=0; x < num_x; x++){
          if(!palette[x]) {
            palette[x] = []; // lazy column init
          }
          var ox = x * tile_width;
          var oy = y * tile_height;
          tile_map[tile_id] = { dx : ox, dy : oy, img_id : img_id };
          palette[x][py] = [tile_id]; // only one z-layer
          tile_id += 1;
        }
        py++;
      }
    });
    palette
    var tileset_def = {
      tile_height : tile_height,
      tile_width : tile_width,
      tile_map : tile_map
    };
    $("#" + palette_json_id).append(JSON.stringify(tileset_def));
    webtiles_draw($, palette_canvas_id, tileset_def, palette, true);
  });
}


// https://stackoverflow.com/questions/16505333/get-the-data-of-uploaded-file-in-javascript
// https://www.html5rocks.com/en/tutorials/file/dndfiles/#toc-reading-files
// https://www.w3.org/TR/FileAPI/#file-section
function upload(evt) {
    console.log("file selected!")
    var f = evt.target.files[0]; // FileList object, with the 1st grabbed
    var reader = new FileReader();

    reader.onload = (() => {
        return (e) => {
          // clean the text
          let arr = e.target.result.replace(/(\r\n|\r\n\t|\n|\r)/gm,"\n")
          // transform text into array, each elt being an str which represents a row. ignore \n char
          arr = arr.split(/(\n)/gm)
          arr = arr.filter((a) => {return a !== '\n'})
          // transform each str/row into another array
          // overall ds becomes a 2d array containing str of each col item in a row
          for(let i = 0; i < arr.length; ++i){
            arr[i] = arr[i].split("|")
            arr[i] = arr[i].filter((a) => {return a !== ""})
            for(let j = 0; j < arr[i].length; ++j ){
              arr[i][j] = arr[i][j].trim()
              let url = arr[i][j].indexOf("http")
              if(url != -1){
                url = arr[i][j].substring(url, arr[i][j].length - 1)
                // need to keep original text in front for proper sorting, keep invisible
                arr[i][j] = "<span class='invisible'>" + arr[i][j] + "</span><a href='" + url + "'>" + arr[i][j].substring(1, arr[i][j].indexOf("]")) + "</a>"
              }
            }
          }
          go_list(arr);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
}

//https://listjs.com/
function go_list(arr, format="md"){
  let cols = [] // must track category names so the list api knows how to sort
  let buttonStr = "" // creating buttons for sorting
  let items = "" // item str for all table items
  for(let i = 0; i < arr[0].length; ++i){
    let catNumStr = "Category #" + i.toString();
    cols.push(catNumStr);
    // create buttons for sorting for each category
    buttonStr += "<button class='sort btn btn-primary' data-sort='" + catNumStr + "'>"+ "Sort By " + catNumStr + "</button> "
  }
  // show actual items
  for(let i = 0; i < arr.length; ++i){
    items += "<div class='row cell'>"
    for(let j = 0; j < arr[i].length; ++j){
      items += "<div class='col " + cols[j] + " '>" + arr[i][j] +"</div> "
    }
    items += "</div> "
  }
  document.getElementById('sort-buttons').innerHTML = buttonStr
  document.getElementsByClassName('list')[0].innerHTML = items
  var options = {
    valueNames: cols
  };
var result = new List('tabled', options);
}

  Promise.resolve()
  .then(() => {
    console.log("")
  })
  .then(() => {
    document.getElementById('upload').addEventListener('change', upload, false);
  })


  /* let toHTML = e.target.result.replace(/(\t)/gm,"&nbsp;&nbsp;&nbsp;&nbsp;");
  document.getElementById('tag-id').innerHTML
  */

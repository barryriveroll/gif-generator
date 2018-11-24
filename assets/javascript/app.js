var card = {
  gifColumns: [$("#column-1"), $("#column-2"), $("#column-3"), $("#column-4")],
  buttonArray: ["cat", "dog", "bird", "lion", "monkey"],
  newCard: function(imgSrcStill, imgSrcGif, rating, column) {
    var cardDiv = $("<div>")
      .addClass("card mb-4")
      .css("width", "16rem");
    var imgNew = $("<img>").addClass("card-img-top");
    imgNew
      .attr("src", imgSrcStill)
      .attr("data-still", imgSrcStill)
      .attr("data-gif", imgSrcGif)
      .attr("data-state", "still");
    var cardBodyDiv = $("<div>");
    var ratingText = $("<h5>")
      .addClass("card-title")
      .text("Rating: " + rating);
    cardBodyDiv.append(ratingText);
    cardDiv.append(imgNew).append(cardBodyDiv);
    column.prepend(cardDiv);
  },

  updateButtons: function() {
    $("#button-div").empty();
    for (var i = 0; i < this.buttonArray.length; i++) {
      var newButton = $("<button>");
      newButton
        .addClass("btn btn-primary gif-button m-1")
        .attr("data-value", this.buttonArray[i])
        .text(this.buttonArray[i]);
      $("#button-div").append(newButton);
    }
  },

  emptyColumns: function() {
    for (var i = 0; i < this.gifColumns.length; i++) {
      this.gifColumns[i].empty();
    }
  }
};

$(document).ready(function() {
  card.updateButtons();

  $("#add-button").on("click", function(event) {
    event.preventDefault();
    card.buttonArray.push($("#search").val());
    card.updateButtons();
  });

  $("a").click(function(e) {
    // $("a").attr({
    //   target: "_blank",
    //   href: "index.html"
    // });

    e.preventDefault(); //stop the browser from following
    window.location.href =
      "https://media3.giphy.com/media/tHXbAe0Zz6tj4W1UBB/giphy.webp";
  });

  $(document).on("click", ".card-img-top", function() {
    var state = $(this).attr("data-state");
    if (state === "still") {
      $(this)
        .attr("src", $(this).attr("data-gif"))
        .attr("data-state", "gif");
    } else {
      $(this)
        .attr("src", $(this).attr("data-still"))
        .attr("data-state", "still");
    }
  });

  $(document).on("click", ".gif-button", function() {
    card.emptyColumns();
    // var apiKey = "xQzjTdUjrsEyzPDRRksQka40sD7rkWBZ";
    var apiKey = "dc6zaTOxFJmzC";
    var search = $(this).attr("data-value");
    var limit = 10;
    var columnIndex = 0;
    var queryURL =
      "https://api.giphy.com/v1/gifs/search?api_key=" +
      apiKey +
      "&q=" +
      search +
      "&limit=" +
      limit;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      for (var i = 0; i < limit; i++) {
        card.newCard(
          response.data[i].images.fixed_width_still.url,
          response.data[i].images.fixed_width.url,
          response.data[i].rating,
          card.gifColumns[columnIndex]
        );
        columnIndex++;
        if (columnIndex >= 4) {
          columnIndex = 0;
        }
      }
    });
  });
});

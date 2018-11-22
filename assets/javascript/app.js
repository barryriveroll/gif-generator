var card = {
  returnCount: 5,
  buttonArray: ["cat", "dog", "bird", "lion", "monkey"],
  newCard: function(imgSrc, rating, column) {
    var cardDiv = $("<div>")
      .addClass("card mb-4")
      .css("width", "22rem");
    var imgNew = $("<img>").addClass("card-img-top");
    imgNew.attr("src", imgSrc);
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
    $("#column-1").empty();
    $("#column-2").empty();
    $("#column-3").empty();
  }
};

$(document).ready(function() {
  card.updateButtons();

  $("#add-button").on("click", function() {
    card.buttonArray.push($("#search").val());
    card.updateButtons();
  });

  $(document).on("click", ".gif-button", function() {
    card.emptyColumns();
    // var apiKey = "xQzjTdUjrsEyzPDRRksQka40sD7rkWBZ";
    var apiKey = "dc6zaTOxFJmzC";
    var search = $(this).attr("data-value");
    var limit = 6;
    var column = $("#column-1");
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
      for (var i = 0; i < limit; i++) {
        console.log(response.data[i]);
        card.newCard(
          response.data[i].images.fixed_width.url,
          response.data[i].rating,
          column
        );
        switch (i) {
          case 1:
            column = $("#column-2");
            break;
          case 3:
            column = $("#column-3");
            break;
        }
      }
    });
  });
});

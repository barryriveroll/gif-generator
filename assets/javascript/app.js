var card = {
  gifColumns: [$("#column-1"), $("#column-2"), $("#column-3"), $("#column-4")],
  buttonArray: ["cat", "dog", "bird", "lion", "monkey"],

  newCard: function(imgSrcStill, imgSrcGif, rating, largeSrc, column) {
    var cardDiv = $("<div>").addClass("card mb-4 p-1 gif-card");
    var topDiv = $("<div>")
      .addClass("position-relative tint gif-image")
      .html('<i class="fas play-button fa-play"></i>');
    var imgNew = $("<img>").addClass("card-img-top");
    imgNew
      .attr("src", imgSrcStill)
      .attr("data-still", imgSrcStill)
      .attr("data-gif", imgSrcGif)
      .attr("data-state", "still");
    topDiv.append(imgNew);
    var cardBodyDiv = $("<div>");
    var ratingDiv = $("<div>").addClass("rating-div");
    var ratingText = $("<h5>").text(rating);
    var expandDiv = $("<div>")
      .addClass("expand-div")
      .html("<i class='fas fa-expand'></i>")
      .attr("data-large", imgSrcGif);
    if (rating === "pg-13") {
      ratingText.addClass("pg-13");
    }
    ratingDiv.append(ratingText);
    cardBodyDiv.append(ratingDiv).append(expandDiv);
    cardDiv.append(topDiv).append(cardBodyDiv);
    column.prepend(cardDiv);
  },

  updateButtons: function() {
    $("#button-div").empty();
    for (var i = 0; i < this.buttonArray.length; i++) {
      var newButton = $("<button>");
      newButton
        .addClass("btn btn-dark gif-button m-1")
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

var rotateClicked = false;
var rotateValue = 180;
var menuHeightValue = 200;

$(document).ready(function() {
  card.updateButtons();

  $(".menu-icon").on("click", function() {
    $(this).css("transform", "rotate(" + rotateValue + "deg)");
    $(".menu-div").css("height", menuHeightValue + "px");
    rotateClicked = !rotateClicked;
    if (rotateClicked) {
      rotateValue = 0;
      menuHeightValue = 0;
    } else {
      rotateValue = 180;
      menuHeightValue = 200;
    }
  });

  $("#add-button").on("click", function(event) {
    event.preventDefault();
    if ($("#search").val() != "") {
      card.buttonArray.push(
        $("#search")
          .val()
          .toLowerCase()
      );
      card.updateButtons();
      $("#search").val("");
    }
  });

  $(".extended-bg").on("click", function() {
    $(".extended-bg").css("height", "0%");
    $(".expanded-view").empty();
  });

  $(document).on("click", ".expand-div", function() {
    var largeUrl = $(this).attr("data-large");
    var largeImg = $("<img>")
      .attr("src", largeUrl)
      .addClass("card-img-top");
    $(".expanded-view").append(largeImg);
    $(".extended-bg").css("height", "100%");
  });

  $(document).on("click", ".gif-image", function() {
    var gif = $(this).find("img");
    var play = $(this).find("i");
    var state = gif.attr("data-state");
    if (state === "still") {
      $(this).removeClass("tint");
      play.hide();
      gif.attr("src", gif.attr("data-gif")).attr("data-state", "gif");
    } else {
      $(this).addClass("tint");
      play.show();
      gif.attr("src", gif.attr("data-still")).attr("data-state", "still");
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
      30;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response.data[0]);
      var gifs = response.data;
      for (var i = 0; i < limit; i++) {
        var gifIndex = Math.floor(Math.random() * gifs.length);
        card.newCard(
          gifs[gifIndex].images.fixed_width_still.url,
          gifs[gifIndex].images.fixed_width.url,
          gifs[gifIndex].rating,
          gifs[gifIndex].images.downsized_large.url,
          card.gifColumns[columnIndex]
        );
        gifs.splice(gifIndex, 1);
        columnIndex++;
        if (columnIndex >= 4) {
          columnIndex = 0;
        }
      }
    });
  });
});

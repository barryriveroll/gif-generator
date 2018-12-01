var card = {
  gifColumns: [$("#column-1"), $("#column-2"), $("#column-3"), $("#column-4")],
  buttonArray: [],

  pauseAllGifs: function() {
    var activeGif = $("[data-state='gif'");
    if (activeGif.length > 0) {
      activeGif.siblings().show();
      activeGif.parent().addClass("tint");
      activeGif
        .attr("src", activeGif.attr("data-still"))
        .attr("data-state", "still");
    }
  },

  newCard: function(
    imgSrcStill,
    imgSrcGif,
    rating,
    column,
    title,
    url,
    source,
    id
  ) {
    var isFavorite = false;
    for (var i = 0; i < favorites.length; i++) {
      if (imgSrcStill === favorites[i].imgStill) {
        isFavorite = true;
      }
    }
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
    var favoriteDiv = $("<div>")
      .addClass("favorite-div")
      .html('<i class="fas fa-heart"></i>')
      .attr("data-still", imgSrcStill)
      .attr("data-gif", imgSrcGif)
      .attr("data-rating", rating)
      .attr("data-column", column)
      .attr("data-title", title)
      .attr("data-url", url)
      .attr("data-source", source);
    if (isFavorite) {
      favoriteDiv.addClass("favorite-red");
    }
    var ratingText = $("<h5>").text(rating);
    var expandDiv = $("<div>")
      .addClass("expand-div")
      .html("<i class='fas fa-expand'></i>")
      .attr("data-large", imgSrcGif)
      .attr("data-title", title)
      .attr("data-url", url)
      .attr("data-source", source);
    if (rating === "pg-13") {
      ratingText.addClass("pg-13");
    }
    ratingDiv.append(ratingText);
    cardBodyDiv
      .append(ratingDiv)
      .append(expandDiv)
      .append(favoriteDiv);
    cardDiv.append(topDiv).append(cardBodyDiv);
    column.prepend(cardDiv);
  },

  updateButtons: function() {
    $("#button-div").empty();
    this.buttonArray = JSON.parse(localStorage.getItem("buttonArray"));
    if (this.buttonArray === null) {
      this.buttonArray = [];
    }
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

// #region GLOBAL_VARIABLES
var rotateClicked = false;
var rotateValue = 180;
var menuHeightValue = 220;
var columnIndex = 0;
var favorites = [];
// #endregion
// #region GLOBAL_FUNCTIONS
function renderFavorites() {
  card.emptyColumns();
  favorites = JSON.parse(localStorage.getItem("favorites"));
  if (favorites === null) {
    favorites = [];
  }
  var columnIndex = 0;
  for (var i = 0; i < favorites.length; i++) {
    card.newCard(
      favorites[i].imgStill,
      favorites[i].imgGif,
      favorites[i].rating,
      card.gifColumns[columnIndex],
      favorites[i].title,
      favorites[i].url,
      favorites[i].source,
      0
    );
    columnIndex++;
    if (columnIndex >= 4) {
      columnIndex = 0;
    }
  }
}
function returnGifs(search) {
  if (localStorage.getItem("replaceGifs") === "true") {
    card.emptyColumns();
    columnIndex = 0;
  }
  // var apiKey = "xQzjTdUjrsEyzPDRRksQka40sD7rkWBZ";
  var apiKey = "dc6zaTOxFJmzC";
  var limit = 10;
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
    var gifs = response.data;
    for (var i = 0; i < limit; i++) {
      var gifIndex = Math.floor(Math.random() * gifs.length);
      card.newCard(
        gifs[gifIndex].images.fixed_width_still.url,
        gifs[gifIndex].images.fixed_width.url,
        gifs[gifIndex].rating,
        card.gifColumns[columnIndex],
        gifs[gifIndex].title,
        gifs[gifIndex].url,
        gifs[gifIndex].source,
        gifs[gifIndex].id
      );
      gifs.splice(gifIndex, 1);
      columnIndex++;
      if (columnIndex >= 4) {
        columnIndex = 0;
      }
    }
  });
}
function init() {
  // localStorage.setItem("buttonArray", JSON.stringify([]));
  // localStorage.setItem("favorites", JSON.stringify([]));

  $('[data-toggle="tooltip"]').tooltip();
  $(".expanded-view").hide();
  // favorites = JSON.parse(localStorage.getItem("favorites"));
  var optionResetButtons = localStorage.getItem("resetButtons");
  var optionReplaceGifs = localStorage.getItem("replaceGifs");
  if (optionReplaceGifs === "false") {
    $("#option-replace-gifs").removeClass("active");
    $("#option-add-gifs").addClass("active");
  }

  if (optionResetButtons === "true") {
    card.buttonArray = [];
  } else if (optionResetButtons === "false") {
    $("#option-reset-button").removeClass("active");
    $("#option-save-button").addClass("active");
    // card.buttonArray = JSON.parse(localStorage.getItem("buttonArray"));
    card.updateButtons();
  }
}
// #endregion

$(document).ready(function() {
  init();

  // #region OPTION_BUTTON_EVENTS
  $("#btn-view-favorites").on("click", function() {
    renderFavorites();
  });
  $("#btn-clear-favorites").on("click", function() {
    card.emptyColumns();
    favorites = [];
    localStorage.setItem("favorites", JSON.stringify(favorites));
  });
  $("#option-reset-button").on("click", function() {
    localStorage.setItem("resetButtons", true);
    card.buttonArray = [];
    localStorage.setItem("buttonArray", JSON.stringify(card.buttonArray));
    card.updateButtons();
  });
  $("#option-save-button").on("click", function() {
    localStorage.setItem("resetButtons", false);
  });

  $("#option-replace-gifs").on("click", function() {
    localStorage.setItem("replaceGifs", true);
  });
  $("#option-add-gifs").on("click", function() {
    localStorage.setItem("replaceGifs", false);
  });
  // #endregion
  // #region HEADER_BUTTON_EVENTS
  $(".menu-icon").on("click", function() {
    $(this).css("transform", "rotate(" + rotateValue + "deg)");
    $(".menu-div").css("height", menuHeightValue + "px");
    rotateClicked = !rotateClicked;
    if (rotateClicked) {
      rotateValue = 0;
      menuHeightValue = 0;
    } else {
      rotateValue = 180;
      menuHeightValue = 220;
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
      localStorage.setItem("buttonArray", JSON.stringify(card.buttonArray));
      card.updateButtons();
      $("#search").val("");
    }
  });

  $("#search-button").on("click", function(event) {
    event.preventDefault();
    if ($("#search").val() != "") {
      returnGifs(
        $("#search")
          .val()
          .toLowerCase()
      );
    }
  });
  // #endregion
  // #region CARD_BUTTON_EVENTS
  $(document).on("click", ".favorite-div", function() {
    if ($(this).hasClass("favorite-red")) {
      for (var i = 0; i < favorites.length; i++) {
        if ($(this).attr("data-still") === favorites[i].imgStill) {
          favorites.splice(i, 1);
          $(this).removeClass("favorite-red");
        }
      }
    } else {
      $(this).addClass("favorite-red");
      favorites.push({
        imgStill: $(this).attr("data-still"),
        imgGif: $(this).attr("data-gif"),
        rating: $(this).attr("data-rating"),
        column: $(this).attr("data-column"),
        title: $(this).attr("data-title"),
        url: $(this).attr("data-url"),
        source: $(this).attr("data-source")
      });
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  });

  $(document).on("click", ".expand-div", function() {
    $(".expanded-view").show();
    card.pauseAllGifs();
    var largeUrl = $(this).attr("data-large");
    var title = $(this).attr("data-title");
    var url = $(this).attr("data-url");
    var source = $(this).attr("data-source");
    var largeImg = $("<img>")
      .attr("src", largeUrl)
      .addClass("card-img-top");
    var cardBodyDiv = $("<div>")
      .addClass("card-body")
      .html("<h2>" + title + "</h2><hr>")
      .append("<p>URL: <a target=_blank href='" + url + "'>giphy.com</a></p>")
      .append(
        "<p>Source: <a target=_blank href='" +
          source +
          "'>" +
          source +
          "</a></p>"
      );

    $(".expanded-view")
      .append(largeImg)
      .append(cardBodyDiv);
    $(".extended-bg").css("height", "100%");
  });
  // #endregion

  $(".extended-bg").on("click", function() {
    $(".expanded-view").hide();
    $(".extended-bg").css("height", "0%");
    $(".expanded-view").empty();
  });

  $(document).on("click", ".gif-image", function() {
    var gif = $(this).find("img");
    var play = $(this).find("i");
    var state = gif.attr("data-state");
    if (state === "still") {
      card.pauseAllGifs();
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
    var search = $(this).attr("data-value");
    returnGifs(search);
  });
});

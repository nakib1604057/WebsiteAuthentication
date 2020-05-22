const showHeaderAt = 150;
$(document).ready(function () {
  const win = $(window),
    body = $("body");

  // Show the fixed header only on larger screen devices

  if (win.width() > 400) {
    // When we scroll more than 150px down, we set the
    // "fixed" class on the body element.

    win.on("scroll", function (e) {
      if (win.scrollTop() > showHeaderAt) {
        body.addClass("fixed");
      } else {
        body.removeClass("fixed");
      }
    });
  }
});

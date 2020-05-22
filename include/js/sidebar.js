$(".ctgli:has(.ctgulChild)").click(function (e) {
  e.preventDefault();
  console.log("hello");
  //li_HAVE_Child-hasShowed-hasSlideD
  if ($(this).hasClass("showed")) {
    //-x-hasShowed
    $(".ctgli").removeClass("showed");
    //-x-hasSlideD
    $(this).children(".ctgulChild").slideUp();
  } else {
    $(".ctgulChild").slideUp();
    $(".ctgli").removeClass("showed");

    $(this).addClass("showed");
    $(this).children(".ctgulChild").slideToggle();
  }
});

$(".ctgli").click(function () {
  $(this).toggleClass("wtok");
});

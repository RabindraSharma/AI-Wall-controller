var swiper = new Swiper('.swiper-container', {
    effect: 'cube',
    grabCursor: true,
    autoplay:{
          delay:2000
    },
    cubeEffect:{
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    pagination: {
      el: '.swiper-pagination',
    },
  });

  function goToPage(link){
      window.location.href =link;
  }

function showTerms() {
  const id = event.target.id;
  Swal.fire({
    title: "Kullanıcı sözleşmesi",
    text: "Bunu onayladığınız taktirde bu API'nin size karşı tam bilgi saglayamadıgında vea kötü amaçlı herşeyden biz değil siz sorumlu olmuş olursunuz.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Red Et",
    confirmButtonText: "Kabul et",
    showClass: {
      popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
    },
  }).then((result) => {
    if (result.isConfirmed) {
      let timerInterval;
      Swal.fire({
        title: "Yönlendiriyorsun...",
        html: "<b></b>",
        timer: 500,
        showClass: {
          popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
        },
        hideClass: {
          popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
        },
        timerProgressBar: true,
        position: "top-end",
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
       window.location.href = id
      });
    }
  });
}

export const shareOnWhatsapp = (withSessionLink: string) => {
    const whatsappUrl = `https://wa.me/?text=Check%20out%20this%20session%20I%20am%20working%20on:%20${encodeURIComponent(
        withSessionLink
    )}`;
    window.open(whatsappUrl, "_blank");
};
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amatista",
    short_name: "Amatista",
    description: "Propiedades inmobiliarias de lujo",
    start_url: "/",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/faviconcba.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}

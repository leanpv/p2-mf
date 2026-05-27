export type Property = {
  id: number;
  sliderLabel: string;
  name: string;
  location: string;
  photoCount: number;
  photos?: string[];
};

export const PROPERTIES: Property[] = [
  {
    id: 0,
    sliderLabel: "320 m² · 4 amb · Vista panorámica",
    name: "Penthouse",
    location: "Nueva Córdoba",
    photoCount: 6,
    photos: ["/2.webp", "/3.webp", "/4.webp", "/5.webp", "/6.webp", "/7.webp"],
  },
  { id: 1, sliderLabel: "480 m² · 5 amb · Jardín y piscina", name: "Casa", location: "Cerro de las Rosas", photoCount: 6 },
  { id: 2, sliderLabel: "95 m² · 2 amb · Piso alto", name: "Departamento", location: "Güemes", photoCount: 5 },
  { id: 3, sliderLabel: "1.200 m² · 6 amb · Country privado", name: "Villa", location: "Country Los Álamos", photoCount: 9 },
  { id: 4, sliderLabel: "65 m² · 1 amb · Diseño industrial", name: "Loft", location: "Centro", photoCount: 4 },
];

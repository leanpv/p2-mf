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
    sliderLabel: "90 m² · 4 amb · Vista panorámica",
    name: "Aromos",
    location: "Villa Allende Golf",
    photoCount: 6,
    photos: ["/2.webp", "/3.webp", "/4.webp", "/5.webp", "/6.webp", "/7.webp"],
  },
  { id: 1, sliderLabel: "230 m² · 8 amb · Jardín y piscina", name: "Casuarinas", location: "El Prado", photoCount: 4, photos: ["/12.webp", "/17.webp", "/21.webp", "/25.webp"] },
  { id: 2, sliderLabel: "195 m² · 6 amb · Piso alto", name: "Jacarandás", location: "Jockey Club", photoCount: 7, photos: ["/8.webp", "/11.webp", "/14.webp", "/18.webp", "/22.webp", "/24.webp", "/27.webp"] },
  { id: 3, sliderLabel: "205 m² · 6 amb · Country privado", name: "Nogales", location: "La Reserva", photoCount: 3, photos: ["/10.webp", "/16.webp", "/23.webp"] },
  { id: 4, sliderLabel: "140 m² · 4 amb · Diseño industrial", name: "Magnolias", location: "Palmas del Chateau", photoCount: 6, photos: ["/9.webp", "/13.webp", "/15.webp", "/19.webp", "/20.webp", "/26.webp"] },
];

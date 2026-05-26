export type Property = {
  id: number;
  sliderLabel: string;
  name: string;
  location: string;
  photoCount: number;
};

export const PROPERTIES: Property[] = [
  { id: 0, sliderLabel: "Slide 01", name: "Penthouse", location: "Nueva Córdoba", photoCount: 8 },
  { id: 1, sliderLabel: "Slide 02", name: "Casa", location: "Cerro de las Rosas", photoCount: 6 },
  { id: 2, sliderLabel: "Slide 03", name: "Departamento", location: "Güemes", photoCount: 5 },
  { id: 3, sliderLabel: "Slide 04", name: "Villa", location: "Country Los Álamos", photoCount: 9 },
  { id: 4, sliderLabel: "Slide 05", name: "Loft", location: "Centro", photoCount: 4 },
];

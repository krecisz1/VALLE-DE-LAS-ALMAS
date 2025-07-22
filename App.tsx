import React, { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";
import MemorialProfile from "./components/MemorialProfile";
import QRAccessScreen from "./components/QRAccessScreen";
import FamilyTreeView from "./components/FamilyTreeView";
import PricingModal from "./components/PricingModal";

export interface FamilyRelation {
  id: string;
  fromMemorialId: string;
  toMemorialId: string;
  relationType:
    | "padre"
    | "madre"
    | "hijo"
    | "hija"
    | "hermano"
    | "hermana"
    | "abuelo"
    | "abuela"
    | "nieto"
    | "nieta"
    | "bisabuelo"
    | "bisabuela"
    | "bisnieto"
    | "bisnieta"
    | "tio"
    | "tia"
    | "sobrino"
    | "sobrina"
    | "primo"
    | "prima"
    | "cuñado"
    | "cuñada"
    | "suegro"
    | "suegra"
    | "yerno"
    | "nuera"
    | "conyuge"
    | "pareja"
    | "mascota";
  dateCreated: Date;
  createdBy: string;
}

export interface PhotoWithTitle {
  url: string;
  title?: string;
}

export interface Memorial {
  id: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: Date;
  fechaFallecimiento: Date;
  tipo: "humano" | "mascota";
  fotoPrincipal: string;
  biografia: string;
  fotos: PhotoWithTitle[];
  videos: string[];
  createdBy: string;
  esPublico: boolean;
  usuariosPermitidos: string[];
  ubicacion?: string;
  ocupacion?: string;
  fechaCreacion: Date;
  familyRelations?: string[]; // IDs de las relaciones familiares
}

export type PlanType = "gratuito" | "tributo_completo";

export interface SubscriptionPlan {
  type: PlanType;
  name: string;
  price: number;
  features: string[];
  limits: {
    maxMemorials: number;
    maxPhotosPerMemorial: number;
    maxVideosPerMemorial: number;
    canUseFamilyTree: boolean;
    canAddMultipleMedia: boolean;
    canUseQRCodes: boolean;
    canAddComments: boolean;
    maxCommentsPerMemorial: number;
  };
}

export interface Usuario {
  id: string;
  username: string; // Generado automáticamente a partir del email
  email: string;
  nombre: string;
  apellidos: string;
  memorialesCreados: string[];
  memorialesPermitidos: string[];
  plan: PlanType;
  subscriptionDate?: Date;
  trialEndsAt?: Date;
}

export interface Comentario {
  id: string;
  memorialId: string;
  autorId: string;
  autorNombre: string;
  contenido: string;
  fecha: Date;
  esPrivado: boolean;
}

export interface AccessMode {
  type: "owner" | "permitted" | "qr" | "guest";
  userId?: string;
}

// Configuración de planes
export const SUBSCRIPTION_PLANS: Record<
  PlanType,
  SubscriptionPlan
> = {
  gratuito: {
    type: "gratuito",
    name: "Plan Gratuito",
    price: 0,
    features: [
      "1 memorial básico",
      "Información personal completa",
      "Foto principal",
      "Biografía ilimitada",
      "Visualización pública",
      "Comentarios básicos (5 por memorial)",
    ],
    limits: {
      maxMemorials: 1,
      maxPhotosPerMemorial: 1, // Solo foto principal
      maxVideosPerMemorial: 0,
      canUseFamilyTree: false,
      canAddMultipleMedia: false,
      canUseQRCodes: false,
      canAddComments: true,
      maxCommentsPerMemorial: 5,
    },
  },
  tributo_completo: {
    type: "tributo_completo",
    name: "Plan Tributo Completo",
    price: 4.99,
    features: [
      "Memoriales ilimitados",
      "Galería de fotos completa",
      "Videos y multimedia",
      "Árbol genealógico interactivo",
      "Códigos QR para lápidas",
      "Comentarios ilimitados",
      "Títulos para fotos",
      "Relaciones familiares completas",
      "Búsqueda avanzada",
      "Notificaciones completas",
      "Configuración de privacidad",
      "Compartir memoriales",
      "Soporte prioritario",
    ],
    limits: {
      maxMemorials: -1, // Ilimitados
      maxPhotosPerMemorial: -1, // Ilimitadas
      maxVideosPerMemorial: -1, // Ilimitados
      canUseFamilyTree: true,
      canAddMultipleMedia: true,
      canUseQRCodes: true,
      canAddComments: true,
      maxCommentsPerMemorial: -1, // Ilimitados
    },
  },
};

// Función helper para capitalizar la primera letra (autocorrector)
const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";
  return (
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  );
};

function App() {
  const [currentUser, setCurrentUser] =
    useState<Usuario | null>(null);
  const [currentView, setCurrentView] = useState<
    "login" | "dashboard" | "memorial" | "qr" | "family-tree"
  >("login");
  const [selectedMemorial, setSelectedMemorial] =
    useState<Memorial | null>(null);
  const [accessMode, setAccessMode] = useState<AccessMode>({
    type: "guest",
  });
  const [qrMemorialId, setQrMemorialId] = useState<string>("");
  const [showPricingModal, setShowPricingModal] =
    useState(false);
  const [familyRelations, setFamilyRelations] = useState<
    FamilyRelation[]
  >([
    {
      id: "relation_1",
      fromMemorialId: "memorial_example_1",
      toMemorialId: "memorial_example_2",
      relationType: "mascota",
      dateCreated: new Date("2023-12-15"),
      createdBy: "user_demo",
    },
    {
      id: "relation_2",
      fromMemorialId: "memorial_example_1",
      toMemorialId: "memorial_example_3",
      relationType: "conyuge",
      dateCreated: new Date("2023-12-15"),
      createdBy: "user_demo",
    },
    {
      id: "relation_3",
      fromMemorialId: "memorial_example_1",
      toMemorialId: "memorial_example_4",
      relationType: "hija",
      dateCreated: new Date("2023-12-15"),
      createdBy: "user_demo",
    },
    {
      id: "relation_4",
      fromMemorialId: "memorial_example_3",
      toMemorialId: "memorial_example_4",
      relationType: "hija",
      dateCreated: new Date("2023-12-15"),
      createdBy: "user_demo",
    },
  ]);

  // Mock data - Memoriales de ejemplo expandidos con títulos de fotos
  const [memoriales, setMemoriales] = useState<Memorial[]>([
    {
      id: "memorial_example_1",
      nombre: "Elena",
      apellidos: "Martínez Silva",
      fechaNacimiento: new Date("1955-03-20"),
      fechaFallecimiento: new Date("2023-11-15"),
      tipo: "humano",
      fotoPrincipal:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      biografia:
        "Maestra jubilada y abuela cariñosa, Elena dedicó su vida a la educación y a su familia. Sus tardes de té con galletas caseras y sus historias fascinantes quedaron grabadas para siempre en el corazón de sus seres queridos. Amaba leer novelas románticas y cuidar su jardín de rosas. Durante más de 35 años enseñó matemáticas en la escuela primaria local, donde era conocida por su paciencia infinita y su capacidad para hacer que los números cobraran vida. Sus estudiantes la recordaban décadas después por sus métodos creativos y su genuino cariño.",
      fotos: [
        {
          url: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=600&h=400&fit=crop",
          title: "Cumpleaños número 70",
        },
        {
          url: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=600&h=400&fit=crop",
          title: "En su jardín de rosas",
        },
        {
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=400&fit=crop",
          title: "Leyendo su libro favorito",
        },
        {
          url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop",
          title: "Enseñando a hacer galletas",
        },
        {
          url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
          title: "Caminata en el parque",
        },
      ],
      videos: [],
      createdBy: "user_demo",
      esPublico: true,
      usuariosPermitidos: [],
      ubicacion: "Valencia, España",
      ocupacion: "Maestra",
      fechaCreacion: new Date("2023-12-15"),
    },
    {
      id: "memorial_example_2",
      nombre: "Max",
      apellidos: "",
      fechaNacimiento: new Date("2010-05-12"),
      fechaFallecimiento: new Date("2024-01-20"),
      tipo: "mascota",
      fotoPrincipal:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face",
      biografia:
        "Max fue más que una mascota, fue un miembro de la familia. Este golden retriever llenó nuestro hogar de alegría durante 14 años maravillosos. Le encantaba jugar en el parque, perseguir pelotas y dar abrazos infinitos. Su lealtad incondicional y su noble corazón nos enseñaron el verdadero significado del amor puro. Era especialmente protector con los niños de la familia y tenía una habilidad única para consoler a cualquiera que estuviera triste. Sus travesuras juveniles y su sabiduría canina en la vejez nos regalaron miles de sonrisas.",
      fotos: [
        {
          url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&h=400&fit=crop",
          title: "Jugando en el parque",
        },
        {
          url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=400&fit=crop",
          title: "Nadando en el lago",
        },
        {
          url: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=400&fit=crop",
          title: "Jugando en el jardín",
        },
        {
          url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop",
          title: "Durmiendo en el sofá",
        },
        {
          url: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&h=400&fit=crop",
          title: "Con su pelota favorita",
        },
      ],
      videos: [],
      createdBy: "user_demo",
      esPublico: true,
      usuariosPermitidos: [],
      ubicacion: "Sevilla, España",
      ocupacion: "Golden Retriever",
      fechaCreacion: new Date("2024-01-25"),
    },
    {
      id: "memorial_example_3",
      nombre: "Carlos",
      apellidos: "Martínez Ruiz",
      fechaNacimiento: new Date("1952-08-15"),
      fechaFallecimiento: new Date("2022-06-30"),
      tipo: "humano",
      fotoPrincipal:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      biografia:
        "Ingeniero civil y esposo devoto, Carlos fue el pilar de la familia Martínez. Durante 45 años de matrimonio con Elena, construyó no solo edificios, sino también una familia sólida llena de amor. Su pasión por la carpintería y su paciencia infinita lo convirtieron en el abuelo favorito. Trabajó en la construcción del nuevo hospital de la ciudad y del puente que conecta los dos barrios principales. En sus ratos libres, creaba muebles artesanales que regalaba a familiares y amigos. Sus nietos lo recordarán siempre por las casas de muñecas y los carros de madera que les construía.",
      fotos: [
        {
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
          title: "Último proyecto como ingeniero",
        },
        {
          url: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=600&h=400&fit=crop",
          title: "En su taller de carpintería",
        },
        {
          url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=400&fit=crop",
          title: "Enseñando a pescar",
        },
        {
          url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop",
          title: "Partida de dominó",
        },
        {
          url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop",
          title: "Trabajando en el jardín",
        },
      ],
      videos: [],
      createdBy: "user_demo",
      esPublico: true,
      usuariosPermitidos: [],
      ubicacion: "Valencia, España",
      ocupacion: "Ingeniero Civil",
      fechaCreacion: new Date("2022-07-15"),
    },
    {
      id: "memorial_example_4",
      nombre: "Carmen",
      apellidos: "Martínez López",
      fechaNacimiento: new Date("1980-04-12"),
      fechaFallecimiento: new Date("2024-02-14"),
      tipo: "humano",
      fotoPrincipal:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      biografia:
        "Doctora pediatra y madre amorosa, Carmen siguió los pasos de su madre en el cuidado de otros. Su consultorio siempre estaba lleno de risas infantiles y su hogar de amor familiar. Dejó un legado de bondad en cada niño que atendió y en su propia hija, a quien amó profundamente. Se especializó en medicina preventiva infantil y fue pionera en programas de nutrición escolar en su ciudad. Tocaba el piano en el hospital para calmar a los pequeños pacientes y organizaba campañas de vacunación en comunidades rurales. Su compromiso social la llevó a fundar una clínica gratuita para familias de bajos recursos.",
      fotos: [
        {
          url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop",
          title: "En su consultorio",
        },
        {
          url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop",
          title: "Tocando el piano",
        },
        {
          url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
          title: "En la clínica comunitaria",
        },
        {
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
          title: "Con sus pacientes",
        },
        {
          url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=400&fit=crop",
          title: "Campaña de vacunación",
        },
      ],
      videos: [],
      createdBy: "user_demo",
      esPublico: true,
      usuariosPermitidos: [],
      ubicacion: "Madrid, España",
      ocupacion: "Pediatra",
      fechaCreacion: new Date("2024-02-20"),
    },
  ]);

  // Comentarios expandidos con más variedad y comentarios para todas las fotos
  const [comentarios, setComentarios] = useState<Comentario[]>([
    // Comentarios específicos de fotos para Elena
    {
      id: "comment_1b",
      memorialId: "memorial_example_1",
      autorId: "user_demo",
      autorNombre: "María Elena Rodríguez",
      contenido:
        "[Sobre la foto 1] Esta foto fue tomada en su cumpleaños número 70. Qué feliz se veía rodeada de toda la familia.",
      fecha: new Date("2023-12-18"),
      esPrivado: false,
    },
    {
      id: "comment_1c",
      memorialId: "memorial_example_1",
      autorId: "user_demo",
      autorNombre: "José Antonio Silva",
      contenido:
        "[Sobre la foto 2] Recuerdo este día en el jardín. Le encantaba cuidar sus rosas, era su pasión.",
      fecha: new Date("2023-12-17"),
      esPrivado: false,
    },
    {
      id: "comment_1d",
      memorialId: "memorial_example_1",
      autorId: "user_demo",
      autorNombre: "Carlos, su esposo",
      contenido:
        "[Sobre la foto 3] Aquí está con su libro favorito en nuestro rincón de lectura. Podía pasar horas ahí.",
      fecha: new Date("2023-12-16"),
      esPrivado: false,
    },
    {
      id: "comment_1e",
      memorialId: "memorial_example_1",
      autorId: "user_demo",
      autorNombre: "Nieta Sofía",
      contenido:
        "[Sobre la foto 4] Esta es de cuando me enseñó a hacer galletas. Siempre tan paciente conmigo.",
      fecha: new Date("2023-12-15"),
      esPrivado: false,
    },
    {
      id: "comment_1f",
      memorialId: "memorial_example_1",
      autorId: "user_demo",
      autorNombre: "Vecina Mercedes",
      contenido:
        "[Sobre la foto 5] La foto del parque donde íbamos a caminar juntas. Siempre con una sonrisa.",
      fecha: new Date("2023-12-14"),
      esPrivado: false,
    },

    // Comentarios específicos de fotos para Max
    {
      id: "comment_2b",
      memorialId: "memorial_example_2",
      autorId: "user_demo",
      autorNombre: "Carmen Morales",
      contenido:
        "[Sobre la foto 1] Esta es mi foto favorita de Max. Siempre le gustaba jugar en el parque central.",
      fecha: new Date("2024-01-26"),
      esPrivado: false,
    },
    {
      id: "comment_2c",
      memorialId: "memorial_example_2",
      autorId: "user_demo",
      autorNombre: "Luis García",
      contenido:
        "[Sobre la foto 2] Aquí está nadando en el lago. Era tan feliz en el agua, un verdadero golden retriever.",
      fecha: new Date("2024-01-25"),
      esPrivado: false,
    },
    {
      id: "comment_2d",
      memorialId: "memorial_example_2",
      autorId: "user_demo",
      autorNombre: "Niño Pablo",
      contenido:
        "[Sobre la foto 3] Max jugando conmigo en el jardín. Era mi mejor amigo peludo.",
      fecha: new Date("2024-01-24"),
      esPrivado: false,
    },
    {
      id: "comment_2e",
      memorialId: "memorial_example_2",
      autorId: "user_demo",
      autorNombre: "Elena, su mamá humana",
      contenido:
        "[Sobre la foto 4] Aquí está durmiendo en su lugar favorito del sofá. Qué paz transmitía.",
      fecha: new Date("2024-01-23"),
      esPrivado: false,
    },
    {
      id: "comment_2f",
      memorialId: "memorial_example_2",
      autorId: "user_demo",
      autorNombre: "Amigo canino Rex",
      contenido:
        "[Sobre la foto 5] Max con su pelota favorita. Podía jugar horas y horas sin cansarse.",
      fecha: new Date("2024-01-22"),
      esPrivado: false,
    },

    // Comentarios específicos de fotos para Carlos
    {
      id: "comment_3b",
      memorialId: "memorial_example_3",
      autorId: "user_demo",
      autorNombre: "Pedro Ramírez",
      contenido:
        "[Sobre la foto 1] Esta foto es de cuando terminó su último proyecto como ingeniero. Qué orgulloso estaba.",
      fecha: new Date("2022-07-08"),
      esPrivado: false,
    },
    {
      id: "comment_3c",
      memorialId: "memorial_example_3",
      autorId: "user_demo",
      autorNombre: "Hijo Ricardo",
      contenido:
        "[Sobre la foto 2] Papá en su taller de carpintería. Ahí creaba verdaderas obras de arte.",
      fecha: new Date("2022-07-07"),
      esPrivado: false,
    },
    {
      id: "comment_3d",
      memorialId: "memorial_example_3",
      autorId: "user_demo",
      autorNombre: "Nieto Miguel",
      contenido:
        "[Sobre la foto 3] Abuelo enseñándome a pescar. Fue uno de los mejores días de mi vida.",
      fecha: new Date("2022-07-06"),
      esPrivado: false,
    },
    {
      id: "comment_3e",
      memorialId: "memorial_example_3",
      autorId: "user_demo",
      autorNombre: "Amigo de dominó Juan",
      contenido:
        "[Sobre la foto 4] Carlos con su sonrisa característica después de ganar otra partida de dominó.",
      fecha: new Date("2022-07-05"),
      esPrivado: false,
    },
    {
      id: "comment_3f",
      memorialId: "memorial_example_3",
      autorId: "user_demo",
      autorNombre: "Elena, su esposa",
      contenido:
        "[Sobre la foto 5] Mi amor trabajando en el jardín que plantamos juntos. Qué hermosos recuerdos.",
      fecha: new Date("2022-07-04"),
      esPrivado: false,
    },

    // Comentarios específicos de fotos para Carmen
    {
      id: "comment_4b",
      memorialId: "memorial_example_4",
      autorId: "user_demo",
      autorNombre: "Sofía Herrera",
      contenido:
        "[Sobre la foto 1] Aquí está en su consultorio con algunos de sus pequeños pacientes. Siempre tan cariñosa.",
      fecha: new Date("2024-02-23"),
      esPrivado: false,
    },
    {
      id: "comment_4c",
      memorialId: "memorial_example_4",
      autorId: "user_demo",
      autorNombre: "Su hija Isabella",
      contenido:
        "[Sobre la foto 2] Mami tocando el piano como me enseñó. Era nuestro momento especial cada tarde.",
      fecha: new Date("2024-02-22"),
      esPrivado: false,
    },
    {
      id: "comment_4d",
      memorialId: "memorial_example_4",
      autorId: "user_demo",
      autorNombre: "Colega Dr. Martín",
      contenido:
        "[Sobre la foto 3] Carmen en la clínica comunitaria que fundó. Su compromiso social era admirable.",
      fecha: new Date("2024-02-21"),
      esPrivado: false,
    },
    {
      id: "comment_4e",
      memorialId: "memorial_example_4",
      autorId: "user_demo",
      autorNombre: "Madre agradecida Rosa",
      contenido:
        "[Sobre la foto 4] La doctora Carmen con mi hijo durante su tratamiento. Nos salvó la vida.",
      fecha: new Date("2024-02-20"),
      esPrivado: false,
    },
    {
      id: "comment_4f",
      memorialId: "memorial_example_4",
      autorId: "user_demo",
      autorNombre: "Esposo Roberto",
      contenido:
        "[Sobre la foto 5] Mi amor en una de sus campañas de vacunación rural. Siempre ayudando a otros.",
      fecha: new Date("2024-02-19"),
      esPrivado: false,
    },
  ]);

  // Helper function para verificar límites del plan
  const checkPlanLimits = (
    user: Usuario,
    action: string,
    currentCount?: number,
  ): { allowed: boolean; message?: string } => {
    const plan = SUBSCRIPTION_PLANS[user.plan];

    switch (action) {
      case "create_memorial":
        const userMemorialCount = memoriales.filter(
          (m) => m.createdBy === user.id,
        ).length;
        if (
          plan.limits.maxMemorials !== -1 &&
          userMemorialCount >= plan.limits.maxMemorials
        ) {
          return {
            allowed: false,
            message: `Tu plan ${plan.name} permite máximo ${plan.limits.maxMemorials} memorial${plan.limits.maxMemorials === 1 ? "" : "es"}. Actualiza a Tributo Completo para memoriales ilimitados.`,
          };
        }
        break;

      case "add_photos":
        if (!plan.limits.canAddMultipleMedia) {
          return {
            allowed: false,
            message:
              "La galería de fotos está disponible en el Plan Tributo Completo. Actualiza tu plan para agregar múltiples fotos.",
          };
        }
        break;

      case "add_videos":
        if (plan.limits.maxVideosPerMemorial === 0) {
          return {
            allowed: false,
            message:
              "Los videos están disponibles en el Plan Tributo Completo. Actualiza tu plan para agregar videos.",
          };
        }
        break;

      case "use_family_tree":
        if (!plan.limits.canUseFamilyTree) {
          return {
            allowed: false,
            message:
              "El Árbol Genealógico está disponible en el Plan Tributo Completo. Actualiza tu plan para crear relaciones familiares.",
          };
        }
        break;

      case "use_qr_codes":
        if (!plan.limits.canUseQRCodes) {
          return {
            allowed: false,
            message:
              "Los Códigos QR para lápidas están disponibles en el Plan Tributo Completo. Actualiza tu plan para generar códigos QR.",
          };
        }
        break;

      case "add_comment":
        if (
          plan.limits.maxCommentsPerMemorial !== -1 &&
          currentCount &&
          currentCount >= plan.limits.maxCommentsPerMemorial
        ) {
          return {
            allowed: false,
            message: `Tu plan permite máximo ${plan.limits.maxCommentsPerMemorial} comentarios por memorial. Actualiza a Tributo Completo para comentarios ilimitados.`,
          };
        }
        break;
    }

    return { allowed: true };
  };

  const handleLogin = (userData: Usuario) => {
    // Asignar plan gratuito por defecto a nuevos usuarios
    const userWithPlan = {
      ...userData,
      plan: userData.plan || ("gratuito" as PlanType),
    };
    setCurrentUser(userWithPlan);
    setCurrentView("dashboard");
    setAccessMode({ type: "owner", userId: userWithPlan.id });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("login");
    setSelectedMemorial(null);
    setAccessMode({ type: "guest" });
  };

  const handleCreateMemorial = (
    memorialData: Omit<
      Memorial,
      "id" | "fechaCreacion" | "createdBy"
    >,
    familyRelations?: Omit<
      FamilyRelation,
      "id" | "dateCreated" | "createdBy"
    >[],
  ) => {
    if (!currentUser) return;

    // Verificar límites del plan
    const limitCheck = checkPlanLimits(
      currentUser,
      "create_memorial",
    );
    if (!limitCheck.allowed) {
      alert(limitCheck.message);
      setShowPricingModal(true);
      return;
    }

    const newMemorialId = Date.now().toString();
    const newMemorial: Memorial = {
      ...memorialData,
      id: newMemorialId,
      fechaCreacion: new Date(),
      createdBy: currentUser.id,
    };

    setMemoriales((prev) => [newMemorial, ...prev]);

    // Crear relaciones familiares si se proporcionaron
    if (familyRelations && familyRelations.length > 0) {
      const newFamilyRelations = familyRelations.map(
        (relation) => {
          let fromMemorialId =
            relation.fromMemorialId === "TEMP_ID"
              ? newMemorialId
              : relation.fromMemorialId;
          let toMemorialId =
            relation.toMemorialId === "TEMP_ID"
              ? newMemorialId
              : relation.toMemorialId;

          // Si toMemorialId es el ID del usuario actual, crear un memorial placeholder para el usuario
          if (toMemorialId === currentUser.id) {
            // Crear un memorial temporal para el usuario actual si no existe
            const existingUserMemorial = memoriales.find(
              (m) =>
                m.createdBy === currentUser.id &&
                m.nombre === currentUser.nombre,
            );
            if (!existingUserMemorial) {
              const userMemorialId = `user-memorial-${currentUser.id}`;
              const userMemorial: Memorial = {
                id: userMemorialId,
                nombre: currentUser.nombre,
                apellidos: currentUser.apellidos,
                fechaNacimiento: new Date("1970-01-01"), // Fecha placeholder
                fechaFallecimiento: new Date(), // Fecha placeholder
                tipo: "humano",
                fotoPrincipal:
                  "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
                biografia: "Perfil de usuario",
                fotos: [],
                videos: [],
                createdBy: currentUser.id,
                esPublico: false,
                usuariosPermitidos: [],
                fechaCreacion: new Date(),
              };

              // Solo agregar si no existe ya
              setMemoriales((prev) => {
                const exists = prev.some(
                  (m) => m.id === userMemorialId,
                );
                return exists ? prev : [userMemorial, ...prev];
              });

              toMemorialId = userMemorialId;
            } else {
              toMemorialId = existingUserMemorial.id;
            }
          }

          return {
            ...relation,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            fromMemorialId,
            toMemorialId,
            dateCreated: new Date(),
            createdBy: currentUser.id,
          };
        },
      );

      setFamilyRelations((prev) => [
        ...prev,
        ...newFamilyRelations,
      ]);
    }
  };

  const handleViewMemorial = (
    memorial: Memorial,
    mode: AccessMode,
  ) => {
    setSelectedMemorial(memorial);
    setAccessMode(mode);
    setCurrentView("memorial");
  };

  const handleQRAccess = (memorialId: string) => {
    const memorial = memoriales.find(
      (m) => m.id === memorialId || m.id.includes(memorialId),
    );
    if (memorial) {
      setSelectedMemorial(memorial);
      setAccessMode({ type: "qr" });
      setCurrentView("memorial");
    } else {
      // Si no se encuentra el memorial, crear uno simulado para demo
      const mockMemorial: Memorial = {
        id: memorialId,
        nombre: "Luna",
        apellidos: "",
        fechaNacimiento: new Date("2015-08-10"),
        fechaFallecimiento: new Date("2023-11-25"),
        tipo: "mascota",
        fotoPrincipal:
          "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop&crop=face",
        biografia:
          "Luna fue una gata especial que nos acompañó durante 8 años llenos de ronroneos y cariño. Con su pelaje gris plateado y sus ojos verdes, conquistó nuestros corazones desde el primer día. Le encantaba dormir junto a la ventana bajo los rayos del sol y jugar con pequeños ratones de juguete.",
        fotos: [
          {
            url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop",
            title: "Durmiendo al sol",
          },
          {
            url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop",
            title: "Jugando en casa",
          },
        ],
        videos: [],
        createdBy: "demo_user",
        esPublico: true,
        usuariosPermitidos: [],
        ubicacion: "Málaga, España",
        ocupacion: "Gato doméstico",
        fechaCreacion: new Date("2023-12-01"),
      };

      setSelectedMemorial(mockMemorial);
      setAccessMode({ type: "qr" });
      setCurrentView("memorial");
    }
  };

  const handleAddComment = (
    comentario: Omit<Comentario, "id" | "fecha">,
  ) => {
    if (!currentUser) return;

    // Verificar límites de comentarios
    const memorialComments = comentarios.filter(
      (c) => c.memorialId === comentario.memorialId,
    );
    const limitCheck = checkPlanLimits(
      currentUser,
      "add_comment",
      memorialComments.length,
    );

    if (!limitCheck.allowed) {
      alert(limitCheck.message);
      setShowPricingModal(true);
      return;
    }

    const newComment: Comentario = {
      ...comentario,
      id: Date.now().toString(),
      fecha: new Date(),
    };
    setComentarios((prev) => [newComment, ...prev]);
  };

  const handleUpdateUserProfile = (
    userData: Partial<Usuario> & { fotoPerfil?: string },
  ) => {
    if (currentUser) {
      setCurrentUser((prev) => ({
        ...prev!,
        ...userData,
      }));
    }
  };

  const handleUpgradePlan = (newPlan: PlanType) => {
    if (currentUser) {
      setCurrentUser((prev) => ({
        ...prev!,
        plan: newPlan,
        subscriptionDate: new Date(),
      }));
      setShowPricingModal(false);
      alert(
        `¡Plan actualizado a ${SUBSCRIPTION_PLANS[newPlan].name}!`,
      );
    }
  };

  const handleAddFamilyRelation = (
    relation: Omit<FamilyRelation, "id" | "dateCreated">,
  ) => {
    if (!currentUser) return;

    // Verificar si puede usar el árbol familiar
    const limitCheck = checkPlanLimits(
      currentUser,
      "use_family_tree",
    );
    if (!limitCheck.allowed) {
      alert(limitCheck.message);
      setShowPricingModal(true);
      return;
    }

    const newRelation: FamilyRelation = {
      ...relation,
      id: Date.now().toString(),
      dateCreated: new Date(),
      createdBy: currentUser.id,
    };

    setFamilyRelations((prev) => [...prev, newRelation]);
  };

  const handleRemoveFamilyRelation = (relationId: string) => {
    setFamilyRelations((prev) =>
      prev.filter((r) => r.id !== relationId),
    );
  };

  const handleDeleteMemorial = (memorialId: string) => {
    // Eliminar el memorial
    setMemoriales((prev) =>
      prev.filter((m) => m.id !== memorialId),
    );

    // Eliminar relaciones familiares asociadas
    setFamilyRelations((prev) =>
      prev.filter(
        (r) =>
          r.fromMemorialId !== memorialId &&
          r.toMemorialId !== memorialId,
      ),
    );

    // Eliminar comentarios asociados
    setComentarios((prev) =>
      prev.filter((c) => c.memorialId !== memorialId),
    );
  };

  const getRelatedMemorials = (
    memorialId: string,
  ): { memorial: Memorial; relation: FamilyRelation }[] => {
    const related: {
      memorial: Memorial;
      relation: FamilyRelation;
    }[] = [];

    familyRelations.forEach((relation) => {
      if (relation.fromMemorialId === memorialId) {
        const memorial = memoriales.find(
          (m) => m.id === relation.toMemorialId,
        );
        if (memorial) {
          related.push({ memorial, relation });
        }
      } else if (relation.toMemorialId === memorialId) {
        const memorial = memoriales.find(
          (m) => m.id === relation.fromMemorialId,
        );
        if (memorial) {
          // Invertir la relación
          const reversedRelation = {
            ...relation,
            relationType: getReverseRelationType(
              relation.relationType,
            ),
          };
          related.push({
            memorial,
            relation: reversedRelation,
          });
        }
      }
    });

    return related;
  };

  const getReverseRelationType = (
    type: FamilyRelation["relationType"],
  ): FamilyRelation["relationType"] => {
    const reverseMap: Record<
      FamilyRelation["relationType"],
      FamilyRelation["relationType"]
    > = {
      padre: "hijo",
      madre: "hija",
      hijo: "padre",
      hija: "madre",
      hermano: "hermano",
      hermana: "hermana",
      abuelo: "nieto",
      abuela: "nieta",
      nieto: "abuelo",
      nieta: "abuela",
      bisabuelo: "bisnieto",
      bisabuela: "bisnieta",
      bisnieto: "bisabuelo",
      bisnieta: "bisabuela",
      tio: "sobrino",
      tia: "sobrina",
      sobrino: "tio",
      sobrina: "tia",
      primo: "primo",
      prima: "prima",
      cuñado: "cuñado",
      cuñada: "cuñada",
      suegro: "yerno",
      suegra: "nuera",
      yerno: "suegro",
      nuera: "suegra",
      conyuge: "conyuge",
      pareja: "pareja",
      mascota: "mascota",
    };
    return reverseMap[type] || type;
  };

  const getMemorialRelationship = (
    memorialId: string,
  ): string => {
    if (!currentUser) return "";

    // Buscar cualquier relación donde este memorial esté involucrado
    const relation = familyRelations.find(
      (r) =>
        r.fromMemorialId === memorialId ||
        r.toMemorialId === memorialId,
    );

    if (relation) {
      let relationType = "";

      // Si el memorial es el "from", devolver la relación directa
      if (relation.fromMemorialId === memorialId) {
        relationType = relation.relationType;
      }
      // Si el memorial es el "to", devolver la relación inversa
      else if (relation.toMemorialId === memorialId) {
        relationType = getReverseRelationType(
          relation.relationType,
        );
      }

      // Aplicar capitalización automática (autocorrector)
      return capitalizeFirstLetter(relationType);
    }

    return "";
  };

  const canAccessFullContent = (
    memorial: Memorial,
  ): boolean => {
    if (!memorial) return false;
    if (
      accessMode.type === "owner" &&
      currentUser?.id === memorial.createdBy
    )
      return true;
    if (
      accessMode.type === "owner" &&
      memorial.createdBy === "user_demo"
    )
      return true; // Acceso a memoriales demo
    if (
      accessMode.type === "permitted" &&
      memorial.usuariosPermitidos.includes(
        currentUser?.id || "",
      )
    )
      return true;
    return false;
  };

  if (currentView === "qr") {
    return (
      <QRAccessScreen
        onAccessMemorial={handleQRAccess}
        onBack={() => setCurrentView("login")}
      />
    );
  }

  if (currentView === "memorial" && selectedMemorial) {
    return (
      <MemorialProfile
        memorial={selectedMemorial}
        accessMode={accessMode}
        currentUser={currentUser}
        comentarios={comentarios.filter(
          (c) => c.memorialId === selectedMemorial.id,
        )}
        canAccessFullContent={canAccessFullContent(
          selectedMemorial,
        )}
        onBack={() => {
          if (currentUser) {
            setCurrentView("dashboard");
          } else {
            setCurrentView("login");
          }
        }}
        onAddComment={handleAddComment}
        checkPlanLimits={checkPlanLimits}
        onShowPricing={() => setShowPricingModal(true)}
      />
    );
  }

  if (currentView === "family-tree" && currentUser) {
    // Solo mostrar memoriales demo si el usuario no tiene memoriales propios
    const userMemorials = memoriales.filter(
      (m) => m.createdBy === currentUser.id,
    );
    const showDemoMemorials = userMemorials.length === 0;

    return (
      <FamilyTreeView
        currentUser={currentUser}
        familyRelations={familyRelations}
        allMemorials={memoriales.filter(
          (m) =>
            m.createdBy === currentUser.id ||
            (showDemoMemorials &&
              m.createdBy === "user_demo") || // Solo mostrar demos si no tiene memoriales propios
            m.usuariosPermitidos.includes(currentUser.id),
        )}
        onBack={() => setCurrentView("dashboard")}
        onAddRelation={handleAddFamilyRelation}
        onRemoveRelation={handleRemoveFamilyRelation}
        onViewMemorial={(memorial) =>
          handleViewMemorial(memorial, {
            type: "owner",
            userId: currentUser?.id,
          })
        }
        checkPlanLimits={checkPlanLimits}
        onShowPricing={() => setShowPricingModal(true)}
      />
    );
  }

  if (currentView === "dashboard" && currentUser) {
    // Solo mostrar memoriales demo si el usuario no tiene memoriales propios
    const userMemorials = memoriales.filter(
      (m) => m.createdBy === currentUser.id,
    );
    const showDemoMemorials = userMemorials.length === 0;

    return (
      <>
        <Dashboard
          user={currentUser}
          memoriales={memoriales.filter(
            (m) =>
              m.createdBy === currentUser.id ||
              (showDemoMemorials &&
                m.createdBy === "user_demo") || // Solo mostrar demos si no tiene memoriales propios
              m.usuariosPermitidos.includes(currentUser.id),
          )}
          onCreateMemorial={handleCreateMemorial}
          onViewMemorial={handleViewMemorial}
          onDeleteMemorial={handleDeleteMemorial}
          onUpdateUserProfile={handleUpdateUserProfile}
          onLogout={handleLogout}
          onViewFamilyTree={() => setCurrentView("family-tree")}
          getMemorialRelationship={getMemorialRelationship}
          checkPlanLimits={checkPlanLimits}
          onShowPricing={() => setShowPricingModal(true)}
        />
        {showPricingModal && (
          <PricingModal
            currentPlan={currentUser.plan}
            onUpgrade={handleUpgradePlan}
            onClose={() => setShowPricingModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <LoginScreen
      onLogin={handleLogin}
      onQRAccess={() => setCurrentView("qr")}
    />
  );
}

export default App;
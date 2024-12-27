export interface Teacher {
  id: string;
  email: string;
  name: string;
  age: number;
  bio: string;
  photo: string;
  achievements: {
    rating?: number;
    reviews?: number;
    students?: number;
    courses?: number;
  };
  category: {
    id: string;
    name: string;
  };
}

export interface UserLocalData {
  name: string;
  email: string;
  phone: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
}

interface Bootcamp {
  id: string;
  title: string;
  subHeading: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  discountedPrice: number;
  coverImage: string;
  certificateImage: string;
  onboardingFormLink: string;
  welcomeKitURL: string;
  duration: number;
  durationType: string;
  teacherId: string;
  doubtFormLink: string;
  createdAt: string;
  updatedAt: string;
  bundleBootcampId: string | null;
  whatsappGroupLink: string;
  facilitatorId: string;
  hidden: boolean;
  learnings: string;
  metaData: Record<string, string>;
  teacher: Teacher;
  categories: [];
  masterClass: {
    id: string;
    slug: string;
    slots: {
      active: boolean;
      startDateTime: string;
    }[];
  }[];
  bundleBootcamp?: Omit<Bootcamp, "bundleBootcamp">;
}

export interface BootcampSlugData {
  data: {
    id: string;
    bootcampId: string;
    startDateTime: string;
    endDateTime: string;
    Topics: string[];
    active: boolean;
    metaData: string | null;
    brochurePdf: string | null;
    updatedAt: string;
    createdAt: string;
    Modules: Module[];
    Bootcamp: Bootcamp;
  };
  message: string;
}

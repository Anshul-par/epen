import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  activeSubscription?: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  password?: string;
  currentPlan?: string;
  phoneNumber?: string;
  firebaseUserId?: string;
  email: string;
  role?: string;
  profileImage?: Types.ObjectId;
  isEmailVerified?: boolean;
  isGoogleLogin?: boolean;
  isAppleLogin?: boolean;
  isRegistered?: boolean;
  isPurchased?: boolean;
  isBlocked?: boolean;
  isFeedback?: boolean;
  isSubscribe?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IClient {
  _id?: Types.ObjectId;
  clientname: string;
  projectTitle: string;
  industry: string;
  tags: [string];
  image: Types.ObjectId;
  hidden: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMedia {
  _id?: Types.ObjectId | string;
  title: string;
  description: string;
  url: string;
  mime: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContact {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  media: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IKeyFeature {
  heading: string;
  paragraph: string;
}

export interface IProduct {
  _id: Types.ObjectId;
  category: Types.ObjectId;
  image: Types.ObjectId;
  icon_image?: Types.ObjectId;
  company_name: string;
  product_name: string;
  description: string;
  hidden: boolean;
  heading_main: string;
  heading_sub: string;
  key_features: IKeyFeature[];
  tags: string[];
  supported_platforms: string[];
  supported_gpu_architectures: string[];
  target_applications: string[];
  version: string;
  transformation_statement: string;
  __v: number;
}

export interface ISubService {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  service: Types.ObjectId;
  hidden: boolean;
  image?: Types.ObjectId;
  icon_image?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IService {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  hidden: boolean;
  image?: Types.ObjectId;
  icon_image?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  image: Types.ObjectId;
  icon_image: Types.ObjectId;
  hidden: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFAQ {
  _id?: Types.ObjectId;
  question: string;
  answer: string;
  category: string;
  hidden: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddress {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  companyName?: string;
  address: string;
  addressLine2?: string;
  city: string;
  country: string;
  region?: string;
  zip: string;
  phone: string;
  user: Types.ObjectId;
  default?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComponent {
  name: string;
  bgImage?: Types.ObjectId;
  bgVideo?: Types.ObjectId;
  image?: Types.ObjectId;
  mainHeading: string;
  subHeading?: string;
  CTA_Text?: string;
  order: number;
  others?: any;
}

export interface IPage {
  name: string;
  components: IComponent[];
}

export interface IClientStory {
  client: Types.ObjectId;
  icon_image?: Types.ObjectId;
  components: IComponent[];
}

export interface IProductDetails {
  product: Types.ObjectId;
  icon_image?: Types.ObjectId;
  components: IComponent[];
}

export interface IAboutUs {
  address: string;
  phone: string;
  abousUs: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICart {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
  status?: "active" | "converted";
  createdAt?: Date;
  updatedAt?: Date;
}

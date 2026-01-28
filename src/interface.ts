export interface projectPackage {
    _id: string,
    packageName: string,
    packageTitle: string,
    time: number,
    price: number,
    successFee: number
}

export interface User {
    _id: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    userAvt: string;
    userStatus: string;
    userRole: string;
    userAddress: string;
    userFirstName: string;
    userLastName: string
}

export interface Login {
    token: string,
    user: User
}

export interface Register {
    message: string,
    token: string,
    email: string,
    errors: {
        userName?: string,
        userEmail?: string,
    }
}

export interface VerifyOTP {
    token: string,
    user: User,
    action: string
}

export interface ResendOTP {
    token: string,
    email: string
}

export interface ForgotPassword {
    token: string,
    email: string
}

// types/interface.ts

// Interface cho User (chủ dự án - dựa trên ref: 'User')
export interface User {
    _id: string;
    name: string;
    avatar?: string;
}

// Interface chính cho Project dựa trên Mongoose Schema
export interface IProject {
    _id: string | undefined
    projectName: string | undefined;          
    projectType: string | undefined;           
    userId?: User | string | undefined;         
    briefIntro: string | undefined;          
    brandImage: string[] | undefined;       
    activityImage: string[] | undefined;       
    summary?: string | undefined;             
    brandStory?: string | undefined;        
    videoLink?: string | undefined;            
    totalCallValue: number | undefined;       
    issueQuantity?: number | undefined;        
    openTime: string | undefined;              
    capitalGoal?: string | undefined;          


    businessName?: string | undefined;
    taxId?: string | undefined;
    bankAccount?: string | undefined;
    bankName?: string | undefined;
    transparencyCommitment?: string | undefined;
    officeAddress?: string | undefined;
    representative?: string | undefined;
    contactEmail?: string | undefined;
    phoneNumber?: string | undefined;

    status: 'process' | 'active' | 'completed' | 'failed' | undefined;
    createAt?: string | undefined;
    currentAmount?: number | undefined;
    backerCount?: number | undefined;
}

// Interface cho gói quà tặng (Reward Package)
// Schema Project không chứa cái này, nên thường nó nằm ở collection khác hoặc sub-document
export interface IRewardPackage {
    id: string | number;
    name: string;
    price: number;
    description?: string;
    quantity: number;
    image?: string;
    estimatedDelivery?: string;
}

export interface IRewardPackage {
    id: string | number;
    name: string;
    price: number;
    description?: string;
    quantity: number;
    image?: string;
    estimatedDelivery?: string;
}
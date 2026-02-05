export interface projectPackage {
    _id: string,
    packageName: string,
    packageTitle: string,
    time: number,
    price: number,
    successFee: number
}

export interface IUser {
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
    user: IUser
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
    user: IUser,
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


export interface ICategory {
    _id: string;
    categoryName: string;
    categoryDesc?: string;
}

export interface IProject {
    _id?: string | undefined
    projectName?: string | undefined;
    projectType?: ICategory
    userId?: IUser | string | undefined;
    briefIntro?: string | undefined;
    brandImage?: string[] | undefined;
    activityImage?: string[] | undefined;
    summary?: string | undefined;
    brandStory?: string | undefined;
    videoLink?: string | undefined;
    totalCallValue?: number | undefined;
    issueQuantity?: number | undefined;
    openTime?: string | undefined;
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


export interface IRewardPackage {
    _id: string | number;
    name: string;
    price: number;
    description?: string;
    quantity: number;
    image?: string;
    estimatedDelivery?: string;
}

export interface INotification {
    _id: string,
    userId: string,
    title: string,
    message: string,
    isRead: boolean,
    link?: string,
    createdAt: Date
}

export interface getAllNotification {
    notifications: INotification[],
    total: number,
    page: number,
    limit: number,
    hasMore: boolean,
}

export interface IDonation {
    _id: string,
    amount: number,
    donor: IUser,
    project: IProject[]
    message: string,
    createdAt: Date
}
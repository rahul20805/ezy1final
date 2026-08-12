import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface RequestRideInput {
    dropoffLocation: string;
    passengerCount: bigint;
    rideType: string;
    datetime: string;
    pickupLocation: string;
}
export interface UserPublic {
    id: UserId;
    preferredLanguage: string;
    name: string;
    createdAt: Timestamp;
    role: Role;
    savedAddresses: Array<string>;
    email: string;
    phone: string;
}
export interface Listing {
    id: bigint;
    title: string;
    description: string;
    category: string;
    price: bigint;
}
export interface BusStop {
    arrivalTime: string;
    name: string;
}
export interface AvailabilitySlot {
    startTime: string;
    endTime: string;
    date: string;
    isBooked: boolean;
}
export interface BusRoute {
    id: bigint;
    arrivalTime: string;
    departureTime: string;
    routeName: string;
    availability: bigint;
    stops: Array<BusStop>;
    price: bigint;
}
export interface Transaction {
    id: bigint;
    date: Timestamp;
    description: string;
    txType: TransactionType;
    amount: bigint;
}
export type UserId = Principal;
export interface RegisterVendorInput {
    contactInfo: string;
    name: string;
    vendorType: VendorType;
}
export interface RegisterUserInput {
    preferredLanguage: string;
    name: string;
    email: string;
    phone: string;
}
export interface ListingInput {
    title: string;
    description: string;
    category: string;
    price: bigint;
}
export interface BookAppointmentInput {
    doctorId: bigint;
    visitType: VisitType;
    notes: string;
    dateTime: string;
}
export interface RideRequest {
    id: bigint;
    status: RideStatus;
    dropoffLocation: string;
    userId: UserId;
    fare: bigint;
    createdAt: Timestamp;
    passengerCount: bigint;
    assignedDriverId?: UserId;
    rideType: string;
    datetime: string;
    pickupLocation: string;
}
export interface WalletPublic {
    balance: bigint;
    userId: UserId;
    transactions: Array<Transaction>;
}
export interface VendorPublic {
    id: bigint;
    contactInfo: string;
    offerings: Array<Listing>;
    ownerId: UserId;
    name: string;
    approvalStatus: ApprovalStatus;
    earnings: bigint;
    rating: number;
    registeredAt: Timestamp;
    vendorType: VendorType;
}
export interface Doctor {
    id: bigint;
    availabilitySlots: Array<AvailabilitySlot>;
    name: string;
    qualifications: Array<string>;
    specialization: string;
    rating: number;
    hourlyPrice: bigint;
    visitTypes: Array<VisitType>;
}
export interface Appointment {
    id: bigint;
    status: AppointmentStatus;
    doctorId: bigint;
    userId: UserId;
    createdAt: Timestamp;
    visitType: VisitType;
    notes: string;
    dateTime: string;
}
export interface AdminApprovalPublic {
    decision: ApprovalStatus;
    reviewedDate?: Timestamp;
    rejectionReason?: string;
    reviewedBy?: UserId;
    vendorId: bigint;
    submissionDate: Timestamp;
}
export enum AppointmentStatus {
    scheduled = "scheduled",
    cancelled = "cancelled",
    completed = "completed"
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum RideStatus {
    assigned = "assigned",
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum Role {
    admin = "admin",
    user = "user",
    vendor = "vendor",
    driver = "driver"
}
export enum TransactionType {
    credit = "credit",
    debit = "debit"
}
export enum VendorType {
    service = "service",
    shop = "shop",
    driver = "driver"
}
export enum VisitType {
    clinic = "clinic",
    home = "home"
}
export interface backendInterface {
    addListing(input: ListingInput): Promise<Listing | null>;
    approveVendor(vendorId: bigint): Promise<void>;
    bookAppointment(input: BookAppointmentInput): Promise<Appointment>;
    cancelAppointment(appointmentId: bigint): Promise<boolean>;
    cancelRide(rideId: bigint): Promise<boolean>;
    getDoctor(doctorId: bigint): Promise<Doctor | null>;
    getMyAppointments(): Promise<Array<Appointment>>;
    getMyProfile(): Promise<UserPublic | null>;
    getMyRides(): Promise<Array<RideRequest>>;
    getMyTransactions(): Promise<Array<Transaction>>;
    getMyVendorProfile(): Promise<VendorPublic | null>;
    getMyWallet(): Promise<WalletPublic | null>;
    getPendingApprovals(): Promise<Array<AdminApprovalPublic>>;
    listApprovedVendors(): Promise<Array<VendorPublic>>;
    listBusRoutes(): Promise<Array<BusRoute>>;
    listDoctors(): Promise<Array<Doctor>>;
    registerUser(input: RegisterUserInput): Promise<UserPublic>;
    registerVendor(input: RegisterVendorInput): Promise<VendorPublic>;
    rejectVendor(vendorId: bigint, reason: string): Promise<void>;
    removeListing(listingId: bigint): Promise<boolean>;
    requestRide(input: RequestRideInput): Promise<RideRequest>;
    updateListing(listingId: bigint, input: ListingInput): Promise<boolean>;
    updateProfile(input: RegisterUserInput): Promise<UserPublic | null>;
}
